'use client';

/**
 * VehicleCompatPicker
 *
 * DB-driven vehicle compatibility selector for product modals.
 * Fetches live vehicles from /api/admin/vehicles.
 * Mirrors the Vehicles admin page hierarchy: Brand → Model → Variant.
 *
 * Light/white premium theme — designed to contrast against dark modal backgrounds.
 */

import { useState, useEffect, useMemo, useCallback } from 'react';
import {
  Search, X, Star, Calendar, ChevronDown, ChevronRight,
  Plus, Loader2, AlertTriangle, RefreshCw, CheckSquare,
} from 'lucide-react';

// ─── Types ─────────────────────────────────────────────────────────────────────

export interface PickerVehicle {
  id: string;
  brand: string;
  model: string;
  code: string;
  year_start: number | null;
  year_end: number | null;
  popular: boolean;
}

interface VehicleCompatPickerProps {
  selectedIds: string[];
  onChange: (ids: string[]) => void;
  parentLoading?: boolean;
}

// ─── Brand colour map ───────────────────────────────────────────────────────────

const BRAND_STYLE: Record<string, { badge: string; header: string }> = {
  Toyota:     { badge: 'bg-red-100 text-red-700 border border-red-200',         header: 'bg-red-50' },
  Nissan:     { badge: 'bg-blue-100 text-blue-700 border border-blue-200',        header: 'bg-blue-50' },
  Mazda:      { badge: 'bg-purple-100 text-purple-700 border border-purple-200',  header: 'bg-purple-50' },
  Subaru:     { badge: 'bg-orange-100 text-orange-700 border border-orange-200',  header: 'bg-orange-50' },
  Honda:      { badge: 'bg-emerald-100 text-emerald-700 border border-emerald-200', header: 'bg-emerald-50' },
  Mitsubishi: { badge: 'bg-sky-100 text-sky-700 border border-sky-200',           header: 'bg-sky-50' },
  Isuzu:      { badge: 'bg-amber-100 text-amber-700 border border-amber-200',     header: 'bg-amber-50' },
};

const BRAND_ORDER = ['Toyota', 'Nissan', 'Mazda', 'Subaru', 'Honda', 'Mitsubishi', 'Isuzu'];

function sortBrands(brands: string[]): string[] {
  return [...brands].sort((a, b) => {
    const ai = BRAND_ORDER.indexOf(a);
    const bi = BRAND_ORDER.indexOf(b);
    if (ai !== -1 && bi !== -1) return ai - bi;
    if (ai !== -1) return -1;
    if (bi !== -1) return 1;
    return a.localeCompare(b);
  });
}

function yearLabel(start: number | null, end: number | null): string {
  if (!start && !end) return '';
  if (start && end) return `${start}–${end}`;
  if (start) return `${start}–present`;
  return `up to ${end}`;
}

// ─── Variant row ───────────────────────────────────────────────────────────────

function VariantRow({
  vehicle,
  selected,
  onToggle,
}: {
  vehicle: PickerVehicle;
  selected: boolean;
  onToggle: (id: string) => void;
}) {
  const years = yearLabel(vehicle.year_start, vehicle.year_end);

  return (
    <button
      type="button"
      onClick={() => onToggle(vehicle.id)}
      className={`w-full flex items-center gap-2.5 pl-8 pr-3 py-2 text-left transition-all active:scale-[0.99] ${
        selected
          ? 'bg-red-50 border-l-2 border-[#E8002D]'
          : 'hover:bg-gray-50 border-l-2 border-transparent'
      }`}
    >
      {/* Checkbox */}
      <div
        className={`w-4 h-4 rounded-[4px] border-2 flex items-center justify-center flex-shrink-0 transition-all shadow-sm ${
          selected
            ? 'bg-[#E8002D] border-[#E8002D]'
            : 'bg-white border-gray-300 hover:border-gray-400'
        }`}
      >
        {selected && (
          <svg className="w-2.5 h-2.5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
          </svg>
        )}
      </div>

      {/* Code chip */}
      <span
        className={`flex-shrink-0 text-[11px] font-mono font-bold px-2 py-0.5 rounded-md min-w-[68px] text-center border transition-colors ${
          selected
            ? 'bg-red-100 text-[#E8002D] border-red-200'
            : 'bg-gray-100 text-gray-600 border-gray-200'
        }`}
      >
        {vehicle.code}
      </span>

      {/* Year badge */}
      {years ? (
        <span className={`flex-shrink-0 inline-flex items-center gap-1 text-[11px] px-2 py-0.5 rounded-full border transition-colors ${
          selected
            ? 'text-red-600 bg-red-50 border-red-200'
            : 'text-gray-500 bg-white border-gray-200'
        }`}>
          <Calendar className="h-2.5 w-2.5" />
          {years}
        </span>
      ) : (
        <span className="text-[11px] text-gray-300 italic">No year set</span>
      )}

      {/* Popular star */}
      {vehicle.popular && !selected && (
        <span className="flex-shrink-0 inline-flex items-center gap-0.5 text-[9px] font-black text-amber-600 bg-amber-50 border border-amber-200 px-1.5 py-0.5 rounded-full tracking-wide">
          <Star className="h-2 w-2 fill-amber-500" /> HOT
        </span>
      )}

      {selected && (
        <span className="ml-auto flex-shrink-0">
          <svg className="w-3 h-3 text-[#E8002D]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
          </svg>
        </span>
      )}
    </button>
  );
}

// ─── Model group ───────────────────────────────────────────────────────────────

function ModelGroup({
  model,
  variants,
  selectedIds,
  onToggle,
  onSelectAll,
  onClearAll,
  defaultOpen,
}: {
  model: string;
  variants: PickerVehicle[];
  selectedIds: string[];
  onToggle: (id: string) => void;
  onSelectAll: (ids: string[]) => void;
  onClearAll: (ids: string[]) => void;
  defaultOpen: boolean;
}) {
  const [open, setOpen] = useState(defaultOpen);
  const selectedCount = variants.filter((v) => selectedIds.includes(v.id)).length;
  const allSelected = selectedCount === variants.length;
  const hasPopular = variants.some((v) => v.popular);

  function handleSelectToggle(e: React.MouseEvent) {
    e.stopPropagation();
    if (allSelected) {
      onClearAll(variants.map((v) => v.id));
    } else {
      onSelectAll(variants.map((v) => v.id));
    }
  }

  return (
    <div className="border-b border-gray-100 last:border-b-0">
      {/* Model header */}
      <div
        className={`flex items-center gap-2 px-3 py-2 cursor-pointer transition-colors ${
          selectedCount > 0 ? 'bg-red-50/60' : 'hover:bg-gray-50'
        }`}
        onClick={() => setOpen((o) => !o)}
      >
        <button type="button" className="flex-shrink-0 p-0.5 text-gray-400 hover:text-gray-600">
          {open
            ? <ChevronDown className="h-3.5 w-3.5" />
            : <ChevronRight className="h-3.5 w-3.5" />}
        </button>

        <span className="font-semibold text-gray-800 text-sm">{model}</span>

        {hasPopular && <Star className="h-3 w-3 text-amber-500 fill-amber-400 flex-shrink-0" />}

        {selectedCount > 0 ? (
          <span className="text-[10px] font-bold text-[#E8002D] bg-red-100 border border-red-200 px-1.5 py-0.5 rounded-full flex-shrink-0">
            {selectedCount}/{variants.length}
          </span>
        ) : (
          <span className="text-[10px] text-gray-400 flex-shrink-0">{variants.length} variant{variants.length !== 1 ? 's' : ''}</span>
        )}

        {/* Select all / clear for this model */}
        <button
          type="button"
          onClick={handleSelectToggle}
          className={`ml-auto flex-shrink-0 flex items-center gap-1 text-[10px] font-bold px-2 py-1 rounded-lg transition-all border ${
            allSelected
              ? 'text-gray-500 hover:text-gray-700 bg-white border-gray-200 hover:border-gray-300'
              : 'text-[#E8002D] hover:bg-red-50 bg-white border-red-200'
          }`}
          title={allSelected ? 'Deselect all variants' : 'Select all variants'}
        >
          {allSelected
            ? <><CheckSquare className="h-3 w-3" />Deselect all</>
            : <><Plus className="h-3 w-3" />All</>
          }
        </button>
      </div>

      {/* Variants */}
      {open && (
        <div className="bg-white">
          {[...variants]
            .sort((a, b) => (a.year_start ?? 9999) - (b.year_start ?? 9999))
            .map((v) => (
              <VariantRow
                key={v.id}
                vehicle={v}
                selected={selectedIds.includes(v.id)}
                onToggle={onToggle}
              />
            ))}
        </div>
      )}
    </div>
  );
}

// ─── Brand section ─────────────────────────────────────────────────────────────

function BrandSection({
  brand,
  vehicles,
  selectedIds,
  onToggle,
  onSelectAll,
  onClearAll,
  defaultOpen,
}: {
  brand: string;
  vehicles: PickerVehicle[];
  selectedIds: string[];
  onToggle: (id: string) => void;
  onSelectAll: (ids: string[]) => void;
  onClearAll: (ids: string[]) => void;
  defaultOpen: boolean;
}) {
  const [open, setOpen] = useState(defaultOpen);
  const style = BRAND_STYLE[brand] ?? {
    badge: 'bg-gray-100 text-gray-600 border border-gray-200',
    header: 'bg-gray-50',
  };

  const selectedCount = vehicles.filter((v) => selectedIds.includes(v.id)).length;

  // Group by model
  const modelGroups = useMemo(() => {
    const g: Record<string, PickerVehicle[]> = {};
    vehicles.forEach((v) => {
      if (!g[v.model]) g[v.model] = [];
      g[v.model].push(v);
    });
    return g;
  }, [vehicles]);

  const modelNames = Object.keys(modelGroups).sort();

  return (
    <div className="bg-white rounded-xl border border-gray-200 overflow-hidden shadow-sm">
      {/* Brand header */}
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        className={`w-full flex items-center gap-2.5 px-3 py-2.5 hover:brightness-95 transition-all text-left border-b border-gray-100 ${style.header}`}
      >
        {open
          ? <ChevronDown className="h-3.5 w-3.5 text-gray-500 flex-shrink-0" />
          : <ChevronRight className="h-3.5 w-3.5 text-gray-500 flex-shrink-0" />}

        <span className={`flex-shrink-0 text-[10px] font-black px-2.5 py-0.5 rounded-lg uppercase tracking-wide ${style.badge}`}>
          {brand}
        </span>

        <span className="text-gray-500 text-xs font-medium">
          {modelNames.length} model{modelNames.length !== 1 ? 's' : ''} · {vehicles.length} variants
        </span>

        {selectedCount > 0 && (
          <span className="flex-shrink-0 ml-auto text-[11px] font-bold text-[#E8002D] bg-red-100 border border-red-200 px-2 py-0.5 rounded-full">
            {selectedCount} selected
          </span>
        )}
      </button>

      {/* Models */}
      {open && (
        <div className="bg-white">
          {modelNames.map((modelName, i) => (
            <ModelGroup
              key={modelName}
              model={modelName}
              variants={modelGroups[modelName]}
              selectedIds={selectedIds}
              onToggle={onToggle}
              onSelectAll={onSelectAll}
              onClearAll={onClearAll}
              defaultOpen={i === 0 && defaultOpen}
            />
          ))}
        </div>
      )}
    </div>
  );
}

// ─── Main component ────────────────────────────────────────────────────────────

export function VehicleCompatPicker({
  selectedIds,
  onChange,
  parentLoading = false,
}: VehicleCompatPickerProps) {
  const [vehicles, setVehicles] = useState<PickerVehicle[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [search, setSearch] = useState('');

  const fetchVehicles = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch('/api/admin/vehicles');
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? 'Failed to load vehicles');
      setVehicles(data.vehicles ?? []);
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Failed to load vehicles');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchVehicles(); }, [fetchVehicles]);

  // Filter by search
  const filtered = useMemo(() => {
    if (!search.trim()) return vehicles;
    const q = search.toLowerCase();
    return vehicles.filter(
      (v) =>
        v.brand.toLowerCase().includes(q) ||
        v.model.toLowerCase().includes(q) ||
        v.code.toLowerCase().includes(q) ||
        String(v.year_start ?? '').includes(q) ||
        String(v.year_end ?? '').includes(q)
    );
  }, [vehicles, search]);

  // Group by brand
  const brandGroups = useMemo(() => {
    const g: Record<string, PickerVehicle[]> = {};
    filtered.forEach((v) => {
      if (!g[v.brand]) g[v.brand] = [];
      g[v.brand].push(v);
    });
    return g;
  }, [filtered]);

  const sortedBrands = useMemo(() => sortBrands(Object.keys(brandGroups)), [brandGroups]);

  // Toggle handlers
  function toggleOne(id: string) {
    onChange(
      selectedIds.includes(id)
        ? selectedIds.filter((s) => s !== id)
        : [...selectedIds, id]
    );
  }

  function selectAll(ids: string[]) {
    const next = new Set(selectedIds);
    ids.forEach((id) => next.add(id));
    onChange(Array.from(next));
  }

  function clearAll(ids: string[]) {
    const toRemove = new Set(ids);
    onChange(selectedIds.filter((id) => !toRemove.has(id)));
  }

  if (loading || parentLoading) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center gap-2 py-10 bg-white rounded-xl border border-gray-200">
        <Loader2 className="h-5 w-5 text-gray-400 animate-spin" />
        <p className="text-gray-400 text-xs font-medium">Loading vehicles…</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center gap-3 py-10 px-4 text-center bg-white rounded-xl border border-red-200">
        <div className="w-10 h-10 rounded-full bg-red-50 flex items-center justify-center">
          <AlertTriangle className="h-5 w-5 text-red-400" />
        </div>
        <p className="text-red-500 text-sm font-semibold">{error}</p>
        <button
          type="button"
          onClick={fetchVehicles}
          className="flex items-center gap-1.5 text-xs text-gray-500 hover:text-gray-800 transition-colors font-semibold bg-gray-100 hover:bg-gray-200 px-3 py-1.5 rounded-lg"
        >
          <RefreshCw className="h-3.5 w-3.5" /> Retry
        </button>
      </div>
    );
  }

  return (
    <div className="flex-1 flex flex-col overflow-hidden min-h-0 bg-gray-50 rounded-xl border border-gray-200">
      {/* Header */}
      <div className="flex items-center justify-between flex-shrink-0 px-3.5 pt-3 pb-2.5 bg-white border-b border-gray-200">
        <div>
          <p className="text-gray-900 font-bold text-sm leading-none">Vehicle Compatibility</p>
          <p className="text-gray-400 text-[11px] mt-0.5">
            {vehicles.length} variants · {sortBrands(Object.keys(
              vehicles.reduce<Record<string, boolean>>((a, v) => { a[v.brand] = true; return a; }, {})
            )).length} brands
          </p>
        </div>
        {selectedIds.length > 0 && (
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold text-[#E8002D] bg-red-100 border border-red-200 px-2.5 py-1 rounded-full">
              {selectedIds.length} selected
            </span>
            <button
              type="button"
              onClick={() => onChange([])}
              className="text-[11px] text-gray-400 hover:text-red-500 transition-colors font-semibold"
            >
              Clear all
            </button>
          </div>
        )}
      </div>

      {/* Search */}
      <div className="flex-shrink-0 px-3 pt-2.5 pb-2 bg-white border-b border-gray-100">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-gray-400 pointer-events-none" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search make, model, code, year…"
            className="w-full bg-gray-50 border border-gray-200 rounded-lg pl-9 pr-8 py-2 text-sm text-gray-800 placeholder-gray-400 focus:outline-none focus:border-[#E8002D]/50 focus:ring-2 focus:ring-[#E8002D]/10 transition-all"
          />
          {search && (
            <button
              type="button"
              onClick={() => setSearch('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
            >
              <X className="h-3.5 w-3.5" />
            </button>
          )}
        </div>
      </div>

      {/* No results */}
      {sortedBrands.length === 0 && (
        <div className="flex-1 flex flex-col items-center justify-center text-center py-10 px-4">
          {search ? (
            <>
              <p className="text-gray-500 text-sm font-semibold">No vehicles match &ldquo;{search}&rdquo;</p>
              <button
                type="button"
                onClick={() => setSearch('')}
                className="mt-2 text-xs text-[#E8002D] hover:underline font-semibold"
              >
                Clear search
              </button>
            </>
          ) : (
            <>
              <p className="text-gray-500 text-sm font-semibold">No vehicles in database</p>
              <p className="text-gray-400 text-xs mt-1">Add vehicles on the Vehicles &amp; Categories page first.</p>
            </>
          )}
        </div>
      )}

      {/* Brand list */}
      {sortedBrands.length > 0 && (
        <div className="flex-1 overflow-y-auto min-h-0 p-3 pb-4 space-y-2">
          {sortedBrands.map((brand, i) => (
            <BrandSection
              key={brand}
              brand={brand}
              vehicles={brandGroups[brand]}
              selectedIds={selectedIds}
              onToggle={toggleOne}
              onSelectAll={selectAll}
              onClearAll={clearAll}
              defaultOpen={i === 0}
            />
          ))}

          {search && filtered.length > 0 && (
            <p className="text-gray-400 text-[11px] text-center pt-1">
              {filtered.length} of {vehicles.length} vehicles match
            </p>
          )}
        </div>
      )}

      {/* Selected summary chips */}
      {selectedIds.length > 0 && !loading && (
        <div className="flex-shrink-0 border-t border-gray-200 bg-white px-3 pt-2.5 pb-3">
          <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1.5">
            Selected ({selectedIds.length})
          </p>
          <div className="flex flex-wrap gap-1.5 max-h-20 overflow-y-auto">
            {selectedIds.map((id) => {
              const v = vehicles.find((x) => x.id === id);
              if (!v) return null;
              return (
                <span
                  key={id}
                  className="inline-flex items-center gap-1 bg-red-50 border border-red-200 text-[10px] font-semibold text-red-700 px-2 py-1 rounded-full shadow-sm"
                >
                  {v.brand} {v.model} <span className="font-mono text-red-500">{v.code}</span>
                  <button
                    type="button"
                    onClick={() => toggleOne(id)}
                    className="hover:text-red-900 ml-0.5 transition-colors"
                  >
                    <X className="h-2.5 w-2.5" />
                  </button>
                </span>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}

// Needed for Square icon — re-export for use in parent if needed
export { CheckSquare as Square };
