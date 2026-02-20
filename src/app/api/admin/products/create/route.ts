import { NextRequest, NextResponse } from 'next/server';
import { revalidateTag } from 'next/cache';
import { createClient } from '@supabase/supabase-js';

function getAdminClient() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  );
}

function slugify(text: string) {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '');
}

function isMissingColumnError(message: string): boolean {
  return message.includes('new_arrival') || message.includes('flash_deal');
}

/**
 * Resolves compatibility input — accepts either:
 *   - Array of vehicle UUIDs (new format from DB-driven picker)
 *   - Array of legacy strings like "Toyota Fielder NZE141" (backward compat)
 *
 * Returns rows ready to insert into product_vehicle_compatibility.
 */
async function resolveCompatibility(
  compatibility: string[],
  supabase: ReturnType<typeof getAdminClient>
): Promise<{ vehicle_id: string | null; compatibility_string: string }[]> {
  if (!compatibility || compatibility.length === 0) return [];

  // Detect if these look like UUIDs
  const UUID_RE = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
  const areUUIDs = compatibility.every((c) => UUID_RE.test(c));

  if (areUUIDs) {
    // New format: vehicle IDs — fetch vehicle data including years to build compatibility_string
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

  // Legacy format: plain strings — store as-is, no vehicle_id
  return compatibility.map((s) => ({
    vehicle_id: null,
    compatibility_string: s,
  }));
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const supabase = getAdminClient();

    // Look up category id
    const { data: catData } = await supabase
      .from('categories')
      .select('id')
      .ilike('name', body.category)
      .single();

    const slug = slugify(body.name) + '-' + Date.now().toString(36);

    // Full insert payload
    const fullInsert = {
      name: body.name,
      slug,
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
      specs: {},
    };

    let result = await supabase
      .from('products')
      .insert(fullInsert)
      .select('id')
      .single();

    // Graceful fallback: optional columns don't exist yet
    if (result.error && isMissingColumnError(result.error.message)) {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { new_arrival: _nr, flash_deal: _fd, ...baseInsert } = fullInsert;
      result = await supabase
        .from('products')
        .insert(baseInsert)
        .select('id')
        .single();
    }

    if (result.error) throw new Error(result.error.message);

    const productId = result.data.id;

    // Resolve and insert vehicle compatibility
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
              product_id: productId,
              vehicle_id: r.vehicle_id,
              compatibility_string: r.compatibility_string,
            }))
          );
        } else {
          // Schema not migrated yet — insert without vehicle_id
          await supabase.from('product_vehicle_compatibility').insert(
            rows.map((r) => ({
              product_id: productId,
              compatibility_string: r.compatibility_string,
            }))
          );
        }
      }
    }

    revalidateTag('products');
    return NextResponse.json({ id: productId });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Failed to create product';
    console.error('[create product] error:', message);
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
