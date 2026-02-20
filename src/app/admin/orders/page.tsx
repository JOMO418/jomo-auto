'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { ShoppingCart, ChevronRight, Search } from 'lucide-react';
import type { Order } from '@/lib/admin-db';

const TABS = ['all', 'pending', 'approved', 'dispatched', 'delivered', 'cancelled'] as const;

const STATUS_STYLES: Record<string, string> = {
  pending: 'bg-amber-500/10 text-amber-400 border-amber-500/20',
  approved: 'bg-blue-500/10 text-blue-400 border-blue-500/20',
  dispatched: 'bg-purple-500/10 text-purple-400 border-purple-500/20',
  delivered: 'bg-green-500/10 text-green-400 border-green-500/20',
  cancelled: 'bg-red-500/10 text-red-400 border-red-500/20',
};

const PAYMENT_STYLES: Record<string, string> = {
  paid: 'text-green-400',
  pending: 'text-amber-400',
  failed: 'text-red-400',
};

function formatPrice(n: number) {
  return `KSh ${n.toLocaleString()}`;
}

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString('en-KE', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  });
}

export default function OrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<string>('all');
  const [search, setSearch] = useState('');
  const [actioning, setActioning] = useState<string | null>(null);

  useEffect(() => {
    setLoading(true);
    fetch(`/api/admin/orders?status=${activeTab}`)
      .then((r) => r.json())
      .then((d) => setOrders(d.orders ?? []))
      .finally(() => setLoading(false));
  }, [activeTab]);

  async function updateStatus(orderId: string, status: Order['status']) {
    setActioning(orderId);
    await fetch(`/api/admin/orders/${orderId}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status }),
    });
    setOrders((prev) =>
      prev.map((o) => (o.id === orderId ? { ...o, status } : o))
    );
    setActioning(null);
  }

  const filtered = orders.filter(
    (o) =>
      o.customer_name.toLowerCase().includes(search.toLowerCase()) ||
      o.id.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-4 md:space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-xl md:text-2xl font-bold text-white">Orders</h1>
        <p className="text-zinc-500 text-sm mt-0.5">{orders.length} orders</p>
      </div>

      {/* Status Tabs — scrollable on mobile */}
      <div className="flex overflow-x-auto gap-1 pb-1 -mx-4 px-4 md:mx-0 md:px-0 no-scrollbar">
        {TABS.map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`flex-shrink-0 px-3 py-1.5 rounded-lg text-xs font-medium capitalize transition-colors ${
              activeTab === tab
                ? 'bg-[#E8002D] text-white'
                : 'bg-[#141414] text-zinc-400 border border-white/[0.08] hover:text-white'
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Search */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-500" />
        <input
          type="text"
          placeholder="Search by customer or order ID..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full bg-[#141414] border border-white/[0.08] rounded-lg pl-9 pr-4 py-2.5 text-white text-sm placeholder-zinc-600 focus:outline-none focus:border-[#E8002D] transition-colors"
        />
      </div>

      {/* Orders List */}
      <div className="bg-[#141414] border border-white/[0.08] rounded-xl overflow-hidden">
        {loading ? (
          <div className="flex items-center justify-center py-20">
            <div className="w-6 h-6 border-2 border-[#E8002D] border-t-transparent rounded-full animate-spin" />
          </div>
        ) : filtered.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 text-center px-4">
            <ShoppingCart className="h-10 w-10 text-zinc-700 mb-3" />
            <p className="text-zinc-400 font-medium">No orders found</p>
          </div>
        ) : (
          <>
            {/* Desktop table */}
            <div className="hidden md:block overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-white/[0.08]">
                    {['Customer', 'Amount', 'Status', 'Payment', 'Date', 'Actions'].map((h) => (
                      <th key={h} className="text-left px-4 py-3 text-xs font-medium text-zinc-500 uppercase tracking-wider">
                        {h}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/[0.05]">
                  {filtered.map((order) => (
                    <tr key={order.id} className="hover:bg-white/[0.02] transition-colors">
                      <td className="px-4 py-3">
                        <Link href={`/admin/orders/${order.id}`} className="group">
                          <p className="text-white text-sm font-medium group-hover:text-[#E8002D] transition-colors">
                            {order.customer_name}
                          </p>
                          <p className="text-zinc-600 text-xs mt-0.5">#{order.id.slice(0, 8)}</p>
                        </Link>
                      </td>
                      <td className="px-4 py-3 text-white text-sm font-semibold">
                        {formatPrice(order.total)}
                      </td>
                      <td className="px-4 py-3">
                        <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium border ${STATUS_STYLES[order.status] ?? STATUS_STYLES.pending}`}>
                          {order.status}
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        <span className={`text-xs font-medium capitalize ${PAYMENT_STYLES[order.payment_status] ?? 'text-zinc-400'}`}>
                          {order.payment_status}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-zinc-400 text-xs">
                        {formatDate(order.created_at)}
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-2">
                          {order.status === 'pending' && (
                            <button
                              onClick={() => updateStatus(order.id, 'approved')}
                              disabled={actioning === order.id}
                              className="px-2.5 py-1 bg-blue-500/10 text-blue-400 border border-blue-500/20 rounded-lg text-xs font-medium hover:bg-blue-500/20 transition-colors disabled:opacity-50"
                            >
                              Approve
                            </button>
                          )}
                          {order.status === 'approved' && (
                            <button
                              onClick={() => updateStatus(order.id, 'dispatched')}
                              disabled={actioning === order.id}
                              className="px-2.5 py-1 bg-purple-500/10 text-purple-400 border border-purple-500/20 rounded-lg text-xs font-medium hover:bg-purple-500/20 transition-colors disabled:opacity-50"
                            >
                              Dispatch
                            </button>
                          )}
                          <Link href={`/admin/orders/${order.id}`} className="p-1.5 text-zinc-500 hover:text-white rounded-lg hover:bg-white/10 transition-colors">
                            <ChevronRight className="h-4 w-4" />
                          </Link>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Mobile cards */}
            <div className="md:hidden divide-y divide-white/[0.05]">
              {filtered.map((order) => (
                <Link key={order.id} href={`/admin/orders/${order.id}`} className="flex items-center gap-3 px-4 py-3 hover:bg-white/[0.03] transition-colors">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-2">
                      <p className="text-white text-sm font-medium truncate">{order.customer_name}</p>
                      <p className="text-white text-sm font-bold flex-shrink-0">{formatPrice(order.total)}</p>
                    </div>
                    <div className="flex items-center gap-2 mt-1.5 flex-wrap">
                      <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium border ${STATUS_STYLES[order.status] ?? STATUS_STYLES.pending}`}>
                        {order.status}
                      </span>
                      <span className={`text-xs font-medium ${PAYMENT_STYLES[order.payment_status] ?? 'text-zinc-400'}`}>
                        {order.payment_status}
                      </span>
                      <span className="text-zinc-600 text-xs">{formatDate(order.created_at)}</span>
                    </div>
                  </div>
                  <ChevronRight className="h-4 w-4 text-zinc-600 flex-shrink-0" />
                </Link>
              ))}
            </div>
          </>
        )}
      </div>

      <style jsx global>{`
        .no-scrollbar::-webkit-scrollbar { display: none; }
        .no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
      `}</style>
    </div>
  );
}
