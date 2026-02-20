import { Trash2, RefreshCw, X } from 'lucide-react';
import type { AdminProduct } from '@/lib/admin-db';

export function DeleteModal({
  product, isDeleting, onConfirm, onCancel,
}: {
  product: AdminProduct; isDeleting: boolean; onConfirm: () => void; onCancel: () => void;
}) {
  return (
    <div className="fixed inset-0 z-[60] flex items-end sm:items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
      <div className="bg-white rounded-2xl p-6 w-full max-w-sm shadow-2xl animate-in slide-in-from-bottom-4 duration-200">
        <div className="w-12 h-12 rounded-2xl bg-red-50 flex items-center justify-center mb-4">
          <Trash2 className="h-6 w-6 text-red-500" />
        </div>
        <h3 className="text-gray-900 font-bold text-lg">Delete product?</h3>
        <p className="text-gray-500 text-sm mt-2 leading-relaxed">
          <span className="font-semibold text-gray-800">{product.name}</span> will be permanently removed. This cannot be undone.
        </p>
        <div className="flex gap-3 mt-6">
          <button onClick={onCancel} className="flex-1 py-3 rounded-xl border border-gray-200 text-gray-700 text-sm font-semibold hover:bg-gray-50 transition-colors">
            Cancel
          </button>
          <button onClick={onConfirm} disabled={isDeleting} className="flex-1 py-3 rounded-xl bg-red-600 text-white text-sm font-semibold hover:bg-red-700 transition-colors disabled:opacity-60 flex items-center justify-center gap-2">
            {isDeleting ? <><RefreshCw className="h-3.5 w-3.5 animate-spin" />Deleting…</> : 'Yes, Delete'}
          </button>
        </div>
      </div>
    </div>
  );
}
