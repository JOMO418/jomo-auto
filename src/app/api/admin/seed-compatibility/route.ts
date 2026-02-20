/**
 * POST /api/admin/seed-compatibility
 *
 * Seeds product_vehicle_compatibility in Supabase with realistic data.
 * Distribution strategy:
 *   ~60% of products → Toyota (Fielder, Corolla, Vitz, Probox, Hiace, Noah, Prado, Wish, Belta)
 *   ~25% of products → Nissan (Tiida, Note, Wingroad)
 *   ~15% of products → Mazda / Subaru / Honda
 *
 * Every vehicle gets at least ONE compatible product.
 * Compatibility strings use the format: "Brand Model CODE (year_start-year_end)"
 *
 * This is a one-time / admin-only seeding utility. Auth-protected.
 */

import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { createClient } from '@supabase/supabase-js';
import { VEHICLE_DATA } from '@/lib/constants';

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

function buildCompatLabel(v: typeof VEHICLE_DATA[number]): string {
  const years = v.year_start
    ? ` (${v.year_start}-${v.year_end ?? 'present'})`
    : '';
  return `${v.brand} ${v.model} ${v.code}${years}`;
}

// Weighted vehicle assignment — Toyota models get far more products
const TOYOTA_VARIANTS  = VEHICLE_DATA.filter((v) => v.brand === 'Toyota');
const NISSAN_VARIANTS  = VEHICLE_DATA.filter((v) => v.brand === 'Nissan');
const OTHER_VARIANTS   = VEHICLE_DATA.filter((v) => v.brand !== 'Toyota' && v.brand !== 'Nissan');

function pickVehiclesForProduct(index: number, total: number): string[] {
  const bucket = index / total;
  let pool: typeof VEHICLE_DATA[number][];

  if (bucket < 0.60) {
    pool = TOYOTA_VARIANTS;
  } else if (bucket < 0.85) {
    pool = NISSAN_VARIANTS;
  } else {
    pool = OTHER_VARIANTS;
  }

  // Each product gets 1–4 compatible vehicles from its pool
  const count = Math.min(pool.length, Math.floor(Math.random() * 3) + 1);
  const shuffled = [...pool].sort(() => Math.random() - 0.5);
  const picked = shuffled.slice(0, count);

  // Popular Toyota models sometimes cross-reference Nissan equivalents
  if (bucket < 0.30 && Math.random() < 0.2 && NISSAN_VARIANTS.length > 0) {
    const nissan = NISSAN_VARIANTS[Math.floor(Math.random() * NISSAN_VARIANTS.length)];
    picked.push(nissan);
  }

  return [...new Set(picked.map(buildCompatLabel))];
}

export async function POST(req: NextRequest) {
  if (!(await checkAuth())) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const body = await req.json().catch(() => ({}));
  const dryRun: boolean = body.dry_run ?? false;

  const supabase = getAdminClient();

  // Fetch all product IDs
  const { data: products, error: prodErr } = await supabase
    .from('products')
    .select('id')
    .order('created_at');

  if (prodErr || !products) {
    return NextResponse.json({ error: prodErr?.message ?? 'Failed to fetch products' }, { status: 500 });
  }

  const total = products.length;
  if (total === 0) {
    return NextResponse.json({ ok: true, message: 'No products found — nothing to seed.', total: 0 });
  }

  // Build compatibility rows
  const allCompatRows: { product_id: string; compatibility_string: string }[] = [];

  products.forEach((product, i) => {
    const labels = pickVehiclesForProduct(i, total);
    labels.forEach((label) => {
      allCompatRows.push({ product_id: product.id, compatibility_string: label });
    });
  });

  // Ensure every vehicle gets at least one product
  const coveredLabels = new Set(allCompatRows.map((r) => r.compatibility_string));
  const firstProductId = products[0].id;

  VEHICLE_DATA.forEach((v) => {
    const label = buildCompatLabel(v);
    if (!coveredLabels.has(label)) {
      // Assign to a random product
      const randomProduct = products[Math.floor(Math.random() * Math.min(20, total))];
      allCompatRows.push({ product_id: randomProduct.id, compatibility_string: label });
    }
  });

  if (dryRun) {
    return NextResponse.json({
      ok: true,
      dry_run: true,
      total_products: total,
      total_compat_rows: allCompatRows.length,
      sample: allCompatRows.slice(0, 10),
    });
  }

  // Clear existing compatibility data
  const { error: deleteErr } = await supabase
    .from('product_vehicle_compatibility')
    .delete()
    .neq('id', '00000000-0000-0000-0000-000000000000'); // delete all

  if (deleteErr) {
    console.error('[seed-compatibility] delete error:', deleteErr.message);
    return NextResponse.json({ error: 'Failed to clear existing compatibility data' }, { status: 500 });
  }

  // Insert in batches of 500
  const BATCH = 500;
  let inserted = 0;
  for (let i = 0; i < allCompatRows.length; i += BATCH) {
    const batch = allCompatRows.slice(i, i + BATCH);
    const { data, error } = await supabase
      .from('product_vehicle_compatibility')
      .insert(batch)
      .select('id');

    if (error) {
      console.error('[seed-compatibility] insert error:', error.message);
      return NextResponse.json({
        error: `Insert failed at row ${i}: ${error.message}`,
        inserted,
      }, { status: 500 });
    }
    inserted += data?.length ?? 0;
  }

  return NextResponse.json({
    ok: true,
    total_products: total,
    total_compat_rows: inserted,
    vehicles_covered: VEHICLE_DATA.length,
    message: `Successfully seeded ${inserted} compatibility records across ${total} products and ${VEHICLE_DATA.length} vehicle variants.`,
  });
}

/** GET — returns a preview of what would be seeded (dry run) */
export async function GET() {
  return NextResponse.json({
    info: 'POST to /api/admin/seed-compatibility to seed compatibility data.',
    hint: 'Add { "dry_run": true } to preview without writing.',
    vehicles: VEHICLE_DATA.length,
    distribution: {
      Toyota: `~60% of products (${TOYOTA_VARIANTS.length} variants)`,
      Nissan: `~25% of products (${NISSAN_VARIANTS.length} variants)`,
      Others: `~15% of products (${OTHER_VARIANTS.length} variants)`,
    },
  });
}
