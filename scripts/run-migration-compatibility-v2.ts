/**
 * Runs migrations/add_vehicle_id_to_compatibility.sql against the Supabase project.
 *
 * Usage:  npx tsx scripts/run-migration-compatibility-v2.ts
 */

import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
import fs from 'fs';
import path from 'path';

dotenv.config({ path: '.env.local' });

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const SERVICE_KEY  = process.env.SUPABASE_SERVICE_ROLE_KEY!;

if (!SUPABASE_URL || !SERVICE_KEY) {
  console.error('❌  Missing NEXT_PUBLIC_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY in .env.local');
  process.exit(1);
}

const supabase = createClient(SUPABASE_URL, SERVICE_KEY);

// Read the SQL file
const sqlPath = path.join(process.cwd(), 'migrations', 'add_vehicle_id_to_compatibility.sql');
const sql = fs.readFileSync(sqlPath, 'utf-8');

async function columnExists(): Promise<boolean> {
  const { data, error } = await supabase
    .from('product_vehicle_compatibility')
    .select('vehicle_id')
    .limit(0);

  // If no error selecting vehicle_id — column exists
  if (!error) return true;
  // If error mentions the column — it doesn't exist
  if (error.message?.includes('vehicle_id')) return false;
  // Any other error — assume column doesn't exist yet
  return false;
}

async function runViaMgmtApi(): Promise<{ ok: boolean; error?: string }> {
  // Extract project ref from URL: https://[ref].supabase.co
  const match = SUPABASE_URL.match(/https:\/\/([^.]+)\.supabase\.co/);
  if (!match) return { ok: false, error: 'Could not parse project ref from SUPABASE_URL' };

  const projectRef = match[1];
  const endpoint = `https://api.supabase.com/v1/projects/${projectRef}/database/query`;

  const res = await fetch(endpoint, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      // Management API requires a personal access token, not service role
      // This will fail if not set — handled below
      'Authorization': `Bearer ${process.env.SUPABASE_ACCESS_TOKEN ?? ''}`,
    },
    body: JSON.stringify({ query: sql }),
  });

  if (res.ok) return { ok: true };
  const body = await res.text();
  return { ok: false, error: body };
}

async function runViaRpc(): Promise<{ ok: boolean; error?: string }> {
  // Some Supabase projects expose an exec_sql RPC function
  const { error } = await supabase.rpc('exec_sql', { sql });
  if (!error) return { ok: true };
  return { ok: false, error: error.message };
}

async function main() {
  console.log('\n🔧  Running compatibility migration...\n');

  // Check if already done
  const done = await columnExists();
  if (done) {
    console.log('✅  vehicle_id column already exists — nothing to do.\n');
    return;
  }

  console.log('📋  Column vehicle_id not found. Applying migration...\n');

  // Try exec_sql RPC first (fastest)
  const rpcResult = await runViaRpc();
  if (rpcResult.ok) {
    console.log('✅  Migration applied via RPC exec_sql.\n');
    return;
  }

  // Try Management API (requires SUPABASE_ACCESS_TOKEN)
  if (process.env.SUPABASE_ACCESS_TOKEN) {
    const mgmtResult = await runViaMgmtApi();
    if (mgmtResult.ok) {
      console.log('✅  Migration applied via Management API.\n');
      return;
    }
    console.warn('⚠️   Management API attempt failed:', mgmtResult.error);
  }

  // All programmatic attempts failed — print SQL for manual run
  console.log('─'.repeat(60));
  console.log('⚠️   Could not apply migration automatically.');
  console.log('    Run the following SQL in the Supabase SQL Editor:');
  console.log('    https://supabase.com/dashboard/project/_/sql/new');
  console.log('─'.repeat(60));
  console.log('\n' + sql + '\n');
  console.log('─'.repeat(60));
  console.log('    After running, the admin product modals will be');
  console.log('    fully synced with the Vehicles page.\n');

  process.exit(1);
}

main().catch((e) => {
  console.error('Fatal:', e);
  process.exit(1);
});
