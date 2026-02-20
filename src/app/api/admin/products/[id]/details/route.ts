import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

function getAdminClient() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  );
}

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const supabase = getAdminClient();

  const [productRes, compatRes] = await Promise.all([
    supabase
      .from('products')
      .select('*, category:categories(name)')
      .eq('id', id)
      .single(),
    // Try to fetch with vehicle join (new schema)
    supabase
      .from('product_vehicle_compatibility')
      .select('vehicle_id, compatibility_string, vehicle:vehicles(id, brand, model, code, year_start, year_end, popular)')
      .eq('product_id', id),
  ]);

  if (productRes.error) {
    return NextResponse.json({ error: 'Not found' }, { status: 404 });
  }

  // Build compatibility list:
  // - If a row has vehicle_id, return the full vehicle object
  // - If it only has compatibility_string (legacy), mark it as legacy
  const compatRows = compatRes.data ?? [];

  // Check if vehicle_id column exists (by seeing if any row has it or if select errored)
  const hasVehicleIdColumn = !compatRes.error ||
    !compatRes.error.message?.includes('vehicle_id');

  let compatibility: Array<{
    vehicle_id: string | null;
    brand: string;
    model: string;
    code: string;
    year_start: number | null;
    year_end: number | null;
    popular: boolean;
    compatibility_string: string;
    is_legacy: boolean;
  }>;

  if (hasVehicleIdColumn && compatRows.length > 0 && (compatRows[0] as Record<string, unknown>).vehicle_id !== undefined) {
    // New schema — rows have vehicle_id FK
    compatibility = compatRows
      .filter((r) => {
        const row = r as Record<string, unknown>;
        return row.vehicle_id && row.vehicle;
      })
      .map((r) => {
        const row = r as Record<string, unknown>;
        const v = row.vehicle as Record<string, unknown>;
        return {
          vehicle_id: row.vehicle_id as string,
          brand: v.brand as string,
          model: v.model as string,
          code: v.code as string,
          year_start: (v.year_start as number) ?? null,
          year_end: (v.year_end as number) ?? null,
          popular: (v.popular as boolean) ?? false,
          compatibility_string: row.compatibility_string as string ?? `${v.brand} ${v.model} ${v.code}`,
          is_legacy: false,
        };
      });
  } else {
    // Legacy schema — only has compatibility_string
    compatibility = compatRows.map((r) => {
      const parts = ((r as Record<string, unknown>).compatibility_string as string ?? '').split(' ');
      return {
        vehicle_id: null,
        brand: parts[0] ?? '',
        model: parts[1] ?? '',
        code: parts.slice(2).join(' '),
        year_start: null,
        year_end: null,
        popular: false,
        compatibility_string: (r as Record<string, unknown>).compatibility_string as string ?? '',
        is_legacy: true,
      };
    });
  }

  const product = {
    ...productRes.data,
    category_name: productRes.data.category?.name ?? null,
    compatibility,
    // Also expose simple string array for backward compat
    compatibility_strings: compatibility.map((c) => c.compatibility_string),
  };

  return NextResponse.json({ product });
}
