import { NextRequest, NextResponse } from 'next/server';
import { revalidateTag } from 'next/cache';
import { createClient } from '@supabase/supabase-js';

function getAdminClient() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  );
}

const OPTIONAL_COLUMNS = ['new_arrival', 'flash_deal'] as const;

function isMissingColumnError(message: string): boolean {
  return OPTIONAL_COLUMNS.some((col) => message.includes(col));
}

/**
 * Resolves compatibility input — accepts either:
 *   - Array of vehicle UUIDs (new format from DB-driven picker)
 *   - Array of legacy strings like "Toyota Fielder NZE141" (backward compat)
 */
async function resolveCompatibility(
  compatibility: string[],
  supabase: ReturnType<typeof getAdminClient>
): Promise<{ vehicle_id: string | null; compatibility_string: string }[]> {
  if (!compatibility || compatibility.length === 0) return [];

  const UUID_RE = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
  const areUUIDs = compatibility.every((c) => UUID_RE.test(c));

  if (areUUIDs) {
    const { data: vehicles } = await supabase
      .from('vehicles')
      .select('id, brand, model, code, year_start, year_end')
      .in('id', compatibility);

    if (!vehicles) return [];

    return vehicles.map((v) => {
      const yearSuffix = v.year_start
        ? ` (${v.year_start}-${v.year_end ?? 'present'})`
        : '';
      return {
        vehicle_id: v.id,
        compatibility_string: `${v.brand} ${v.model} ${v.code}${yearSuffix}`,
      };
    });
  }

  return compatibility.map((s) => ({
    vehicle_id: null,
    compatibility_string: s,
  }));
}

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const body = await req.json();
  const supabase = getAdminClient();

  // Resolve category id
  const { data: catData } = await supabase
    .from('categories')
    .select('id')
    .ilike('name', body.category)
    .single();

  const fullPayload = {
    name: body.name,
    description: body.description,
    price: body.price,
    original_price: body.original_price ?? null,
    condition: body.condition,
    origin: body.origin,
    category_id: catData?.id ?? null,
    stock: body.stock,
    featured: body.featured ?? false,
    new_arrival: body.new_arrival ?? false,
    flash_deal: body.flash_deal ?? false,
    images: body.images ?? [],
    updated_at: new Date().toISOString(),
  };

  let { error } = await supabase
    .from('products')
    .update(fullPayload)
    .eq('id', id);

  // Graceful fallback if optional columns missing
  if (error && isMissingColumnError(error.message)) {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { new_arrival: _nr, flash_deal: _fd, ...basePayload } = fullPayload;
    const retry = await supabase
      .from('products')
      .update(basePayload)
      .eq('id', id);
    error = retry.error;
  }

  if (error) {
    console.error('[update product] error:', error.message);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  // Replace vehicle compatibility
  await supabase
    .from('product_vehicle_compatibility')
    .delete()
    .eq('product_id', id);

  if (body.compatibility?.length > 0) {
    const rows = await resolveCompatibility(body.compatibility, supabase);

    if (rows.length > 0) {
      // Check if vehicle_id column exists
      const { error: schemaCheckError } = await supabase
        .from('product_vehicle_compatibility')
        .select('vehicle_id')
        .limit(0);

      const hasVehicleIdCol = !schemaCheckError ||
        !schemaCheckError.message?.includes('vehicle_id');

      if (hasVehicleIdCol) {
        await supabase.from('product_vehicle_compatibility').insert(
          rows.map((r) => ({
            product_id: id,
            vehicle_id: r.vehicle_id,
            compatibility_string: r.compatibility_string,
          }))
        );
      } else {
        await supabase.from('product_vehicle_compatibility').insert(
          rows.map((r) => ({
            product_id: id,
            compatibility_string: r.compatibility_string,
          }))
        );
      }
    }
  }

  revalidateTag('products');
  return NextResponse.json({ ok: true });
}
