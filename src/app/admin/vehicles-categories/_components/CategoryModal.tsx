'use client';

import { useState, useEffect } from 'react';
import { X, Loader2 } from 'lucide-react';
import type { Category } from './CategoryRow';

interface Props {
  initial?: Category | null;
  onClose: () => void;
  onSaved: (c: Category) => void;
  showToast: (msg: string, ok?: boolean) => void;
}

export function CategoryModal({ initial, onClose, onSaved, showToast }: Props) {
  const isEdit = !!initial;
  const [name, setName] = useState(initial?.name ?? '');
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    const handler = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose(); };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [onClose]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!name.trim()) { setError('Category name is required.'); return; }

    setSaving(true);
    setError('');

    const url = isEdit ? `/api/admin/categories/${initial!.id}` : '/api/admin/categories';
    const method = isEdit ? 'PATCH' : 'POST';

    try {
      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: name.trim() }),
      });
      const data = await res.json();
      if (!res.ok) { setError(data.error ?? 'Something went wrong'); return; }

      showToast(isEdit ? `"${data.category.name}" updated.` : `"${data.category.name}" added.`, true);
      onSaved({ ...data.category, product_count: initial?.product_count ?? 0 });
    } catch {
      setError('Network error — please try again.');
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-sm">
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100">
          <h2 className="text-gray-900 font-bold text-base">
            {isEdit ? 'Edit Category' : 'Add Category'}
          </h2>
          <button onClick={onClose} className="p-1.5 rounded-lg text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition-colors">
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="px-5 py-4 space-y-4">
          <div>
            <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1.5">
              Category Name
            </label>
            <input
              type="text"
              autoFocus
              placeholder="e.g. Engine, Brakes, Suspension…"
              value={name}
              onChange={(e) => { setName(e.target.value); setError(''); }}
              className="w-full bg-gray-50 border border-gray-200 rounded-xl px-3.5 py-2.5 text-gray-900 text-sm placeholder-gray-400 focus:outline-none focus:border-[#E8002D]/60 focus:ring-2 focus:ring-[#E8002D]/15 transition-all"
            />
            {error && (
              <p className="text-red-600 text-xs bg-red-50 border border-red-200 rounded-xl px-3 py-2 mt-2">{error}</p>
            )}
          </div>

          <div className="flex gap-3">
            <button
              type="button"
              onClick={onClose}
              disabled={saving}
              className="flex-1 py-3 rounded-xl border border-gray-200 text-gray-700 font-semibold text-sm hover:bg-gray-50 transition-colors disabled:opacity-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={saving}
              className="flex-1 py-3 rounded-xl bg-[#E8002D] hover:bg-[#c5001f] text-white font-semibold text-sm transition-colors disabled:opacity-50 flex items-center justify-center gap-2 shadow-lg shadow-red-900/20"
            >
              {saving ? <><Loader2 className="h-4 w-4 animate-spin" />Saving…</> : isEdit ? 'Save Changes' : 'Add Category'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
