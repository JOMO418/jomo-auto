import { NextRequest, NextResponse } from 'next/server';
import { revalidateTag } from 'next/cache';
import { cookies } from 'next/headers';
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

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  if (!(await checkAuth())) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { id } = await params;
  const body = await req.json().catch(() => ({}));
  const { brand, model, code, year_start, year_end, popular } = body;

  if (!brand?.trim() || !model?.trim() || !code?.trim()) {
    return NextResponse.json({ error: 'Brand, model, and code are required.' }, { status: 400 });
  }

  const slug = makeSlug(brand, model, code);
  const supabase = getAdminClient();

  // Try with year columns
  let { data, error } = await supabase
    .from('vehicles')
    .update({
      brand: brand.trim(), model: model.trim(), code: code.trim(), slug,
      year_start: year_start ?? null, year_end: year_end ?? null,
      popular: popular ?? false, updated_at: new Date().toISOString(),
    })
    .eq('id', id)
    .select()
    .single();

  // Schema not migrated yet — retry without year fields
  if (error && isMissingColumnError(error)) {
    const fb = await supabase
      .from('vehicles')
      .update({
        brand: brand.trim(), model: model.trim(), code: code.trim(), slug,
        popular: popular ?? false, updated_at: new Date().toISOString(),
      })
      .eq('id', id)
      .select()
      .single();
    data  = fb.data;
    error = fb.error;
  }

  if (error) {
    if (error.code === '23505') {
      return NextResponse.json({ error: 'A vehicle with this brand, model, and code already exists.' }, { status: 409 });
    }
    console.error('[PATCH /api/admin/vehicles/[id]]', error.message);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  // Bust vehicle list cache + product cache (compatibility strings change)
  revalidateTag('admin-vehicles');
  revalidateTag('products');
  return NextResponse.json({ vehicle: normalise(data as Record<string, unknown>) });
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
  const { error } = await supabase.from('vehicles').delete().eq('id', id);

  if (error) {
    console.error('[DELETE /api/admin/vehicles/[id]]', error.message);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  // Cascade deletes compatibility rows (via FK ON DELETE CASCADE)
  revalidateTag('admin-vehicles');
  revalidateTag('products');
  return NextResponse.json({ ok: true });
}
