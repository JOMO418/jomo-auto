"use client";

import { ContactBar } from "@/components/layout/ContactBar";
import { Header } from "@/components/layout/Header";
import { Sidebar } from "@/components/layout/Sidebar";
import { CartBadge } from "@/components/layout/CartBadge";
import { BottomNav } from "@/components/layout/BottomNav";
import { SearchBar } from "@/components/search/SearchBar";
import { SearchResults } from "@/components/search/SearchResults";
import { useInstantSearch } from "@/hooks/useInstantSearch";
import { getAllProducts } from "@/lib/dummy-data";
import { useCartStore } from "@/lib/store";
import { useState, useCallback, useRef, useMemo } from "react";
import { Product } from "@/lib/types";
import Fuse from "fuse.js";

export function RootLayoutClient({ children }: { children: React.ReactNode }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const { isOpen, open, close } = useInstantSearch();
  const addItem = useCartStore((state) => state.addItem);

  const products = getAllProducts();

  // Initialize Fuse.js for fuzzy search
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

  // Perform search
  const searchResults = useMemo(() => {
    if (!searchQuery.trim()) return [];

    const fuseResults = fuse.current.search(searchQuery);
    return fuseResults.map((result) => result.item);
  }, [searchQuery]);

  // Handle search query change
  const handleSearch = useCallback((query: string) => {
    setSearchQuery(query);
  }, []);

  // Handle search close
  const handleSearchClose = useCallback(() => {
    setSearchQuery("");
    close();
  }, [close]);

  // Handle add to cart
  const handleAddToCart = useCallback((product: Product) => {
    addItem(product, 1);
  }, [addItem]);

  // Determine what content to show
  const showSearchResults = isOpen && searchQuery.trim();

  return (
    <div className="min-h-screen flex flex-col overflow-x-hidden max-w-full">
      {/* Contact Bar */}
      <ContactBar />

      {/* Header */}
      <Header
        onMenuClick={() => setSidebarOpen(true)}
        onSearchClick={open}
      />

      {/* Search Bar */}
      <SearchBar
        isOpen={isOpen}
        onClose={handleSearchClose}
        onSearch={handleSearch}
        initialQuery={searchQuery}
      />

      {/* Main Content - Show search results or normal content */}
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

      {/* Sidebar */}
      <Sidebar
        open={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
      />

      {/* Floating Cart Badge */}
      <CartBadge />

      {/* Bottom Navigation */}
      <BottomNav onSearchClick={open} />
    </div>
  );
}
