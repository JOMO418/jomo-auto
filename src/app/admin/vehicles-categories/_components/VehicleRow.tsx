'use client';

import { Edit2, Trash2, Star, Calendar } from 'lucide-react';

export interface Vehicle {
  id: string;
  brand: string;
  model: string;
  code: string;
  slug: string;
  year_start: number | null;
  year_end: number | null;
  popular: boolean;
  created_at: string;
  updated_at: string;
}

export const BRAND_STYLE: Record<string, { badge: string; dot: string }> = {
  Toyota:     { badge: 'bg-red-100 text-red-700',     dot: 'bg-red-500'     },
  Nissan:     { badge: 'bg-blue-100 text-blue-700',   dot: 'bg-blue-500'    },
  Mazda:      { badge: 'bg-purple-100 text-purple-700', dot: 'bg-purple-500' },
  Honda:      { badge: 'bg-orange-100 text-orange-700', dot: 'bg-orange-500' },
  Mitsubishi: { badge: 'bg-yellow-100 text-yellow-700', dot: 'bg-yellow-500' },
  Subaru:     { badge: 'bg-cyan-100 text-cyan-700',   dot: 'bg-cyan-500'    },
  Isuzu:      { badge: 'bg-green-100 text-green-700', dot: 'bg-green-500'   },
};

export function yearLabel(year_start: number | null, year_end: number | null): string {
  if (!year_start && !year_end) return '';
  if (year_start && !year_end) return `${year_start}–present`;
  if (!year_start && year_end) return `–${year_end}`;
  return `${year_start}–${year_end}`;
}

interface Props {
  vehicle: Vehicle;
  deleting: boolean;
  onEdit: (v: Vehicle) => void;
  onDelete: (v: Vehicle) => void;
}

export function VehicleRow({ vehicle, deleting, onEdit, onDelete }: Props) {
  const style = BRAND_STYLE[vehicle.brand] ?? { badge: 'bg-zinc-100 text-zinc-600', dot: 'bg-zinc-400' };
  const years = yearLabel(vehicle.year_start, vehicle.year_end);

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 px-4 py-3 flex items-center gap-3 hover:border-gray-200 transition-colors">
      {/* Brand badge */}
      <span className={`flex-shrink-0 text-[11px] font-bold px-2.5 py-1 rounded-lg uppercase tracking-wide ${style.badge}`}>
        {vehicle.brand}
      </span>

      {/* Info */}
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 flex-wrap">
          <span className="text-gray-900 font-semibold text-sm">{vehicle.model}</span>
          <span className="text-[11px] font-mono font-bold text-gray-400 bg-gray-100 px-2 py-0.5 rounded-md">
            {vehicle.code}
          </span>
          {years && (
            <span className="inline-flex items-center gap-1 text-[11px] text-gray-500 bg-gray-50 border border-gray-200 px-2 py-0.5 rounded-full">
              <Calendar className="h-2.5 w-2.5" />
              {years}
            </span>
          )}
          {vehicle.popular && (
            <span className="inline-flex items-center gap-0.5 text-[10px] font-bold text-amber-600 bg-amber-50 px-1.5 py-0.5 rounded-full">
              <Star className="h-2.5 w-2.5 fill-amber-400" /> Popular
            </span>
          )}
        </div>
        <p className="text-[10px] text-gray-300 mt-0.5 font-mono truncate">{vehicle.slug}</p>
      </div>

      {/* Actions */}
      <div className="flex items-center gap-1 flex-shrink-0">
        <button
          onClick={() => onEdit(vehicle)}
          className="p-2 rounded-xl text-blue-600 hover:bg-blue-50 transition-colors"
          title="Edit vehicle"
        >
          <Edit2 className="h-4 w-4" />
        </button>
        <button
          onClick={() => onDelete(vehicle)}
          disabled={deleting}
          className="p-2 rounded-xl text-red-500 hover:bg-red-50 transition-colors disabled:opacity-40"
          title="Delete vehicle"
        >
          <Trash2 className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
}

export function VehicleRowSkeleton() {
  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 px-4 py-3 flex items-center gap-3 animate-pulse">
      <div className="h-7 w-16 rounded-lg bg-gray-200 flex-shrink-0" />
      <div className="flex-1 space-y-2">
        <div className="flex gap-2">
          <div className="h-3.5 bg-gray-200 rounded-full w-24" />
          <div className="h-3.5 bg-gray-100 rounded-full w-16" />
          <div className="h-3.5 bg-gray-100 rounded-full w-20" />
        </div>
        <div className="h-3 bg-gray-100 rounded-full w-1/3" />
      </div>
      <div className="flex gap-1">
        <div className="h-8 w-8 rounded-xl bg-gray-100" />
        <div className="h-8 w-8 rounded-xl bg-gray-100" />
      </div>
    </div>
  );
}
