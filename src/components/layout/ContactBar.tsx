import { Phone } from "lucide-react";
import { CONTACT_INFO } from "@/lib/constants";

export function ContactBar() {
  return (
    <div className="relative bg-gradient-to-br from-[#0A1E3D] via-[#1E3A5F] to-[#0F2744] backdrop-blur-xl border-b border-blue-400/20 shadow-2xl shadow-blue-900/40 before:absolute before:inset-0 before:bg-gradient-to-r before:from-blue-600/10 before:via-transparent before:to-blue-600/10 before:animate-shimmer overflow-x-hidden">
      <div className="relative h-9 md:h-10 lg:h-10 flex items-center justify-center px-3 md:px-6 lg:px-8 w-full">
        <a
          href={`tel:${CONTACT_INFO.phone}`}
          className="flex items-center gap-2 md:gap-2.5 lg:gap-3 hover:scale-[1.01] transition-all duration-500 group"
        >
          {/* Premium Phone Icon */}
          <div className="relative">
            <div className="absolute inset-0 bg-amber-400/40 rounded-full blur-lg opacity-70 group-hover:opacity-100 transition-opacity duration-700 animate-pulse-slow"></div>
            <Phone className="relative h-3.5 w-3.5 md:h-4 md:w-4 lg:h-4 lg:w-4 text-amber-200 group-hover:text-amber-100 transition-colors duration-500 drop-shadow-[0_0_12px_rgba(251,191,36,0.8)]" />
          </div>

          {/* Small Text - "For Order/Inquiries" */}
          <span className="text-[10px] md:text-xs lg:text-xs text-blue-100/90 group-hover:text-white font-normal tracking-wide transition-all duration-500">
            For Order/Inquiries
          </span>

          {/* Divider */}
          <div className="hidden sm:block h-4 md:h-4 lg:h-4 w-px bg-blue-300/30 group-hover:bg-amber-400/40 transition-colors duration-500"></div>

          {/* PROMINENT Phone Number - POPS OUT */}
          <div className="relative">
            {/* Multi-layer glow effect */}
            <div className="absolute -inset-4 bg-gradient-to-r from-amber-500/0 via-amber-400/35 to-amber-500/0 rounded-2xl blur-xl animate-pulse-elegant opacity-80 group-hover:opacity-100"></div>
            <div className="absolute -inset-2 bg-gradient-to-r from-white/0 via-white/25 to-white/0 rounded-lg blur-md animate-pulse-elegant-delay opacity-70"></div>

            {/* Phone Number - Matches Header Style */}
            <span className="relative font-heading text-sm md:text-lg lg:text-lg font-bold tracking-wide text-transparent bg-gradient-to-br from-white via-blue-50 to-amber-50 bg-clip-text drop-shadow-[0_2px_18px_rgba(255,255,255,0.9)] group-hover:from-amber-200 group-hover:via-white group-hover:to-amber-200 group-hover:drop-shadow-[0_3px_24px_rgba(251,191,36,1)] transition-all duration-700 animate-elegant-fade">
              {CONTACT_INFO.phone}
            </span>

            {/* Elegant underline with glow */}
            <div className="absolute -bottom-1 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-amber-400/0 to-transparent group-hover:via-amber-400/90 rounded-full transition-all duration-700 shadow-[0_0_12px_rgba(251,191,36,0.8)]"></div>
          </div>

          {/* Mobile tap indicator */}
          <span className="xs:hidden text-[7px] text-amber-200/60 font-light uppercase tracking-wide">
            tap
          </span>
        </a>
      </div>
    </div>
  );
}