import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { getAdminProducts } from '@/lib/admin-db';

export async function GET() {
  // Auth check — same logic as middleware but for API routes
  const cookieStore = await cookies();
  const token = cookieStore.get('admin_token')?.value;
  const secret = process.env.ADMIN_COOKIE_SECRET ?? '';

  if (!token || !token.startsWith(secret)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const products = await getAdminProducts();
    return NextResponse.json({ products });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Unknown error';
    console.error('[API] GET /api/admin/products failed:', message);
    return NextResponse.json(
      { error: 'Failed to fetch products', detail: message },
      { status: 500 }
    );
  }
}
