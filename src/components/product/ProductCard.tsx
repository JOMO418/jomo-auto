"use client";

import Link from "next/link";
import type { Product } from "@/lib/types";
import { PLACEHOLDER_IMAGE } from "@/lib/constants";
import { useState } from "react";
import { ShoppingCart, Check, Sparkles } from "lucide-react";
import { OptimizedImage } from "@/components/ui/optimized-image";

interface ProductCardProps {
  product: Product;
  onAddToCart?: (product: Product) => void;
}

/**
 * PREMIUM PRODUCT CARD
 * Impressive order button with visual feedback
 */
export function ProductCard({ product, onAddToCart }: ProductCardProps) {
  const [isAdding, setIsAdding] = useState(false);
  const [justAdded, setJustAdded] = useState(false);
  const isOutOfStock = product.stock === 0;

  const handleOrder = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    console.log("Order Now clicked!", { product: product.name, onAddToCart: !!onAddToCart });

    if (isOutOfStock) {
      console.log("Product is out of stock");
      return;
    }

    if (!onAddToCart) {
      console.error("onAddToCart is not provided to ProductCard!");
      alert("Error: Cart functionality not connected. Please refresh the page.");
      return;
    }

    // Trigger adding state
    setIsAdding(true);
    console.log("Adding to cart...");
    onAddToCart(product);

    // Show "Added!" state
    setTimeout(() => {
      setIsAdding(false);
      setJustAdded(true);
      console.log("Item added to cart!");
    }, 600);

    // Reset to normal after showing success
    setTimeout(() => {
      setJustAdded(false);
    }, 2000);
  };

  const priceNumber = product.price.toLocaleString('en-KE');

  return (
    <div className="group relative bg-white rounded-xl shadow-md hover:shadow-2xl transition-all duration-500 overflow-hidden flex flex-col h-full border border-gray-100 hover:border-blue-300">
      {/* Product Image */}
      <Link href={`/product/${product.slug}`} className="block relative overflow-hidden">
        <div className="relative w-full aspect-[4/3] bg-gradient-to-br from-gray-50 to-gray-100">
          {/* Out of Stock Overlay */}
          {isOutOfStock && (
            <div className="absolute inset-0 z-20 bg-black/60 backdrop-blur-sm flex items-center justify-center">
              <span className="bg-white text-gray-900 text-xs font-bold px-4 py-2 rounded-full shadow-lg">
                Out of Stock
              </span>
            </div>
          )}

          {/* Product Image */}
          <OptimizedImage
            src={product.images[0] || PLACEHOLDER_IMAGE}
            alt={product.name}
            fill
            className="object-cover group-hover:scale-110 transition-transform duration-700 ease-out"
            sizes="(max-width: 640px) 50vw, (max-width: 768px) 33vw, (max-width: 1024px) 25vw, 20vw"
            priority={false}
          />

          {/* Elegant hover overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
        </div>
      </Link>

      {/* Product Details */}
      <div className="p-3 md:p-3.5 flex flex-col flex-grow">
        {/* Product Name */}
        <Link href={`/product/${product.slug}`}>
          <h3 className="text-sm md:text-base font-semibold text-gray-900 line-clamp-2 hover:text-blue-600 transition-colors duration-300 leading-tight mb-1.5">
            {product.name}
          </h3>
        </Link>

        {/* Vehicle Compatibility */}
        {product.compatibility && product.compatibility.length > 0 && (
          <p className="text-[10px] md:text-xs text-gray-500 line-clamp-1 mb-2">
            Fits: {product.compatibility.slice(0, 2).join(", ")}
          </p>
        )}

        {/* Spacer */}
        <div className="flex-grow"></div>

        {/* Price */}
        <p className="text-lg md:text-xl font-bold text-red-600 tabular-nums mb-3">
          KSh {priceNumber}
        </p>

        {/* IMPRESSIVE ORDER BUTTON */}
        <button
          onClick={handleOrder}
          disabled={isOutOfStock || isAdding}
          className={`
            w-full py-2.5 md:py-3 rounded-lg font-bold text-sm md:text-base
            transition-all duration-300 transform
            flex items-center justify-center gap-2
            shadow-lg hover:shadow-xl
            border border-transparent
            ${isOutOfStock
              ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
              : justAdded
                ? 'bg-gradient-to-r from-green-500 to-emerald-600 text-white scale-95 shadow-green-500/50'
                : isAdding
                  ? 'bg-gradient-to-br from-[#0A1E3D] via-[#1E3A5F] to-[#0F2744] text-white scale-95'
                  : 'bg-gradient-to-br from-[#0A1E3D] via-[#1E3A5F] to-[#0F2744] text-white hover:from-[#1E3A5F] hover:via-[#0A1E3D] hover:to-[#1E3A5F] hover:scale-[1.02] active:scale-95 shadow-blue-900/40 hover:shadow-blue-800/60 border-blue-400/20 hover:border-blue-400/40'
            }
            disabled:cursor-not-allowed disabled:opacity-60
          `}
          aria-label={isOutOfStock ? "Out of stock" : justAdded ? "Added to cart" : "Order now"}
        >
          {isAdding ? (
            <>
              <div className="w-5 h-5 border-3 border-white border-t-transparent rounded-full animate-spin"></div>
              <span className="animate-pulse">Adding...</span>
            </>
          ) : justAdded ? (
            <>
              <Check className="h-5 w-5 animate-bounce" />
              <span className="font-bold">Added to Cart!</span>
              <Sparkles className="h-4 w-4 animate-pulse" />
            </>
          ) : (
            <>
              <ShoppingCart className={`h-5 w-5 transition-transform duration-300 ${!isOutOfStock && 'group-hover:rotate-12'}`} />
              <span className="font-bold">{isOutOfStock ? 'Unavailable' : 'Order Now'}</span>
            </>
          )}
        </button>
      </div>

      {/* Success Confetti Animation Overlay */}
      {justAdded && (
        <div className="absolute inset-0 pointer-events-none overflow-hidden rounded-xl">
          {/* Confetti particles */}
          {[...Array(8)].map((_, i) => (
            <div
              key={i}
              className="absolute w-2 h-2 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-full animate-ping"
              style={{
                top: '50%',
                left: '50%',
                animationDelay: `${i * 50}ms`,
                animationDuration: '800ms',
              }}
            />
          ))}
        </div>
      )}
    </div>
  );
}
