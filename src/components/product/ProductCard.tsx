"use client";

import Link from "next/link";
import type { Product } from "@/lib/types";
import { PLACEHOLDER_IMAGE } from "@/lib/constants";
import { useState } from "react";
import { ShoppingCart } from "lucide-react";
import { OptimizedImage } from "@/components/ui/optimized-image";

interface ProductCardProps {
  product: Product;
  onAddToCart?: (product: Product) => void;
}

export function ProductCard({ product, onAddToCart }: ProductCardProps) {
  const [isAdding, setIsAdding] = useState(false);
  const isOutOfStock = product.stock === 0;

  const handleOrder = async (e: React.MouseEvent) => {
    e.preventDefault();
    if (isOutOfStock || !onAddToCart) return;

    setIsAdding(true);
    onAddToCart(product);

    setTimeout(() => setIsAdding(false), 1000);
  };

  const priceNumber = product.price.toLocaleString('en-KE');

  return (
    <div className="group relative bg-white rounded-lg shadow-md hover:shadow-xl transition-all duration-500 overflow-hidden flex flex-col h-full">
      {/* Full-Width Image Section - Wider aspect ratio (4:3) */}
      <Link href={`/product/${product.slug}`} className="block relative overflow-hidden">
        <div className="relative w-full aspect-[4/3] bg-gradient-to-br from-gray-50 to-gray-100">
          {/* Out of Stock Overlay */}
          {isOutOfStock && (
            <div className="absolute inset-0 z-20 bg-black/60 backdrop-blur-sm flex items-center justify-center">
              <span className="bg-white text-gray-900 text-xs font-bold px-4 py-1.5 rounded-full shadow-lg">
                Out of Stock
              </span>
            </div>
          )}

          {/* Product Image - Full width, no padding */}
          <OptimizedImage
            src={product.images[0] || PLACEHOLDER_IMAGE}
            alt={product.name}
            fill
            className="object-cover group-hover:scale-110 transition-transform duration-700 ease-out"
            sizes="(max-width: 640px) 50vw, (max-width: 768px) 33vw, (max-width: 1024px) 25vw, 20vw"
            priority={false}
          />

          {/* Elegant hover overlay with gradient */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
        </div>
      </Link>

      {/* Product Details Section - Compact & Tight Spacing */}
      <div className="p-2.5 flex flex-col flex-grow">
        {/* Product Name */}
        <Link href={`/product/${product.slug}`}>
          <h3 className="text-xs font-semibold text-gray-900 line-clamp-2 hover:text-[#0A5789] transition-colors duration-300 leading-tight mb-1">
            {product.name}
          </h3>
        </Link>

        {/* Vehicle Compatibility */}
        {product.compatibility && product.compatibility.length > 0 && (
          <p className="text-[10px] text-gray-500 line-clamp-1 mb-1.5">
            {product.compatibility.slice(0, 2).join(", ")}
          </p>
        )}

        {/* Price - Smaller, Still Red */}
        <p className="text-base font-bold text-red-600 tabular-nums mb-2">
          KSh {priceNumber}
        </p>

        {/* Order Now Button - Compact */}
        <button
          onClick={handleOrder}
          disabled={isOutOfStock || isAdding}
          className={`
            w-full py-2 rounded-md font-semibold text-white text-xs
            transition-all duration-300 transform
            ${isOutOfStock
              ? 'bg-gray-400 cursor-not-allowed'
              : isAdding
                ? 'bg-green-500 scale-95'
                : 'bg-[#0A5789] hover:bg-[#083d5e] hover:scale-[1.02] hover:shadow-md active:scale-95'
            }
            flex items-center justify-center gap-1.5
            disabled:cursor-not-allowed disabled:opacity-60
          `}
          aria-label={isOutOfStock ? "Out of stock" : "Order now"}
        >
          {isAdding ? (
            <>
              <svg className="animate-bounce h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
              <span className="animate-pulse">Added!</span>
            </>
          ) : (
            <>
              <ShoppingCart className={`h-4 w-4 transition-transform duration-300 ${!isOutOfStock && 'group-hover:rotate-12'}`} />
              <span>{isOutOfStock ? 'Unavailable' : 'Order Now'}</span>
            </>
          )}
        </button>
      </div>
    </div>
  );
}