'use client';

import { useState, useRef } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { Upload, X, Plus, ArrowLeft, Loader2, Star } from 'lucide-react';
import { CATEGORIES, VEHICLE_DATA } from '@/lib/constants';

interface ImageFile {
  file: File;
  preview: string;
  uploaded?: string;
}

// Brand order: Toyota first
const BRAND_ORDER = ['Toyota', 'Nissan', 'Mazda', 'Subaru', 'Honda', 'Mitsubishi', 'Isuzu'];

function buildCompatLabel(v: typeof VEHICLE_DATA[number]): string {
  const years = v.year_start ? ` (${v.year_start}-${v.year_end ?? 'present'})` : '';
  return `${v.brand} ${v.model} ${v.code}${years}`;
}

// Group vehicles by brand, Toyota first
const VEHICLE_GROUPS: [string, typeof VEHICLE_DATA[number][]][] = (() => {
  const groups: Record<string, typeof VEHICLE_DATA[number][]> = {};
  VEHICLE_DATA.forEach((v) => {
    if (!groups[v.brand]) groups[v.brand] = [];
    groups[v.brand].push(v);
  });
  const brands = Object.keys(groups).sort((a, b) => {
    const ai = BRAND_ORDER.indexOf(a);
    const bi = BRAND_ORDER.indexOf(b);
    if (ai !== -1 && bi !== -1) return ai - bi;
    if (ai !== -1) return -1;
    if (bi !== -1) return 1;
    return a.localeCompare(b);
  });
  return brands.map((brand) => [brand, groups[brand]]);
})();

export default function NewProductPage() {
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [images, setImages] = useState<ImageFile[]>([]);
  const [uploading, setUploading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [selectedVehicles, setSelectedVehicles] = useState<string[]>([]);

  const [form, setForm] = useState({
    name: '',
    description: '',
    price: '',
    originalPrice: '',
    condition: 'New',
    origin: 'Japan',
    category: CATEGORIES[0],
    stock: '1',
    featured: false,
  });

  function handleField(key: string, value: string | boolean) {
    setForm((prev) => ({ ...prev, [key]: value }));
  }

  function handleFilePick(files: FileList | null) {
    if (!files) return;
    const newImages: ImageFile[] = Array.from(files).map((file) => ({
      file,
      preview: URL.createObjectURL(file),
    }));
    setImages((prev) => [...prev, ...newImages]);
  }

  function removeImage(idx: number) {
    setImages((prev) => prev.filter((_, i) => i !== idx));
  }

  function toggleVehicle(label: string) {
    setSelectedVehicles((prev) =>
      prev.includes(label) ? prev.filter((v) => v !== label) : [...prev, label]
    );
  }

  async function uploadImages(): Promise<string[]> {
    const toUpload = images.filter((img) => !img.uploaded);
    if (toUpload.length === 0) return images.map((i) => i.uploaded ?? i.preview);

    const formData = new FormData();
    toUpload.forEach((img) => formData.append('files', img.file));

    const res = await fetch('/api/upload', { method: 'POST', body: formData });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error ?? 'Upload failed');

    const urls: string[] = data.urls;
    setImages((prev) =>
      prev.map((img, idx) =>
        img.uploaded ? img : { ...img, uploaded: urls[idx] ?? img.preview }
      )
    );
    return urls;
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError('');

    if (!form.name.trim()) return setError('Product name is required.');
    if (!form.price || isNaN(Number(form.price))) return setError('Valid price is required.');

    setSaving(true);
    setUploading(true);

    try {
      const imageUrls = images.length > 0 ? await uploadImages() : [];
      setUploading(false);

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
        images: imageUrls,
        compatibility: selectedVehicles,
      };

      const res = await fetch('/api/admin/products/create', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? 'Save failed');

      router.push('/admin/products');
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Something went wrong.');
    } finally {
      setSaving(false);
      setUploading(false);
    }
  }

  return (
    <div className="max-w-4xl mx-auto space-y-5">
      {/* Header */}
      <div className="flex items-center gap-3">
        <button
          onClick={() => router.back()}
          className="p-2 rounded-lg text-zinc-400 hover:text-white hover:bg-white/10 transition-colors"
        >
          <ArrowLeft className="h-4 w-4" />
        </button>
        <div>
          <h1 className="text-xl md:text-2xl font-bold text-white">Add New Product</h1>
          <p className="text-zinc-500 text-sm">Fill in the details below</p>
        </div>
      </div>

      {error && (
        <div className="bg-red-950/40 border border-red-900/40 rounded-lg px-4 py-3 text-red-400 text-sm">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-5">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
          {/* Left Column */}
          <div className="space-y-4">
            {/* Basic Info */}
            <div className="bg-[#141414] border border-white/[0.08] rounded-xl p-4 space-y-4">
              <h2 className="text-white font-semibold text-sm">Basic Info</h2>

              <div>
                <label className="block text-xs font-medium text-zinc-400 mb-1.5 uppercase tracking-wider">
                  Product Name *
                </label>
                <input
                  type="text"
                  value={form.name}
                  onChange={(e) => handleField('name', e.target.value)}
                  required
                  className="admin-input"
                  placeholder="e.g. Brake Disc Rotor Front"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-zinc-400 mb-1.5 uppercase tracking-wider">
                  Description
                </label>
                <textarea
                  value={form.description}
                  onChange={(e) => handleField('description', e.target.value)}
                  rows={3}
                  className="admin-input resize-none"
                  placeholder="Brief product description..."
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium text-zinc-400 mb-1.5 uppercase tracking-wider">
                    Price (KSh) *
                  </label>
                  <input
                    type="number"
                    value={form.price}
                    onChange={(e) => handleField('price', e.target.value)}
                    required
                    min="0"
                    className="admin-input"
                    placeholder="0"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-zinc-400 mb-1.5 uppercase tracking-wider">
                    Original Price
                  </label>
                  <input
                    type="number"
                    value={form.originalPrice}
                    onChange={(e) => handleField('originalPrice', e.target.value)}
                    min="0"
                    className="admin-input"
                    placeholder="0 (optional)"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium text-zinc-400 mb-1.5 uppercase tracking-wider">
                    Condition
                  </label>
                  <select
                    value={form.condition}
                    onChange={(e) => handleField('condition', e.target.value)}
                    className="admin-input"
                  >
                    <option>New</option>
                    <option>Used</option>
                    <option>Refurbished</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-medium text-zinc-400 mb-1.5 uppercase tracking-wider">
                    Origin
                  </label>
                  <select
                    value={form.origin}
                    onChange={(e) => handleField('origin', e.target.value)}
                    className="admin-input"
                  >
                    <option>Japan</option>
                    <option>Kenya</option>
                    <option>China</option>
                    <option>Germany</option>
                    <option>Other</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium text-zinc-400 mb-1.5 uppercase tracking-wider">
                    Stock Qty
                  </label>
                  <input
                    type="number"
                    value={form.stock}
                    onChange={(e) => handleField('stock', e.target.value)}
                    min="0"
                    className="admin-input"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-zinc-400 mb-1.5 uppercase tracking-wider">
                    Category
                  </label>
                  <select
                    value={form.category}
                    onChange={(e) => handleField('category', e.target.value)}
                    className="admin-input"
                  >
                    {CATEGORIES.map((c) => (
                      <option key={c} value={c}>
                        {c}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Featured toggle */}
              <label className="flex items-center gap-3 cursor-pointer group">
                <div
                  className={`relative w-10 h-5 rounded-full transition-colors ${
                    form.featured ? 'bg-[#E8002D]' : 'bg-white/10'
                  }`}
                  onClick={() => handleField('featured', !form.featured)}
                >
                  <div
                    className={`absolute top-0.5 left-0.5 w-4 h-4 rounded-full bg-white transition-transform ${
                      form.featured ? 'translate-x-5' : 'translate-x-0'
                    }`}
                  />
                </div>
                <div className="flex items-center gap-1.5">
                  <Star className={`h-4 w-4 ${form.featured ? 'text-amber-400' : 'text-zinc-600'}`} />
                  <span className="text-sm text-zinc-300">Mark as Featured</span>
                </div>
              </label>
            </div>
          </div>

          {/* Right Column */}
          <div className="space-y-4">
            {/* Image Upload */}
            <div className="bg-[#141414] border border-white/[0.08] rounded-xl p-4 space-y-3">
              <h2 className="text-white font-semibold text-sm">Product Images</h2>

              {/* Drop zone */}
              <div
                className="border-2 border-dashed border-white/10 hover:border-[#E8002D]/50 rounded-xl p-6 text-center cursor-pointer transition-colors"
                onClick={() => fileInputRef.current?.click()}
                onDragOver={(e) => e.preventDefault()}
                onDrop={(e) => {
                  e.preventDefault();
                  handleFilePick(e.dataTransfer.files);
                }}
              >
                <Upload className="h-7 w-7 text-zinc-600 mx-auto mb-2" />
                <p className="text-zinc-400 text-sm font-medium">
                  Drag & drop or tap to upload
                </p>
                <p className="text-zinc-600 text-xs mt-1">PNG, JPG, WebP up to 10MB each</p>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  multiple
                  className="hidden"
                  onChange={(e) => handleFilePick(e.target.files)}
                />
              </div>

              {/* Previews */}
              {images.length > 0 && (
                <div className="grid grid-cols-3 gap-2">
                  {images.map((img, idx) => (
                    <div
                      key={idx}
                      className="relative aspect-square rounded-lg overflow-hidden bg-white/5 group"
                    >
                      <Image
                        src={img.preview}
                        alt={`Preview ${idx + 1}`}
                        fill
                        className="object-cover"
                      />
                      <button
                        type="button"
                        onClick={() => removeImage(idx)}
                        className="absolute top-1 right-1 w-5 h-5 rounded-full bg-black/70 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        <X className="h-3 w-3 text-white" />
                      </button>
                      {idx === 0 && (
                        <div className="absolute bottom-1 left-1 text-[10px] bg-[#E8002D] text-white px-1.5 py-0.5 rounded font-medium">
                          Main
                        </div>
                      )}
                    </div>
                  ))}
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    className="aspect-square rounded-lg border-2 border-dashed border-white/10 hover:border-[#E8002D]/40 flex items-center justify-center transition-colors"
                  >
                    <Plus className="h-5 w-5 text-zinc-600" />
                  </button>
                </div>
              )}
            </div>

            {/* Vehicle Compatibility */}
            <div className="bg-[#141414] border border-white/[0.08] rounded-xl p-4 space-y-3">
              <div className="flex items-center justify-between">
                <h2 className="text-white font-semibold text-sm">Vehicle Compatibility</h2>
                {selectedVehicles.length > 0 && (
                  <span className="text-xs text-[#E8002D] font-medium">
                    {selectedVehicles.length} selected
                  </span>
                )}
              </div>

              <div className="space-y-3 max-h-72 overflow-y-auto pr-1 custom-scroll">
                {VEHICLE_GROUPS.map(([brand, brandVehicles]) => (
                  <div key={brand}>
                    <p className="text-zinc-500 text-xs font-medium uppercase tracking-wider mb-1.5 sticky top-0 bg-[#141414] py-0.5">
                      {brand}
                    </p>
                    <div className="space-y-0.5">
                      {brandVehicles.map((v) => {
                        const label = buildCompatLabel(v);
                        const checked = selectedVehicles.includes(label);
                        const years = v.year_start
                          ? `${v.year_start}–${v.year_end ?? 'present'}`
                          : null;
                        return (
                          <label
                            key={`${v.model}-${v.code}`}
                            className={`flex items-center gap-2.5 cursor-pointer group px-2 py-1.5 rounded-lg transition-colors ${
                              checked ? 'bg-[#E8002D]/10' : 'hover:bg-white/[0.04]'
                            }`}
                            onClick={() => toggleVehicle(label)}
                          >
                            <div
                              className={`w-4 h-4 rounded border flex items-center justify-center flex-shrink-0 transition-colors ${
                                checked
                                  ? 'bg-[#E8002D] border-[#E8002D]'
                                  : 'border-white/20 group-hover:border-white/40'
                              }`}
                            >
                              {checked && (
                                <svg className="w-2.5 h-2.5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                                  <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                                </svg>
                              )}
                            </div>
                            <div className="flex-1 min-w-0">
                              <span className="text-zinc-300 text-sm group-hover:text-white transition-colors">
                                {v.model}
                              </span>
                              <span className="text-zinc-600 text-xs font-mono ml-1.5">{v.code}</span>
                              {years && (
                                <span className="text-zinc-600 text-xs ml-1.5">{years}</span>
                              )}
                            </div>
                          </label>
                        );
                      })}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Submit */}
        <div className="flex flex-col sm:flex-row gap-3 pt-2">
          <button
            type="submit"
            disabled={saving}
            className="flex-1 sm:flex-none sm:min-w-[160px] flex items-center justify-center gap-2 bg-[#E8002D] hover:bg-[#c5001f] disabled:opacity-60 text-white font-semibold py-3 px-6 rounded-lg transition-colors"
          >
            {saving ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                {uploading ? 'Uploading...' : 'Saving...'}
              </>
            ) : (
              'Save Product'
            )}
          </button>
          <button
            type="button"
            onClick={() => router.back()}
            className="flex-1 sm:flex-none sm:min-w-[120px] py-3 px-6 rounded-lg border border-white/10 text-zinc-400 hover:text-white hover:border-white/20 font-medium text-sm transition-colors"
          >
            Cancel
          </button>
        </div>
      </form>

      <style jsx global>{`
        .admin-input {
          width: 100%;
          background: #0A0A0A;
          border: 1px solid rgba(255,255,255,0.08);
          border-radius: 0.5rem;
          padding: 0.625rem 0.875rem;
          color: white;
          font-size: 0.875rem;
          transition: border-color 0.15s;
        }
        .admin-input:focus {
          outline: none;
          border-color: #E8002D;
          box-shadow: 0 0 0 1px #E8002D;
        }
        .admin-input::placeholder {
          color: #52525b;
        }
        .admin-input option {
          background: #141414;
          color: white;
        }
        .custom-scroll::-webkit-scrollbar { width: 4px; }
        .custom-scroll::-webkit-scrollbar-track { background: transparent; }
        .custom-scroll::-webkit-scrollbar-thumb { background: rgba(255,255,255,0.1); border-radius: 2px; }
      `}</style>
    </div>
  );
}
