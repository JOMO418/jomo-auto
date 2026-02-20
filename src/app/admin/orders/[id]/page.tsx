'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Image from 'next/image';
import {
  ArrowLeft,
  User,
  Phone,
  Mail,
  MapPin,
  CreditCard,
  Package,
  Loader2,
} from 'lucide-react';
import type { Order } from '@/lib/admin-db';
import { PLACEHOLDER_IMAGE } from '@/lib/constants';

const STATUS_STYLES: Record<string, string> = {
  pending: 'bg-amber-500/10 text-amber-400 border-amber-500/20',
  approved: 'bg-blue-500/10 text-blue-400 border-blue-500/20',
  dispatched: 'bg-purple-500/10 text-purple-400 border-purple-500/20',
  delivered: 'bg-green-500/10 text-green-400 border-green-500/20',
  cancelled: 'bg-red-500/10 text-red-400 border-red-500/20',
};

function formatPrice(n: number) {
  return `KSh ${n.toLocaleString()}`;
}

function formatDate(iso: string) {
  return new Date(iso).toLocaleString('en-KE', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
}

const STATUS_FLOW: Record<string, { label: string; next: Order['status'] }[]> = {
  pending: [
    { label: 'Approve', next: 'approved' },
    { label: 'Cancel', next: 'cancelled' },
  ],
  approved: [
    { label: 'Mark Dispatched', next: 'dispatched' },
    { label: 'Cancel', next: 'cancelled' },
  ],
  dispatched: [{ label: 'Mark Delivered', next: 'delivered' }],
  delivered: [],
  cancelled: [],
};

export default function OrderDetailPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);
  const [actioning, setActioning] = useState(false);

  useEffect(() => {
    fetch(`/api/admin/orders/${id}`)
      .then((r) => r.json())
      .then((d) => setOrder(d.order ?? null))
      .finally(() => setLoading(false));
  }, [id]);

  async function updateStatus(status: Order['status']) {
    if (!order) return;
    setActioning(true);
    await fetch(`/api/admin/orders/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status }),
    });
    setOrder((prev) => (prev ? { ...prev, status } : prev));
    setActioning(false);
  }

  async function markPaid() {
    if (!order) return;
    setActioning(true);
    await fetch(`/api/admin/orders/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ payment_status: 'paid' }),
    });
    setOrder((prev) => (prev ? { ...prev, payment_status: 'paid' } : prev));
    setActioning(false);
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="w-6 h-6 border-2 border-[#E8002D] border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!order) {
    return (
      <div className="text-center py-20">
        <p className="text-zinc-400">Order not found.</p>
        <button onClick={() => router.back()} className="mt-4 text-[#E8002D] text-sm hover:underline">
          Go back
        </button>
      </div>
    );
  }

  const actions = STATUS_FLOW[order.status] ?? [];

  return (
    <div className="max-w-3xl mx-auto space-y-5">
      {/* Header */}
      <div className="flex items-center gap-3">
        <button
          onClick={() => router.back()}
          className="p-2 rounded-lg text-zinc-400 hover:text-white hover:bg-white/10 transition-colors"
        >
          <ArrowLeft className="h-4 w-4" />
        </button>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <h1 className="text-xl font-bold text-white">Order Details</h1>
            <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium border ${STATUS_STYLES[order.status] ?? STATUS_STYLES.pending}`}>
              {order.status}
            </span>
          </div>
          <p className="text-zinc-500 text-xs mt-0.5">#{order.id} · {formatDate(order.created_at)}</p>
        </div>
      </div>

      {/* Status Actions */}
      {actions.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {actions.map((a) => (
            <button
              key={a.next}
              onClick={() => updateStatus(a.next)}
              disabled={actioning}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors disabled:opacity-50 ${
                a.next === 'cancelled'
                  ? 'bg-red-950/40 text-red-400 border border-red-900/40 hover:bg-red-950/60'
                  : 'bg-[#E8002D] text-white hover:bg-[#c5001f]'
              }`}
            >
              {actioning && <Loader2 className="h-3.5 w-3.5 animate-spin" />}
              {a.label}
            </button>
          ))}
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Customer Info */}
        <div className="bg-[#141414] border border-white/[0.08] rounded-xl p-4 space-y-3">
          <h2 className="text-white font-semibold text-sm flex items-center gap-2">
            <User className="h-4 w-4 text-zinc-500" /> Customer
          </h2>
          <div className="space-y-2">
            <p className="text-white font-medium">{order.customer_name}</p>
            {order.customer_phone && (
              <div className="flex items-center gap-2 text-zinc-400 text-sm">
                <Phone className="h-3.5 w-3.5 text-zinc-600 flex-shrink-0" />
                {order.customer_phone}
              </div>
            )}
            {order.customer_email && (
              <div className="flex items-center gap-2 text-zinc-400 text-sm">
                <Mail className="h-3.5 w-3.5 text-zinc-600 flex-shrink-0" />
                {order.customer_email}
              </div>
            )}
            {order.customer_address && (
              <div className="flex items-start gap-2 text-zinc-400 text-sm">
                <MapPin className="h-3.5 w-3.5 text-zinc-600 flex-shrink-0 mt-0.5" />
                {order.customer_address}
              </div>
            )}
          </div>
        </div>

        {/* Payment Info */}
        <div className="bg-[#141414] border border-white/[0.08] rounded-xl p-4 space-y-3">
          <h2 className="text-white font-semibold text-sm flex items-center gap-2">
            <CreditCard className="h-4 w-4 text-zinc-500" /> Payment
          </h2>
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-zinc-400 text-sm">Status</span>
              <span className={`text-sm font-medium capitalize ${
                order.payment_status === 'paid' ? 'text-green-400' :
                order.payment_status === 'failed' ? 'text-red-400' : 'text-amber-400'
              }`}>
                {order.payment_status}
              </span>
            </div>
            {order.payment_method && (
              <div className="flex items-center justify-between">
                <span className="text-zinc-400 text-sm">Method</span>
                <span className="text-white text-sm capitalize">{order.payment_method}</span>
              </div>
            )}
            {order.mpesa_code && (
              <div className="flex items-center justify-between">
                <span className="text-zinc-400 text-sm">M-Pesa Code</span>
                <span className="text-white text-sm font-mono">{order.mpesa_code}</span>
              </div>
            )}
            <div className="flex items-center justify-between pt-1 border-t border-white/[0.08]">
              <span className="text-zinc-400 text-sm font-medium">Total</span>
              <span className="text-white font-bold">{formatPrice(order.total)}</span>
            </div>
            {order.payment_status !== 'paid' && (
              <button
                onClick={markPaid}
                disabled={actioning}
                className="w-full mt-1 py-2 bg-green-500/10 text-green-400 border border-green-500/20 rounded-lg text-sm font-medium hover:bg-green-500/20 transition-colors disabled:opacity-50"
              >
                Mark as Paid
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Order Items */}
      <div className="bg-[#141414] border border-white/[0.08] rounded-xl overflow-hidden">
        <div className="px-4 py-3 border-b border-white/[0.08] flex items-center gap-2">
          <Package className="h-4 w-4 text-zinc-500" />
          <h2 className="text-white font-semibold text-sm">
            Items ({order.items?.length ?? 0})
          </h2>
        </div>

        {!order.items?.length ? (
          <div className="px-4 py-8 text-center">
            <p className="text-zinc-500 text-sm">No items found for this order.</p>
          </div>
        ) : (
          <div className="divide-y divide-white/[0.05]">
            {order.items.map((item) => (
              <div key={item.id} className="flex items-center gap-3 px-4 py-3">
                <div className="relative w-12 h-12 rounded-lg overflow-hidden bg-white/5 flex-shrink-0">
                  <Image
                    src={item.product_image ?? PLACEHOLDER_IMAGE}
                    alt={item.product_name}
                    fill
                    className="object-cover"
                  />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-white text-sm font-medium line-clamp-1">{item.product_name}</p>
                  <p className="text-zinc-500 text-xs mt-0.5">
                    {formatPrice(item.unit_price)} × {item.quantity}
                  </p>
                </div>
                <p className="text-white text-sm font-semibold flex-shrink-0">
                  {formatPrice(item.total_price)}
                </p>
              </div>
            ))}
            <div className="flex items-center justify-between px-4 py-3 bg-white/[0.02]">
              <span className="text-zinc-400 text-sm font-medium">Order Total</span>
              <span className="text-white font-bold text-lg">{formatPrice(order.total)}</span>
            </div>
          </div>
        )}
      </div>

      {/* Notes */}
      {order.notes && (
        <div className="bg-[#141414] border border-white/[0.08] rounded-xl p-4">
          <h2 className="text-white font-semibold text-sm mb-2">Notes</h2>
          <p className="text-zinc-400 text-sm">{order.notes}</p>
        </div>
      )}
    </div>
  );
}
