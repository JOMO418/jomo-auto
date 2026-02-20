'use client';
import { useState, useEffect, useRef } from 'react';
import Image from 'next/image';
import {
  Plus, X, Upload, Loader2, CheckCircle2, XCircle,
  Star, Sparkles, ChevronLeft, ChevronRight, Flame,
} from 'lucide-react';
import { PLACEHOLDER_IMAGE } from '@/lib/constants';
import type { AdminProduct } from '@/lib/admin-db';
import type { ImageItem } from './types';
import { StepIndicator } from './StepIndicator';
import { VehicleCompatPicker } from './VehicleCompatPicker';

export function EditModal({
  product,
  onClose,
  onSaved,
  onSaveError,
}: {
  product: AdminProduct;
  onClose: () => void;
  onSaved: (updated: AdminProduct) => void;
  onSaveError?: (message: string) => void;
}) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [step, setStep] = useState<1 | 2>(1);
  const [loadingCompat, setLoadingCompat] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [images, setImages] = useState<ImageItem[]>((product.images ?? []).map((url) => ({ url })));

  // DB-driven vehicle IDs
  const [selectedVehicleIds, setSelectedVehicleIds] = useState<string[]>([]);

  // DB-driven categories
  const [categories, setCategories] = useState<string[]>([]);
  const [catsLoading, setCatsLoading] = useState(true);

  const [form, setForm] = useState({
    name: product.name ?? '',
    description: product.description ?? '',
    price: String(product.price ?? ''),
    originalPrice: product.original_price ? String(product.original_price) : '',
    condition: product.condition ?? 'Ex Japan',
    origin: product.origin ?? 'Japan',
    category: product.category_name ?? '',
    stock: String(product.stock ?? 1),
    featured: product.featured ?? false,
    new_arrival: product.new_arrival ?? false,
    flash_deal: product.flash_deal ?? false,
  });

  // Fetch categories from DB
  useEffect(() => {
    async function load() {
      try {
        const res = await fetch('/api/admin/categories');
        const data = await res.json();
        const names: string[] = (data.categories ?? []).map((c: { name: string }) => c.name);
        setCategories(names);
        // If current category not set, default to first
        if (names.length > 0 && !form.category) {
          setForm((prev) => ({ ...prev, category: names[0] }));
        }
      } catch {
        // fallback silently
      } finally {
        setCatsLoading(false);
      }
    }
    load();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Load existing vehicle compatibility by ID
  useEffect(() => {
    async function load() {
      try {
        const res = await fetch(`/api/admin/products/${product.id}/details`);
        const data = await res.json();
        const compat = data.product?.compatibility ?? [];
        // Extract vehicle IDs — if they have vehicle_id, use that; otherwise fallback to legacy
        const ids: string[] = compat
          .filter((c: { vehicle_id: string | null }) => c.vehicle_id)
          .map((c: { vehicle_id: string }) => c.vehicle_id);
        setSelectedVehicleIds(ids);
      } catch {
        // silently fail — picker will just start with nothing selected
      } finally {
        setLoadingCompat(false);
      }
    }
    load();
  }, [product.id]);

  useEffect(() => {
    const handler = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose(); };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [onClose]);

  function field(key: string, value: string | boolean) { setForm((p) => ({ ...p, [key]: value })); }

  function handleFilePick(files: FileList | null) {
    if (!files) return;
    setImages((prev) => [...prev, ...Array.from(files).map((file) => ({
      url: '', file, preview: URL.createObjectURL(file), isNew: true,
    }))]);
  }

  function removeImage(idx: number) { setImages((prev) => prev.filter((_, i) => i !== idx)); }

  function validateStep1(): string {
    if (!form.name.trim()) return 'Product name is required.';
    if (!form.price || isNaN(Number(form.price)) || Number(form.price) < 0) return 'A valid price is required.';
    if (form.originalPrice && isNaN(Number(form.originalPrice))) return 'Original price must be a number.';
    if (isNaN(Number(form.stock)) || Number(form.stock) < 0) return 'Stock must be a non-negative number.';
    return '';
  }

  function handleNext() {
    const err = validateStep1();
    if (err) { setError(err); return; }
    setError(''); setStep(2);
  }

  async function handleSave() {
    setError(''); setSaving(true);
    try {
      const newFiles = images.filter((i) => i.isNew && i.file);
      let uploadedUrls: string[] = [];
      if (newFiles.length > 0) {
        const fd = new FormData();
        newFiles.forEach((i) => fd.append('files', i.file!));
        const upRes = await fetch('/api/upload', { method: 'POST', body: fd });
        const upData = await upRes.json();
        if (!upRes.ok) throw new Error(upData.error ?? 'Image upload failed');
        uploadedUrls = upData.urls;
      }
      let newIdx = 0;
      const allImages = images.map((img) => img.isNew ? (uploadedUrls[newIdx++] ?? '') : img.url).filter(Boolean);

      const payload = {
        name: form.name.trim(),
        description: form.description.trim(),
        price: Number(form.price),
        original_price: form.originalPrice ? Number(form.originalPrice) : null,
        condition: form.condition,
        origin: form.origin,
        category: form.category,
        stock: Number(form.stock),
        featured: form.featured,
        new_arrival: form.new_arrival,
        flash_deal: form.flash_deal,
        images: allImages,
        // Send vehicle UUIDs — API resolves to compatibility_string automatically
        compatibility: selectedVehicleIds,
      };

      const res = await fetch(`/api/admin/products/${product.id}/update`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? 'Save failed');

      onSaved({
        ...product,
        ...payload,
        original_price: payload.original_price,
        category_name: form.category,
        images: allImages,
        updated_at: new Date().toISOString(),
      });
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Something went wrong.';
      setError(msg); onSaveError?.(msg); setSaving(false);
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/75 backdrop-blur-sm p-0 sm:p-3">
      <div className="bg-[#111] border border-white/[0.08] w-full sm:max-w-4xl rounded-t-3xl sm:rounded-2xl flex flex-col max-h-[97dvh] sm:max-h-[96vh] shadow-2xl animate-in slide-in-from-bottom-4 duration-300">

        {/* Header */}
        <div className="flex items-center justify-between px-5 pt-4 pb-3 flex-shrink-0">
          <div className="min-w-0">
            <h2 className="text-white font-bold text-[15px] leading-none">Edit Product</h2>
            <p className="text-zinc-500 text-[11px] mt-0.5 truncate max-w-[260px]">{form.name || product.name}</p>
          </div>
          <button onClick={onClose} className="w-7 h-7 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center transition-colors flex-shrink-0">
            <X className="h-3.5 w-3.5 text-zinc-300" />
          </button>
        </div>

        <StepIndicator step={step} />

        {error && (
          <div className="mx-5 mt-3 flex items-center gap-2 bg-red-950/60 border border-red-700/40 rounded-lg px-3 py-2 text-red-300 text-xs font-medium flex-shrink-0">
            <XCircle className="h-3.5 w-3.5 flex-shrink-0 text-red-400" />{error}
          </div>
        )}

        {/* ── Step 1: Details ── */}
        {step === 1 && (
          <div className="overflow-y-auto flex-1 custom-scroll">
            {/* Photos */}
            <div className="px-5 pt-4 pb-3">
              <div className="flex items-center justify-between mb-2.5">
                <span className="text-[11px] font-bold text-zinc-500 uppercase tracking-wider">Photos</span>
                <button type="button" onClick={() => fileInputRef.current?.click()} className="text-[11px] text-[#E8002D] font-semibold hover:text-[#ff1a3d] transition-colors flex items-center gap-0.5">
                  <Plus className="h-3 w-3" />Add Photo
                </button>
              </div>
              {images.length > 0 ? (
                <div className="flex gap-2.5 overflow-x-auto pb-1 -mx-5 px-5 no-scrollbar">
                  {images.map((img, idx) => (
                    <div key={idx} className={`relative flex-shrink-0 rounded-2xl overflow-hidden bg-white/[0.06] group ${idx === 0 ? 'w-[118px] h-[118px]' : 'w-[82px] h-[82px] self-end'}`}>
                      <Image src={img.preview ?? img.url ?? PLACEHOLDER_IMAGE} alt={`photo-${idx}`} fill className="object-cover" sizes="118px" />
                      {idx === 0 && (
                        <div className="absolute bottom-0 inset-x-0 bg-gradient-to-t from-black/85 via-black/20 to-transparent pt-5 pb-2 px-2">
                          <span className="text-[9px] text-white font-black tracking-widest">MAIN</span>
                        </div>
                      )}
                      <button type="button" onClick={() => removeImage(idx)} className="absolute top-1.5 right-1.5 w-5 h-5 rounded-full bg-black/70 backdrop-blur-sm flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                        <X className="h-2.5 w-2.5 text-white" />
                      </button>
                    </div>
                  ))}
                  <button type="button" onClick={() => fileInputRef.current?.click()} className="flex-shrink-0 w-[82px] h-[82px] self-end rounded-2xl border-2 border-dashed border-white/15 hover:border-[#E8002D]/50 flex flex-col items-center justify-center gap-1.5 transition-colors">
                    <Upload className="h-4 w-4 text-zinc-600" />
                    <span className="text-[10px] text-zinc-600 font-medium">Upload</span>
                  </button>
                </div>
              ) : (
                <button type="button" onClick={() => fileInputRef.current?.click()} className="w-full h-[108px] border-2 border-dashed border-white/10 hover:border-[#E8002D]/40 rounded-2xl flex flex-col items-center justify-center gap-2 transition-colors">
                  <div className="w-10 h-10 rounded-xl bg-white/[0.04] flex items-center justify-center">
                    <Upload className="h-5 w-5 text-zinc-600" />
                  </div>
                  <span className="text-zinc-500 text-xs font-medium">Tap to add photos</span>
                </button>
              )}
              <input ref={fileInputRef} type="file" accept="image/*" multiple className="hidden" onChange={(e) => handleFilePick(e.target.files)} />
            </div>

            {/* Fields */}
            <div className="px-5 pb-5 space-y-3">
              <div>
                <label className="modal-label">Name *</label>
                <input type="text" value={form.name} onChange={(e) => field('name', e.target.value)} className="modal-input" placeholder="e.g. Toyota Fielder Front Bumper" />
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                <div>
                  <label className="modal-label">Price (KSh) *</label>
                  <input type="number" value={form.price} onChange={(e) => field('price', e.target.value)} min="0" className="modal-input" placeholder="0" />
                </div>
                <div>
                  <label className="modal-label">Orig. Price</label>
                  <input type="number" value={form.originalPrice} onChange={(e) => field('originalPrice', e.target.value)} min="0" className="modal-input" placeholder="Optional" />
                </div>
                <div>
                  <label className="modal-label">Stock</label>
                  <input type="number" value={form.stock} onChange={(e) => field('stock', e.target.value)} min="0" className="modal-input" />
                </div>
                <div>
                  <label className="modal-label">Category</label>
                  {catsLoading ? (
                    <div className="modal-input flex items-center gap-2 text-zinc-600">
                      <Loader2 className="h-3.5 w-3.5 animate-spin" />
                      <span className="text-xs">Loading…</span>
                    </div>
                  ) : categories.length > 0 ? (
                    <select value={form.category} onChange={(e) => field('category', e.target.value)} className="modal-input">
                      {categories.map((c) => <option key={c} value={c}>{c}</option>)}
                    </select>
                  ) : (
                    <input
                      type="text"
                      value={form.category}
                      onChange={(e) => field('category', e.target.value)}
                      className="modal-input"
                      placeholder="e.g. Engine"
                    />
                  )}
                </div>
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                <div>
                  <label className="modal-label">Condition</label>
                  <select value={form.condition} onChange={(e) => field('condition', e.target.value)} className="modal-input">
                    {['Ex Japan', 'New'].map((o) => <option key={o}>{o}</option>)}
                  </select>
                </div>
                <div>
                  <label className="modal-label">Origin</label>
                  <select value={form.origin} onChange={(e) => field('origin', e.target.value)} className="modal-input">
                    {['Japan', 'Taiwan'].map((o) => <option key={o}>{o}</option>)}
                  </select>
                </div>
                <div className="sm:col-span-2">
                  <label className="modal-label">Description</label>
                  <textarea value={form.description} onChange={(e) => field('description', e.target.value)} rows={1} className="modal-input resize-none" placeholder="Brief product description…" />
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ── Step 2: Sections + Compatibility ── */}
        {step === 2 && (
          <div className="flex-1 flex flex-col overflow-hidden min-h-0">

            {/* Compact sections row */}
            <div className="flex-shrink-0 px-5 pt-3 pb-2.5 border-b border-white/[0.06]">
              <p className="text-[10px] font-bold text-zinc-600 uppercase tracking-wider mb-2">Show in sections</p>
              <div className="flex gap-2">
                <button type="button" onClick={() => field('featured', !form.featured)}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg border text-[11px] font-bold transition-all active:scale-95 flex-1 justify-center ${form.featured ? 'bg-amber-500/15 border-amber-500/35 text-amber-400' : 'bg-white/[0.04] border-white/[0.08] text-zinc-500 hover:text-zinc-300'}`}>
                  <Star className={`h-3.5 w-3.5 ${form.featured ? 'fill-amber-400' : ''}`} />Featured
                </button>
                <button type="button" onClick={() => field('new_arrival', !form.new_arrival)}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg border text-[11px] font-bold transition-all active:scale-95 flex-1 justify-center ${form.new_arrival ? 'bg-blue-500/15 border-blue-500/35 text-blue-400' : 'bg-white/[0.04] border-white/[0.08] text-zinc-500 hover:text-zinc-300'}`}>
                  <Sparkles className="h-3.5 w-3.5" />New Arrival
                </button>
                <button type="button" onClick={() => field('flash_deal', !form.flash_deal)}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg border text-[11px] font-bold transition-all active:scale-95 flex-1 justify-center ${form.flash_deal ? 'bg-orange-500/15 border-orange-500/35 text-orange-400' : 'bg-white/[0.04] border-white/[0.08] text-zinc-500 hover:text-zinc-300'}`}>
                  <Flame className="h-3.5 w-3.5" />Flash Deal
                </button>
              </div>
            </div>

            {/* Vehicle compatibility picker — takes all remaining space */}
            <div className="flex-1 flex flex-col overflow-hidden p-4 min-h-0">
              <VehicleCompatPicker
                selectedIds={selectedVehicleIds}
                onChange={setSelectedVehicleIds}
                parentLoading={loadingCompat}
              />
            </div>
          </div>
        )}

        {/* Footer */}
        <div className="flex-shrink-0 border-t border-white/[0.08] px-5 py-3.5 flex gap-2.5">
          {step === 1 ? (
            <>
              <button type="button" onClick={onClose} className="py-3 px-5 rounded-xl border border-white/10 text-zinc-400 hover:text-white hover:border-white/20 text-sm font-semibold transition-colors">Cancel</button>
              <button type="button" onClick={handleNext} className="flex-1 py-3 rounded-xl bg-[#E8002D] hover:bg-[#c5001f] text-white text-sm font-bold transition-colors flex items-center justify-center gap-2">
                Continue <ChevronRight className="h-4 w-4" />
              </button>
            </>
          ) : (
            <>
              <button type="button" onClick={() => { setError(''); setStep(1); }} className="py-3 px-4 rounded-xl border border-white/10 text-zinc-400 hover:text-white hover:border-white/20 text-sm font-semibold transition-colors flex items-center gap-1.5">
                <ChevronLeft className="h-4 w-4" />Back
              </button>
              <button type="button" onClick={handleSave} disabled={saving} className="flex-1 py-3 rounded-xl bg-[#E8002D] hover:bg-[#c5001f] disabled:opacity-60 text-white text-sm font-bold transition-colors flex items-center justify-center gap-2">
                {saving
                  ? <><Loader2 className="h-4 w-4 animate-spin" />Saving…</>
                  : <><CheckCircle2 className="h-4 w-4" />Save Changes</>
                }
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
