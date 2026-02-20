'use client';

import { useState, useEffect } from 'react';
import { X, Loader2, Star, Calendar, Info } from 'lucide-react';
import type { Vehicle } from './VehicleRow';

// Toyota listed first — matches admin's primary workflow
const MAKES = [
  'Toyota', 'Nissan', 'Mazda', 'Subaru', 'Honda',
  'Mitsubishi', 'Isuzu', 'Hyundai', 'Volkswagen',
];

// Year range for dropdowns
const CURRENT_YEAR = new Date().getFullYear();
const YEARS = Array.from({ length: CURRENT_YEAR - 1985 + 2 }, (_, i) => CURRENT_YEAR + 1 - i);
// → [2027, 2026, 2025, ... 1985]

interface Props {
  initial?: Vehicle | null;
  /** Pre-fill brand when adding a variant from within a brand section */
  defaultBrand?: string;
  /** Pre-fill model when adding a variant from within a model group */
  defaultModel?: string;
  onClose: () => void;
  onSaved: (v: Vehicle) => void;
  showToast: (msg: string, ok?: boolean) => void;
}

const INPUT = [
  'w-full bg-gray-50 border border-gray-200 rounded-xl px-3.5 py-2.5',
  'text-gray-900 text-sm placeholder-gray-400',
  'focus:outline-none focus:border-[#E8002D]/60 focus:ring-2 focus:ring-[#E8002D]/15 transition-all',
].join(' ');

function Field({
  label,
  hint,
  children,
}: {
  label: string;
  hint?: string;
  children: React.ReactNode;
}) {
  return (
    <div>
      <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1.5">
        {label}
      </label>
      {children}
      {hint && <p className="text-[11px] text-gray-400 mt-1 flex items-start gap-1"><Info className="h-3 w-3 flex-shrink-0 mt-0.5" />{hint}</p>}
    </div>
  );
}

export function VehicleModal({
  initial,
  defaultBrand,
  defaultModel,
  onClose,
  onSaved,
  showToast,
}: Props) {
  const isEdit = !!initial;

  const [brand,      setBrand]      = useState(initial?.brand      ?? defaultBrand ?? '');
  const [model,      setModel]      = useState(initial?.model      ?? defaultModel ?? '');
  const [code,       setCode]       = useState(initial?.code       ?? '');
  const [yearStart,  setYearStart]  = useState<number | ''>(initial?.year_start ?? '');
  const [yearEnd,    setYearEnd]    = useState<number | ''>(initial?.year_end   ?? '');
  const [popular,    setPopular]    = useState(initial?.popular    ?? false);
  const [saving,     setSaving]     = useState(false);
  const [error,      setError]      = useState('');

  const isCustomBrand = brand !== '' && !MAKES.includes(brand);
  const showCustomInput = isCustomBrand || (!MAKES.includes(brand) && brand === '');

  useEffect(() => {
    const handler = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose(); };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [onClose]);

  function validate(): string {
    if (!brand.trim()) return 'Brand is required.';
    if (!model.trim()) return 'Model is required.';
    if (!code.trim())  return 'Chassis/model code is required.';
    if (yearStart !== '' && yearEnd !== '' && Number(yearStart) > Number(yearEnd)) {
      return 'Start year cannot be after end year.';
    }
    return '';
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const validationError = validate();
    if (validationError) { setError(validationError); return; }

    setSaving(true);
    setError('');

    const url    = isEdit ? `/api/admin/vehicles/${initial!.id}` : '/api/admin/vehicles';
    const method = isEdit ? 'PATCH' : 'POST';

    try {
      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          brand:      brand.trim(),
          model:      model.trim(),
          code:       code.trim(),
          year_start: yearStart !== '' ? Number(yearStart) : null,
          year_end:   yearEnd   !== '' ? Number(yearEnd)   : null,
          popular,
        }),
      });

      const data = await res.json();
      if (!res.ok) { setError(data.error ?? 'Something went wrong.'); return; }

      showToast(
        isEdit
          ? `"${data.vehicle.brand} ${data.vehicle.model} ${data.vehicle.code}" updated.`
          : `"${data.vehicle.brand} ${data.vehicle.model} ${data.vehicle.code}" added.`,
        true
      );
      onSaved(data.vehicle);
    } catch {
      setError('Network error — please try again.');
    } finally {
      setSaving(false);
    }
  }

  // Year options filtered so end year ≥ start year
  const endYearOptions = YEARS.filter(
    (y) => yearStart === '' || y >= Number(yearStart)
  );
  const startYearOptions = YEARS.filter(
    (y) => yearEnd === '' || y <= Number(yearEnd)
  );

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md max-h-[92vh] flex flex-col">

        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100">
          <div>
            <h2 className="text-gray-900 font-bold text-base">
              {isEdit ? 'Edit Vehicle' : 'Add Vehicle'}
            </h2>
            {(defaultModel || defaultBrand) && !isEdit && (
              <p className="text-xs text-gray-400 mt-0.5">
                Adding new variant for {defaultBrand}{defaultModel ? ` ${defaultModel}` : ''}
              </p>
            )}
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition-colors"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto px-5 py-4 space-y-4">

          {/* Brand */}
          <Field label="Brand (Make)">
            <select
              value={isCustomBrand ? '__other__' : brand}
              onChange={(e) => {
                setError('');
                setBrand(e.target.value === '__other__' ? '' : e.target.value);
              }}
              className={INPUT}
            >
              <option value="">Select brand…</option>
              {MAKES.map((m) => (
                <option key={m} value={m}>{m}</option>
              ))}
              <option value="__other__">Other (type below)</option>
            </select>
            {showCustomInput && (
              <input
                type="text"
                placeholder="Type brand name…"
                value={brand}
                onChange={(e) => { setBrand(e.target.value); setError(''); }}
                className={`${INPUT} mt-2`}
                autoFocus
              />
            )}
          </Field>

          {/* Model */}
          <Field
            label="Model"
            hint='e.g. Corolla, Fielder, Vitz, Hiace. Use the exact model name.'
          >
            <input
              type="text"
              placeholder="e.g. Fielder, Vitz, Hiace"
              value={model}
              onChange={(e) => { setModel(e.target.value); setError(''); }}
              className={INPUT}
            />
          </Field>

          {/* Chassis Code */}
          <Field
            label="Chassis / Generation Code"
            hint='Uniquely identifies the variant. e.g. NZE141, KDH200 2KD, KSP90.'
          >
            <input
              type="text"
              placeholder="e.g. NZE141, KDH200 2KD, KSP90"
              value={code}
              onChange={(e) => { setCode(e.target.value.toUpperCase()); setError(''); }}
              className={`${INPUT} font-mono tracking-wide`}
            />
          </Field>

          {/* Year Range */}
          <Field
            label="Manufacturing Year Range"
            hint='Sets which customer years this variant covers. Leave blank if unknown.'
          >
            <div className="flex items-center gap-2">
              <div className="flex-1">
                <div className="flex items-center gap-1.5 mb-1">
                  <Calendar className="h-3 w-3 text-gray-400" />
                  <span className="text-[11px] text-gray-400 font-medium">From year</span>
                </div>
                <select
                  value={yearStart}
                  onChange={(e) => {
                    setYearStart(e.target.value === '' ? '' : Number(e.target.value));
                    setError('');
                  }}
                  className={INPUT}
                >
                  <option value="">Any</option>
                  {startYearOptions.map((y) => (
                    <option key={y} value={y}>{y}</option>
                  ))}
                </select>
              </div>

              <div className="flex-shrink-0 text-gray-300 font-bold mt-5">–</div>

              <div className="flex-1">
                <div className="flex items-center gap-1.5 mb-1">
                  <Calendar className="h-3 w-3 text-gray-400" />
                  <span className="text-[11px] text-gray-400 font-medium">To year</span>
                </div>
                <select
                  value={yearEnd}
                  onChange={(e) => {
                    setYearEnd(e.target.value === '' ? '' : Number(e.target.value));
                    setError('');
                  }}
                  className={INPUT}
                >
                  <option value="">Present</option>
                  {endYearOptions.map((y) => (
                    <option key={y} value={y}>{y}</option>
                  ))}
                </select>
              </div>
            </div>

            {/* Live preview */}
            {(yearStart !== '' || yearEnd !== '') && (
              <div className="mt-2 px-3 py-2 bg-gray-50 rounded-xl border border-gray-200">
                <p className="text-xs text-gray-600">
                  <span className="text-gray-400">Compatibility label: </span>
                  <span className="font-semibold font-mono">
                    {brand || 'Brand'} {model || 'Model'} {code || 'CODE'}{' '}
                    ({yearStart || '?'}-{yearEnd || 'present'})
                  </span>
                </p>
              </div>
            )}
          </Field>

          {/* Popular toggle */}
          <button
            type="button"
            onClick={() => setPopular((p) => !p)}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl border-2 transition-all text-left ${
              popular
                ? 'border-amber-300 bg-amber-50'
                : 'border-gray-200 bg-gray-50 hover:border-gray-300'
            }`}
          >
            <Star className={`h-5 w-5 flex-shrink-0 ${popular ? 'text-amber-500 fill-amber-400' : 'text-gray-300'}`} />
            <div>
              <p className={`text-sm font-semibold ${popular ? 'text-amber-700' : 'text-gray-600'}`}>
                Mark as Popular
              </p>
              <p className="text-xs text-gray-400 mt-0.5">
                Shown prominently in the shop filter bar and vehicle search
              </p>
            </div>
          </button>

          {error && (
            <p className="text-red-600 text-xs bg-red-50 border border-red-200 rounded-xl px-3 py-2.5">
              {error}
            </p>
          )}
        </form>

        {/* Footer */}
        <div className="flex gap-3 px-5 py-4 border-t border-gray-100">
          <button
            type="button"
            onClick={onClose}
            disabled={saving}
            className="flex-1 py-3 rounded-xl border border-gray-200 text-gray-700 font-semibold text-sm hover:bg-gray-50 transition-colors disabled:opacity-50"
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            disabled={saving}
            className="flex-1 py-3 rounded-xl bg-[#E8002D] hover:bg-[#c5001f] text-white font-semibold text-sm transition-colors disabled:opacity-50 flex items-center justify-center gap-2 shadow-lg shadow-red-900/20"
          >
            {saving
              ? <><Loader2 className="h-4 w-4 animate-spin" />Saving…</>
              : isEdit ? 'Save Changes' : 'Add Vehicle'}
          </button>
        </div>
      </div>
    </div>
  );
}
