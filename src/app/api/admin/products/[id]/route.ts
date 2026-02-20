import { NextRequest, NextResponse } from 'next/server';
import { revalidateTag } from 'next/cache';
import { deleteProduct } from '@/lib/admin-db';

export async function DELETE(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const ok = await deleteProduct(id);
  if (!ok) return NextResponse.json({ error: 'Delete failed' }, { status: 500 });
  revalidateTag('products');
  return NextResponse.json({ ok: true });
}
