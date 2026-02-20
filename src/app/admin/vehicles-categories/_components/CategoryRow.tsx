'use client';

import { Edit2, Trash2, Tag } from 'lucide-react';

export interface Category {
  id: string;
  name: string;
  product_count: number;
}

const CATEGORY_COLORS: Record<string, string> = {
  Engine:         'bg-red-100 text-red-700',
  Brakes:         'bg-orange-100 text-orange-700',
  Suspension:     'bg-blue-100 text-blue-700',
  Electrical:     'bg-yellow-100 text-yellow-700',
  Body:           'bg-purple-100 text-purple-700',
  Interior:       'bg-pink-100 text-pink-700',
  Transmission:   'bg-green-100 text-green-700',
  'Wheels & Tires': 'bg-cyan-100 text-cyan-700',
};

interface Props {
  category: Category;
  deleting: boolean;
  onEdit: (c: Category) => void;
  onDelete: (c: Category) => void;
}

export function CategoryRow({ category, deleting, onEdit, onDelete }: Props) {
  const colorStyle = CATEGORY_COLORS[category.name] ?? 'bg-zinc-100 text-zinc-600';

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 px-4 py-3.5 flex items-center gap-3">
      {/* Icon */}
      <div className={`w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0 ${colorStyle}`}>
        <Tag className="h-4 w-4" />
      </div>

      {/* Info */}
      <div className="flex-1 min-w-0">
        <p className="text-gray-900 font-semibold text-sm">{category.name}</p>
        <p className="text-gray-400 text-xs mt-0.5">
          {category.product_count === 0
            ? 'No products'
            : `${category.product_count} product${category.product_count === 1 ? '' : 's'}`}
        </p>
      </div>

      {/* Actions */}
      <div className="flex items-center gap-1 flex-shrink-0">
        <button
          onClick={() => onEdit(category)}
          className="p-2 rounded-xl text-blue-600 hover:bg-blue-50 transition-colors"
          title="Edit category"
        >
          <Edit2 className="h-4 w-4" />
        </button>
        <button
          onClick={() => onDelete(category)}
          disabled={deleting}
          className="p-2 rounded-xl text-red-500 hover:bg-red-50 transition-colors disabled:opacity-40"
          title={category.product_count > 0 ? `${category.product_count} product(s) use this category` : 'Delete category'}
        >
          <Trash2 className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
}

export function CategoryRowSkeleton() {
  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 px-4 py-3.5 flex items-center gap-3 animate-pulse">
      <div className="w-9 h-9 rounded-xl bg-gray-200 flex-shrink-0" />
      <div className="flex-1 space-y-2">
        <div className="h-3.5 bg-gray-200 rounded-full w-1/3" />
        <div className="h-3 bg-gray-100 rounded-full w-1/5" />
      </div>
      <div className="flex gap-1">
        <div className="h-8 w-8 rounded-xl bg-gray-100" />
        <div className="h-8 w-8 rounded-xl bg-gray-100" />
      </div>
    </div>
  );
}
