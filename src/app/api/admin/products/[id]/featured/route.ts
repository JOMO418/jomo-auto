import { NextRequest, NextResponse } from 'next/server';
import { revalidateTag } from 'next/cache';
import { toggleProductFeatured } from '@/lib/admin-db';

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const { featured } = await req.json();
  const ok = await toggleProductFeatured(id, featured);
  if (!ok) return NextResponse.json({ error: 'Update failed' }, { status: 500 });
  revalidateTag('products');
  return NextResponse.json({ ok: true });
}
