import { NextRequest, NextResponse } from 'next/server';
import { getOrderById, updateOrderStatus, updatePaymentStatus } from '@/lib/admin-db';

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const order = await getOrderById(id);
  if (!order) return NextResponse.json({ error: 'Not found' }, { status: 404 });
  return NextResponse.json({ order });
}

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const body = await req.json();

  if (body.status) {
    const ok = await updateOrderStatus(id, body.status);
    if (!ok) return NextResponse.json({ error: 'Update failed' }, { status: 500 });
  }

  if (body.payment_status) {
    const ok = await updatePaymentStatus(id, body.payment_status, body.mpesa_code);
    if (!ok) return NextResponse.json({ error: 'Update failed' }, { status: 500 });
  }

  return NextResponse.json({ ok: true });
}
