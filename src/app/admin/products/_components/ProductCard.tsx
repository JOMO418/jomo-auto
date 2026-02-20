import Image from 'next/image';
import { Edit2, Trash2, Star, Tag, Zap, CheckCircle2 } from 'lucide-react';
import type { AdminProduct } from '@/lib/admin-db';
import { formatPrice, safeImage } from './helpers';

function StockBadge({ stock }: { stock: number }) {
  if (stock === 0)
    return <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-bold bg-red-50 text-red-600 border border-red-100">Out of Stock</span>;
  if (stock <= 10)
    return <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-bold bg-amber-50 text-amber-600 border border-amber-100">⚠ Low · {stock}</span>;
  return <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-100">✓ {stock} in stock</span>;
}

function SectionBadges({ product }: { product: AdminProduct }) {
  return (
    <div className="flex flex-wrap gap-1 mt-1">
      {product.featured && (
        <span className="inline-flex items-center gap-0.5 bg-amber-100 text-amber-700 text-[10px] font-bold px-1.5 py-0.5 rounded-full">
          <Star className="h-2.5 w-2.5 fill-amber-500" /> Featured
        </span>
      )}
      {product.new_arrival && (
        <span className="inline-flex items-center gap-0.5 bg-blue-100 text-blue-700 text-[10px] font-bold px-1.5 py-0.5 rounded-full">
          <Tag className="h-2.5 w-2.5" /> New
        </span>
      )}
      {product.flash_deal && (
        <span className="inline-flex items-center gap-0.5 bg-orange-100 text-orange-700 text-[10px] font-bold px-1.5 py-0.5 rounded-full">
          <Zap className="h-2.5 w-2.5 fill-orange-500" /> Flash
        </span>
      )}
    </div>
  );
}

export function ProductCard({
  product,
  onEdit,
  onRequestDelete,
  isDeleting,
  selectable = false,
  selected = false,
  onToggleSelect,
}: {
  product: AdminProduct;
  onEdit: (p: AdminProduct) => void;
  onRequestDelete: (p: AdminProduct) => void;
  isDeleting: boolean;
  selectable?: boolean;
  selected?: boolean;
  onToggleSelect?: (id: string) => void;
}) {
  return (
    <div
      className={`bg-white rounded-2xl overflow-hidden shadow-sm transition-all duration-200 flex flex-col group ${
        selectable
          ? selected
            ? 'ring-2 ring-[#E8002D] shadow-lg shadow-red-100'
            : 'hover:shadow-md cursor-pointer'
          : 'hover:shadow-lg'
      }`}
      onClick={selectable ? () => onToggleSelect?.(product.id) : undefined}
    >
      <div className="relative aspect-square bg-gray-100 overflow-hidden">
        <Image
          src={safeImage(product.images)}
          alt={product.name}
          fill
          sizes="(max-width: 768px) 50vw, (max-width: 1200px) 33vw, 25vw"
          className={`object-cover transition-transform duration-300 ${!selectable ? 'group-hover:scale-105' : ''}`}
        />
        {product.stock === 0 && (
          <div className="absolute inset-0 bg-black/40 flex items-end justify-center pb-3">
            <span className="bg-red-600 text-white text-[10px] font-bold tracking-wide px-2.5 py-1 rounded-lg uppercase">Out of Stock</span>
          </div>
        )}

        {/* Select mode checkbox */}
        {selectable ? (
          <div className="absolute top-2 left-2">
            <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all shadow-sm ${
              selected ? 'bg-[#E8002D] border-[#E8002D]' : 'bg-white/80 border-white/80'
            }`}>
              {selected && <CheckCircle2 className="h-4 w-4 text-white" />}
            </div>
          </div>
        ) : (
          <div className="absolute top-2 left-2 flex gap-1">
            {product.featured && <span className="w-2 h-2 rounded-full bg-amber-400 shadow-sm" title="Featured" />}
            {product.new_arrival && <span className="w-2 h-2 rounded-full bg-blue-400 shadow-sm" title="New Arrival" />}
            {product.flash_deal && <span className="w-2 h-2 rounded-full bg-orange-400 shadow-sm" title="Flash Deal" />}
          </div>
        )}

        {Array.isArray(product.images) && product.images.length > 1 && (
          <div className="absolute bottom-2 right-2">
            <span className="bg-black/60 text-white text-[10px] font-semibold px-1.5 py-0.5 rounded-md">+{product.images.length - 1}</span>
          </div>
        )}

        {/* Selected overlay tint */}
        {selected && <div className="absolute inset-0 bg-[#E8002D]/10" />}
      </div>

      <div className="px-3 pt-3 pb-2 flex-1 flex flex-col gap-1">
        <p className="text-gray-900 text-sm font-semibold leading-snug line-clamp-2 min-h-[2.5rem]">{product.name}</p>
        <div className="flex items-center justify-between mt-0.5">
          <span className="text-[11px] text-gray-400 font-medium">{product.category_name ?? 'Uncategorized'}</span>
          <span className="text-[10px] text-gray-300 font-medium uppercase tracking-wide">{product.condition}</span>
        </div>
        <div className="flex items-center justify-between mt-1">
          <span className="text-gray-900 font-bold text-base leading-none">{formatPrice(product.price)}</span>
          {product.original_price && product.original_price > product.price && (
            <span className="text-gray-400 text-xs line-through">{formatPrice(product.original_price)}</span>
          )}
        </div>
        <div className="mt-1"><StockBadge stock={product.stock} /></div>
        <SectionBadges product={product} />
      </div>

      {/* Edit/Delete buttons — hidden in select mode */}
      {!selectable && (
        <div className="border-t border-gray-100 flex mt-auto">
          <button
            onClick={() => onEdit(product)}
            className="flex-1 flex items-center justify-center gap-1.5 py-2.5 text-xs font-semibold text-[#1d4ed8] hover:bg-blue-50 active:bg-blue-100 transition-colors"
          >
            <Edit2 className="h-3.5 w-3.5" />Edit
          </button>
          <div className="w-px bg-gray-100" />
          <button
            onClick={() => onRequestDelete(product)}
            disabled={isDeleting}
            className="flex-1 flex items-center justify-center gap-1.5 py-2.5 text-xs font-semibold text-red-500 hover:bg-red-50 active:bg-red-100 transition-colors disabled:opacity-40"
          >
            <Trash2 className="h-3.5 w-3.5" />
            {isDeleting ? '…' : 'Delete'}
          </button>
        </div>
      )}
    </div>
  );
}

export function SkeletonCard() {
  return (
    <div className="bg-white rounded-2xl overflow-hidden shadow-sm animate-pulse">
      <div className="aspect-square bg-gray-200" />
      <div className="p-3 space-y-2.5">
        <div className="h-3.5 bg-gray-200 rounded-full w-4/5" />
        <div className="h-3 bg-gray-200 rounded-full w-2/5" />
        <div className="h-4 bg-gray-200 rounded-full w-1/3 mt-3" />
        <div className="h-5 bg-gray-100 rounded-full w-2/5" />
      </div>
      <div className="border-t border-gray-100 flex">
        <div className="flex-1 py-3 flex justify-center"><div className="h-3 bg-gray-200 rounded-full w-10" /></div>
        <div className="w-px bg-gray-100" />
        <div className="flex-1 py-3 flex justify-center"><div className="h-3 bg-gray-200 rounded-full w-10" /></div>
      </div>
    </div>
  );
}
