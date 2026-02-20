import { Plus, X, Layers } from 'lucide-react';

export function AddMenuSheet({ onClose, onSelectSingle, onSelectBatch }: {
  onClose: () => void;
  onSelectSingle: () => void;
  onSelectBatch: () => void;
}) {
  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/60 backdrop-blur-sm" onClick={onClose}>
      <div
        className="bg-[#111] border border-white/[0.08] w-full max-w-lg rounded-t-3xl p-5 pb-10 shadow-2xl animate-in slide-in-from-bottom-4 duration-300"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="w-10 h-1 bg-white/20 rounded-full mx-auto mb-5" />
        <div className="flex items-center justify-between mb-5">
          <h3 className="text-white font-bold text-base">Add Product</h3>
          <button onClick={onClose} className="w-7 h-7 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center transition-colors">
            <X className="h-3.5 w-3.5 text-zinc-300" />
          </button>
        </div>
        <div className="grid grid-cols-2 gap-3">
          <button
            onClick={() => { onClose(); onSelectSingle(); }}
            className="flex flex-col items-start gap-3 p-4 bg-white/[0.04] hover:bg-white/[0.07] border border-white/[0.08] hover:border-[#E8002D]/40 rounded-2xl transition-all active:scale-[0.97] text-left"
          >
            <div className="w-10 h-10 rounded-xl bg-[#E8002D]/15 flex items-center justify-center">
              <Plus className="h-5 w-5 text-[#E8002D]" />
            </div>
            <div>
              <p className="text-white font-bold text-sm leading-snug">Add One Product</p>
              <p className="text-zinc-500 text-[11px] mt-0.5">Fill in full details</p>
            </div>
          </button>
          <button
            onClick={() => { onClose(); onSelectBatch(); }}
            className="flex flex-col items-start gap-3 p-4 bg-white/[0.04] hover:bg-white/[0.07] border border-white/[0.08] hover:border-blue-500/40 rounded-2xl transition-all active:scale-[0.97] text-left"
          >
            <div className="w-10 h-10 rounded-xl bg-blue-500/15 flex items-center justify-center">
              <Layers className="h-5 w-5 text-blue-400" />
            </div>
            <div>
              <p className="text-white font-bold text-sm leading-snug">Batch Add</p>
              <p className="text-zinc-500 text-[11px] mt-0.5">Upload images, name & price each</p>
            </div>
          </button>
        </div>
      </div>
    </div>
  );
}
