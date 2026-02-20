'use client';

import { useState, useEffect, useCallback } from 'react';
import { Plus, Search, Package, AlertTriangle, X, RefreshCw, Trash2, CheckSquare, Square, Loader2 } from 'lucide-react';
import { CATEGORIES } from '@/lib/constants';
import type { AdminProduct } from '@/lib/admin-db';

import { useToast, Toaster } from './_components/Toast';
import { ProductCard, SkeletonCard } from './_components/ProductCard';
import { DeleteModal } from './_components/DeleteModal';
import { EditModal } from './_components/EditModal';
import { MigrationBanner } from './_components/MigrationBanner';
import { AddMenuSheet } from './_components/AddMenuSheet';
import { AddSingleModal } from './_components/AddSingleModal';
import { AddMultipleModal } from './_components/AddMultipleModal';

const ALL_CATEGORIES = ['All', ...CATEGORIES] as const;

export default function AdminProductsPage() {
  const [products, setProducts] = useState<AdminProduct[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState<string>('All');
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [pendingDelete, setPendingDelete] = useState<AdminProduct | null>(null);
  const [editingProduct, setEditingProduct] = useState<AdminProduct | null>(null);
  const [showMigrationBanner, setShowMigrationBanner] = useState(false);

  // Add product flows
  const [showAddMenu, setShowAddMenu] = useState(false);
  const [showAddSingle, setShowAddSingle] = useState(false);
  const [showAddMultiple, setShowAddMultiple] = useState(false);

  // Bulk select
  const [selectMode, setSelectMode] = useState(false);
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const [bulkDeleting, setBulkDeleting] = useState(false);
  const [showBulkConfirm, setShowBulkConfirm] = useState(false);

  const { toasts, show: showToast, dismiss } = useToast();

  const fetchProducts = useCallback(async () => {
    setLoading(true); setError(null);
    try {
      const res = await fetch('/api/admin/products');
      if (!res.ok) {
        const body = await res.json().catch(() => ({}));
        throw new Error(body.error ?? `Server error (${res.status})`);
      }
      const data = await res.json();
      setProducts(Array.isArray(data.products) ? data.products : []);
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : 'Unknown error');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchProducts(); }, [fetchProducts]);

  const filtered = products.filter((p) => {
    const matchSearch = !search || (p.name ?? '').toLowerCase().includes(search.toLowerCase());
    const matchCat = category === 'All' || p.category_name === category;
    return matchSearch && matchCat;
  });

  // ── Select helpers ────────────────────────────────────────────────────────
  function exitSelectMode() {
    setSelectMode(false);
    setSelectedIds(new Set());
  }

  function toggleSelect(id: string) {
    setSelectedIds((prev) => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  }

  function toggleSelectAll() {
    if (selectedIds.size === filtered.length) {
      setSelectedIds(new Set());
    } else {
      setSelectedIds(new Set(filtered.map((p) => p.id)));
    }
  }

  // ── Bulk delete ───────────────────────────────────────────────────────────
  const handleBulkDelete = useCallback(async () => {
    if (selectedIds.size === 0) return;
    setBulkDeleting(true);
    setShowBulkConfirm(false);
    const ids = Array.from(selectedIds);
    const results = await Promise.allSettled(
      ids.map((id) => fetch(`/api/admin/products/${id}`, { method: 'DELETE' }))
    );
    const succeeded = ids.filter((_, i) => results[i].status === 'fulfilled' && (results[i] as PromiseFulfilledResult<Response>).value.ok);
    const failCount = ids.length - succeeded.length;
    setProducts((prev) => prev.filter((p) => !succeeded.includes(p.id)));
    setBulkDeleting(false);
    exitSelectMode();
    if (failCount === 0) {
      showToast('success', `${succeeded.length} product${succeeded.length !== 1 ? 's' : ''} deleted.`);
    } else {
      showToast('error', `${succeeded.length} deleted, ${failCount} failed.`);
    }
  }, [selectedIds, showToast]);

  // ── Single delete ─────────────────────────────────────────────────────────
  const handleDeleteConfirm = useCallback(async () => {
    if (!pendingDelete) return;
    const target = pendingDelete;
    setDeletingId(target.id); setPendingDelete(null);
    try {
      const res = await fetch(`/api/admin/products/${target.id}`, { method: 'DELETE' });
      if (res.ok) {
        setProducts((prev) => prev.filter((p) => p.id !== target.id));
        showToast('success', `"${target.name}" deleted.`);
      } else {
        const body = await res.json().catch(() => ({}));
        showToast('error', body.error ?? 'Failed to delete product.');
      }
    } catch {
      showToast('error', 'Network error — product could not be deleted.');
    } finally {
      setDeletingId(null);
    }
  }, [pendingDelete, showToast]);

  const handleEditSaved = useCallback((updated: AdminProduct) => {
    setProducts((prev) => prev.map((p) => (p.id === updated.id ? updated : p)));
    setEditingProduct(null);
    showToast('success', `"${updated.name}" updated successfully.`);
  }, [showToast]);

  const handleSaveError = useCallback((message: string) => {
    if (message.includes('new_arrival') || message.includes('flash_deal')) setShowMigrationBanner(true);
  }, []);

  const handleProductCreated = useCallback((product: AdminProduct) => {
    setProducts((prev) => [product, ...prev]);
    setShowAddSingle(false);
    showToast('success', `"${product.name}" added successfully.`);
  }, [showToast]);

  const handleBatchCreated = useCallback((newProducts: AdminProduct[]) => {
    setProducts((prev) => [...newProducts, ...prev]);
    setShowAddMultiple(false);
    showToast('success', `${newProducts.length} product${newProducts.length !== 1 ? 's' : ''} added successfully.`);
  }, [showToast]);

  const allFilteredSelected = filtered.length > 0 && selectedIds.size === filtered.length;

  return (
    <div className="space-y-5 pb-36">
      <Toaster toasts={toasts} dismiss={dismiss} />

      {showMigrationBanner && (
        <MigrationBanner
          onDismiss={() => setShowMigrationBanner(false)}
          onApplied={() => setShowMigrationBanner(false)}
          showToast={showToast}
        />
      )}

      {/* Header */}
      <div className="flex items-start justify-between gap-3">
        <div>
          <h1 className="text-xl font-bold text-white tracking-tight">Products</h1>
          <p className="text-zinc-500 text-xs mt-0.5">
            {loading ? 'Loading…' : `${products.length} total · ${filtered.length} showing`}
          </p>
        </div>
        <div className="flex items-center gap-2 flex-shrink-0">
          {/* Select / Cancel button */}
          {!loading && filtered.length > 0 && (
            <button
              onClick={selectMode ? exitSelectMode : () => setSelectMode(true)}
              className={`inline-flex items-center gap-1.5 text-sm font-bold px-3.5 py-2.5 rounded-xl transition-colors ${
                selectMode
                  ? 'bg-zinc-700 hover:bg-zinc-600 text-white'
                  : 'bg-white/[0.06] hover:bg-white/[0.10] text-zinc-300 border border-white/[0.08]'
              }`}
            >
              {selectMode ? <><X className="h-4 w-4" />Cancel</> : <><CheckSquare className="h-4 w-4" />Select</>}
            </button>
          )}
          {!selectMode && (
            <button
              onClick={() => setShowAddMenu(true)}
              className="inline-flex items-center gap-1.5 bg-[#E8002D] hover:bg-[#c5001f] active:bg-[#a0001a] text-white text-sm font-bold px-4 py-2.5 rounded-xl transition-colors shadow-lg shadow-red-900/40"
            >
              <Plus className="h-4 w-4" />
              <span className="hidden xs:inline">Add Product</span>
              <span className="xs:hidden">Add</span>
            </button>
          )}
        </div>
      </div>

      {/* Search */}
      <div className="relative">
        <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-500 pointer-events-none" />
        <input
          type="search"
          placeholder="Search products…"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full bg-[#1A1A1A] border border-white/[0.08] rounded-xl pl-10 pr-10 py-3 text-white text-sm placeholder-zinc-600 focus:outline-none focus:border-[#E8002D]/60 focus:ring-2 focus:ring-[#E8002D]/20 transition-all"
        />
        {search && (
          <button onClick={() => setSearch('')} className="absolute right-3.5 top-1/2 -translate-y-1/2 text-zinc-500 hover:text-white transition-colors">
            <X className="h-4 w-4" />
          </button>
        )}
      </div>

      {/* Category Pills */}
      <div className="flex gap-2 overflow-x-auto pb-1 -mx-4 px-4 scrollbar-hide">
        {ALL_CATEGORIES.map((cat) => {
          const count = cat === 'All' ? products.length : products.filter((p) => p.category_name === cat).length;
          const isActive = category === cat;
          return (
            <button
              key={cat}
              onClick={() => setCategory(cat)}
              className={`flex-shrink-0 inline-flex items-center gap-1.5 px-3.5 py-2 rounded-full text-xs font-semibold transition-all whitespace-nowrap ${
                isActive
                  ? 'bg-[#E8002D] text-white shadow-md shadow-red-900/40'
                  : 'bg-[#1A1A1A] text-zinc-400 hover:text-white border border-white/[0.08] hover:border-white/20'
              }`}
            >
              {cat}
              {!loading && (
                <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded-full ${isActive ? 'bg-white/20 text-white' : 'bg-white/[0.08] text-zinc-500'}`}>
                  {count}
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* Error Banner */}
      {error && (
        <div className="flex items-start gap-3 bg-red-950/50 border border-red-500/20 rounded-xl p-4">
          <AlertTriangle className="h-5 w-5 text-red-400 flex-shrink-0 mt-0.5" />
          <div className="flex-1 min-w-0">
            <p className="text-red-300 text-sm font-semibold">Failed to load products</p>
            <p className="text-red-500/80 text-xs mt-0.5 break-words">{error}</p>
          </div>
          <button onClick={fetchProducts} className="flex-shrink-0 flex items-center gap-1 text-xs text-red-400 hover:text-red-300 font-semibold transition-colors">
            <RefreshCw className="h-3.5 w-3.5" />Retry
          </button>
        </div>
      )}

      {/* Loading Skeleton */}
      {loading && (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
          {Array.from({ length: 8 }).map((_, i) => <SkeletonCard key={i} />)}
        </div>
      )}

      {/* Empty State */}
      {!loading && !error && filtered.length === 0 && (
        <div className="flex flex-col items-center justify-center py-20 text-center px-4">
          <div className="w-16 h-16 rounded-2xl bg-[#1A1A1A] border border-white/[0.06] flex items-center justify-center mb-4">
            <Package className="h-8 w-8 text-zinc-700" />
          </div>
          <p className="text-zinc-300 font-bold text-base">No products found</p>
          <p className="text-zinc-600 text-sm mt-1.5 max-w-xs">
            {search ? `No results for "${search}"` : category !== 'All' ? `Nothing in ${category} yet` : 'Add your first product to get started'}
          </p>
          {!search && category === 'All' && (
            <button onClick={() => setShowAddMenu(true)} className="mt-5 inline-flex items-center gap-2 bg-[#E8002D] text-white text-sm font-bold px-5 py-3 rounded-xl shadow-lg shadow-red-900/30 hover:bg-[#c5001f] transition-colors">
              <Plus className="h-4 w-4" />Add First Product
            </button>
          )}
          {(search || category !== 'All') && (
            <button onClick={() => { setSearch(''); setCategory('All'); }} className="mt-4 text-sm text-zinc-500 hover:text-zinc-300 underline underline-offset-2 transition-colors">
              Clear filters
            </button>
          )}
        </div>
      )}

      {/* Product Grid */}
      {!loading && !error && filtered.length > 0 && (
        <>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
            {filtered.map((product) => (
              <ProductCard
                key={product.id}
                product={product}
                onEdit={setEditingProduct}
                onRequestDelete={setPendingDelete}
                isDeleting={deletingId === product.id}
                selectable={selectMode}
                selected={selectedIds.has(product.id)}
                onToggleSelect={toggleSelect}
              />
            ))}
          </div>
          <p className="text-zinc-700 text-xs text-center pt-2">Showing {filtered.length} of {products.length} products</p>
        </>
      )}

      {/* ── Bulk Action Bar ─────────────────────────────────────────────────── */}
      {selectMode && (
        <div className="fixed bottom-0 inset-x-0 z-40 flex justify-center pointer-events-none">
          <div className="w-full max-w-lg pointer-events-auto">
            <div className="mx-4 mb-4 bg-[#1A1A1A] border border-white/[0.10] rounded-2xl shadow-2xl px-4 py-3 flex items-center gap-3 animate-in slide-in-from-bottom-4 duration-200">
              {/* Select all toggle */}
              <button
                onClick={toggleSelectAll}
                className="flex items-center gap-2 text-sm font-semibold text-zinc-300 hover:text-white transition-colors flex-shrink-0"
              >
                {allFilteredSelected
                  ? <CheckSquare className="h-4.5 w-4.5 text-[#E8002D]" />
                  : <Square className="h-4.5 w-4.5" />
                }
                <span className="text-xs">
                  {selectedIds.size > 0 ? `${selectedIds.size} selected` : 'Select all'}
                </span>
              </button>

              <div className="flex-1" />

              {/* Delete button */}
              <button
                onClick={() => selectedIds.size > 0 && setShowBulkConfirm(true)}
                disabled={selectedIds.size === 0 || bulkDeleting}
                className="flex items-center gap-2 bg-red-600 hover:bg-red-700 disabled:opacity-40 disabled:cursor-not-allowed text-white text-sm font-bold px-4 py-2.5 rounded-xl transition-colors"
              >
                {bulkDeleting
                  ? <><Loader2 className="h-4 w-4 animate-spin" />Deleting…</>
                  : <><Trash2 className="h-4 w-4" />Delete {selectedIds.size > 0 ? `(${selectedIds.size})` : ''}</>
                }
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ── Bulk Delete Confirm ──────────────────────────────────────────────── */}
      {showBulkConfirm && (
        <div className="fixed inset-0 z-[60] flex items-end sm:items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="bg-white rounded-2xl p-6 w-full max-w-sm shadow-2xl animate-in slide-in-from-bottom-4 duration-200">
            <div className="w-12 h-12 rounded-2xl bg-red-50 flex items-center justify-center mb-4">
              <Trash2 className="h-6 w-6 text-red-500" />
            </div>
            <h3 className="text-gray-900 font-bold text-lg">Delete {selectedIds.size} product{selectedIds.size !== 1 ? 's' : ''}?</h3>
            <p className="text-gray-500 text-sm mt-2 leading-relaxed">
              This will permanently remove <span className="font-semibold text-gray-800">{selectedIds.size} product{selectedIds.size !== 1 ? 's' : ''}</span>. This cannot be undone.
            </p>
            <div className="flex gap-3 mt-6">
              <button onClick={() => setShowBulkConfirm(false)} className="flex-1 py-3 rounded-xl border border-gray-200 text-gray-700 text-sm font-semibold hover:bg-gray-50 transition-colors">
                Cancel
              </button>
              <button onClick={handleBulkDelete} className="flex-1 py-3 rounded-xl bg-red-600 text-white text-sm font-semibold hover:bg-red-700 transition-colors flex items-center justify-center gap-2">
                <Trash2 className="h-4 w-4" />Yes, Delete All
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Single delete modal */}
      {pendingDelete && (
        <DeleteModal
          product={pendingDelete}
          isDeleting={deletingId === pendingDelete.id}
          onConfirm={handleDeleteConfirm}
          onCancel={() => setPendingDelete(null)}
        />
      )}

      {/* Edit modal */}
      {editingProduct && !selectMode && (
        <EditModal
          product={editingProduct}
          onClose={() => setEditingProduct(null)}
          onSaved={handleEditSaved}
          onSaveError={handleSaveError}
        />
      )}

      {/* Add flows */}
      {showAddMenu && (
        <AddMenuSheet
          onClose={() => setShowAddMenu(false)}
          onSelectSingle={() => setShowAddSingle(true)}
          onSelectBatch={() => setShowAddMultiple(true)}
        />
      )}
      {showAddSingle && (
        <AddSingleModal
          onClose={() => setShowAddSingle(false)}
          onCreated={handleProductCreated}
        />
      )}
      {showAddMultiple && (
        <AddMultipleModal
          onClose={() => setShowAddMultiple(false)}
          onCreated={handleBatchCreated}
        />
      )}

      {/* Global modal styles */}
      <style jsx global>{`
        .modal-label {
          display: block;
          font-size: 0.675rem;
          font-weight: 700;
          color: #52525b;
          text-transform: uppercase;
          letter-spacing: 0.07em;
          margin-bottom: 0.3rem;
        }
        .modal-input {
          width: 100%;
          background: #0A0A0A;
          border: 1px solid rgba(255,255,255,0.07);
          border-radius: 0.6rem;
          padding: 0.55rem 0.8rem;
          color: white;
          font-size: 0.875rem;
          transition: border-color 0.15s, box-shadow 0.15s;
        }
        .modal-input:focus {
          outline: none;
          border-color: #E8002D;
          box-shadow: 0 0 0 2px rgba(232,0,45,0.12);
        }
        .modal-input::placeholder { color: #3f3f46; }
        .modal-input option { background: #141414; color: white; }
        .custom-scroll::-webkit-scrollbar { width: 3px; }
        .custom-scroll::-webkit-scrollbar-track { background: transparent; }
        .custom-scroll::-webkit-scrollbar-thumb { background: rgba(255,255,255,0.08); border-radius: 2px; }
        .no-scrollbar::-webkit-scrollbar { display: none; }
        .no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
      `}</style>
    </div>
  );
}
