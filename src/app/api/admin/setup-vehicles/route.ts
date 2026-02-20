/**
 * POST /api/admin/setup-vehicles
 *
 * Creates the vehicles table in Supabase (if it doesn't exist) then seeds
 * it with VEHICLE_DATA from constants.ts (includes year_start / year_end).
 *
 * If pg-meta is unreachable, returns the SQL to run manually.
 */

import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { VEHICLE_DATA } from '@/lib/constants';

const CREATE_TABLE_SQL = `
CREATE TABLE IF NOT EXISTS vehicles (
  id          UUID          PRIMARY KEY DEFAULT gen_random_uuid(),
  brand       VARCHAR(100)  NOT NULL,
  model       VARCHAR(100)  NOT NULL,
  code        VARCHAR(50)   NOT NULL,
  slug        VARCHAR(200)  NOT NULL,
  year_start  INTEGER,
  year_end    INTEGER,
  popular     BOOLEAN       NOT NULL DEFAULT false,
  created_at  TIMESTAMPTZ   NOT NULL DEFAULT NOW(),
  updated_at  TIMESTAMPTZ   NOT NULL DEFAULT NOW()
);

-- Unique constraint: one row per brand+model+code combination
CREATE UNIQUE INDEX IF NOT EXISTS vehicles_brand_model_code_idx
  ON vehicles (brand, model, code);

CREATE UNIQUE INDEX IF NOT EXISTS vehicles_slug_idx
  ON vehicles (slug);

-- Add year columns to existing table (safe no-op if already present)
ALTER TABLE vehicles
  ADD COLUMN IF NOT EXISTS year_start INTEGER,
  ADD COLUMN IF NOT EXISTS year_end   INTEGER;
`.trim();

function getAdminClient() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  );
}

async function runViaPgMeta(sql: string): Promise<void> {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
  const serviceKey  = process.env.SUPABASE_SERVICE_ROLE_KEY!;

  const res = await fetch(`${supabaseUrl}/pg-meta/v1/query`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      apikey: serviceKey,
      Authorization: `Bearer ${serviceKey}`,
    },
    body: JSON.stringify({ query: sql }),
  });

  if (!res.ok) {
    const text = await res.text().catch(() => res.statusText);
    throw new Error(`pg-meta ${res.status}: ${text}`);
  }
}

async function tableExists(): Promise<boolean> {
  const supabase = getAdminClient();
  const { error } = await supabase.from('vehicles').select('id').limit(1);
  return !error || error.code !== '42P01';
}

function makeSlug(brand: string, model: string, code: string): string {
  return `${brand}-${model}-${code}`
    .toLowerCase()
    .replace(/\s+/g, '-')
    .replace(/[^a-z0-9-]/g, '');
}

async function seedVehicles(): Promise<{ inserted: number; skipped: number }> {
  const supabase = getAdminClient();

  const rows = VEHICLE_DATA.map((v) => ({
    brand:      v.brand,
    model:      v.model,
    code:       v.code,
    slug:       makeSlug(v.brand, v.model, v.code),
    year_start: v.year_start,
    year_end:   v.year_end,
    popular:    v.popular,
  }));

  const { data, error } = await supabase
    .from('vehicles')
    .upsert(rows, { onConflict: 'brand,model,code', ignoreDuplicates: false })
    .select('id');

  if (error) {
    console.error('[setup-vehicles] seed error:', error.message);
    return { inserted: 0, skipped: rows.length };
  }

  const inserted = data?.length ?? 0;
  return { inserted, skipped: rows.length - inserted };
}

export async function POST() {
  try {
    const exists = await tableExists();

    if (!exists) {
      try {
        await runViaPgMeta(CREATE_TABLE_SQL);
      } catch (pgMetaErr) {
        const message = pgMetaErr instanceof Error ? pgMetaErr.message : 'Unknown error';
        return NextResponse.json({
          ok: false,
          method: 'manual',
          message: 'Cannot reach pg-meta API. Run the SQL below in Supabase SQL Editor, then click Setup again.',
          sql: CREATE_TABLE_SQL,
          detail: message,
        });
      }
    } else {
      // Table exists — try to add year columns in case they're missing (migration)
      try {
        await runViaPgMeta(
          `ALTER TABLE vehicles
             ADD COLUMN IF NOT EXISTS year_start INTEGER,
             ADD COLUMN IF NOT EXISTS year_end   INTEGER;`
        );
      } catch {
        // Non-fatal — columns may already exist or pg-meta unavailable
      }
    }

    const { inserted, skipped } = await seedVehicles();

    return NextResponse.json({
      ok: true,
      method: exists ? 'already_existed' : 'created',
      message: exists
        ? `Table updated. Upserted ${inserted} vehicle(s), skipped ${skipped}.`
        : `Table created and seeded with ${inserted} vehicle(s).`,
      inserted,
      skipped,
      total: VEHICLE_DATA.length,
    });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Unknown error';
    console.error('[setup-vehicles] error:', message);
    return NextResponse.json(
      {
        ok: false,
        method: 'failed',
        message: `Setup failed: ${message}. Run the SQL below manually in Supabase SQL Editor.`,
        sql: CREATE_TABLE_SQL,
      },
      { status: 500 }
    );
  }
}

/** GET — returns the migration SQL without executing it */
export async function GET() {
  return NextResponse.json({ sql: CREATE_TABLE_SQL, total: VEHICLE_DATA.length });
}
