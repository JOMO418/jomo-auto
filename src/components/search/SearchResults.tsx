"use client";

import { Product } from "@/lib/types";
import Image from "next/image";
import Link from "next/link";
import { ShoppingCart, Package, Tag, Check } from "lucide-react";
import { useState } from "react";

interface SearchResultsProps {
  results: Product[];
  query: string;
  onAddToCart: (product: Product) => void;
}

export function SearchResults({ results, query, onAddToCart }: SearchResultsProps) {
  const [addedItems, setAddedItems] = useState<Set<string>>(new Set());

  const handleAddToCart = (product: Product, e: React.MouseEvent) => {
    e.preventDefault(); // Prevent link navigation
    onAddToCart(product);

    // Show success feedback
    setAddedItems(prev => new Set(prev).add(product.id));
    setTimeout(() => {
      setAddedItems(prev => {
        const newSet = new Set(prev);
        newSet.delete(product.id);
        return newSet;
      });
    }, 2000);
  };

  if (!query) {
    return null;
  }

  if (results.length === 0) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="text-center max-w-md mx-auto px-4">
          <Package className="h-16 w-16 text-gray-300 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-700 mb-2">
            No products found
          </h2>
          <p className="text-gray-500 mb-4">
            We couldn't find any products matching "{query}"
          </p>
          <p className="text-sm text-gray-400">
            Try different keywords, check spelling, or browse our categories
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="py-6">
      <div className="max-w-7xl mx-auto px-4">
        {/* Results Header */}
        <div className="mb-6">
          <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2">
            Search Results
          </h1>
          <p className="text-gray-600">
            Found <span className="font-semibold text-blue-600">{results.length}</span> product{results.length !== 1 ? 's' : ''} matching "{query}"
          </p>
        </div>

        {/* Results Grid - 2 Columns for Quick Browsing */}
        <div className="grid grid-cols-2 gap-3 md:gap-4">
          {results.map((product) => {
            const isAdded = addedItems.has(product.id);
            const isOutOfStock = product.stock === 0;

            return (
              <Link
                key={product.id}
                href={`/product/${product.slug}`}
                className="group bg-white rounded-lg md:rounded-xl border border-gray-200 overflow-hidden hover:shadow-lg hover:border-blue-300 transition-all duration-200 flex flex-col"
              >
                {/* Product Image */}
                <div className="relative aspect-square bg-gray-100 overflow-hidden">
                  <Image
                    src={product.images[0] || "/placeholder.png"}
                    alt={product.name}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  {product.originalPrice && (
                    <div className="absolute top-1.5 left-1.5 bg-red-500 text-white text-[10px] md:text-xs font-bold px-1.5 py-0.5 md:px-2 md:py-1 rounded">
                      SALE
                    </div>
                  )}
                  {isOutOfStock && (
                    <div className="absolute inset-0 bg-black/60 flex items-center justify-center">
                      <span className="bg-white text-gray-900 px-2 py-1 md:px-3 md:py-1.5 rounded text-xs md:text-sm font-semibold">
                        Out of Stock
                      </span>
                    </div>
                  )}
                </div>

                {/* Product Info - Compact */}
                <div className="p-2 md:p-3 flex-1 flex flex-col">
                  {/* Category Badge */}
                  <div className="flex items-center gap-1 mb-1.5">
                    <span className="inline-flex items-center gap-0.5 text-[10px] md:text-xs px-1.5 py-0.5 bg-blue-100 text-blue-700 rounded-full font-medium">
                      <Tag className="h-2.5 w-2.5 md:h-3 md:w-3" />
                      <span className="hidden sm:inline">{product.category}</span>
                      <span className="sm:hidden">{product.category.slice(0, 4)}</span>
                    </span>
                    {product.condition === "New" && (
                      <span className="text-[10px] md:text-xs px-1.5 py-0.5 bg-green-100 text-green-700 rounded-full font-medium">
                        New
                      </span>
                    )}
                  </div>

                  {/* Product Name */}
                  <h3 className="font-semibold text-xs md:text-sm text-gray-900 mb-1 md:mb-1.5 line-clamp-2 group-hover:text-blue-600 transition-colors leading-tight">
                    {product.name}
                  </h3>

                  {/* Compatibility - Hidden on mobile */}
                  {product.compatibility.length > 0 && (
                    <p className="hidden md:block text-xs text-gray-500 mb-2 line-clamp-1">
                      {product.compatibility[0]}
                    </p>
                  )}

                  {/* Price */}
                  <div className="mt-auto">
                    <div className="flex items-baseline gap-1 md:gap-1.5 mb-2">
                      <span className="text-sm md:text-lg font-bold text-gray-900">
                        {product.price.toLocaleString()}
                      </span>
                      {product.originalPrice && (
                        <span className="text-[10px] md:text-xs text-gray-400 line-through">
                          {product.originalPrice.toLocaleString()}
                        </span>
                      )}
                    </div>

                    {/* Add to Cart Button - Compact */}
                    <button
                      onClick={(e) => handleAddToCart(product, e)}
                      disabled={isOutOfStock || isAdded}
                      className={`w-full py-1.5 md:py-2 px-2 md:px-3 rounded-lg font-semibold text-[11px] md:text-sm transition-all duration-200 flex items-center justify-center gap-1 md:gap-1.5 ${
                        isAdded
                          ? "bg-green-500 text-white"
                          : isOutOfStock
                          ? "bg-gray-200 text-gray-400 cursor-not-allowed"
                          : "bg-blue-600 text-white hover:bg-blue-700 active:scale-95"
                      }`}
                    >
                      {isAdded ? (
                        <>
                          <Check className="h-3 w-3 md:h-4 md:w-4" />
                          <span className="hidden sm:inline">Added</span>
                          <span className="sm:hidden">✓</span>
                        </>
                      ) : (
                        <>
                          <ShoppingCart className="h-3 w-3 md:h-4 md:w-4" />
                          <span className="hidden sm:inline">{isOutOfStock ? "Out of Stock" : "Add to Cart"}</span>
                          <span className="sm:hidden">{isOutOfStock ? "Out" : "Add"}</span>
                        </>
                      )}
                    </button>
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      </div>
    </div>
  );
}
