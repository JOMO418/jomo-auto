/**
 * POST /api/admin/setup-compatibility-v2
 *
 * Adds `vehicle_id UUID REFERENCES vehicles(id) ON DELETE CASCADE`
 * to the product_vehicle_compatibility table so product compatibility
 * is properly linked to DB vehicle records (not just free-text strings).
 *
 * Also adds an index on vehicle_id for fast filtering.
 *
 * Safe to run multiple times (uses IF NOT EXISTS / IF NOT EXISTS guard).
 */

import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { createClient } from '@supabase/supabase-js';

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

// The SQL we need to run
const MIGRATION_SQL = `
-- Add vehicle_id FK to compatibility junction table
ALTER TABLE product_vehicle_compatibility
  ADD COLUMN IF NOT EXISTS vehicle_id UUID REFERENCES vehicles(id) ON DELETE CASCADE;

-- Index for fast product-by-vehicle queries
CREATE INDEX IF NOT EXISTS idx_pvc_vehicle_id
  ON product_vehicle_compatibility(vehicle_id);

-- Make compatibility_string nullable (new rows use vehicle_id as source of truth)
ALTER TABLE product_vehicle_compatibility
  ALTER COLUMN compatibility_string DROP NOT NULL;
`.trim();

export async function POST() {
  if (!(await checkAuth())) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const supabase = getAdminClient();

  // Check if vehicle_id column already exists
  const { data: existing } = await supabase
    .from('product_vehicle_compatibility')
    .select('vehicle_id')
    .limit(1);

  // If no error on selecting vehicle_id, column already exists
  if (existing !== null) {
    return NextResponse.json({ ok: true, already_done: true });
  }

  // Try to run via RPC (exec_sql function) — works if the Supabase project has it
  const { error: rpcError } = await supabase.rpc('exec_sql', { sql: MIGRATION_SQL });

  if (!rpcError) {
    return NextResponse.json({ ok: true, method: 'auto' });
  }

  // Auto-migration not available — return SQL for manual run
  return NextResponse.json({
    ok: false,
    method: 'manual',
    sql: MIGRATION_SQL,
    message: 'Run this SQL in the Supabase SQL Editor, then click "Done".',
  });
}

export async function GET() {
  if (!(await checkAuth())) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const supabase = getAdminClient();

  // Check if vehicle_id column exists by trying to select it
  const { error } = await supabase
    .from('product_vehicle_compatibility')
    .select('vehicle_id')
    .limit(1);

  const hasVehicleId = !error || !error.message?.includes('vehicle_id');

  return NextResponse.json({ hasVehicleId, sql: MIGRATION_SQL });
}
