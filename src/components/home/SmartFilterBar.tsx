"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import { Car, Search, X, ChevronRight, Flame } from "lucide-react";
import { getUniqueVehicles, getUniqueCategories, getPopularVehicles } from "@/lib/vehicle-utils";
import type { VehicleInfo } from "@/lib/vehicle-utils";
import { slugify } from "@/lib/utils";

const CATEGORY_ICONS: Record<string, string> = {
  Engine:           "⚙️",
  Brakes:           "🛑",
  Suspension:       "🔧",
  Electrical:       "⚡",
  Body:             "🚗",
  Transmission:     "🔩",
  Interior:         "🪑",
  "Wheels & Tires": "🔄",
};

export function SmartFilterBar() {
  const router = useRouter();

  const [query, setQuery]           = useState("");
  const [open, setOpen]             = useState(false);
  const [highlighted, setHighlighted] = useState(-1);

  const wrapRef  = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const allVehicles    = getUniqueVehicles();
  const popularVehicles = getPopularVehicles();
  const categories      = getUniqueCategories();

  // Suggestions: show popular when no query, filtered when typing
  const suggestions: VehicleInfo[] = query.trim()
    ? allVehicles
        .filter((v) =>
          v.name.toLowerCase().includes(query.toLowerCase()) ||
          v.fullName.toLowerCase().includes(query.toLowerCase()) ||
          v.code.toLowerCase().includes(query.toLowerCase())
        )
        .slice(0, 6)
    : popularVehicles.slice(0, 6);

  // Close on outside click
  useEffect(() => {
    const onDown = (e: MouseEvent) => {
      if (wrapRef.current && !wrapRef.current.contains(e.target as Node)) {
        setOpen(false);
        setHighlighted(-1);
      }
    };
    document.addEventListener("mousedown", onDown);
    return () => document.removeEventListener("mousedown", onDown);
  }, []);

  const goToVehicle = useCallback(
    (v: VehicleInfo) => {
      router.push(`/vehicle/${v.slug}`);
      setQuery("");
      setOpen(false);
      setHighlighted(-1);
    },
    [router]
  );

  const goToCategory = useCallback(
    (cat: string) => {
      router.push(`/category/${slugify(cat)}`);
    },
    [router]
  );

  const onKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (!open) return;
    if (e.key === "Escape") { setOpen(false); setHighlighted(-1); }
    else if (e.key === "ArrowDown") { e.preventDefault(); setHighlighted((h) => Math.min(h + 1, suggestions.length - 1)); }
    else if (e.key === "ArrowUp")   { e.preventDefault(); setHighlighted((h) => Math.max(h - 1, -1)); }
    else if (e.key === "Enter" && highlighted >= 0) { e.preventDefault(); goToVehicle(suggestions[highlighted]); }
  };

  return (
    <section className="w-full bg-white border-b border-gray-100">
      <div className="container mx-auto px-4 md:px-6 lg:px-8 py-3 md:py-5 max-w-4xl">

        {/* ── Section label ── */}
        <div className="text-center mb-3 md:mb-5">
          <h2 className="text-base md:text-2xl lg:text-3xl font-bold tracking-tight text-[#0A0A0A] leading-tight">
            Find Your Parts{" "}
            <span className="relative inline-block">
              <span className="text-[#E8002D]">Fast</span>
              <span className="absolute -bottom-0.5 left-0 right-0 h-0.5 bg-[#E8002D] rounded-full" />
            </span>
          </h2>
          <p className="text-[10px] md:text-xs text-gray-400 mt-1 tracking-wide">
            Search by vehicle or tap a category below
          </p>
        </div>

        {/* ── Vehicle search (primary) ── */}
        <div ref={wrapRef} className="relative mb-3 md:mb-4">

          {/* Input */}
          <div className="relative">
            <Car className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-[#E8002D] pointer-events-none" />
            <input
              ref={inputRef}
              type="text"
              value={query}
              onChange={(e) => { setQuery(e.target.value); setOpen(true); setHighlighted(-1); }}
              onFocus={() => setOpen(true)}
              onKeyDown={onKeyDown}
              placeholder="Search your vehicle — Fielder, Corolla, Prado, Hiace…"
              autoComplete="off"
              spellCheck={false}
              className="w-full pl-10 pr-10 py-3 text-sm font-medium bg-gray-50 border-2 border-gray-200 rounded-xl
                         focus:outline-none focus:border-[#E8002D] focus:bg-white
                         placeholder:text-gray-400 transition-all duration-200"
            />
            {query ? (
              <button
                onClick={() => { setQuery(""); setHighlighted(-1); inputRef.current?.focus(); }}
                className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 flex items-center justify-center rounded-full hover:bg-gray-200 transition-colors"
                aria-label="Clear"
              >
                <X className="h-3.5 w-3.5 text-gray-400" />
              </button>
            ) : (
              <Search className="absolute right-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-300 pointer-events-none" />
            )}
          </div>

          {/* ── Floating dropdown ── */}
          {open && (
            <div className="absolute top-full left-0 right-0 mt-1.5 bg-white rounded-2xl shadow-2xl border border-gray-100 overflow-hidden z-40">

              {/* Header strip */}
              <div className="flex items-center gap-2 px-4 py-2 border-b border-gray-50">
                {query ? (
                  <>
                    <Search className="h-3 w-3 text-gray-300" />
                    <span className="text-[10px] font-bold uppercase tracking-widest text-gray-400">
                      {suggestions.length} {suggestions.length === 1 ? "vehicle" : "vehicles"} found
                    </span>
                  </>
                ) : (
                  <>
                    <Flame className="h-3 w-3 text-[#E8002D]" />
                    <span className="text-[10px] font-bold uppercase tracking-widest text-gray-400">
                      Popular vehicles
                    </span>
                  </>
                )}
              </div>

              {/* Results */}
              {suggestions.length === 0 ? (
                <div className="px-4 py-7 text-center">
                  <p className="text-sm font-semibold text-gray-400">No match found</p>
                  <p className="text-xs text-gray-300 mt-1">Try "Fielder", "Corolla" or "NZE141"</p>
                </div>
              ) : (
                <ul>
                  {suggestions.map((v, i) => (
                    <li key={v.slug}>
                      <button
                        onClick={() => goToVehicle(v)}
                        onMouseEnter={() => setHighlighted(i)}
                        className={`w-full flex items-center gap-3 px-4 py-2.5 text-left transition-colors duration-100 ${
                          highlighted === i ? "bg-[#FFF5F7]" : "hover:bg-gray-50"
                        }`}
                      >
                        {/* Icon pill */}
                        <div className={`flex-shrink-0 w-8 h-8 rounded-lg flex items-center justify-center transition-colors ${
                          highlighted === i ? "bg-[#E8002D]" : "bg-gray-100"
                        }`}>
                          <Car className={`h-3.5 w-3.5 ${highlighted === i ? "text-white" : "text-gray-500"}`} />
                        </div>

                        {/* Text */}
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2">
                            <span className="text-sm font-bold text-gray-900 truncate">{v.fullName}</span>
                            {v.popular && (
                              <span className="flex-shrink-0 text-[9px] font-extrabold text-[#E8002D] bg-red-50 px-1.5 py-0.5 rounded">
                                HOT
                              </span>
                            )}
                          </div>
                          <div className="flex items-center gap-1.5 mt-0.5">
                            <span className="text-[11px] font-mono text-gray-400">{v.code}</span>
                            <span className="text-gray-200">·</span>
                            <span className="text-[11px] font-semibold text-[#E8002D]">{v.productCount} parts</span>
                          </div>
                        </div>

                        {/* Arrow */}
                        <ChevronRight className={`flex-shrink-0 h-4 w-4 ${
                          highlighted === i ? "text-[#E8002D]" : "text-gray-200"
                        }`} />
                      </button>
                      {i < suggestions.length - 1 && <div className="h-px bg-gray-50 mx-4" />}
                    </li>
                  ))}
                </ul>
              )}
            </div>
          )}
        </div>

        {/* ── Category grid — 4 columns × 2 rows on mobile ── */}
        <div>
          <p className="text-[10px] font-bold uppercase tracking-widest text-gray-400 mb-2">
            or browse by <span className="text-[#E8002D]">category</span>
          </p>
          <div className="grid grid-cols-4 gap-1.5 md:flex md:flex-wrap md:gap-2">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => goToCategory(cat)}
                className="
                  /* mobile: compact vertical tile */
                  flex flex-col items-center justify-center gap-0.5
                  py-2 px-1 rounded-xl
                  bg-gray-50 hover:bg-[#0A0A0A]
                  border border-gray-100 hover:border-[#E8002D]/30
                  transition-all duration-200 group
                  /* desktop: horizontal chip */
                  md:flex-row md:gap-1.5 md:px-3 md:py-1.5 md:rounded-full md:bg-gray-100
                "
              >
                <span className="text-lg md:text-sm leading-none">{CATEGORY_ICONS[cat] ?? "🔩"}</span>
                <span className="text-[9px] md:text-xs font-semibold text-gray-700 group-hover:text-white text-center leading-tight w-full truncate md:w-auto">
                  {cat}
                </span>
                <ChevronRight className="hidden md:block h-3 w-3 text-gray-400 group-hover:text-white/60 -mr-0.5" />
              </button>
            ))}
          </div>
        </div>

      </div>
    </section>
  );
}
