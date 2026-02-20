'use client';

import { Loader2, Trash2, AlertTriangle } from 'lucide-react';

interface Props {
  title: string;
  description: string;
  warning?: string;
  deleting: boolean;
  onConfirm: () => void;
  onCancel: () => void;
}

export function DeleteModal({ title, description, warning, deleting, onConfirm, onCancel }: Props) {
  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-sm">
        {/* Icon */}
        <div className="flex justify-center pt-6 pb-2">
          <div className="w-14 h-14 rounded-full bg-red-50 border-4 border-red-100 flex items-center justify-center">
            <Trash2 className="h-6 w-6 text-red-500" />
          </div>
        </div>

        {/* Content */}
        <div className="px-6 pb-2 text-center">
          <h3 className="text-gray-900 font-bold text-lg mt-1">{title}</h3>
          <p className="text-gray-500 text-sm mt-1.5 leading-relaxed">{description}</p>
          {warning && (
            <div className="mt-3 flex items-start gap-2 bg-amber-50 border border-amber-200 rounded-xl px-3 py-2.5 text-left">
              <AlertTriangle className="h-4 w-4 text-amber-500 flex-shrink-0 mt-0.5" />
              <p className="text-amber-700 text-xs leading-relaxed">{warning}</p>
            </div>
          )}
        </div>

        {/* Actions */}
        <div className="flex gap-3 p-4 pt-4">
          <button
            onClick={onCancel}
            disabled={deleting}
            className="flex-1 py-3 rounded-xl border border-gray-200 text-gray-700 font-semibold text-sm hover:bg-gray-50 transition-colors disabled:opacity-50"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            disabled={deleting}
            className="flex-1 py-3 rounded-xl bg-red-600 hover:bg-red-700 text-white font-semibold text-sm transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
          >
            {deleting ? (
              <><Loader2 className="h-4 w-4 animate-spin" />Deleting…</>
            ) : (
              'Delete'
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
