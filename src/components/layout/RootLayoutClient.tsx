"use client";

import { ContactBar } from "@/components/layout/ContactBar";
import { Header } from "@/components/layout/Header";
import { Breadcrumb } from "@/components/layout/Breadcrumb";
import { Sidebar } from "@/components/layout/Sidebar";
import { CartBadge } from "@/components/layout/CartBadge";
import { BottomNav } from "@/components/layout/BottomNav";
import { Footer } from "@/components/layout/Footer";
import { SearchBar } from "@/components/search/SearchBar";
import { SearchResults } from "@/components/search/SearchResults";
import { useInstantSearch } from "@/hooks/useInstantSearch";
import { useCartStore } from "@/lib/store";
import { useState, useCallback, useRef, useMemo } from "react";
import { usePathname } from "next/navigation";
import type { Product } from "@/lib/types";
import Fuse from "fuse.js";

interface RootLayoutClientProps {
  children: React.ReactNode;
  products: Product[]; // passed from server layout — no dummy-data import needed
}

export function RootLayoutClient({ children, products }: RootLayoutClientProps) {
  const pathname = usePathname();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const { isOpen, open, close } = useInstantSearch();
  const addItem = useCartStore((state) => state.addItem);

  // Build Fuse index from server-provided products
  const fuse = useRef(
    new Fuse(products, {
      keys: [
        { name: "name", weight: 2 },
        { name: "specs.Part Number", weight: 2 },
        { name: "specs.OEM Number", weight: 1.8 },
        { name: "category", weight: 1.5 },
        { name: "compatibility", weight: 1.5 },
        { name: "description", weight: 1 },
        { name: "origin", weight: 0.5 },
      ],
      threshold: 0.4,
      includeScore: true,
      minMatchCharLength: 2,
      ignoreLocation: true,
      useExtendedSearch: true,
    })
  );

  const searchResults = useMemo(() => {
    if (!searchQuery.trim()) return [];
    return fuse.current.search(searchQuery).map((r) => r.item);
  }, [searchQuery]);

  const handleSearch = useCallback((query: string) => {
    setSearchQuery(query);
  }, []);

  const handleSearchClose = useCallback(() => {
    setSearchQuery("");
    close();
  }, [close]);

  const handleAddToCart = useCallback(
    (product: Product) => {
      addItem(product, 1);
    },
    [addItem]
  );

  // Admin pages use their own layout — skip all customer chrome
  if (pathname.startsWith("/admin")) {
    return <>{children}</>;
  }

  const showSearchResults = isOpen && searchQuery.trim();

  return (
    <div className="min-h-screen flex flex-col overflow-x-hidden max-w-full">
      <ContactBar />

      <Header onMenuClick={() => setSidebarOpen(true)} onSearchClick={open} />

      <SearchBar
        isOpen={isOpen}
        onClose={handleSearchClose}
        onSearch={handleSearch}
        initialQuery={searchQuery}
      />

      {!showSearchResults && <Breadcrumb />}

      <main className="flex-1 pb-16 md:pb-0">
        {showSearchResults ? (
          <SearchResults
            results={searchResults}
            query={searchQuery}
            onAddToCart={handleAddToCart}
          />
        ) : (
          children
        )}
      </main>

      <Footer />

      <Sidebar open={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      <CartBadge />

      <BottomNav onSearchClick={open} />
    </div>
  );
}
