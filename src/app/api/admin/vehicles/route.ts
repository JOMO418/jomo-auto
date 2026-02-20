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

function makeSlug(brand: string, model: string, code: string): string {
  return `${brand}-${model}-${code}`
    .toLowerCase()
    .replace(/\s+/g, '-')
    .replace(/[^a-z0-9-]/g, '');
}

function normalise(row: Record<string, unknown>) {
  return { ...row, year_start: row.year_start ?? null, year_end: row.year_end ?? null };
}

function isMissingColumnError(error: { code?: string; message?: string }) {
  return (
    error.code === '42703' ||
    error.code === 'PGRST204' ||
    error.message?.includes('schema cache') ||
    error.message?.includes('year_start') ||
    error.message?.includes('year_end')
  );
}

// ─── Cached DB fetch ─────────────────────────────────────────────────────────
// Cached in Next.js server memory. Revalidated on any vehicle mutation via
// revalidateTag('admin-vehicles'). Typical cache hit: ~5ms vs ~300ms cold.

const fetchVehiclesFromDB = unstable_cache(
  async () => {
    const supabase = getAdminClient();

    let { data, error } = await supabase
      .from('vehicles')
      .select('*')
      .order('brand')
      .order('model')
      .order('year_start', { ascending: true, nullsFirst: true });

    if (error && isMissingColumnError(error)) {
      const fb = await supabase
        .from('vehicles')
        .select('id, brand, model, code, slug, popular, created_at, updated_at')
        .order('brand')
        .order('model')
        .order('code');
      data  = fb.data;
      error = fb.error;
    }

    if (error) throw error;

    const vehicles = (data ?? []).map(normalise);
    const hasYearColumns = vehicles.length === 0
      ? false
      : 'year_start' in (data?.[0] ?? {});

    return { vehicles, hasYearColumns };
  },
  ['admin-vehicles'],
  { tags: ['admin-vehicles'], revalidate: 3600 }
);

// ─── GET ─────────────────────────────────────────────────────────────────────

export async function GET() {
  if (!(await checkAuth())) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const result = await fetchVehiclesFromDB();
    return NextResponse.json(result);
  } catch (error: unknown) {
    const err = error as { code?: string; message?: string };
    if (err.code === '42P01') {
      return NextResponse.json({ error: 'TABLE_NOT_FOUND', vehicles: [] }, { status: 404 });
    }
    console.error('[GET /api/admin/vehicles]', err.message);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

// ─── POST ─────────────────────────────────────────────────────────────────────

export async function POST(req: NextRequest) {
  if (!(await checkAuth())) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const body = await req.json().catch(() => ({}));
  const { brand, model, code, year_start, year_end, popular } = body;

  if (!brand?.trim() || !model?.trim() || !code?.trim()) {
    return NextResponse.json({ error: 'Brand, model, and code are required.' }, { status: 400 });
  }

  const slug = makeSlug(brand, model, code);
  const supabase = getAdminClient();

  let { data, error } = await supabase
    .from('vehicles')
    .insert({
      brand: brand.trim(), model: model.trim(), code: code.trim(), slug,
      year_start: year_start ?? null, year_end: year_end ?? null,
      popular: popular ?? false,
    })
    .select()
    .single();

  if (error && isMissingColumnError(error)) {
    const fb = await supabase
      .from('vehicles')
      .insert({ brand: brand.trim(), model: model.trim(), code: code.trim(), slug, popular: popular ?? false })
      .select()
      .single();
    data  = fb.data;
    error = fb.error;
  }

  if (error) {
    if (error.code === '23505') {
      return NextResponse.json({ error: 'A vehicle with this brand, model, and code already exists.' }, { status: 409 });
    }
    console.error('[POST /api/admin/vehicles]', error.message);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  // Bust cache so the new vehicle appears immediately
  revalidateTag('admin-vehicles');
  revalidateTag('products');
  return NextResponse.json({ vehicle: normalise(data as Record<string, unknown>) }, { status: 201 });
}
