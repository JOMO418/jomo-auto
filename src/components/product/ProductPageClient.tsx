"use client";

import { useState } from "react";
import Link from "next/link";
import { ShoppingCart, Check, Package, Shield, Truck, ArrowLeft } from "lucide-react";
import type { ProductWithDetails, ProductWithCategory } from "@/lib/supabase";
import { useCartStore } from "@/lib/store";
import { PLACEHOLDER_IMAGE } from "@/lib/constants";
import { ProductCard } from "./ProductCard";
import { OptimizedImage } from "@/components/ui/optimized-image";

interface ProductPageClientProps {
  product: ProductWithDetails;
  relatedProducts: ProductWithCategory[];
}

export function ProductPageClient({ product, relatedProducts }: ProductPageClientProps) {
  const [selectedImage, setSelectedImage] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const addItem = useCartStore((state) => state.addItem);
  const [isAdding, setIsAdding] = useState(false);

  const handleAddToCart = () => {
    setIsAdding(true);
    // Convert to Product type for cart
    const cartProduct = {
      ...product,
      category: product.category.name,
      compatibility: product.compatibility.map(c => c.compatibility_string),
      original_price: product.original_price || undefined,
      origin: product.origin || "Japan",
      createdAt: product.created_at,
      updatedAt: product.updated_at,
    };
    addItem(cartProduct as any, quantity);
    setTimeout(() => setIsAdding(false), 1500);
  };

  const isOutOfStock = product.stock === 0;
  const images = product.images && product.images.length > 0 ? product.images : [PLACEHOLDER_IMAGE];

  return (
    <div className="min-h-screen bg-gray-50 overflow-x-hidden">
      {/* Breadcrumb */}
      <div className="bg-white border-b">
        <div className="container mx-auto px-3 sm:px-4 py-4 max-w-7xl">
          <Link
            href="/"
            className="inline-flex items-center text-sm text-gray-600 hover:text-blue-600 transition-colors"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Home
          </Link>
          <div className="flex items-center gap-2 text-sm text-gray-500 mt-2">
            <Link href="/" className="hover:text-blue-600">Home</Link>
            <span>/</span>
            <Link href={`/category/${product.category.slug}`} className="hover:text-blue-600">
              {product.category.name}
            </Link>
            <span>/</span>
            <span className="text-gray-900">{product.name}</span>
          </div>
        </div>
      </div>

      {/* Product Detail */}
      <div className="container mx-auto px-3 sm:px-4 py-8 max-w-7xl">
        <div className="grid md:grid-cols-2 gap-4 md:gap-6 lg:gap-8 bg-white rounded-lg shadow-lg p-4 sm:p-6 md:p-8">
          {/* OptimizedImage Gallery */}
          <div>
            {/* Main OptimizedImage */}
            <div className="relative aspect-square bg-gray-100 rounded-lg overflow-hidden mb-4">
              {isOutOfStock && (
                <div className="absolute inset-0 z-10 bg-black/60 backdrop-blur-sm flex items-center justify-center">
                  <span className="bg-white text-gray-900 font-bold px-6 py-2 rounded-full shadow-lg">
                    Out of Stock
                  </span>
                </div>
              )}
              <OptimizedImage
                src={images[selectedImage]}
                alt={product.name}
                fill
                className="object-cover"
                sizes="(max-width: 768px) 100vw, 50vw"
                priority
              />
            </div>

            {/* Thumbnail Gallery */}
            {images.length > 1 && (
              <div className="grid grid-cols-4 gap-1.5 sm:gap-2">
                {images.map((image, index) => (
                  <button
                    key={index}
                    onClick={() => setSelectedImage(index)}
                    className={`relative aspect-square bg-gray-100 rounded-lg overflow-hidden border-2 transition-all ${
                      selectedImage === index
                        ? "border-blue-600 ring-2 ring-blue-200"
                        : "border-gray-200 hover:border-gray-300"
                    }`}
                  >
                    <OptimizedImage
                      src={image}
                      alt={`${product.name} - ${index + 1}`}
                      fill
                      className="object-cover"
                      sizes="100px"
                    />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Product Info */}
          <div className="flex flex-col">
            <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-4">
              {product.name}
            </h1>

            {/* Category & Condition */}
            <div className="flex items-center gap-3 mb-4">
              <Link
                href={`/category/${product.category.slug}`}
                className="text-sm font-semibold text-blue-600 bg-blue-50 px-3 py-1 rounded-full hover:bg-blue-100 transition-colors"
              >
                {product.category.name}
              </Link>
              <span className="text-sm font-semibold text-gray-600 bg-gray-100 px-3 py-1 rounded-full">
                {product.condition}
              </span>
            </div>

            {/* Price */}
            <div className="mb-6">
              {product.original_price && product.original_price > product.price && (
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-lg text-gray-400 line-through">
                    KSh {product.original_price.toLocaleString()}
                  </span>
                  <span className="text-sm font-bold text-green-600 bg-green-50 px-2 py-0.5 rounded">
                    Save {Math.round(((product.original_price - product.price) / product.original_price) * 100)}%
                  </span>
                </div>
              )}
              <p className="text-3xl md:text-4xl font-bold text-red-600">
                KSh {product.price.toLocaleString()}
              </p>
            </div>

            {/* Description */}
            <p className="text-gray-600 mb-6 leading-relaxed">
              {product.description}
            </p>

            {/* Compatibility */}
            {product.compatibility && product.compatibility.length > 0 && (
              <div className="mb-6">
                <h3 className="text-sm font-semibold text-gray-900 mb-2">Compatible Vehicles:</h3>
                <div className="flex flex-wrap gap-2">
                  {product.compatibility.slice(0, 8).map((compat, index) => (
                    <span
                      key={index}
                      className="text-xs bg-gray-100 text-gray-700 px-3 py-1 rounded-full"
                    >
                      {compat.compatibility_string}
                    </span>
                  ))}
                  {product.compatibility.length > 8 && (
                    <span className="text-xs text-gray-500 px-3 py-1">
                      +{product.compatibility.length - 8} more
                    </span>
                  )}
                </div>
              </div>
            )}

            {/* Specs */}
            {product.specs && Object.keys(product.specs).length > 0 && (
              <div className="mb-6">
                <h3 className="text-sm font-semibold text-gray-900 mb-3">Specifications:</h3>
                <div className="bg-gray-50 rounded-lg p-4 space-y-2">
                  {Object.entries(product.specs).map(([key, value]) => (
                    <div key={key} className="flex justify-between text-sm">
                      <span className="text-gray-600">{key}:</span>
                      <span className="font-medium text-gray-900">{value}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Stock & Quantity */}
            <div className="mb-6">
              <div className="flex items-center justify-between mb-3">
                <span className="text-sm font-semibold text-gray-900">Quantity:</span>
                <span className={`text-sm font-medium ${product.stock > 0 ? 'text-green-600' : 'text-red-600'}`}>
                  {product.stock > 0 ? `${product.stock} in stock` : "Out of stock"}
                </span>
              </div>

              {/* Quantity Selector */}
              <div className="flex items-center gap-2 mb-4">
                <span className="text-sm text-gray-600">Select Quantity:</span>
                <div className="flex items-center border-2 border-gray-300 rounded-lg overflow-hidden">
                  <button
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    disabled={isOutOfStock}
                    className="px-4 py-2.5 bg-gray-50 hover:bg-gray-100 active:bg-gray-200 transition-colors disabled:opacity-40 disabled:cursor-not-allowed font-semibold text-gray-700"
                  >
                    −
                  </button>
                  <span className="px-6 py-2.5 font-bold text-gray-900 min-w-[60px] text-center bg-white">
                    {quantity}
                  </span>
                  <button
                    onClick={() => setQuantity(Math.min(product.stock, quantity + 1))}
                    disabled={isOutOfStock || quantity >= product.stock}
                    className="px-4 py-2.5 bg-gray-50 hover:bg-gray-100 active:bg-gray-200 transition-colors disabled:opacity-40 disabled:cursor-not-allowed font-semibold text-gray-700"
                  >
                    +
                  </button>
                </div>
              </div>

              {/* Add to Cart Button - Full Width */}
              <button
                onClick={handleAddToCart}
                disabled={isOutOfStock || isAdding}
                className={`
                  w-full py-4 px-6 rounded-xl font-bold text-lg text-white
                  transition-all duration-300 flex items-center justify-center gap-3
                  shadow-lg hover:shadow-xl transform hover:scale-[1.02] active:scale-[0.98]
                  ${
                    isOutOfStock
                      ? "bg-gray-400 cursor-not-allowed"
                      : isAdding
                      ? "bg-green-600 hover:bg-green-700"
                      : "bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-700 hover:to-blue-600"
                  }
                `}
              >
                {isAdding ? (
                  <>
                    <Check className="h-6 w-6" />
                    <span>Added to Cart!</span>
                  </>
                ) : (
                  <>
                    <ShoppingCart className="h-6 w-6" />
                    <span>{isOutOfStock ? "Out of Stock" : "Add to Cart"}</span>
                  </>
                )}
              </button>
            </div>

            {/* Features */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-6 border-t">
              <div className="flex items-center gap-3">
                <Shield className="h-5 w-5 text-blue-600" />
                <div>
                  <p className="text-xs font-semibold text-gray-900">Quality Assured</p>
                  <p className="text-xs text-gray-600">Genuine Parts</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <Truck className="h-5 w-5 text-blue-600" />
                <div>
                  <p className="text-xs font-semibold text-gray-900">Fast Delivery</p>
                  <p className="text-xs text-gray-600">Nairobi & Beyond</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <Package className="h-5 w-5 text-blue-600" />
                <div>
                  <p className="text-xs font-semibold text-gray-900">Secure Packaging</p>
                  <p className="text-xs text-gray-600">Safe Shipping</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Related Products */}
        {relatedProducts.length > 0 && (
          <div className="mt-8 md:mt-12">
            <h2 className="text-xl md:text-2xl font-bold text-gray-900 mb-4 md:mb-6">Related Products</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4">
              {relatedProducts.map((relatedProduct) => {
                const cartProduct = {
                  ...relatedProduct,
                  category: relatedProduct.category.name,
                  compatibility: [],
                  original_price: relatedProduct.original_price || undefined,
                  origin: relatedProduct.origin || "Japan",
                  createdAt: relatedProduct.created_at,
                  updatedAt: relatedProduct.updated_at,
                };
                return (
                  <ProductCard
                    key={relatedProduct.id}
                    product={cartProduct as any}
                    onAddToCart={(p) => addItem(p, 1)}
                  />
                );
              })}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
