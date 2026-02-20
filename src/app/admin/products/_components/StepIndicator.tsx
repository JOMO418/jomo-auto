import { CheckCircle2 } from 'lucide-react';

export function StepIndicator({ step }: { step: 1 | 2 }) {
  return (
    <div className="flex items-center px-5 py-2.5 border-b border-white/[0.08]">
      <div className="flex items-center gap-2">
        <div className={`w-5 h-5 rounded-full flex items-center justify-center text-[11px] font-bold transition-colors ${step === 1 ? 'bg-[#E8002D] text-white' : 'bg-emerald-600 text-white'}`}>
          {step > 1 ? <CheckCircle2 className="h-3 w-3" /> : '1'}
        </div>
        <span className={`text-xs font-semibold ${step === 1 ? 'text-white' : 'text-zinc-500'}`}>Product Info</span>
      </div>
      <div className={`flex-1 h-px mx-3 transition-colors ${step > 1 ? 'bg-[#E8002D]' : 'bg-white/10'}`} />
      <div className="flex items-center gap-2">
        <div className={`w-5 h-5 rounded-full flex items-center justify-center text-[11px] font-bold transition-colors ${step === 2 ? 'bg-[#E8002D] text-white' : 'bg-white/10 text-zinc-500'}`}>
          2
        </div>
        <span className={`text-xs font-semibold ${step === 2 ? 'text-white' : 'text-zinc-600'}`}>Fitment & Visibility</span>
      </div>
    </div>
  );
}
