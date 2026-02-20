import { NextRequest, NextResponse } from 'next/server';
import { getOrders } from '@/lib/admin-db';

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const status = searchParams.get('status') ?? 'all';
  const orders = await getOrders(status === 'all' ? undefined : status);
  return NextResponse.json({ orders });
}
