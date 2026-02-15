"use client";

import { useState } from "react";
import Link from "next/link";
import { Sparkles, TrendingUp, ShoppingCart, Check, Star } from "lucide-react";
import type { Product } from "@/lib/types";
import { PLACEHOLDER_IMAGE } from "@/lib/constants";
import { OptimizedImage } from "@/components/ui/optimized-image";

interface NewArrivalsProps {
  products: Product[];
  onAddToCart: (product: Product) => void;
}

const categories = ["All", "Engine", "Brakes", "Suspension", "Electrical", "Body"];

export function NewArrivals({ products, onAddToCart }: NewArrivalsProps) {
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [addingToCart, setAddingToCart] = useState<string | null>(null);

  // Filter products by category
  const filteredProducts = selectedCategory === "All"
    ? products
    : products.filter(p => p.category === selectedCategory);

  // Limit to 8 products for display
  const displayProducts = filteredProducts.slice(0, 8);

  const handleAddToCart = (product: Product) => {
    setAddingToCart(product.id);
    onAddToCart(product);
    setTimeout(() => setAddingToCart(null), 1500);
  };

  return (
    <section className="relative py-16 md:py-20 bg-white overflow-hidden">
      {/* Decorative Elements - Subtle */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-blue-50 rounded-full blur-3xl opacity-20 -z-10"></div>
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-orange-50 rounded-full blur-3xl opacity-20 -z-10"></div>

      <div className="container mx-auto px-3 sm:px-4 max-w-7xl">
        {/* Header Section - Premium Design */}
        <div className="text-center mb-12">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-blue-50 to-orange-50 rounded-full mb-4">
            <Sparkles className="h-4 w-4 text-orange-600" />
            <span className="text-sm font-semibold text-gray-700">Fresh Stock</span>
          </div>

          {/* Title */}
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 mb-3">
            New Arrivals
          </h2>
          <p className="text-gray-600 text-base md:text-lg max-w-2xl mx-auto">
            Just landed! Premium quality auto parts fresh from Japan
          </p>
        </div>

        {/* Category Filter Tabs - Premium Pills */}
        <div className="flex flex-wrap items-center justify-center gap-2 md:gap-3 mb-10">
          {categories.map((category) => (
            <button
              key={category}
              onClick={() => setSelectedCategory(category)}
              className={`
                px-5 py-2.5 rounded-full font-semibold text-sm transition-all duration-300
                ${selectedCategory === category
                  ? "bg-gradient-to-r from-blue-600 to-blue-500 text-white shadow-lg shadow-blue-500/30 scale-105"
                  : "bg-gray-100 text-gray-700 hover:bg-gray-200 hover:scale-105"
                }
              `}
            >
              {category}
            </button>
          ))}
        </div>

        {/* Products Grid - Premium Layout */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6 mb-10">
          {displayProducts.map((product, index) => (
            <ProductCard
              key={product.id}
              product={product}
              index={index}
              onAddToCart={handleAddToCart}
              isAdding={addingToCart === product.id}
            />
          ))}
        </div>

        {/* View All Button - Premium CTA */}
        <div className="text-center">
          <Link
            href="/"
            className="inline-flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-gray-900 to-gray-800 text-white font-semibold rounded-xl hover:from-gray-800 hover:to-gray-700 transition-all duration-300 shadow-lg hover:shadow-xl hover:scale-105 group"
          >
            <span>View All New Arrivals</span>
            <TrendingUp className="h-5 w-5 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>
      </div>
    </section>
  );
}

// Premium Product Card Component
function ProductCard({
  product,
  index,
  onAddToCart,
  isAdding,
}: {
  product: Product;
  index: number;
  onAddToCart: (product: Product) => void;
  isAdding: boolean;
}) {
  const isOutOfStock = product.stock === 0;
  const isNew = index < 4; // First 4 products are marked as "NEW"

  return (
    <div className="group relative">
      {/* Card Container */}
      <div className="relative bg-white rounded-2xl overflow-hidden border-2 border-gray-100 hover:border-blue-300 transition-all duration-300 hover:shadow-xl">
        {/* NEW Badge - Premium */}
        {isNew && (
          <div className="absolute top-3 left-3 z-10">
            <div className="flex items-center gap-1 bg-gradient-to-r from-blue-600 to-blue-500 text-white px-2.5 py-1 rounded-lg shadow-lg">
              <Star className="h-3 w-3 fill-white" />
              <span className="text-xs font-bold">NEW</span>
            </div>
          </div>
        )}

        {/* Stock Status */}
        {!isOutOfStock && product.stock <= 5 && (
          <div className="absolute top-3 right-3 z-10">
            <div className="bg-orange-500 text-white px-2 py-1 rounded-lg text-[10px] font-bold shadow-md">
              {product.stock} left
            </div>
          </div>
        )}

        {isOutOfStock && (
          <div className="absolute top-3 right-3 z-10">
            <div className="bg-gray-500 text-white px-2 py-1 rounded-lg text-[10px] font-bold shadow-md">
              Out of Stock
            </div>
          </div>
        )}

        {/* Product Image - Premium */}
        <Link href={`/product/${product.slug}`} className="block">
          <div className="relative aspect-square bg-gray-50 overflow-hidden">
            <OptimizedImage
              src={product.images[0] || PLACEHOLDER_IMAGE}
              alt={product.name}
              fill
              className="object-cover group-hover:scale-110 transition-transform duration-500"
              sizes="(max-width: 768px) 50vw, (max-width: 1024px) 33vw, 25vw"
            />
            {/* Premium Overlay on Hover */}
            <div className="absolute inset-0 bg-gradient-to-t from-blue-900/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
          </div>
        </Link>

        {/* Product Details - Premium Typography */}
        <div className="p-4">
          {/* Category Badge */}
          <div className="mb-2">
            <span className="inline-block text-[10px] font-semibold text-blue-600 bg-blue-50 px-2 py-1 rounded">
              {product.category}
            </span>
          </div>

          {/* Product Name */}
          <Link href={`/product/${product.slug}`}>
            <h3 className="font-semibold text-sm text-gray-900 mb-2 line-clamp-2 min-h-[40px] group-hover:text-blue-600 transition-colors">
              {product.name}
            </h3>
          </Link>

          {/* Compatibility - Single line */}
          {product.compatibility && product.compatibility.length > 0 && (
            <p className="text-[10px] text-gray-500 mb-3 line-clamp-1">
              Fits: {product.compatibility.slice(0, 2).join(", ")}
            </p>
          )}

          {/* Price - Premium Display */}
          <div className="mb-3">
            {product.originalPrice && product.originalPrice > product.price ? (
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="text-xs text-gray-400 line-through">
                    KSh {product.originalPrice.toLocaleString()}
                  </span>
                  <span className="text-[10px] font-bold text-green-600 bg-green-50 px-1.5 py-0.5 rounded">
                    -{Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)}%
                  </span>
                </div>
                <p className="text-xl font-bold text-gray-900">
                  KSh {product.price.toLocaleString()}
                </p>
              </div>
            ) : (
              <p className="text-xl font-bold text-gray-900">
                KSh {product.price.toLocaleString()}
              </p>
            )}
          </div>

          {/* Add to Cart Button - Premium */}
          <button
            onClick={() => onAddToCart(product)}
            disabled={isOutOfStock || isAdding}
            className={`
              w-full py-2.5 rounded-lg font-semibold text-sm
              transition-all duration-300 flex items-center justify-center gap-2
              ${isOutOfStock
                ? "bg-gray-200 text-gray-500 cursor-not-allowed"
                : isAdding
                ? "bg-green-600 text-white"
                : "bg-gradient-to-r from-blue-600 to-blue-500 text-white hover:from-blue-700 hover:to-blue-600 hover:shadow-lg hover:scale-[1.02] active:scale-95"
              }
            `}
          >
            {isAdding ? (
              <>
                <Check className="h-4 w-4" />
                <span>Added!</span>
              </>
            ) : isOutOfStock ? (
              <span>Out of Stock</span>
            ) : (
              <>
                <ShoppingCart className="h-4 w-4" />
                <span>Add to Cart</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
