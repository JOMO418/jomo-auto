"use client";

import { useEffect, useState, useRef } from "react";
import { Search, X } from "lucide-react";

interface SearchBarProps {
  isOpen: boolean;
  onClose: () => void;
  onSearch: (query: string) => void;
  initialQuery?: string;
}

export function SearchBar({ isOpen, onClose, onSearch, initialQuery = "" }: SearchBarProps) {
  const [query, setQuery] = useState(initialQuery);
  const inputRef = useRef<HTMLInputElement>(null);

  // Auto-focus when opened
  useEffect(() => {
    if (isOpen && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isOpen]);

  // Handle search with debounce
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      onSearch(query.trim());
    }, 150);

    return () => clearTimeout(timeoutId);
  }, [query, onSearch]);

  // Handle ESC key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isOpen) {
        handleClose();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen]);

  const handleClose = () => {
    setQuery("");
    onClose();
  };

  if (!isOpen) return null;

  return (
    <>
      {/* Backdrop - subtle */}
      <div
        className="fixed inset-0 bg-black/20 z-40 animate-in fade-in duration-200"
        onClick={handleClose}
      />

      {/* Search Bar - Slim and positioned below header */}
      <div className="fixed top-[120px] md:top-[136px] left-0 right-0 z-50 px-4 animate-in slide-in-from-top-2 duration-200">
        <div className="max-w-4xl mx-auto relative">
          <div className="bg-white rounded-2xl shadow-2xl border border-blue-200/50 overflow-hidden">
            {/* Search Input */}
            <div className="relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-blue-600" />
              <input
                ref={inputRef}
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search by product name, part number, category, or vehicle..."
                className="w-full pl-12 pr-24 md:pr-28 py-4 text-base bg-transparent border-none outline-none text-gray-900 placeholder:text-gray-500"
                autoComplete="off"
                spellCheck="false"
              />
              <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center gap-1">
                {query && (
                  <button
                    onClick={() => setQuery("")}
                    className="p-1.5 hover:bg-gray-100 rounded-lg transition-all duration-300 group/clear"
                    aria-label="Clear search"
                  >
                    <X className="h-4 w-4 text-gray-400 group-hover/clear:text-gray-600 transition-colors" />
                  </button>
                )}
                {/* Elegant Close Button */}
                <button
                  onClick={handleClose}
                  className="p-1.5 hover:bg-blue-50 rounded-lg transition-all duration-300 group/close border border-transparent hover:border-blue-200/50"
                  aria-label="Close search"
                >
                  <X className="h-5 w-5 text-blue-500 group-hover/close:text-blue-700 group-hover/close:rotate-90 transition-all duration-300" />
                </button>
              </div>
            </div>
          </div>

          {/* Helper text */}
          {query && (
            <div className="mt-2 text-center">
              <p className="text-xs text-white/90 bg-black/40 backdrop-blur-sm rounded-full px-3 py-1 inline-block">
                Showing results for "{query}"
              </p>
            </div>
          )}
        </div>
      </div>
    </>
  );
}
