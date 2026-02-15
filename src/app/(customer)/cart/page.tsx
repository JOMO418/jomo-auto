"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import {
  Minus,
  Plus,
  Trash2,
  ShoppingBag,
  ArrowLeft,
  Package,
  Truck,
  Shield,
  ChevronRight,
  AlertCircle,
} from "lucide-react";
import { useCartStore } from "@/lib/store";
import { PLACEHOLDER_IMAGE } from "@/lib/constants";
import { getAllProducts } from "@/lib/dummy-data";
import type { Product } from "@/lib/types";

/**
 * Premium Shopping Cart Page
 * Expert UI/UX Implementation with Perfect Mobile Responsiveness
 */
export default function CartPage() {
  const [mounted, setMounted] = useState(false);
  const [removingId, setRemovingId] = useState<string | null>(null);

  const items = useCartStore((state) => state.items);
  const updateQuantity = useCartStore((state) => state.updateQuantity);
  const removeItem = useCartStore((state) => state.removeItem);
  const getTotalPrice = useCartStore((state) => state.getTotalPrice);
  const getTotalItems = useCartStore((state) => state.getTotalItems);
  const addItem = useCartStore((state) => state.addItem);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Handle remove with confirmation animation
  const handleRemove = (productId: string) => {
    setRemovingId(productId);
    setTimeout(() => {
      removeItem(productId);
      setRemovingId(null);
    }, 300);
  };

  // Get suggested products (not in cart)
  const suggestedProducts = getAllProducts()
    .filter((p) => !items.some((item) => item.product.id === p.id))
    .filter((p) => p.featured)
    .slice(0, 4);

  // Format price
  const formatPrice = (price: number) => {
    return `KSh ${price.toLocaleString("en-KE")}`;
  };

  // Loading state
  if (!mounted) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 rounded-full bg-gradient-to-br from-blue-100 to-blue-200 flex items-center justify-center mx-auto mb-4 animate-pulse">
            <ShoppingBag className="w-8 h-8 text-blue-600" />
          </div>
          <p className="text-gray-500 font-medium">Loading your cart...</p>
        </div>
      </div>
    );
  }

  const total = getTotalPrice();
  const totalItems = getTotalItems();
  const hasLowStock = items.some((item) => item.product.stock <= 5);

  // Empty cart state
  if (items.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 overflow-x-hidden">
        <div className="container mx-auto px-3 sm:px-4 py-8 md:py-16 max-w-4xl">
          <div className="bg-white rounded-2xl shadow-sm p-8 md:p-12 text-center">
            {/* Empty cart icon */}
            <div className="w-24 h-24 rounded-full bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center mx-auto mb-6">
              <ShoppingBag className="w-12 h-12 text-gray-400" />
            </div>

            <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-3">
              Your Cart is Empty
            </h2>
            <p className="text-gray-600 mb-8 max-w-md mx-auto">
              Start adding quality auto parts to your cart and get them delivered fast!
            </p>

            <Link
              href="/"
              className="inline-flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-blue-600 to-blue-500 text-white font-semibold rounded-xl hover:from-blue-700 hover:to-blue-600 transition-all duration-300 shadow-lg shadow-blue-500/30 hover:shadow-xl"
            >
              <ArrowLeft className="w-5 h-5" />
              Start Shopping
            </Link>

            {/* Suggested products */}
            {suggestedProducts.length > 0 && (
              <div className="mt-12 pt-12 border-t border-gray-200">
                <h3 className="text-lg font-semibold text-gray-900 mb-6">
                  Popular Products
                </h3>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {suggestedProducts.map((product) => (
                    <Link
                      key={product.id}
                      href={`/product/${product.slug}`}
                      className="group bg-gray-50 rounded-xl p-3 hover:bg-blue-50 transition-all duration-200 border border-gray-100 hover:border-blue-200"
                    >
                      <div className="relative aspect-square rounded-lg overflow-hidden bg-white mb-2">
                        <Image
                          src={product.images[0] || PLACEHOLDER_IMAGE}
                          alt={product.name}
                          fill
                          className="object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                      </div>
                      <p className="text-xs font-medium text-gray-900 line-clamp-2 group-hover:text-blue-600">
                        {product.name}
                      </p>
                      <p className="text-sm font-bold text-red-600 mt-1">
                        {formatPrice(product.price)}
                      </p>
                    </Link>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 pb-24 md:pb-8 overflow-x-hidden">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 sticky top-0 z-30">
        <div className="container mx-auto px-3 sm:px-4 py-4 md:py-5 max-w-full">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-xl md:text-3xl font-bold text-gray-900">
                Shopping Cart
              </h1>
              <p className="text-sm text-gray-600 mt-1">
                {totalItems} {totalItems === 1 ? "item" : "items"} in your cart
              </p>
            </div>
            <Link
              href="/"
              className="hidden md:inline-flex items-center gap-2 text-blue-600 hover:text-blue-700 font-medium transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              Continue Shopping
            </Link>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-3 sm:px-4 py-6 md:py-8 max-w-7xl">
        <div className="grid lg:grid-cols-3 gap-4 md:gap-6 lg:gap-8">
          {/* Cart Items */}
          <div className="lg:col-span-2 space-y-4">
            {/* Low stock warning */}
            {hasLowStock && (
              <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 flex items-start gap-3">
                <AlertCircle className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
                <div className="flex-1">
                  <p className="text-sm font-medium text-amber-900">
                    Low Stock Alert
                  </p>
                  <p className="text-sm text-amber-700 mt-0.5">
                    Some items in your cart are running low on stock. Complete your order soon!
                  </p>
                </div>
              </div>
            )}

            {/* Cart items list */}
            {items.map((item) => (
              <div
                key={item.product.id}
                className={`
                  bg-white rounded-xl md:rounded-2xl shadow-sm border border-gray-200
                  overflow-hidden transition-all duration-300
                  ${removingId === item.product.id ? "opacity-0 scale-95" : "opacity-100 scale-100"}
                `}
              >
                <div className="p-3 sm:p-4 md:p-5">
                  <div className="flex gap-2 sm:gap-3 md:gap-4">
                    {/* Product Image */}
                    <Link
                      href={`/product/${item.product.slug}`}
                      className="relative w-16 h-16 sm:w-20 sm:h-20 md:w-28 md:h-28 flex-shrink-0 bg-gray-100 rounded-lg md:rounded-xl overflow-hidden group"
                    >
                      <Image
                        src={item.product.images[0] || PLACEHOLDER_IMAGE}
                        alt={item.product.name}
                        fill
                        className="object-cover group-hover:scale-105 transition-transform duration-300"
                        sizes="(max-width: 640px) 64px, (max-width: 768px) 80px, 112px"
                      />
                    </Link>

                    {/* Product Info */}
                    <div className="flex-1 min-w-0 overflow-hidden">
                      <div className="flex items-start justify-between gap-2 mb-2">
                        <Link
                          href={`/product/${item.product.slug}`}
                          className="font-semibold text-sm md:text-base text-gray-900 hover:text-blue-600 line-clamp-2 transition-colors"
                        >
                          {item.product.name}
                        </Link>

                        {/* Remove button - Desktop */}
                        <button
                          onClick={() => handleRemove(item.product.id)}
                          className="hidden md:flex p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors group"
                          aria-label="Remove item"
                        >
                          <Trash2 className="w-5 h-5 group-hover:scale-110 transition-transform" />
                        </button>
                      </div>

                      {/* Product details */}
                      <div className="flex flex-wrap items-center gap-2 text-xs md:text-sm text-gray-600 mb-3">
                        <span className="px-2 py-0.5 bg-gray-100 rounded text-xs">
                          {item.product.condition}
                        </span>
                        <span>•</span>
                        <span>{item.product.category}</span>
                        {item.product.stock <= 5 && (
                          <>
                            <span>•</span>
                            <span className="text-amber-600 font-medium">
                              Only {item.product.stock} left
                            </span>
                          </>
                        )}
                      </div>

                      {/* Price and quantity - Mobile/Desktop layout */}
                      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                        {/* Quantity selector */}
                        <div className="flex items-center gap-1 bg-gray-100 rounded-lg p-1 w-fit">
                          <button
                            onClick={() =>
                              updateQuantity(item.product.id, item.quantity - 1)
                            }
                            disabled={item.quantity <= 1}
                            className="w-7 h-7 sm:w-8 sm:h-8 md:w-10 md:h-10 flex items-center justify-center rounded-md hover:bg-white disabled:opacity-40 disabled:cursor-not-allowed transition-all active:scale-95"
                            aria-label="Decrease quantity"
                          >
                            <Minus className="w-3.5 h-3.5 sm:w-4 sm:h-4 md:w-5 md:h-5 text-gray-700" />
                          </button>
                          <span className="font-bold text-gray-900 w-7 sm:w-8 md:w-10 text-center text-sm md:text-base">
                            {item.quantity}
                          </span>
                          <button
                            onClick={() =>
                              updateQuantity(item.product.id, item.quantity + 1)
                            }
                            disabled={item.quantity >= item.product.stock}
                            className="w-7 h-7 sm:w-8 sm:h-8 md:w-10 md:h-10 flex items-center justify-center rounded-md hover:bg-white disabled:opacity-40 disabled:cursor-not-allowed transition-all active:scale-95"
                            aria-label="Increase quantity"
                          >
                            <Plus className="w-3.5 h-3.5 sm:w-4 sm:h-4 md:w-5 md:h-5 text-gray-700" />
                          </button>
                        </div>

                        {/* Price */}
                        <div className="text-left sm:text-right">
                          <p className="text-base sm:text-lg md:text-xl font-bold text-red-600">
                            {formatPrice(item.product.price * item.quantity)}
                          </p>
                          {item.quantity > 1 && (
                            <p className="text-xs text-gray-500">
                              {formatPrice(item.product.price)} each
                            </p>
                          )}
                        </div>
                      </div>

                      {/* Remove button - Mobile */}
                      <button
                        onClick={() => handleRemove(item.product.id)}
                        className="md:hidden mt-3 flex items-center gap-2 text-sm text-red-600 hover:text-red-700 font-medium"
                      >
                        <Trash2 className="w-4 h-4" />
                        Remove
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}

            {/* Mobile: Continue shopping link */}
            <Link
              href="/"
              className="md:hidden flex items-center justify-center gap-2 text-blue-600 hover:text-blue-700 font-medium py-4"
            >
              <ArrowLeft className="w-4 h-4" />
              Continue Shopping
            </Link>
          </div>

          {/* Cart Summary - Desktop Sticky */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6 lg:sticky lg:top-24 space-y-6">
              <h2 className="text-xl font-bold text-gray-900">Order Summary</h2>

              {/* Price breakdown */}
              <div className="space-y-3">
                <div className="flex justify-between text-gray-600">
                  <span>Subtotal ({totalItems} items)</span>
                  <span className="font-semibold text-gray-900">
                    {formatPrice(total)}
                  </span>
                </div>

                <div className="flex justify-between text-gray-600">
                  <span className="flex items-center gap-1">
                    <Truck className="w-4 h-4" />
                    Delivery
                  </span>
                  <span className="text-sm font-medium text-green-600">
                    Calculated at checkout
                  </span>
                </div>

                <div className="h-px bg-gray-200"></div>

                <div className="flex justify-between text-lg md:text-xl font-bold">
                  <span className="text-gray-900">Total</span>
                  <span className="text-red-600">{formatPrice(total)}</span>
                </div>
              </div>

              {/* Checkout button */}
              <Link
                href="/checkout"
                className="block w-full py-4 bg-gradient-to-r from-blue-600 to-blue-500 text-white text-center font-bold rounded-xl hover:from-blue-700 hover:to-blue-600 transition-all duration-300 shadow-lg shadow-blue-500/30 hover:shadow-xl hover:scale-[1.02] active:scale-100"
              >
                Proceed to Checkout
              </Link>

              {/* Trust badges */}
              <div className="pt-6 border-t border-gray-200 space-y-3">
                <div className="flex items-center gap-3 text-sm text-gray-600">
                  <div className="w-10 h-10 rounded-lg bg-green-100 flex items-center justify-center flex-shrink-0">
                    <Shield className="w-5 h-5 text-green-600" />
                  </div>
                  <div className="flex-1">
                    <p className="font-medium text-gray-900">Secure Checkout</p>
                    <p className="text-xs text-gray-500">Your payment is safe</p>
                  </div>
                </div>

                <div className="flex items-center gap-3 text-sm text-gray-600">
                  <div className="w-10 h-10 rounded-lg bg-blue-100 flex items-center justify-center flex-shrink-0">
                    <Truck className="w-5 h-5 text-blue-600" />
                  </div>
                  <div className="flex-1">
                    <p className="font-medium text-gray-900">Fast Delivery</p>
                    <p className="text-xs text-gray-500">Same-day available</p>
                  </div>
                </div>

                <div className="flex items-center gap-3 text-sm text-gray-600">
                  <div className="w-10 h-10 rounded-lg bg-amber-100 flex items-center justify-center flex-shrink-0">
                    <Package className="w-5 h-5 text-amber-600" />
                  </div>
                  <div className="flex-1">
                    <p className="font-medium text-gray-900">Genuine Parts</p>
                    <p className="text-xs text-gray-500">Warranty backed</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Suggested Products */}
        {suggestedProducts.length > 0 && (
          <div className="mt-8 md:mt-12 pt-8 md:pt-12 border-t border-gray-200">
            <div className="flex items-center justify-between mb-4 md:mb-6">
              <div>
                <h3 className="text-lg md:text-xl lg:text-2xl font-bold text-gray-900">
                  You May Also Like
                </h3>
                <p className="text-xs md:text-sm text-gray-600 mt-1">
                  Popular parts other customers purchased
                </p>
              </div>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4">
              {suggestedProducts.map((product) => (
                <div
                  key={product.id}
                  className="bg-white rounded-xl border border-gray-200 overflow-hidden group hover:shadow-lg hover:border-blue-200 transition-all duration-300"
                >
                  <Link href={`/product/${product.slug}`}>
                    <div className="relative aspect-square bg-gray-100">
                      <Image
                        src={product.images[0] || PLACEHOLDER_IMAGE}
                        alt={product.name}
                        fill
                        className="object-cover group-hover:scale-105 transition-transform duration-300"
                        sizes="(max-width: 768px) 50vw, 25vw"
                      />
                    </div>
                  </Link>
                  <div className="p-3 md:p-4">
                    <Link href={`/product/${product.slug}`}>
                      <p className="text-xs md:text-sm font-medium text-gray-900 line-clamp-2 hover:text-blue-600 mb-2">
                        {product.name}
                      </p>
                    </Link>
                    <p className="text-sm md:text-base font-bold text-red-600 mb-3">
                      {formatPrice(product.price)}
                    </p>
                    <button
                      onClick={() => addItem(product, 1)}
                      className="w-full py-2 text-sm font-semibold text-blue-600 border-2 border-blue-600 rounded-lg hover:bg-blue-600 hover:text-white transition-all duration-200 active:scale-95"
                    >
                      Add to Cart
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Mobile Sticky Checkout Bar */}
      <div className="lg:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 p-3 sm:p-4 shadow-2xl z-40 max-w-full">
        <div className="flex items-center justify-between gap-2 sm:gap-3">
          <div className="flex-shrink-0">
            <p className="text-xs text-gray-600">Total ({totalItems} items)</p>
            <p className="text-lg sm:text-xl font-bold text-red-600 whitespace-nowrap">{formatPrice(total)}</p>
          </div>
          <Link
            href="/checkout"
            className="flex-1 max-w-[200px] sm:max-w-xs py-3 sm:py-4 bg-gradient-to-r from-blue-600 to-blue-500 text-white text-center font-bold rounded-xl hover:from-blue-700 hover:to-blue-600 transition-all duration-300 shadow-lg shadow-blue-500/30 active:scale-95 flex items-center justify-center gap-1 sm:gap-2 text-sm sm:text-base"
          >
            Checkout
            <ChevronRight className="w-4 h-4 sm:w-5 sm:h-5" />
          </Link>
        </div>
      </div>
    </div>
  );
}
