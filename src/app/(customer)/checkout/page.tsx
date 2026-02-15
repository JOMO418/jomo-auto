"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { useCartStore } from "@/lib/store";
import { formatPrice } from "@/lib/utils";
import { CONTACT_INFO, PLACEHOLDER_IMAGE } from "@/lib/constants";

export default function CheckoutPage() {
  const router = useRouter();
  const [mounted, setMounted] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    email: "",
    address: "",
  });
  const [paymentMethod, setPaymentMethod] = useState<"mpesa" | "whatsapp">("mpesa");
  const [submitted, setSubmitted] = useState(false);

  const items = useCartStore((state) => state.items);
  const getTotalPrice = useCartStore((state) => state.getTotalPrice);
  const clearCart = useCartStore((state) => state.clearCart);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (mounted && items.length === 0 && !submitted) {
      router.push("/cart");
    }
  }, [items.length, router, mounted, submitted]);

  if (!mounted) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <p className="text-gray-500">Loading...</p>
      </div>
    );
  }

  if (items.length === 0 && !submitted) {
    return null;
  }

  const total = getTotalPrice();

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (paymentMethod === "whatsapp") {
      // Generate WhatsApp message
      const orderItems = items
        .map(
          (item) =>
            `- ${item.product.name} (Qty: ${item.quantity}) - ${formatPrice(
              item.product.price * item.quantity
            )}`
        )
        .join("\n");

      const message = `Hello JOMO AUTO WORLD,

I would like to place an order:

*Customer Details:*
Name: ${formData.name}
Phone: ${formData.phone}
Email: ${formData.email}
Delivery Address: ${formData.address}

*Order Items:*
${orderItems}

*Total: ${formatPrice(total)}*

Please confirm availability and delivery details.`;

      const whatsappUrl = `https://wa.me/${CONTACT_INFO.whatsapp.replace(
        /[^0-9]/g,
        ""
      )}?text=${encodeURIComponent(message)}`;

      window.open(whatsappUrl, "_blank");
    }

    setSubmitted(true);
    clearCart();
  };

  const isFormValid =
    formData.name && formData.phone && formData.email && formData.address;

  if (submitted) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="bg-white rounded-lg shadow-lg p-8 max-w-md text-center">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg
              className="w-8 h-8 text-green-600"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M5 13l4 4L19 7"
              />
            </svg>
          </div>
          <h2 className="text-2xl font-bold mb-2">Order Submitted!</h2>
          <p className="text-gray-600 mb-6">
            Thank you for your order. We'll contact you shortly to confirm availability
            and delivery details.
          </p>
          <Button onClick={() => router.push("/")} className="w-full">
            Continue Shopping
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 overflow-x-hidden">
      <div className="container mx-auto px-3 sm:px-4 py-6 max-w-7xl">
        <h1 className="text-3xl font-bold mb-6">Checkout</h1>

        <form onSubmit={handleSubmit}>
          <div className="grid lg:grid-cols-3 gap-4 md:gap-6 lg:gap-8">
            {/* Customer Info Form */}
            <div className="lg:col-span-2 space-y-6">
              <div className="bg-white rounded-lg shadow-sm p-6">
                <h2 className="text-xl font-bold mb-4">Customer Information</h2>
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">
                      Full Name <span className="text-red-500">*</span>
                    </label>
                    <Input
                      name="name"
                      value={formData.name}
                      onChange={handleInputChange}
                      required
                      placeholder="John Doe"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">
                      Phone Number <span className="text-red-500">*</span>
                    </label>
                    <Input
                      name="phone"
                      type="tel"
                      value={formData.phone}
                      onChange={handleInputChange}
                      required
                      placeholder="+254 712 345 678"
                    />
                  </div>
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium mb-2">
                      Email <span className="text-red-500">*</span>
                    </label>
                    <Input
                      name="email"
                      type="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      required
                      placeholder="john@example.com"
                    />
                  </div>
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium mb-2">
                      Delivery Address <span className="text-red-500">*</span>
                    </label>
                    <Input
                      name="address"
                      value={formData.address}
                      onChange={handleInputChange}
                      required
                      placeholder="Street, City, Kenya"
                    />
                  </div>
                </div>
              </div>

              {/* Payment Method */}
              <div className="bg-white rounded-lg shadow-sm p-6">
                <h2 className="text-xl font-bold mb-4">Payment Method</h2>
                <div className="space-y-3">
                  <div
                    onClick={() => setPaymentMethod("mpesa")}
                    className={`border-2 rounded-lg p-4 cursor-pointer transition-all ${
                      paymentMethod === "mpesa"
                        ? "border-blue-700 bg-blue-50"
                        : "border-gray-200 hover:border-gray-300"
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <input
                        type="radio"
                        name="payment"
                        value="mpesa"
                        checked={paymentMethod === "mpesa"}
                        onChange={(e) => setPaymentMethod("mpesa")}
                        className="h-4 w-4"
                      />
                      <div className="flex-1">
                        <p className="font-semibold">M-Pesa Payment</p>
                        <p className="text-sm text-gray-600">
                          Pay via M-Pesa till number
                        </p>
                      </div>
                    </div>
                    {paymentMethod === "mpesa" && (
                      <div className="mt-4 p-4 bg-white rounded border">
                        <p className="font-semibold mb-2">Payment Instructions:</p>
                        <ol className="text-sm space-y-1 list-decimal list-inside text-gray-700">
                          <li>Go to M-Pesa menu</li>
                          <li>Select Lipa na M-Pesa</li>
                          <li>Select Buy Goods and Services</li>
                          <li>
                            Enter Till Number:{" "}
                            <span className="font-bold">{CONTACT_INFO.mpesaTill}</span>
                          </li>
                          <li>
                            Enter Amount:{" "}
                            <span className="font-bold">{formatPrice(total)}</span>
                          </li>
                          <li>Enter your M-Pesa PIN</li>
                          <li>
                            Take a screenshot of the confirmation message and send to
                            our WhatsApp: {CONTACT_INFO.whatsapp}
                          </li>
                        </ol>
                      </div>
                    )}
                  </div>

                  <div
                    onClick={() => setPaymentMethod("whatsapp")}
                    className={`border-2 rounded-lg p-4 cursor-pointer transition-all ${
                      paymentMethod === "whatsapp"
                        ? "border-blue-700 bg-blue-50"
                        : "border-gray-200 hover:border-gray-300"
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <input
                        type="radio"
                        name="payment"
                        value="whatsapp"
                        checked={paymentMethod === "whatsapp"}
                        onChange={(e) => setPaymentMethod("whatsapp")}
                        className="h-4 w-4"
                      />
                      <div className="flex-1">
                        <p className="font-semibold">Order via WhatsApp</p>
                        <p className="text-sm text-gray-600">
                          Send order details to WhatsApp and arrange payment
                        </p>
                      </div>
                    </div>
                    {paymentMethod === "whatsapp" && (
                      <div className="mt-4 p-4 bg-white rounded border">
                        <p className="text-sm text-gray-700">
                          Click "Submit Order" to send your order details via WhatsApp.
                          We'll confirm availability and arrange payment.
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Order Summary */}
            <div className="lg:col-span-1">
              <div className="bg-white rounded-lg shadow-sm p-6 sticky top-28">
                <h2 className="text-xl font-bold mb-4">Order Summary</h2>

                <div className="space-y-3 mb-4 max-h-64 overflow-y-auto">
                  {items.map((item) => (
                    <div key={item.product.id} className="flex gap-3">
                      <div className="relative w-16 h-16 flex-shrink-0 bg-gray-100 rounded overflow-hidden">
                        <Image
                          src={item.product.images[0] || PLACEHOLDER_IMAGE}
                          alt={item.product.name}
                          fill
                          className="object-cover"
                        />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium line-clamp-2">
                          {item.product.name}
                        </p>
                        <p className="text-xs text-gray-600">
                          Qty: {item.quantity}
                        </p>
                        <p className="text-sm font-semibold text-red-500">
                          {formatPrice(item.product.price * item.quantity)}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>

                <Separator className="my-4" />

                <div className="space-y-2 mb-6">
                  <div className="flex justify-between text-gray-600">
                    <span>Subtotal</span>
                    <span className="font-semibold">{formatPrice(total)}</span>
                  </div>
                  <div className="flex justify-between text-gray-600">
                    <span>Shipping</span>
                    <span className="text-sm">TBD</span>
                  </div>

                  <Separator />

                  <div className="flex justify-between text-lg font-bold">
                    <span>Total</span>
                    <span className="text-red-500">{formatPrice(total)}</span>
                  </div>
                </div>

                <Button
                  type="submit"
                  disabled={!isFormValid}
                  className="w-full h-12 text-lg bg-red-500 hover:bg-red-600"
                >
                  Submit Order
                </Button>
              </div>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
