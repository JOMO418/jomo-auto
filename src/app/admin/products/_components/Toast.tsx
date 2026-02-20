'use client';
import { useState, useCallback } from 'react';
import { CheckCircle2, XCircle, Clock, X } from 'lucide-react';

export type ToastKind = 'success' | 'error' | 'info';
export interface ToastItem { id: string; kind: ToastKind; message: string; }

export function useToast() {
  const [toasts, setToasts] = useState<ToastItem[]>([]);
  const show = useCallback((kind: ToastKind, message: string) => {
    const id = Math.random().toString(36).slice(2);
    setToasts((p) => [...p, { id, kind, message }]);
    setTimeout(() => setToasts((p) => p.filter((t) => t.id !== id)), 4000);
  }, []);
  const dismiss = useCallback((id: string) => setToasts((p) => p.filter((t) => t.id !== id)), []);
  return { toasts, show, dismiss };
}

export function Toaster({ toasts, dismiss }: { toasts: ToastItem[]; dismiss: (id: string) => void }) {
  if (!toasts.length) return null;
  return (
    <div className="fixed top-4 right-4 z-[200] flex flex-col gap-2 max-w-[calc(100vw-2rem)] w-80 pointer-events-none">
      {toasts.map((t) => (
        <div
          key={t.id}
          className={`pointer-events-auto flex items-start gap-3 px-4 py-3 rounded-xl shadow-2xl border text-sm font-medium animate-in slide-in-from-right-4 duration-300 ${
            t.kind === 'success' ? 'bg-[#0d2b1a] border-emerald-700/50 text-emerald-300'
            : t.kind === 'error'  ? 'bg-[#2b0d0d] border-red-700/50 text-red-300'
            :                       'bg-[#0d1a2b] border-blue-700/50 text-blue-300'
          }`}
        >
          {t.kind === 'success' ? <CheckCircle2 className="h-4 w-4 flex-shrink-0 mt-0.5 text-emerald-400" />
          : t.kind === 'error'  ? <XCircle       className="h-4 w-4 flex-shrink-0 mt-0.5 text-red-400" />
          :                       <Clock         className="h-4 w-4 flex-shrink-0 mt-0.5 text-blue-400" />}
          <span className="flex-1 leading-snug">{t.message}</span>
          <button onClick={() => dismiss(t.id)} className="opacity-60 hover:opacity-100 transition-opacity flex-shrink-0">
            <X className="h-3.5 w-3.5" />
          </button>
        </div>
      ))}
    </div>
  );
}
