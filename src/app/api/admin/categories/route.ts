import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { unstable_cache, revalidateTag } from 'next/cache';
import { createClient } from '@supabase/supabase-js';

function getAdminClient() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  );
}

async function checkAuth(): Promise<boolean> {
  const cookieStore = await cookies();
  const token = cookieStore.get('admin_token')?.value;
  const secret = process.env.ADMIN_COOKIE_SECRET ?? '';
  return !!(token && token.startsWith(secret));
}

// ─── Cached DB fetch ─────────────────────────────────────────────────────────
// Replaces the previous two-query approach with a single query + in-app count.
// Cached in Next.js server memory; revalidated on any category mutation.

const fetchCategoriesFromDB = unstable_cache(
  async () => {
    const supabase = getAdminClient();

    // Fetch categories and product counts in parallel (single round-trip each)
    const [catResult, countResult] = await Promise.all([
      supabase.from('categories').select('id, name, slug, description').order('name'),
      supabase.from('products').select('category_id'),
    ]);

    if (catResult.error) throw catResult.error;

    const countMap: Record<string, number> = {};
    for (const row of countResult.data ?? []) {
      if (row.category_id) {
        countMap[row.category_id] = (countMap[row.category_id] ?? 0) + 1;
      }
    }

    return (catResult.data ?? []).map((cat) => ({
      ...cat,
      product_count: countMap[cat.id] ?? 0,
    }));
  },
  ['admin-categories'],
  { tags: ['admin-categories'], revalidate: 3600 }
);

// ─── GET ─────────────────────────────────────────────────────────────────────

export async function GET() {
  if (!(await checkAuth())) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const categories = await fetchCategoriesFromDB();
    return NextResponse.json({ categories });
  } catch (error: unknown) {
    const msg = error instanceof Error ? error.message : 'Unknown error';
    console.error('[API] GET /api/admin/categories error:', msg);
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}

// ─── POST ────────────────────────────────────────────────────────────────────

export async function POST(req: NextRequest) {
  if (!(await checkAuth())) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const body = await req.json().catch(() => ({}));
  const { name } = body;

  if (!name?.trim()) {
    return NextResponse.json({ error: 'name is required' }, { status: 400 });
  }

  const slug = name.trim().toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '');

  const supabase = getAdminClient();
  const { data, error } = await supabase
    .from('categories')
    .insert({ name: name.trim(), slug })
    .select()
    .single();

  if (error) {
    if (error.code === '23505') {
      return NextResponse.json(
        { error: 'A category with this name already exists' },
        { status: 409 }
      );
    }
    console.error('[API] POST /api/admin/categories error:', error.message);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  // Bust cache so the new category appears immediately in dropdowns + page
  revalidateTag('admin-categories');
  return NextResponse.json({ category: { ...data, product_count: 0 } }, { status: 201 });
}
