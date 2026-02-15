"use client";

import { X, Minus, Plus, Trash2, ShoppingBag, Eye } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import {
  Sheet,
  SheetContent,
} from "@/components/ui/sheet";
import { useCartStore } from "@/lib/store";
import { formatPrice } from "@/lib/utils";
import { PLACEHOLDER_IMAGE } from "@/lib/constants";
import { Button } from "@/components/ui/button";
import { useEffect, useState } from "react";

interface QuickCartProps {
  open: boolean;
  onClose: () => void;
}

export function QuickCart({ open, onClose }: QuickCartProps) {
  const [mounted, setMounted] = useState(false);
  const items = useCartStore((state) => state.items);
  const updateQuantity = useCartStore((state) => state.updateQuantity);
  const removeItem = useCartStore((state) => state.removeItem);
  const clearCart = useCartStore((state) => state.clearCart);
  const getTotalPrice = useCartStore((state) => state.getTotalPrice);
  const getTotalItems = useCartStore((state) => state.getTotalItems);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return null;
  }

  const total = getTotalPrice();
  const itemCount = getTotalItems();

  const handleClearCart = () => {
    if (window.confirm("Are you sure you want to clear your cart?")) {
      clearCart();
    }
  };

  return (
    <Sheet open={open} onOpenChange={onClose}>
      <SheetContent
        side="left"
        hideCloseButton
        className="w-full max-w-[85vw] sm:max-w-[60vw] md:max-w-[50vw] lg:max-w-[40vw] p-0 bg-gradient-to-br from-[#0A1E3D] via-[#1E3A5F] to-[#0F2744] border-r border-blue-400/20"
      >
        <div className="flex flex-col h-full">
          {/* Premium Header */}
          <div className="relative px-5 py-5 border-b border-white/10">
            {/* Background Glow */}
            <div className="absolute inset-0 bg-gradient-to-r from-blue-600/10 via-amber-400/10 to-blue-600/10 opacity-50"></div>

            {/* Title with Cart Count */}
            <div className="relative flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="relative">
                  <ShoppingBag className="h-6 w-6 text-amber-400" />
                  {itemCount > 0 && (
                    <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs font-bold rounded-full h-4 w-4 flex items-center justify-center">
                      {itemCount}
                    </span>
                  )}
                </div>
                <div>
                  <h2 className="font-heading text-xl md:text-2xl font-bold text-transparent bg-gradient-to-br from-white via-blue-50 to-amber-50 bg-clip-text">
                    Quick Cart
                  </h2>
                  <p className="text-xs text-blue-200/70 mt-0.5">
                    {itemCount} {itemCount === 1 ? "item" : "items"}
                  </p>
                </div>
              </div>

              {/* Close Button */}
              <button
                onClick={onClose}
                className="p-2 hover:bg-white/10 rounded-lg transition-all duration-300 group"
                aria-label="Close cart"
              >
                <X className="h-5 w-5 text-white/80 group-hover:text-white transition-colors" />
              </button>
            </div>
          </div>

          {/* Cart Items - Scrollable */}
          <div className="flex-1 overflow-y-auto px-5 py-4">
            {items.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-full text-center space-y-4 py-12">
                <div className="relative">
                  <div className="absolute inset-0 bg-blue-400/20 rounded-full blur-2xl"></div>
                  <ShoppingBag className="relative h-20 w-20 text-white/30" />
                </div>
                <div>
                  <h3 className="font-heading text-xl font-bold text-white/90 mb-2">
                    Your cart is empty
                  </h3>
                  <p className="text-sm text-blue-200/70">
                    Add some amazing products to get started!
                  </p>
                </div>
                <Link href="/" onClick={onClose}>
                  <Button className="mt-4 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-white border-0">
                    Start Shopping
                  </Button>
                </Link>
              </div>
            ) : (
              <div className="space-y-3">
                {items.map((item) => (
                  <div
                    key={item.product.id}
                    className="group relative bg-white rounded-lg shadow-sm hover:shadow-md border border-gray-200 overflow-hidden transition-all duration-200"
                  >
                    <div className="p-3">
                      <div className="flex gap-3">
                        {/* Product Image */}
                        <Link
                          href={`/product/${item.product.slug}`}
                          onClick={onClose}
                          className="relative w-16 h-16 sm:w-20 sm:h-20 flex-shrink-0 bg-gray-100 rounded border border-gray-200 overflow-hidden group/img"
                        >
                          <Image
                            src={item.product.images[0] || PLACEHOLDER_IMAGE}
                            alt={item.product.name}
                            fill
                            className="object-cover group-hover/img:scale-105 transition-transform duration-300"
                          />
                        </Link>

                        {/* Product Info */}
                        <div className="flex-1 min-w-0 flex flex-col">
                          <Link
                            href={`/product/${item.product.slug}`}
                            onClick={onClose}
                            className="font-[family-name:var(--font-playfair)] font-semibold text-xs sm:text-sm text-[#0A1E3D] hover:text-[#1E3A5F] line-clamp-2 leading-tight transition-colors"
                          >
                            {item.product.name}
                          </Link>

                          <p className="text-[10px] sm:text-xs text-gray-500 mt-1 font-medium">
                            {item.product.condition}
                          </p>

                          {/* Price and Remove Button Row */}
                          <div className="flex items-center justify-between mt-auto pt-1.5">
                            <div className="flex flex-col">
                              <span className="text-[9px] sm:text-[10px] text-gray-500 uppercase tracking-wide font-semibold mb-0.5">
                                Unit Price
                              </span>
                              <p className="font-sans text-base sm:text-lg font-bold text-red-600 tabular-nums leading-none">
                                {formatPrice(item.product.price)}
                              </p>
                            </div>

                            {/* Remove Button - Mobile Visible */}
                            <button
                              onClick={() => removeItem(item.product.id)}
                              className="p-1.5 text-red-600 hover:text-red-700 hover:bg-red-50 rounded transition-colors"
                              aria-label="Remove item"
                            >
                              <Trash2 className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
                            </button>
                          </div>
                        </div>
                      </div>

                      {/* Quantity Controls and Total - Full Width Bottom Section */}
                      <div className="flex items-center justify-between mt-3 pt-3 border-t border-gray-200">
                        {/* Quantity Controls */}
                        <div className="flex items-center">
                          <span className="text-[10px] sm:text-xs text-gray-600 font-semibold mr-2 uppercase tracking-wide">
                            Qty:
                          </span>
                          <div className="flex items-center border border-gray-300 rounded-md bg-white">
                            <button
                              onClick={() =>
                                updateQuantity(item.product.id, item.quantity - 1)
                              }
                              disabled={item.quantity <= 1}
                              className="p-1 sm:p-1.5 hover:bg-gray-100 rounded-l-md transition-colors disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:bg-transparent"
                              aria-label="Decrease quantity"
                            >
                              <Minus className="h-3 w-3 sm:h-3.5 sm:w-3.5 text-gray-700" />
                            </button>
                            <span className="font-sans font-bold text-xs sm:text-sm text-gray-900 w-7 sm:w-8 text-center border-x border-gray-300 tabular-nums">
                              {item.quantity}
                            </span>
                            <button
                              onClick={() =>
                                updateQuantity(item.product.id, item.quantity + 1)
                              }
                              disabled={item.quantity >= item.product.stock}
                              className="p-1 sm:p-1.5 hover:bg-gray-100 rounded-r-md transition-colors disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:bg-transparent"
                              aria-label="Increase quantity"
                            >
                              <Plus className="h-3 w-3 sm:h-3.5 sm:w-3.5 text-gray-700" />
                            </button>
                          </div>
                        </div>

                        {/* Item Subtotal */}
                        <div className="text-right">
                          <p className="text-[9px] sm:text-[10px] text-gray-500 uppercase tracking-wide font-semibold mb-0.5">
                            Subtotal
                          </p>
                          <p className="font-sans text-base sm:text-lg font-extrabold text-red-600 tabular-nums leading-none">
                            {formatPrice(item.product.price * item.quantity)}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Footer with Total and Actions */}
          {items.length > 0 && (
            <div className="relative border-t border-white/10 bg-gradient-to-br from-[#0A1E3D] via-[#1E3A5F] to-[#0F2744] px-4 py-2.5 space-y-2">
              {/* Background Glow */}
              <div className="absolute inset-0 bg-gradient-to-r from-blue-600/10 via-amber-400/10 to-blue-600/10 opacity-50"></div>

              {/* Total */}
              <div className="relative flex items-center justify-between pb-2 border-b border-white/10">
                <div className="flex flex-col">
                  <span className="text-[10px] text-blue-200/70 uppercase tracking-wide font-semibold mb-0.5">
                    Order Total
                  </span>
                  <span className="font-sans text-xs text-white/80 tabular-nums">
                    {itemCount} {itemCount === 1 ? "item" : "items"}
                  </span>
                </div>
                <div className="text-right">
                  <span className="font-sans text-xl font-extrabold text-amber-400 tabular-nums leading-none drop-shadow-[0_2px_8px_rgba(251,191,36,0.4)]">
                    {formatPrice(total)}
                  </span>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="relative space-y-1.5">
                <Link href="/cart" onClick={onClose} className="block">
                  <Button className="w-full h-9 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-white font-semibold shadow-lg shadow-amber-500/20 hover:shadow-amber-500/30 transition-all duration-300 border-0 text-xs uppercase tracking-wide">
                    <Eye className="h-3.5 w-3.5 mr-1.5" />
                    View Full Cart
                  </Button>
                </Link>

                <Button
                  onClick={handleClearCart}
                  variant="outline"
                  className="w-full h-9 bg-white/10 hover:bg-red-500/20 border-2 border-white/20 hover:border-red-400/50 text-white hover:text-red-300 font-semibold transition-all duration-300 text-xs uppercase tracking-wide"
                >
                  <Trash2 className="h-3.5 w-3.5 mr-1.5" />
                  Clear Cart
                </Button>
              </div>

              {/* Continue Shopping Link */}
              <button
                onClick={onClose}
                className="relative w-full text-center text-xs text-blue-200/70 hover:text-white font-semibold transition-colors uppercase tracking-wide pt-1"
              >
                Continue Shopping
              </button>
            </div>
          )}
        </div>
      </SheetContent>
    </Sheet>
  );
}
