/**
 * POST /api/admin/setup-db
 *
 * Adds missing product columns (new_arrival, flash_deal) to the Supabase DB.
 * Tries to execute via Supabase's pg-meta internal API (works on all hosted projects).
 * If that is unavailable, returns the SQL to paste in the Supabase SQL Editor.
 *
 * Call this once from the Admin → Settings page, or run the SQL manually.
 */

import { NextResponse } from 'next/server';

const MIGRATION_SQL = `
-- Add new_arrival column if it doesn't exist
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'products' AND column_name = 'new_arrival'
  ) THEN
    ALTER TABLE products ADD COLUMN new_arrival boolean NOT NULL DEFAULT false;
  END IF;
END $$;

-- Add flash_deal column if it doesn't exist
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'products' AND column_name = 'flash_deal'
  ) THEN
    ALTER TABLE products ADD COLUMN flash_deal boolean NOT NULL DEFAULT false;
  END IF;
END $$;

-- Confirm columns exist
SELECT column_name, data_type, column_default
FROM information_schema.columns
WHERE table_name = 'products'
  AND column_name IN ('new_arrival', 'flash_deal')
ORDER BY column_name;
`.trim();

async function runViaPgMeta(sql: string): Promise<{ ok: boolean; rows?: unknown[] }> {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

  // Supabase's internal pg-meta API — used by the Studio SQL editor
  const pgMetaUrl = `${supabaseUrl}/pg-meta/v1/query`;

  const res = await fetch(pgMetaUrl, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'apikey': serviceKey,
      'Authorization': `Bearer ${serviceKey}`,
    },
    body: JSON.stringify({ query: sql }),
  });

  if (!res.ok) {
    const text = await res.text().catch(() => res.statusText);
    throw new Error(`pg-meta ${res.status}: ${text}`);
  }

  const data = await res.json();
  return { ok: true, rows: data };
}

async function checkColumnsExist(): Promise<{ new_arrival: boolean; flash_deal: boolean }> {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
  const serviceKey  = process.env.SUPABASE_SERVICE_ROLE_KEY!;

  const checkSql = `
    SELECT column_name FROM information_schema.columns
    WHERE table_name = 'products'
      AND column_name IN ('new_arrival', 'flash_deal');
  `;

  const res = await fetch(`${supabaseUrl}/pg-meta/v1/query`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'apikey': serviceKey,
      'Authorization': `Bearer ${serviceKey}`,
    },
    body: JSON.stringify({ query: checkSql }),
  });

  if (!res.ok) throw new Error('Cannot reach pg-meta');

  const rows: Array<{ column_name: string }> = await res.json();
  const names = rows.map((r) => r.column_name);
  return {
    new_arrival: names.includes('new_arrival'),
    flash_deal:  names.includes('flash_deal'),
  };
}

export async function POST() {
  try {
    // ── Step 1: check current column state ──────────────────────────────────
    let before: { new_arrival: boolean; flash_deal: boolean };
    try {
      before = await checkColumnsExist();
    } catch {
      // pg-meta not reachable — return SQL for manual run
      return NextResponse.json({
        ok: false,
        method: 'manual',
        message: 'Cannot reach the pg-meta API. Run the SQL below in the Supabase SQL Editor.',
        sql: MIGRATION_SQL,
      });
    }

    if (before.new_arrival && before.flash_deal) {
      return NextResponse.json({
        ok: true,
        method: 'already_done',
        message: 'Both columns already exist — no migration needed.',
        columns: before,
      });
    }

    // ── Step 2: run the migration ────────────────────────────────────────────
    const addSql = [
      !before.new_arrival && `
        DO $$ BEGIN
          IF NOT EXISTS (
            SELECT 1 FROM information_schema.columns
            WHERE table_name='products' AND column_name='new_arrival'
          ) THEN
            ALTER TABLE products ADD COLUMN new_arrival boolean NOT NULL DEFAULT false;
          END IF;
        END $$;
      `,
      !before.flash_deal && `
        DO $$ BEGIN
          IF NOT EXISTS (
            SELECT 1 FROM information_schema.columns
            WHERE table_name='products' AND column_name='flash_deal'
          ) THEN
            ALTER TABLE products ADD COLUMN flash_deal boolean NOT NULL DEFAULT false;
          END IF;
        END $$;
      `,
    ].filter(Boolean).join('\n');

    await runViaPgMeta(addSql);

    // ── Step 3: verify ───────────────────────────────────────────────────────
    const after = await checkColumnsExist();

    return NextResponse.json({
      ok: after.new_arrival && after.flash_deal,
      method: 'pg-meta',
      message: after.new_arrival && after.flash_deal
        ? 'Migration applied successfully — columns are ready.'
        : 'Migration ran but columns may still be missing. Check your DB.',
      columns: after,
    });

  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Unknown error';
    console.error('[setup-db] error:', message);

    // Always return the SQL so the admin can apply manually
    return NextResponse.json(
      {
        ok: false,
        method: 'failed',
        message: `Automated migration failed: ${message}. Run the SQL below manually in the Supabase SQL Editor.`,
        sql: MIGRATION_SQL,
      },
      { status: 500 }
    );
  }
}

/** GET — returns the migration SQL without running it (useful for copy-paste) */
export async function GET() {
  return NextResponse.json({ sql: MIGRATION_SQL });
}
