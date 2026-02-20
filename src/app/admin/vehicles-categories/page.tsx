'use client';

import { useState, useEffect, useCallback, useMemo } from 'react';
import {
  Plus, Search, Car, Tag, X, RefreshCw, AlertTriangle,
  Database, Loader2, CheckCircle2, ChevronDown, ChevronRight,
  Star, Calendar, Edit2, Trash2,
} from 'lucide-react';

import type { Vehicle } from './_components/VehicleRow';
import { BRAND_STYLE, yearLabel } from './_components/VehicleRow';
import { CategoryRow, CategoryRowSkeleton, type Category } from './_components/CategoryRow';
import { VehicleModal } from './_components/VehicleModal';
import { CategoryModal } from './_components/CategoryModal';
import { DeleteModal } from './_components/DeleteModal';

// ─── Brand ordering: Toyota always first ──────────────────────────────────────
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

// ─── Toast ─────────────────────────────────────────────────────────────────────
function Toast({ msg, ok, onDone }: { msg: string; ok: boolean; onDone: () => void }) {
  useEffect(() => {
    const t = setTimeout(onDone, 3500);
    return () => clearTimeout(t);
  }, [onDone]);

  return (
    <div className={`fixed bottom-6 left-1/2 -translate-x-1/2 z-[60] flex items-center gap-2.5 px-4 py-3 rounded-2xl shadow-2xl text-sm font-semibold animate-in slide-in-from-bottom-4 ${
      ok ? 'bg-emerald-600 text-white' : 'bg-red-600 text-white'
    }`}>
      {ok
        ? <CheckCircle2 className="h-4 w-4 flex-shrink-0" />
        : <AlertTriangle className="h-4 w-4 flex-shrink-0" />}
      {msg}
    </div>
  );
}

// ─── Setup Banner ──────────────────────────────────────────────────────────────
function SetupBanner({ onSetupDone }: { onSetupDone: () => void }) {
  const [running, setRunning] = useState(false);
  const [sql, setSql]         = useState('');
  const [showSql, setShowSql] = useState(false);

  async function handleSetup() {
    setRunning(true);
    try {
      const res  = await fetch('/api/admin/setup-vehicles', { method: 'POST' });
      const data = await res.json();
      if (data.ok) {
        onSetupDone();
      } else if (data.method === 'manual' && data.sql) {
        setSql(data.sql);
        setShowSql(true);
      }
    } catch { /* swallow */ }
    finally   { setRunning(false); }
  }

  if (showSql) {
    return (
      <div className="bg-[#1A1A1A] border border-amber-500/30 rounded-2xl p-4 space-y-3">
        <div className="flex items-start gap-3">
          <Database className="h-5 w-5 text-amber-400 flex-shrink-0 mt-0.5" />
          <div>
            <p className="text-amber-300 font-semibold text-sm">Run this SQL in Supabase SQL Editor</p>
            <p className="text-zinc-500 text-xs mt-0.5">Then click &quot;I&apos;ve run it&quot; to reload.</p>
          </div>
        </div>
        <textarea
          readOnly value={sql} rows={8}
          className="w-full bg-black/40 border border-white/10 rounded-xl px-3 py-2.5 text-xs font-mono text-zinc-300 resize-none focus:outline-none"
        />
        <div className="flex gap-2">
          <button
            onClick={() => navigator.clipboard.writeText(sql)}
            className="flex-1 py-2.5 rounded-xl bg-white/[0.06] hover:bg-white/[0.10] text-zinc-300 text-sm font-semibold transition-colors border border-white/[0.08]"
          >
            Copy SQL
          </button>
          <button
            onClick={onSetupDone}
            className="flex-1 py-2.5 rounded-xl bg-[#E8002D] hover:bg-[#c5001f] text-white text-sm font-semibold transition-colors"
          >
            I&apos;ve run it
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-[#1A1A1A] border border-amber-500/30 rounded-2xl p-4">
      <div className="flex items-start gap-3">
        <Database className="h-5 w-5 text-amber-400 flex-shrink-0 mt-0.5" />
        <div className="flex-1 min-w-0">
          <p className="text-amber-300 font-semibold text-sm">Vehicles table not found</p>
          <p className="text-zinc-500 text-xs mt-0.5">
            Click Setup to create the table and seed it with all vehicles including correct year ranges.
          </p>
        </div>
        <button
          onClick={handleSetup}
          disabled={running}
          className="flex-shrink-0 flex items-center gap-1.5 bg-amber-500 hover:bg-amber-400 text-black text-xs font-bold px-3.5 py-2 rounded-xl transition-colors disabled:opacity-60"
        >
          {running ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Database className="h-3.5 w-3.5" />}
          {running ? 'Creating…' : 'Setup'}
        </button>
      </div>
    </div>
  );
}

// ─── Single vehicle row inside a model group ───────────────────────────────────
interface VehicleVariantRowProps {
  vehicle: Vehicle;
  onEdit: (v: Vehicle) => void;
  onDelete: (v: Vehicle) => void;
}

function VehicleVariantRow({ vehicle, onEdit, onDelete }: VehicleVariantRowProps) {
  const years = yearLabel(vehicle.year_start, vehicle.year_end);

  return (
    <div className="flex items-center gap-3 px-4 py-2.5 hover:bg-gray-50 transition-colors group">
      {/* Indent line */}
      <div className="flex-shrink-0 w-6 flex justify-center">
        <div className="w-px h-full bg-gray-200" />
      </div>

      {/* Code chip */}
      <span className="flex-shrink-0 text-[11px] font-mono font-bold text-gray-600 bg-gray-100 px-2.5 py-1 rounded-lg min-w-[72px] text-center">
        {vehicle.code}
      </span>

      {/* Year badge */}
      {years ? (
        <span className="flex-shrink-0 inline-flex items-center gap-1 text-[11px] text-gray-500 bg-white border border-gray-200 px-2.5 py-1 rounded-full">
          <Calendar className="h-3 w-3 text-gray-400" />
          {years}
        </span>
      ) : (
        <span className="flex-shrink-0 text-[11px] text-gray-300 italic">No year set</span>
      )}

      {/* Popular star */}
      {vehicle.popular && (
        <span className="flex-shrink-0 inline-flex items-center gap-0.5 text-[10px] font-bold text-amber-600 bg-amber-50 px-1.5 py-0.5 rounded-full">
          <Star className="h-2.5 w-2.5 fill-amber-400" /> Popular
        </span>
      )}

      <div className="flex-1" />

      {/* Actions — show on hover */}
      <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
        <button
          onClick={() => onEdit(vehicle)}
          className="p-1.5 rounded-lg text-blue-500 hover:bg-blue-50 transition-colors"
          title="Edit"
        >
          <Edit2 className="h-3.5 w-3.5" />
        </button>
        <button
          onClick={() => onDelete(vehicle)}
          className="p-1.5 rounded-lg text-red-400 hover:bg-red-50 transition-colors"
          title="Delete"
        >
          <Trash2 className="h-3.5 w-3.5" />
        </button>
      </div>
    </div>
  );
}

// ─── Model group: shows all year variants for one model name ───────────────────
interface ModelGroupProps {
  brand: string;
  model: string;
  variants: Vehicle[];
  onEdit: (v: Vehicle) => void;
  onDelete: (v: Vehicle) => void;
  onAddVariant: (brand: string, model: string) => void;
}

function ModelGroup({ brand, model, variants, onEdit, onDelete, onAddVariant }: ModelGroupProps) {
  const [open, setOpen] = useState(true);
  const hasPopular = variants.some((v) => v.popular);
  const yearRange = useMemo(() => {
    const starts = variants.map((v) => v.year_start).filter(Boolean) as number[];
    const ends   = variants.map((v) => v.year_end).filter(Boolean) as number[];
    if (!starts.length && !ends.length) return null;
    const from = starts.length ? Math.min(...starts) : null;
    const to   = ends.length   ? Math.max(...ends)   : null;
    return yearLabel(from, to);
  }, [variants]);

  return (
    <div className="border-b border-gray-100 last:border-b-0">
      {/* Model header */}
      <button
        onClick={() => setOpen((o) => !o)}
        className="w-full flex items-center gap-3 px-4 py-3 hover:bg-gray-50 transition-colors text-left"
      >
        {open
          ? <ChevronDown className="h-4 w-4 text-gray-400 flex-shrink-0" />
          : <ChevronRight className="h-4 w-4 text-gray-400 flex-shrink-0" />}

        <span className="font-semibold text-gray-800 text-sm">{model}</span>

        {yearRange && (
          <span className="text-[11px] text-gray-400">{yearRange}</span>
        )}

        {hasPopular && (
          <Star className="h-3 w-3 text-amber-400 fill-amber-400" />
        )}

        <span className="ml-auto text-[11px] text-gray-400 flex-shrink-0">
          {variants.length} variant{variants.length !== 1 ? 's' : ''}
        </span>

        {/* Add variant button */}
        <button
          onClick={(e) => { e.stopPropagation(); onAddVariant(brand, model); }}
          className="flex-shrink-0 flex items-center gap-1 text-[11px] text-[#E8002D] hover:text-[#c5001f] font-semibold px-2 py-1 rounded-lg hover:bg-red-50 transition-colors"
          title="Add year variant"
        >
          <Plus className="h-3 w-3" />
          Add
        </button>
      </button>

      {/* Variants list */}
      {open && (
        <div className="pb-1">
          {variants
            .sort((a, b) => (a.year_start ?? 9999) - (b.year_start ?? 9999))
            .map((v) => (
              <VehicleVariantRow
                key={v.id}
                vehicle={v}
                onEdit={onEdit}
                onDelete={onDelete}
              />
            ))}
        </div>
      )}
    </div>
  );
}

// ─── Brand section: collapsible, shows all models for that brand ───────────────
interface BrandSectionProps {
  brand: string;
  vehicles: Vehicle[];
  defaultOpen: boolean;
  onEdit: (v: Vehicle) => void;
  onDelete: (v: Vehicle) => void;
  onAddVehicle: (brand: string, model?: string) => void;
}

function BrandSection({
  brand, vehicles, defaultOpen, onEdit, onDelete, onAddVehicle,
}: BrandSectionProps) {
  const [open, setOpen] = useState(defaultOpen);
  const style = BRAND_STYLE[brand] ?? { badge: 'bg-zinc-100 text-zinc-600', dot: 'bg-zinc-400' };
  const popularCount = vehicles.filter((v) => v.popular).length;

  // Group by model name
  const modelGroups = useMemo(() => {
    const groups: Record<string, Vehicle[]> = {};
    vehicles.forEach((v) => {
      if (!groups[v.model]) groups[v.model] = [];
      groups[v.model].push(v);
    });
    return groups;
  }, [vehicles]);

  const modelNames = Object.keys(modelGroups).sort();

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
      {/* Brand header */}
      <button
        onClick={() => setOpen((o) => !o)}
        className="w-full flex items-center gap-3 px-4 py-3.5 bg-gray-50/80 hover:bg-gray-100/60 transition-colors text-left border-b border-gray-100"
      >
        {open
          ? <ChevronDown className="h-4 w-4 text-gray-500 flex-shrink-0" />
          : <ChevronRight className="h-4 w-4 text-gray-500 flex-shrink-0" />}

        {/* Brand badge */}
        <span className={`flex-shrink-0 text-[11px] font-bold px-2.5 py-1 rounded-lg uppercase tracking-wide ${style.badge}`}>
          {brand}
        </span>

        {/* Model count */}
        <span className="text-gray-700 font-semibold text-sm">
          {modelNames.length} model{modelNames.length !== 1 ? 's' : ''}
        </span>
        <span className="text-gray-400 text-xs">
          · {vehicles.length} variant{vehicles.length !== 1 ? 's' : ''}
        </span>

        {popularCount > 0 && (
          <span className="inline-flex items-center gap-1 text-[10px] font-bold text-amber-600 bg-amber-50 px-2 py-0.5 rounded-full">
            <Star className="h-2.5 w-2.5 fill-amber-400" />
            {popularCount} popular
          </span>
        )}

        {/* Add new model for this brand */}
        <button
          onClick={(e) => { e.stopPropagation(); onAddVehicle(brand); }}
          className="ml-auto flex-shrink-0 flex items-center gap-1.5 text-xs font-semibold text-[#E8002D] hover:text-[#c5001f] px-3 py-1.5 rounded-xl hover:bg-red-50 border border-transparent hover:border-red-100 transition-all"
          title="Add new model"
        >
          <Plus className="h-3.5 w-3.5" />
          Add model
        </button>
      </button>

      {/* Models */}
      {open && (
        <div>
          {modelNames.map((modelName) => (
            <ModelGroup
              key={modelName}
              brand={brand}
              model={modelName}
              variants={modelGroups[modelName]}
              onEdit={onEdit}
              onDelete={onDelete}
              onAddVariant={(b, m) => onAddVehicle(b, m)}
            />
          ))}
        </div>
      )}
    </div>
  );
}

// ─── Page ──────────────────────────────────────────────────────────────────────
type Tab = 'vehicles' | 'categories';

export default function VehiclesCategoriesPage() {
  const [tab, setTab] = useState<Tab>('vehicles');

  // Vehicles state
  const [vehicles,        setVehicles]        = useState<Vehicle[]>([]);
  const [vehiclesLoading, setVehiclesLoading] = useState(true);
  const [vehiclesError,   setVehiclesError]   = useState<string | null>(null);
  const [tableNotFound,   setTableNotFound]   = useState(false);
const [vehicleSearch,   setVehicleSearch]   = useState('');

  // Categories state
  const [categories,  setCategories]  = useState<Category[]>([]);
  const [catsLoading, setCatsLoading] = useState(false);
  const [catsError,   setCatsError]   = useState<string | null>(null);
  const [catSearch,   setCatSearch]   = useState('');

  // Modals
  const [vehicleModal, setVehicleModal] = useState<{
    vehicle?: Vehicle;
    defaultBrand?: string;
    defaultModel?: string;
  } | null>(null);
  const [categoryModal, setCategoryModal] = useState<{ category?: Category } | null>(null);
  const [deleteTarget,  setDeleteTarget]  = useState<
    { type: 'vehicle'; item: Vehicle } | { type: 'category'; item: Category } | null
  >(null);
  const [deleting, setDeleting] = useState(false);

  // Toast
  const [toast, setToast] = useState<{ msg: string; ok: boolean } | null>(null);
  const showToast = useCallback((msg: string, ok = true) => setToast({ msg, ok }), []);

  // ── Fetch vehicles ───────────────────────────────────────────────────────────
  const fetchVehicles = useCallback(async () => {
    setVehiclesLoading(true);
    setVehiclesError(null);
    try {
      const res  = await fetch('/api/admin/vehicles');
      const data = await res.json();
      if (res.status === 404 && data.error === 'TABLE_NOT_FOUND') {
        setTableNotFound(true);
        setVehicles([]);
        return;
      }
      if (!res.ok) throw new Error(data.error ?? 'Failed to fetch vehicles');
      setTableNotFound(false);
      setVehicles(data.vehicles ?? []);
    } catch (e) {
      setVehiclesError(e instanceof Error ? e.message : 'Unknown error');
    } finally {
      setVehiclesLoading(false);
    }
  }, []);

  // ── Fetch categories ─────────────────────────────────────────────────────────
  const fetchCategories = useCallback(async () => {
    setCatsLoading(true);
    setCatsError(null);
    try {
      const res  = await fetch('/api/admin/categories');
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? 'Failed to fetch categories');
      setCategories(data.categories ?? []);
    } catch (e) {
      setCatsError(e instanceof Error ? e.message : 'Unknown error');
    } finally {
      setCatsLoading(false);
    }
  }, []);

  useEffect(() => { fetchVehicles(); }, [fetchVehicles]);
  useEffect(() => { if (tab === 'categories') fetchCategories(); }, [tab, fetchCategories]);

  // ── Derived vehicle data (search + brand grouping) ───────────────────────────
  const filteredVehicles = useMemo(() => {
    if (!vehicleSearch.trim()) return vehicles;
    const q = vehicleSearch.toLowerCase();
    return vehicles.filter(
      (v) =>
        v.brand.toLowerCase().includes(q)  ||
        v.model.toLowerCase().includes(q)  ||
        v.code.toLowerCase().includes(q)   ||
        String(v.year_start ?? '').includes(q) ||
        String(v.year_end   ?? '').includes(q)
    );
  }, [vehicles, vehicleSearch]);

  const brandGroups = useMemo(() => {
    const groups: Record<string, Vehicle[]> = {};
    filteredVehicles.forEach((v) => {
      if (!groups[v.brand]) groups[v.brand] = [];
      groups[v.brand].push(v);
    });
    return groups;
  }, [filteredVehicles]);

  const sortedBrands = useMemo(() => sortBrands(Object.keys(brandGroups)), [brandGroups]);

  const filteredCategories = categories.filter(
    (c) => !catSearch || c.name.toLowerCase().includes(catSearch.toLowerCase())
  );

  // ── Delete handler ───────────────────────────────────────────────────────────
  async function handleDelete() {
    if (!deleteTarget) return;
    setDeleting(true);
    const { type, item } = deleteTarget;
    const url = type === 'vehicle'
      ? `/api/admin/vehicles/${item.id}`
      : `/api/admin/categories/${item.id}`;

    try {
      const res  = await fetch(url, { method: 'DELETE' });
      const data = await res.json();
      if (!res.ok) {
        showToast(data.error ?? 'Delete failed', false);
        setDeleteTarget(null);
        return;
      }
      if (type === 'vehicle') {
        setVehicles((prev) => prev.filter((v) => v.id !== item.id));
        showToast(`"${(item as Vehicle).brand} ${(item as Vehicle).model} ${(item as Vehicle).code}" deleted.`);
      } else {
        setCategories((prev) => prev.filter((c) => c.id !== item.id));
        showToast(`"${(item as Category).name}" deleted.`);
      }
      setDeleteTarget(null);
    } catch {
      showToast('Network error — try again.', false);
    } finally {
      setDeleting(false);
    }
  }

  // ── Render ───────────────────────────────────────────────────────────────────
  return (
    <div className="space-y-5 pb-28">
      {toast && <Toast msg={toast.msg} ok={toast.ok} onDone={() => setToast(null)} />}

      {/* Header */}
      <div>
        <h1 className="text-xl font-bold text-white tracking-tight">Vehicles &amp; Categories</h1>
        <p className="text-zinc-500 text-xs mt-0.5">
          Manage vehicle makes, models, year variants, and product categories.
        </p>
      </div>

      {/* Tab Switcher */}
      <div className="flex gap-2 bg-[#1A1A1A] border border-white/[0.08] rounded-2xl p-1.5">
        {(['vehicles', 'categories'] as Tab[]).map((t) => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl text-sm font-semibold transition-all ${
              tab === t
                ? 'bg-[#E8002D] text-white shadow-lg shadow-red-900/40'
                : 'text-zinc-400 hover:text-white'
            }`}
          >
            {t === 'vehicles'
              ? <Car className="h-4 w-4" />
              : <Tag className="h-4 w-4" />}
            {t === 'vehicles'
              ? `Vehicles${vehicles.length ? ` (${vehicles.length})` : ''}`
              : `Categories${categories.length ? ` (${categories.length})` : ''}`}
          </button>
        ))}
      </div>

      {/* ══ VEHICLES TAB ═══════════════════════════════════════════════════════ */}
      {tab === 'vehicles' && (
        <div className="space-y-4">
          {tableNotFound && (
            <SetupBanner
              onSetupDone={() => { setTableNotFound(false); fetchVehicles(); }}
            />
          )}

          {/* Search + Add Vehicle */}
          <div className="flex gap-2">
            <div className="relative flex-1">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-500 pointer-events-none" />
              <input
                type="search"
                placeholder="Search make, model, code, year…"
                value={vehicleSearch}
                onChange={(e) => setVehicleSearch(e.target.value)}
                className="w-full bg-[#1A1A1A] border border-white/[0.08] rounded-xl pl-10 pr-8 py-2.5 text-white text-sm placeholder-zinc-600 focus:outline-none focus:border-[#E8002D]/60 focus:ring-2 focus:ring-[#E8002D]/20 transition-all"
              />
              {vehicleSearch && (
                <button
                  onClick={() => setVehicleSearch('')}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-500 hover:text-white"
                >
                  <X className="h-3.5 w-3.5" />
                </button>
              )}
            </div>
            <button
              onClick={() => setVehicleModal({})}
              className="flex-shrink-0 flex items-center gap-1.5 bg-[#E8002D] hover:bg-[#c5001f] text-white text-sm font-bold px-4 py-2.5 rounded-xl transition-colors shadow-lg shadow-red-900/30"
            >
              <Plus className="h-4 w-4" />
              <span className="hidden sm:inline">Add Vehicle</span>
              <span className="sm:hidden">Add</span>
            </button>
          </div>

          {/* Stats bar + Tools */}
          {!vehiclesLoading && (
            <div className="flex items-center gap-3">
              {vehicles.length > 0 && (
                <div className="flex gap-2 text-xs text-zinc-500 flex-1 flex-wrap">
                  <span>{vehicles.length} variants</span>
                  <span>·</span>
                  <span>{sortedBrands.length} brands</span>
                  <span>·</span>
                  <span>{vehicles.filter((v) => v.popular).length} popular</span>
                  {vehicleSearch && (
                    <span className="text-amber-400">· {filteredVehicles.length} match</span>
                  )}
                </div>
              )}
            </div>
          )}

          {/* Error */}
          {vehiclesError && (
            <div className="flex items-start gap-3 bg-red-950/50 border border-red-500/20 rounded-xl p-4">
              <AlertTriangle className="h-4 w-4 text-red-400 flex-shrink-0 mt-0.5" />
              <div className="flex-1 min-w-0">
                <p className="text-red-300 text-sm font-semibold">Failed to load vehicles</p>
                <p className="text-red-500/80 text-xs mt-0.5 break-words">{vehiclesError}</p>
              </div>
              <button
                onClick={fetchVehicles}
                className="flex-shrink-0 flex items-center gap-1 text-xs text-red-400 hover:text-red-300 font-semibold"
              >
                <RefreshCw className="h-3.5 w-3.5" /> Retry
              </button>
            </div>
          )}

          {/* Skeleton */}
          {vehiclesLoading && (
            <div className="space-y-3">
              {Array.from({ length: 4 }).map((_, i) => (
                <div key={i} className="bg-white rounded-2xl shadow-sm border border-gray-100 p-4 animate-pulse">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="h-7 w-20 rounded-lg bg-gray-200" />
                    <div className="h-4 w-32 rounded bg-gray-200" />
                    <div className="ml-auto h-4 w-16 rounded bg-gray-100" />
                  </div>
                  <div className="space-y-2 pl-4">
                    {Array.from({ length: 3 }).map((_, j) => (
                      <div key={j} className="flex gap-2">
                        <div className="h-7 w-20 rounded-lg bg-gray-100" />
                        <div className="h-7 w-28 rounded-full bg-gray-100" />
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Empty state */}
          {!vehiclesLoading && !vehiclesError && !tableNotFound && filteredVehicles.length === 0 && (
            <div className="flex flex-col items-center justify-center py-16 text-center">
              <div className="w-14 h-14 rounded-2xl bg-[#1A1A1A] border border-white/[0.06] flex items-center justify-center mb-3">
                <Car className="h-7 w-7 text-zinc-700" />
              </div>
              <p className="text-zinc-300 font-bold text-base">
                {vehicleSearch ? 'No vehicles match' : 'No vehicles yet'}
              </p>
              <p className="text-zinc-600 text-sm mt-1.5">
                {vehicleSearch
                  ? 'Try different search terms — search by model, code, or year'
                  : 'Click "Add Vehicle" or run Setup to seed from the vehicle database'}
              </p>
              {vehicleSearch && (
                <button
                  onClick={() => setVehicleSearch('')}
                  className="mt-4 text-xs text-[#E8002D] hover:text-[#c5001f] font-semibold flex items-center gap-1"
                >
                  <X className="h-3.5 w-3.5" /> Clear search
                </button>
              )}
            </div>
          )}

          {/* Brand-grouped vehicle list */}
          {!vehiclesLoading && filteredVehicles.length > 0 && (
            <div className="space-y-3">
              {sortedBrands.map((brand) => (
                <BrandSection
                  key={brand}
                  brand={brand}
                  vehicles={brandGroups[brand]}
                  defaultOpen={brand === 'Toyota'}  // Toyota expanded by default
                  onEdit={(vehicle) => setVehicleModal({ vehicle })}
                  onDelete={(vehicle) => setDeleteTarget({ type: 'vehicle', item: vehicle })}
                  onAddVehicle={(b, m) => setVehicleModal({ defaultBrand: b, defaultModel: m })}
                />
              ))}
            </div>
          )}
        </div>
      )}

      {/* ══ CATEGORIES TAB ══════════════════════════════════════════════════════ */}
      {tab === 'categories' && (
        <div className="space-y-4">
          {/* Search + Add */}
          <div className="flex gap-2">
            <div className="relative flex-1">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-500 pointer-events-none" />
              <input
                type="search"
                placeholder="Search categories…"
                value={catSearch}
                onChange={(e) => setCatSearch(e.target.value)}
                className="w-full bg-[#1A1A1A] border border-white/[0.08] rounded-xl pl-10 pr-8 py-2.5 text-white text-sm placeholder-zinc-600 focus:outline-none focus:border-[#E8002D]/60 focus:ring-2 focus:ring-[#E8002D]/20 transition-all"
              />
              {catSearch && (
                <button
                  onClick={() => setCatSearch('')}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-500 hover:text-white"
                >
                  <X className="h-3.5 w-3.5" />
                </button>
              )}
            </div>
            <button
              onClick={() => setCategoryModal({})}
              className="flex-shrink-0 flex items-center gap-1.5 bg-[#E8002D] hover:bg-[#c5001f] text-white text-sm font-bold px-4 py-2.5 rounded-xl transition-colors shadow-lg shadow-red-900/30"
            >
              <Plus className="h-4 w-4" />
              <span className="hidden sm:inline">Add Category</span>
              <span className="sm:hidden">Add</span>
            </button>
          </div>

          {/* Error */}
          {catsError && (
            <div className="flex items-start gap-3 bg-red-950/50 border border-red-500/20 rounded-xl p-4">
              <AlertTriangle className="h-4 w-4 text-red-400 flex-shrink-0 mt-0.5" />
              <div className="flex-1 min-w-0">
                <p className="text-red-300 text-sm font-semibold">Failed to load categories</p>
                <p className="text-red-500/80 text-xs mt-0.5">{catsError}</p>
              </div>
              <button
                onClick={fetchCategories}
                className="flex-shrink-0 flex items-center gap-1 text-xs text-red-400 hover:text-red-300 font-semibold"
              >
                <RefreshCw className="h-3.5 w-3.5" /> Retry
              </button>
            </div>
          )}

          {/* Skeleton */}
          {catsLoading && (
            <div className="space-y-2.5">
              {Array.from({ length: 5 }).map((_, i) => <CategoryRowSkeleton key={i} />)}
            </div>
          )}

          {/* Empty */}
          {!catsLoading && !catsError && filteredCategories.length === 0 && (
            <div className="flex flex-col items-center justify-center py-16 text-center">
              <div className="w-14 h-14 rounded-2xl bg-[#1A1A1A] border border-white/[0.06] flex items-center justify-center mb-3">
                <Tag className="h-7 w-7 text-zinc-700" />
              </div>
              <p className="text-zinc-300 font-bold text-base">
                {catSearch ? 'No categories match' : 'No categories yet'}
              </p>
              <p className="text-zinc-600 text-sm mt-1.5">
                {catSearch ? 'Try a different search term' : 'Add your first product category'}
              </p>
            </div>
          )}

          {/* List */}
          {!catsLoading && filteredCategories.length > 0 && (
            <div className="space-y-2.5">
              {filteredCategories.map((c) => (
                <CategoryRow
                  key={c.id}
                  category={c}
                  deleting={deleting && deleteTarget?.item.id === c.id}
                  onEdit={(category) => setCategoryModal({ category })}
                  onDelete={(category) => setDeleteTarget({ type: 'category', item: category })}
                />
              ))}
            </div>
          )}
        </div>
      )}

      {/* ══ Modals ══════════════════════════════════════════════════════════════ */}
      {vehicleModal !== null && (
        <VehicleModal
          initial={vehicleModal.vehicle}
          defaultBrand={vehicleModal.defaultBrand}
          defaultModel={vehicleModal.defaultModel}
          onClose={() => setVehicleModal(null)}
          showToast={showToast}
          onSaved={(saved) => {
            setVehicles((prev) => {
              const exists = prev.find((v) => v.id === saved.id);
              return exists
                ? prev.map((v) => (v.id === saved.id ? saved : v))
                : [saved, ...prev];
            });
            setVehicleModal(null);
          }}
        />
      )}

      {categoryModal !== null && (
        <CategoryModal
          initial={categoryModal.category}
          onClose={() => setCategoryModal(null)}
          showToast={showToast}
          onSaved={(saved) => {
            setCategories((prev) => {
              const exists = prev.find((c) => c.id === saved.id);
              return exists
                ? prev.map((c) => (c.id === saved.id ? saved : c))
                : [...prev, saved].sort((a, b) => a.name.localeCompare(b.name));
            });
            setCategoryModal(null);
          }}
        />
      )}

      {deleteTarget && (
        <DeleteModal
          title={
            deleteTarget.type === 'vehicle'
              ? `Delete ${(deleteTarget.item as Vehicle).brand} ${(deleteTarget.item as Vehicle).model} ${(deleteTarget.item as Vehicle).code}?`
              : `Delete "${(deleteTarget.item as Category).name}"?`
          }
          description={
            deleteTarget.type === 'vehicle'
              ? `This removes ${(deleteTarget.item as Vehicle).brand} ${(deleteTarget.item as Vehicle).model} (${(deleteTarget.item as Vehicle).code}${
                  (deleteTarget.item as Vehicle).year_start ? ` · ${yearLabel((deleteTarget.item as Vehicle).year_start, (deleteTarget.item as Vehicle).year_end)}` : ''
                }) from your database. Products currently assigned to this vehicle will lose this compatibility entry.`
              : `The category "${(deleteTarget.item as Category).name}" will be permanently removed.`
          }
          warning={
            deleteTarget.type === 'category' && (deleteTarget.item as Category).product_count > 0
              ? `${(deleteTarget.item as Category).product_count} product(s) use this category. Reassign them first.`
              : undefined
          }
          deleting={deleting}
          onConfirm={handleDelete}
          onCancel={() => setDeleteTarget(null)}
        />
      )}
    </div>
  );
}
