'use client';
import { useState } from 'react';
import { AlertTriangle, RefreshCw, CheckCircle2, X } from 'lucide-react';
import type { ToastKind } from './Toast';

type MigrationState = 'idle' | 'running' | 'done' | 'manual';

export function MigrationBanner({
  onDismiss, onApplied, showToast,
}: {
  onDismiss: () => void;
  onApplied: () => void;
  showToast: (kind: ToastKind, msg: string) => void;
}) {
  const [state, setState] = useState<MigrationState>('idle');
  const [sql, setSql] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  async function runMigration() {
    setState('running');
    try {
      const res = await fetch('/api/admin/setup-db', { method: 'POST' });
      const data = await res.json();
      if (data.ok) {
        showToast('success', 'DB migration applied — new_arrival & flash_deal columns added.');
        onApplied();
      } else if (data.sql) {
        setSql(data.sql); setState('manual');
      } else {
        showToast('error', data.message ?? 'Migration failed.'); setState('idle');
      }
    } catch {
      showToast('error', 'Could not reach setup-db endpoint.'); setState('idle');
    }
  }

  function copySQL() {
    if (!sql) return;
    navigator.clipboard.writeText(sql).then(() => { setCopied(true); setTimeout(() => setCopied(false), 2000); });
  }

  if (state === 'manual' && sql) {
    return (
      <div className="bg-amber-950/40 border border-amber-600/30 rounded-xl p-4 space-y-3">
        <div className="flex items-start gap-3">
          <AlertTriangle className="h-4 w-4 text-amber-400 flex-shrink-0 mt-0.5" />
          <div className="flex-1 min-w-0">
            <p className="text-amber-300 text-sm font-bold">Run this SQL in Supabase</p>
            <p className="text-amber-500/80 text-xs mt-0.5">Go to <strong>Supabase Dashboard → SQL Editor</strong> and run the query below once.</p>
          </div>
          <button onClick={onDismiss} className="text-amber-600 hover:text-amber-400 transition-colors"><X className="h-4 w-4" /></button>
        </div>
        <pre className="bg-black/40 rounded-lg px-3 py-2.5 text-[10px] text-amber-200/80 overflow-x-auto leading-relaxed custom-scroll">{sql}</pre>
        <div className="flex gap-2">
          <button onClick={copySQL} className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-amber-600/20 hover:bg-amber-600/30 text-amber-300 text-xs font-semibold transition-colors">
            {copied ? <CheckCircle2 className="h-3.5 w-3.5" /> : <RefreshCw className="h-3.5 w-3.5" />}
            {copied ? 'Copied!' : 'Copy SQL'}
          </button>
          <button onClick={onDismiss} className="text-xs text-amber-600 hover:text-amber-400 transition-colors font-medium">Dismiss</button>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-blue-950/40 border border-blue-600/30 rounded-xl p-4 flex items-start gap-3">
      <AlertTriangle className="h-4 w-4 text-blue-400 flex-shrink-0 mt-0.5" />
      <div className="flex-1 min-w-0">
        <p className="text-blue-300 text-sm font-bold">DB migration required</p>
        <p className="text-blue-500/80 text-xs mt-0.5">
          The <code className="text-blue-300">new_arrival</code> and <code className="text-blue-300">flash_deal</code> columns are missing from your products table.
        </p>
      </div>
      <div className="flex items-center gap-2 flex-shrink-0">
        <button onClick={runMigration} disabled={state === 'running'} className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-blue-600/30 hover:bg-blue-600/50 text-blue-300 text-xs font-bold transition-colors disabled:opacity-60">
          {state === 'running' ? <><RefreshCw className="h-3.5 w-3.5 animate-spin" />Applying…</> : <><RefreshCw className="h-3.5 w-3.5" />Apply Now</>}
        </button>
        <button onClick={onDismiss} className="text-blue-700 hover:text-blue-400 transition-colors"><X className="h-4 w-4" /></button>
      </div>
    </div>
  );
}
