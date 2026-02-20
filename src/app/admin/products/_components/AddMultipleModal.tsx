'use client';
import { useState, useEffect, useRef } from 'react';
import Image from 'next/image';
import {
  Star, X, Upload, Loader2, CheckCircle2, XCircle,
  Sparkles, ChevronLeft, ChevronRight, Flame,
} from 'lucide-react';
import type { AdminProduct } from '@/lib/admin-db';
import type { BatchItem } from './types';
import { BatchItemCard } from './BatchItemCard';
import { VehicleCompatPicker } from './VehicleCompatPicker';

export function AddMultipleModal({ onClose, onCreated }: {
  onClose: () => void;
  onCreated: (products: AdminProduct[]) => void;
}) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [step, setStep] = useState<1 | 2 | 3>(1);
  const [batchItems, setBatchItems] = useState<BatchItem[]>([]);
  const [saving, setSaving] = useState(false);
  const [saveProgress, setSaveProgress] = useState(0);
  const [failedItems, setFailedItems] = useState<{ item: BatchItem; error: string }[]>([]);
  const [error, setError] = useState('');

  // DB-driven categories
  const [categories, setCategories] = useState<string[]>([]);
  const [catsLoading, setCatsLoading] = useState(true);

  // Shared vehicle compatibility for all batch products
  const [selectedVehicleIds, setSelectedVehicleIds] = useState<string[]>([]);

  const [defaults, setDefaults] = useState({
    category: '', condition: 'Ex Japan', origin: 'Japan',
    stock: '1', featured: false, new_arrival: false, flash_deal: false,
  });

  // Fetch categories from DB on mount
  useEffect(() => {
    async function load() {
      try {
        const res = await fetch('/api/admin/categories');
        const data = await res.json();
        const names: string[] = (data.categories ?? []).map((c: { name: string }) => c.name);
        setCategories(names);
        if (names.length > 0) {
          setDefaults((prev) => ({ ...prev, category: names[0] }));
        }
      } catch {
        // silently fall back
      } finally {
        setCatsLoading(false);
      }
    }
    load();
  }, []);

  useEffect(() => {
    const handler = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose(); };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [onClose]);

  function handleFilesPick(files: FileList | null) {
    if (!files) return;
    setBatchItems((prev) => [...prev, ...Array.from(files).map((file) => ({
      id: Math.random().toString(36).slice(2),
      file, preview: URL.createObjectURL(file),
      name: '', price: '', originalPrice: '', description: '', stockOverride: '',
      expanded: false, nameError: false, priceError: false,
    }))]);
  }

  function updateItem(id: string, updates: Partial<BatchItem>) {
    setBatchItems((prev) => prev.map((item) => item.id === id ? { ...item, ...updates } : item));
  }

  function removeItem(id: string) { setBatchItems((prev) => prev.filter((item) => item.id !== id)); }

  function defaultField(key: string, value: string | boolean) { setDefaults((p) => ({ ...p, [key]: value })); }

  function validateStep3(): boolean {
    let hasError = false;
    setBatchItems((prev) => prev.map((item) => {
      const nameError = !item.name.trim();
      const priceError = !item.price || isNaN(Number(item.price)) || Number(item.price) < 0;
      if (nameError || priceError) hasError = true;
      return { ...item, nameError, priceError };
    }));
    return !hasError;
  }

  async function handleBatchSave() {
    if (!validateStep3()) { setError('Please fill in Name and Price for all products.'); return; }
    setError(''); setSaving(true); setSaveProgress(0); setFailedItems([]);
    try {
      const fd = new FormData();
      batchItems.forEach((item) => fd.append('files', item.file));
      const upRes = await fetch('/api/upload', { method: 'POST', body: fd });
      const upData = await upRes.json();
      if (!upRes.ok) throw new Error(upData.error ?? 'Image upload failed');
      const urls: string[] = upData.urls;

      let resolved = 0;
      const results = await Promise.allSettled(
        batchItems.map(async (item, idx) => {
          const payload = {
            name: item.name.trim(), description: item.description.trim(),
            price: Number(item.price),
            original_price: item.originalPrice ? Number(item.originalPrice) : null,
            condition: defaults.condition, origin: defaults.origin, category: defaults.category,
            stock: item.stockOverride ? Number(item.stockOverride) : Number(defaults.stock),
            featured: defaults.featured, new_arrival: defaults.new_arrival, flash_deal: defaults.flash_deal,
            images: urls[idx] ? [urls[idx]] : [], compatibility: selectedVehicleIds,
          };
          const res = await fetch('/api/admin/products/create', {
            method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload),
          });
          const data = await res.json();
          if (!res.ok) throw new Error(data.error ?? 'Create failed');
          resolved++; setSaveProgress(resolved);
          return { payload, id: data.id as string };
        })
      );

      const succeeded: AdminProduct[] = [];
      const failed: { item: BatchItem; error: string }[] = [];
      results.forEach((result, idx) => {
        if (result.status === 'fulfilled') {
          const { payload, id } = result.value;
          succeeded.push({
            id, slug: '', category_id: '', specs: {}, name: payload.name, description: payload.description,
            price: payload.price, original_price: payload.original_price,
            condition: payload.condition, origin: payload.origin,
            category_name: payload.category, stock: payload.stock,
            featured: payload.featured, new_arrival: payload.new_arrival,
            flash_deal: payload.flash_deal, images: payload.images,
            created_at: new Date().toISOString(), updated_at: new Date().toISOString(),
          });
        } else {
          failed.push({ item: batchItems[idx], error: result.reason?.message ?? 'Unknown error' });
        }
      });

      if (failed.length > 0) {
        setFailedItems(failed); setSaving(false);
        if (succeeded.length > 0) onCreated(succeeded);
      } else {
        onCreated(succeeded);
      }
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Something went wrong.';
      setError(msg); setSaving(false);
    }
  }

  const stepLabels = ['Pick Images', 'Shared Defaults', 'Quick Details'];

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/75 backdrop-blur-sm p-0 sm:p-3">
      <div className="bg-[#111] border border-white/[0.08] w-full sm:max-w-4xl rounded-t-3xl sm:rounded-2xl flex flex-col max-h-[97dvh] sm:max-h-[96vh] shadow-2xl animate-in slide-in-from-bottom-4 duration-300">
        {/* Header */}
        <div className="flex items-center justify-between px-5 pt-4 pb-3 flex-shrink-0">
          <div>
            <h2 className="text-white font-bold text-[15px] leading-none">Batch Add</h2>
            <p className="text-zinc-500 text-[11px] mt-0.5">{batchItems.length > 0 ? `${batchItems.length} image${batchItems.length !== 1 ? 's' : ''} selected` : 'Add multiple products at once'}</p>
          </div>
          <button onClick={onClose} className="w-7 h-7 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center transition-colors flex-shrink-0">
            <X className="h-3.5 w-3.5 text-zinc-300" />
          </button>
        </div>

        {/* 3-Step Indicator */}
        <div className="flex items-center px-5 py-2.5 border-b border-white/[0.08] flex-shrink-0">
          {stepLabels.map((label, i) => {
            const stepNum = i + 1;
            const isActive = step === stepNum;
            const isDone = step > stepNum;
            return (
              <div key={label} className="flex items-center flex-1 last:flex-none">
                <div className="flex items-center gap-1.5">
                  <div className={`w-5 h-5 rounded-full flex items-center justify-center text-[11px] font-bold transition-colors ${isDone ? 'bg-emerald-600 text-white' : isActive ? 'bg-[#E8002D] text-white' : 'bg-white/10 text-zinc-500'}`}>
                    {isDone ? <CheckCircle2 className="h-3 w-3" /> : stepNum}
                  </div>
                  <span className={`text-xs font-semibold ${isActive ? 'text-white' : 'text-zinc-600'}`}>{label}</span>
                </div>
                {i < 2 && <div className={`flex-1 h-px mx-2 transition-colors ${isDone ? 'bg-[#E8002D]' : 'bg-white/10'}`} />}
              </div>
            );
          })}
        </div>

        {error && (
          <div className="mx-5 mt-3 flex items-center gap-2 bg-red-950/60 border border-red-700/40 rounded-lg px-3 py-2 text-red-300 text-xs font-medium flex-shrink-0">
            <XCircle className="h-3.5 w-3.5 flex-shrink-0 text-red-400" />{error}
          </div>
        )}

        {failedItems.length > 0 && (
          <div className="mx-5 mt-3 bg-amber-950/50 border border-amber-600/30 rounded-lg p-3 flex-shrink-0">
            <p className="text-amber-300 text-xs font-bold mb-1">{failedItems.length} product{failedItems.length !== 1 ? 's' : ''} failed to save</p>
            {failedItems.map((f, i) => (
              <p key={i} className="text-amber-500/80 text-[11px]">{f.item.name || `Item ${i + 1}`}: {f.error}</p>
            ))}
          </div>
        )}

        {/* Step 1: Pick Images */}
        {step === 1 && (
          <div className="flex-1 overflow-y-auto custom-scroll">
            <div className="p-5">
              <button type="button" onClick={() => fileInputRef.current?.click()} className="w-full h-32 border-2 border-dashed border-white/10 hover:border-[#E8002D]/40 rounded-2xl flex flex-col items-center justify-center gap-2 transition-colors mb-4">
                <div className="w-10 h-10 rounded-xl bg-white/[0.04] flex items-center justify-center">
                  <Upload className="h-5 w-5 text-zinc-600" />
                </div>
                <span className="text-zinc-500 text-xs font-medium">Tap or drag to pick images</span>
                <span className="text-zinc-700 text-[10px]">Each image = one product</span>
              </button>
              <input ref={fileInputRef} type="file" accept="image/*" multiple className="hidden" onChange={(e) => handleFilesPick(e.target.files)} />
              {batchItems.length > 0 && (
                <>
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-xs font-bold text-zinc-400">{batchItems.length} image{batchItems.length !== 1 ? 's' : ''} selected</span>
                    <button type="button" onClick={() => setBatchItems([])} className="text-[11px] text-zinc-600 hover:text-red-400 transition-colors font-semibold">Clear all</button>
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    {batchItems.map((item, idx) => (
                      <div key={item.id} className="relative aspect-square rounded-xl overflow-hidden bg-white/[0.06]">
                        <Image src={item.preview} alt={`batch-${idx}`} fill className="object-cover" sizes="150px" />
                        <button type="button" onClick={() => removeItem(item.id)} className="absolute top-1.5 right-1.5 w-5 h-5 rounded-full bg-black/70 backdrop-blur-sm flex items-center justify-center">
                          <X className="h-2.5 w-2.5 text-white" />
                        </button>
                        <div className="absolute bottom-0 inset-x-0 bg-gradient-to-t from-black/80 to-transparent px-2 py-1.5">
                          <p className="text-[10px] text-white/70 font-medium truncate">{item.file.name}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </>
              )}
            </div>
          </div>
        )}

        {/* Step 2: Shared Defaults + Vehicle Compatibility */}
        {step === 2 && (
          <div className="flex-1 flex flex-col overflow-hidden min-h-0">

            {/* Fixed top section: defaults grid + sections toggles */}
            <div className="flex-shrink-0 px-5 pt-4 pb-3 border-b border-white/[0.06] space-y-3">
              <p className="text-zinc-500 text-xs">These values apply to all {batchItems.length} products. Override per-item in the next step.</p>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                <div>
                  <label className="modal-label">Category</label>
                  {catsLoading ? (
                    <div className="modal-input flex items-center gap-2 text-zinc-600">
                      <Loader2 className="h-3.5 w-3.5 animate-spin" />
                      <span className="text-xs">Loading…</span>
                    </div>
                  ) : categories.length > 0 ? (
                    <select value={defaults.category} onChange={(e) => defaultField('category', e.target.value)} className="modal-input">
                      {categories.map((c) => <option key={c} value={c}>{c}</option>)}
                    </select>
                  ) : (
                    <input type="text" value={defaults.category} onChange={(e) => defaultField('category', e.target.value)} className="modal-input" placeholder="e.g. Engine" />
                  )}
                </div>
                <div><label className="modal-label">Condition</label><select value={defaults.condition} onChange={(e) => defaultField('condition', e.target.value)} className="modal-input">{['Ex Japan','New'].map((o) => <option key={o}>{o}</option>)}</select></div>
                <div><label className="modal-label">Origin</label><select value={defaults.origin} onChange={(e) => defaultField('origin', e.target.value)} className="modal-input">{['Japan','Taiwan'].map((o) => <option key={o}>{o}</option>)}</select></div>
                <div><label className="modal-label">Default Stock</label><input type="number" value={defaults.stock} onChange={(e) => defaultField('stock', e.target.value)} min="0" className="modal-input" /></div>
              </div>

              {/* Sections toggles — compact horizontal row */}
              <div>
                <p className="text-[10px] font-bold text-zinc-600 uppercase tracking-wider mb-2">Show in sections</p>
                <div className="flex gap-2">
                  <button type="button" onClick={() => defaultField('featured', !defaults.featured)}
                    className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg border text-[11px] font-bold transition-all active:scale-95 flex-1 justify-center ${defaults.featured ? 'bg-amber-500/15 border-amber-500/35 text-amber-400' : 'bg-white/[0.04] border-white/[0.08] text-zinc-500 hover:text-zinc-300'}`}>
                    <Star className={`h-3.5 w-3.5 ${defaults.featured ? 'fill-amber-400' : ''}`} />Featured
                  </button>
                  <button type="button" onClick={() => defaultField('new_arrival', !defaults.new_arrival)}
                    className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg border text-[11px] font-bold transition-all active:scale-95 flex-1 justify-center ${defaults.new_arrival ? 'bg-blue-500/15 border-blue-500/35 text-blue-400' : 'bg-white/[0.04] border-white/[0.08] text-zinc-500 hover:text-zinc-300'}`}>
                    <Sparkles className="h-3.5 w-3.5" />New Arrival
                  </button>
                  <button type="button" onClick={() => defaultField('flash_deal', !defaults.flash_deal)}
                    className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg border text-[11px] font-bold transition-all active:scale-95 flex-1 justify-center ${defaults.flash_deal ? 'bg-orange-500/15 border-orange-500/35 text-orange-400' : 'bg-white/[0.04] border-white/[0.08] text-zinc-500 hover:text-zinc-300'}`}>
                    <Flame className="h-3.5 w-3.5" />Flash Deal
                  </button>
                </div>
              </div>
            </div>

            {/* Vehicle compatibility picker — dominates remaining space */}
            <div className="flex-1 flex flex-col overflow-hidden p-4 min-h-0">
              <VehicleCompatPicker
                selectedIds={selectedVehicleIds}
                onChange={setSelectedVehicleIds}
              />
            </div>
          </div>
        )}

        {/* Step 3: Quick Details */}
        {step === 3 && (
          <div className="flex-1 overflow-y-auto custom-scroll">
            <div className="px-5 pt-3 pb-1 sticky top-0 bg-[#111] z-10">
              <div className="flex items-center gap-1.5 flex-wrap py-2 bg-white/[0.03] rounded-xl px-3 border border-white/[0.06]">
                <span className="text-[11px] text-zinc-500 font-medium">Defaults:</span>
                <span className="text-[11px] text-zinc-300 font-semibold">{defaults.category}</span>
                <span className="text-zinc-700">·</span>
                <span className="text-[11px] text-zinc-300 font-semibold">{defaults.condition}</span>
                <span className="text-zinc-700">·</span>
                <span className="text-[11px] text-zinc-300 font-semibold">Stock: {defaults.stock}</span>
                <button type="button" onClick={() => setStep(2)} className="text-[11px] text-[#E8002D] font-semibold hover:underline ml-auto">Change</button>
              </div>
            </div>
            <div className="p-5 space-y-3">
              {batchItems.map((item, index) => (
                <BatchItemCard key={item.id} item={item} index={index} onChange={updateItem} onRemove={removeItem} />
              ))}
            </div>
          </div>
        )}

        {/* Footer */}
        <div className="flex-shrink-0 border-t border-white/[0.08] px-5 py-3.5 flex gap-2.5">
          {step === 1 && (
            <>
              <button type="button" onClick={onClose} className="py-3 px-5 rounded-xl border border-white/10 text-zinc-400 hover:text-white hover:border-white/20 text-sm font-semibold transition-colors">Cancel</button>
              <button type="button" onClick={() => { if (batchItems.length === 0) { setError('Select at least one image.'); return; } setError(''); setStep(2); }} className="flex-1 py-3 rounded-xl bg-[#E8002D] hover:bg-[#c5001f] text-white text-sm font-bold transition-colors flex items-center justify-center gap-2">
                Continue <ChevronRight className="h-4 w-4" />
              </button>
            </>
          )}
          {step === 2 && (
            <>
              <button type="button" onClick={() => { setError(''); setStep(1); }} className="py-3 px-4 rounded-xl border border-white/10 text-zinc-400 hover:text-white hover:border-white/20 text-sm font-semibold transition-colors flex items-center gap-1.5"><ChevronLeft className="h-4 w-4" />Back</button>
              <button type="button" onClick={() => { setError(''); setStep(3); }} className="flex-1 py-3 rounded-xl bg-[#E8002D] hover:bg-[#c5001f] text-white text-sm font-bold transition-colors flex items-center justify-center gap-2">
                Set Details <ChevronRight className="h-4 w-4" />
              </button>
            </>
          )}
          {step === 3 && (
            <>
              <button type="button" onClick={() => { setError(''); setStep(2); }} className="py-3 px-4 rounded-xl border border-white/10 text-zinc-400 hover:text-white hover:border-white/20 text-sm font-semibold transition-colors flex items-center gap-1.5"><ChevronLeft className="h-4 w-4" />Back</button>
              <button type="button" onClick={handleBatchSave} disabled={saving} className="flex-1 py-3 rounded-xl bg-[#E8002D] hover:bg-[#c5001f] disabled:opacity-60 text-white text-sm font-bold transition-colors flex items-center justify-center gap-2">
                {saving
                  ? <><Loader2 className="h-4 w-4 animate-spin" />{saveProgress}/{batchItems.length} saved…</>
                  : <><CheckCircle2 className="h-4 w-4" />Upload & Create {batchItems.length} Products</>
                }
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
