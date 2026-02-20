/**
 * POST /api/admin/migrate-vehicles
 * Adds year_start / year_end columns then reloads the PostgREST schema cache.
 * Safe to run multiple times (ADD COLUMN IF NOT EXISTS).
 */

import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const ALTER_SQL = `
ALTER TABLE vehicles
  ADD COLUMN IF NOT EXISTS year_start INTEGER,
  ADD COLUMN IF NOT EXISTS year_end   INTEGER;
`.trim();

// After schema changes PostgREST needs to reload its cache
const RELOAD_SQL = `SELECT pg_notify('pgrst', 'reload schema');`;

function getAdminClient() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  );
}

async function runSQL(sql: string): Promise<void> {
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

async function columnsExist(): Promise<boolean> {
  const supabase = getAdminClient();
  const { error } = await supabase.from('vehicles').select('year_start').limit(1);
  // 42703 = PostgreSQL undefined_column, PGRST204 = PostgREST schema cache miss
  return !error || (error.code !== '42703' && error.code !== 'PGRST204' && !error.message?.includes('schema cache'));
}

export async function POST() {
  try {
    if (await columnsExist()) {
      return NextResponse.json({ ok: true, method: 'already_done', message: 'Year columns already exist.' });
    }

    try {
      // 1) Add columns
      await runSQL(ALTER_SQL);
      // 2) Reload PostgREST schema cache so inserts/updates work immediately
      await runSQL(RELOAD_SQL).catch(() => { /* non-fatal if notify fails */ });
    } catch (pgErr) {
      return NextResponse.json({
        ok: false, method: 'manual',
        message: "Could not reach pg-meta. Run the SQL below in Supabase SQL Editor, then click \"I've run it\".",
        sql: `${ALTER_SQL}\n\n${RELOAD_SQL}`,
        detail: pgErr instanceof Error ? pgErr.message : String(pgErr),
      });
    }

    // Give PostgREST a moment to reload before verifying
    await new Promise((r) => setTimeout(r, 800));

    const confirmed = await columnsExist();
    if (confirmed) {
      return NextResponse.json({ ok: true, method: 'pg-meta', message: 'Year columns added. You can now save year ranges on vehicles.' });
    }

    return NextResponse.json({
      ok: false, method: 'manual',
      message: 'Migration ran but columns not detected yet — run the SQL manually.',
      sql: `${ALTER_SQL}\n\n${RELOAD_SQL}`,
    });
  } catch (err) {
    return NextResponse.json({
      ok: false, method: 'failed',
      message: `Migration error: ${err instanceof Error ? err.message : String(err)}`,
      sql: `${ALTER_SQL}\n\n${RELOAD_SQL}`,
    }, { status: 500 });
  }
}

export async function GET() {
  const exists = await columnsExist();
  return NextResponse.json({ columnsExist: exists, sql: `${ALTER_SQL}\n\n${RELOAD_SQL}` });
}
