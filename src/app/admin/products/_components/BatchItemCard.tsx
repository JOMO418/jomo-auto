import Image from 'next/image';
import { X, ChevronRight } from 'lucide-react';
import type { BatchItem } from './types';

export function BatchItemCard({ item, index, onChange, onRemove }: {
  item: BatchItem;
  index: number;
  onChange: (id: string, updates: Partial<BatchItem>) => void;
  onRemove: (id: string) => void;
}) {
  return (
    <div className={`bg-white/[0.04] border rounded-xl overflow-hidden transition-colors ${item.nameError || item.priceError ? 'border-red-500/40' : 'border-white/[0.08]'}`}>
      <div className="flex items-center gap-3 p-3">
        <div className="relative w-14 h-14 rounded-lg overflow-hidden flex-shrink-0 bg-white/[0.06]">
          <Image src={item.preview} alt={`item-${index}`} fill className="object-cover" sizes="56px" />
          <button
            type="button"
            onClick={() => onRemove(item.id)}
            className="absolute -top-1 -right-1 w-5 h-5 rounded-full bg-red-600 flex items-center justify-center"
          >
            <X className="h-2.5 w-2.5 text-white" />
          </button>
        </div>
        <div className="flex-1 min-w-0 space-y-1.5">
          <input
            type="text"
            value={item.name}
            onChange={(e) => onChange(item.id, { name: e.target.value, nameError: false })}
            placeholder="Product name *"
            className={`modal-input text-xs py-2 ${item.nameError ? 'border-red-500/70' : ''}`}
          />
          <input
            type="number"
            value={item.price}
            onChange={(e) => onChange(item.id, { price: e.target.value, priceError: false })}
            placeholder="Price (KSh) *"
            min="0"
            className={`modal-input text-xs py-2 ${item.priceError ? 'border-red-500/70' : ''}`}
          />
        </div>
        <button
          type="button"
          onClick={() => onChange(item.id, { expanded: !item.expanded })}
          className="flex-shrink-0 text-zinc-600 hover:text-zinc-400 transition-colors p-1"
        >
          <ChevronRight className={`h-4 w-4 transition-transform ${item.expanded ? 'rotate-90' : ''}`} />
        </button>
      </div>
      {item.expanded && (
        <div className="px-3 pb-3 space-y-1.5 border-t border-white/[0.06] pt-3">
          <input type="number" value={item.originalPrice} onChange={(e) => onChange(item.id, { originalPrice: e.target.value })} placeholder="Original price (optional)" min="0" className="modal-input text-xs py-2" />
          <input type="number" value={item.stockOverride} onChange={(e) => onChange(item.id, { stockOverride: e.target.value })} placeholder="Stock override" min="0" className="modal-input text-xs py-2" />
          <textarea value={item.description} onChange={(e) => onChange(item.id, { description: e.target.value })} placeholder="Description (optional)" rows={2} className="modal-input text-xs py-2 resize-none" />
        </div>
      )}
    </div>
  );
}
