import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { revalidateTag } from 'next/cache';
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

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  if (!(await checkAuth())) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { id } = await params;
  const body = await req.json().catch(() => ({}));
  const { name } = body;

  if (!name?.trim()) {
    return NextResponse.json({ error: 'name is required' }, { status: 400 });
  }

  const slug = name.trim().toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '');

  const supabase = getAdminClient();
  const { data, error } = await supabase
    .from('categories')
    .update({ name: name.trim(), slug })
    .eq('id', id)
    .select()
    .single();

  if (error) {
    if (error.code === '23505') {
      return NextResponse.json(
        { error: 'A category with this name already exists' },
        { status: 409 }
      );
    }
    console.error('[API] PATCH /api/admin/categories/[id] error:', error.message);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  revalidateTag('admin-categories');
  return NextResponse.json({ category: data });
}

export async function DELETE(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  if (!(await checkAuth())) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { id } = await params;
  const supabase = getAdminClient();

  // Guard: refuse if products still reference this category
  const { count } = await supabase
    .from('products')
    .select('id', { count: 'exact', head: true })
    .eq('category_id', id);

  if (count && count > 0) {
    return NextResponse.json(
      { error: `Cannot delete: ${count} product${count === 1 ? '' : 's'} still use this category. Reassign them first.` },
      { status: 409 }
    );
  }

  const { error } = await supabase.from('categories').delete().eq('id', id);

  if (error) {
    console.error('[API] DELETE /api/admin/categories/[id] error:', error.message);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  revalidateTag('admin-categories');
  return NextResponse.json({ ok: true });
}
