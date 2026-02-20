import Link from 'next/link';
import {
  Package,
  ShoppingCart,
  TrendingUp,
  AlertTriangle,
  Plus,
  Users,
  Clock,
  ArrowRight,
  ArrowUpRight,
} from 'lucide-react';
import { getDashboardStats } from '@/lib/admin-db';

function formatPrice(n: number) {
  return `KSh ${n.toLocaleString()}`;
}

function formatTime(iso: string) {
  const d = new Date(iso);
  const now = new Date();
  const diffMs = now.getTime() - d.getTime();
  const diffMins = Math.floor(diffMs / 60000);
  if (diffMins < 1) return 'just now';
  if (diffMins < 60) return `${diffMins}m ago`;
  const diffHours = Math.floor(diffMins / 60);
  if (diffHours < 24) return `${diffHours}h ago`;
  return d.toLocaleDateString('en-KE', { day: 'numeric', month: 'short' });
}

const STATUS_CONFIG: Record<string, { bg: string; text: string; dot: string }> = {
  pending:    { bg: 'bg-amber-500/15',   text: 'text-amber-300',   dot: 'bg-amber-400' },
  approved:   { bg: 'bg-blue-500/15',    text: 'text-blue-300',    dot: 'bg-blue-400' },
  dispatched: { bg: 'bg-purple-500/15',  text: 'text-purple-300',  dot: 'bg-purple-400' },
  delivered:  { bg: 'bg-emerald-500/15', text: 'text-emerald-300', dot: 'bg-emerald-400' },
  cancelled:  { bg: 'bg-red-500/15',     text: 'text-red-300',     dot: 'bg-red-400' },
};

export default async function AdminDashboard() {
  const stats = await getDashboardStats();

  const today = new Date().toLocaleDateString('en-KE', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  const kpiCards = [
    {
      label: 'Total Products',
      value: stats.totalProducts,
      description: 'Listed in store',
      icon: Package,
      accentColor: '#3B82F6',
      iconBg: 'bg-blue-500',
      hoverBorder: 'hover:border-blue-500/40',
      hoverShadow: 'hover:shadow-blue-500/20',
      href: '/admin/products',
    },
    {
      label: 'Orders Today',
      value: stats.ordersToday,
      description: 'New orders placed',
      icon: ShoppingCart,
      accentColor: '#A855F7',
      iconBg: 'bg-purple-500',
      hoverBorder: 'hover:border-purple-500/40',
      hoverShadow: 'hover:shadow-purple-500/20',
      href: '/admin/orders',
    },
    {
      label: 'Revenue Today',
      value: formatPrice(stats.revenueToday),
      description: 'Total earnings',
      icon: TrendingUp,
      accentColor: '#10B981',
      iconBg: 'bg-emerald-500',
      hoverBorder: 'hover:border-emerald-500/40',
      hoverShadow: 'hover:shadow-emerald-500/20',
      href: '/admin/analytics',
    },
    {
      label: 'Low Stock',
      value: stats.lowStockCount,
      description: 'Need restocking',
      icon: AlertTriangle,
      accentColor: '#F59E0B',
      iconBg: 'bg-amber-500',
      hoverBorder: 'hover:border-amber-500/40',
      hoverShadow: 'hover:shadow-amber-500/20',
      href: '/admin/inventory',
    },
  ];

  return (
    <div className="space-y-7 md:space-y-8">

      {/* ── Page Header ── */}
      <div className="flex items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-white tracking-tight">Overview</h1>
          <p className="text-zinc-500 text-sm mt-1">{today}</p>
        </div>
        <Link
          href="/admin/products/new"
          className="flex items-center gap-2 bg-[#E8002D] hover:bg-[#c4001f] text-white text-sm font-semibold px-4 py-2.5 rounded-xl transition-colors flex-shrink-0 shadow-lg shadow-red-600/20"
        >
          <Plus className="h-4 w-4" />
          <span className="hidden sm:inline">Add Product</span>
        </Link>
      </div>

      {/* ── KPI Cards ── */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {kpiCards.map((card) => {
          const Icon = card.icon;
          return (
            <Link
              key={card.label}
              href={card.href}
              className={`relative bg-[#161616] border border-white/10 rounded-2xl p-5 transition-all duration-200 group overflow-hidden ${card.hoverBorder} hover:shadow-xl ${card.hoverShadow}`}
            >
              {/* Coloured top accent bar */}
              <div
                className="absolute inset-x-0 top-0 h-[3px] rounded-t-2xl"
                style={{ backgroundColor: card.accentColor }}
              />

              {/* Subtle coloured glow behind icon area */}
              <div
                className="absolute top-0 right-0 w-24 h-24 rounded-full opacity-[0.07] blur-2xl -translate-y-1/2 translate-x-1/3"
                style={{ backgroundColor: card.accentColor }}
              />

              <div className="flex items-start justify-between mb-5">
                <div
                  className={`w-11 h-11 rounded-xl ${card.iconBg} flex items-center justify-center flex-shrink-0 shadow-lg`}
                >
                  <Icon className="h-5 w-5 text-white" />
                </div>
                <ArrowUpRight className="h-4 w-4 text-zinc-600 group-hover:text-zinc-300 transition-colors mt-0.5" />
              </div>

              <p className="text-[2rem] md:text-[2.25rem] font-extrabold text-white leading-none tracking-tight">
                {card.value}
              </p>
              <p className="text-zinc-200 text-sm font-semibold mt-2">{card.label}</p>
              <p className="text-zinc-500 text-xs mt-0.5">{card.description}</p>
            </Link>
          );
        })}
      </div>

      {/* ── Quick Actions ── */}
      <div>
        <p className="text-xs font-semibold text-zinc-500 uppercase tracking-widest mb-3">
          Quick Actions
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <Link
            href="/admin/products/new"
            className="flex items-center gap-3 bg-[#E8002D]/10 border border-[#E8002D]/25 hover:bg-[#E8002D]/20 hover:border-[#E8002D]/50 rounded-xl px-4 py-4 transition-all group"
          >
            <div className="w-10 h-10 rounded-xl bg-[#E8002D] flex items-center justify-center flex-shrink-0 shadow-lg shadow-red-600/20">
              <Plus className="h-5 w-5 text-white" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-white text-sm font-bold">Add Product</p>
              <p className="text-zinc-500 text-xs mt-0.5">Create new listing</p>
            </div>
            <ArrowRight className="h-4 w-4 text-zinc-500 group-hover:text-white transition-colors" />
          </Link>

          <Link
            href="/admin/orders"
            className="flex items-center gap-3 bg-[#161616] border border-white/10 hover:border-purple-500/30 hover:bg-purple-500/5 rounded-xl px-4 py-4 transition-all group"
          >
            <div className="w-10 h-10 rounded-xl bg-purple-500 flex items-center justify-center flex-shrink-0 shadow-lg shadow-purple-500/20">
              <ShoppingCart className="h-5 w-5 text-white" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-white text-sm font-bold">View Orders</p>
              <p className="text-zinc-500 text-xs mt-0.5">Manage all orders</p>
            </div>
            <ArrowRight className="h-4 w-4 text-zinc-500 group-hover:text-white transition-colors" />
          </Link>

          <Link
            href="/admin/customers"
            className="flex items-center gap-3 bg-[#161616] border border-white/10 hover:border-blue-500/30 hover:bg-blue-500/5 rounded-xl px-4 py-4 transition-all group"
          >
            <div className="w-10 h-10 rounded-xl bg-blue-500 flex items-center justify-center flex-shrink-0 shadow-lg shadow-blue-500/20">
              <Users className="h-5 w-5 text-white" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-white text-sm font-bold">Customers</p>
              <p className="text-zinc-500 text-xs mt-0.5">View all customers</p>
            </div>
            <ArrowRight className="h-4 w-4 text-zinc-500 group-hover:text-white transition-colors" />
          </Link>
        </div>
      </div>

      {/* ── Recent Orders ── */}
      <div className="bg-[#161616] border border-white/10 rounded-2xl overflow-hidden">
        <div className="flex items-center justify-between px-5 md:px-6 py-4 border-b border-white/[0.07]">
          <div className="flex items-center gap-2.5">
            <span className="w-2 h-2 rounded-full bg-[#E8002D] animate-pulse" />
            <h2 className="text-white font-bold text-sm">Recent Orders</h2>
          </div>
          <Link
            href="/admin/orders"
            className="text-xs text-zinc-500 hover:text-[#E8002D] transition-colors flex items-center gap-1 font-medium"
          >
            View all <ArrowRight className="h-3 w-3" />
          </Link>
        </div>

        {stats.recentOrders.length === 0 ? (
          <div className="px-6 py-14 text-center">
            <div className="w-14 h-14 rounded-2xl bg-white/5 flex items-center justify-center mx-auto mb-3">
              <ShoppingCart className="h-7 w-7 text-zinc-600" />
            </div>
            <p className="text-zinc-300 text-sm font-semibold">No orders yet</p>
            <p className="text-zinc-600 text-xs mt-1">
              Orders will appear here once customers place them.
            </p>
          </div>
        ) : (
          <div className="divide-y divide-white/[0.05]">
            {stats.recentOrders.map((order: {
              id: string;
              customer_name: string;
              total: number;
              status: string;
              payment_status: string;
              created_at: string;
            }) => {
              const statusCfg = STATUS_CONFIG[order.status] ?? STATUS_CONFIG.pending;
              return (
                <Link
                  key={order.id}
                  href={`/admin/orders/${order.id}`}
                  className="flex items-center gap-3 md:gap-4 px-5 md:px-6 py-4 hover:bg-white/[0.03] transition-colors group"
                >
                  {/* Avatar */}
                  <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-zinc-700 to-zinc-800 border border-white/10 flex items-center justify-center flex-shrink-0">
                    <span className="text-zinc-100 text-sm font-bold uppercase">
                      {order.customer_name?.[0] ?? '?'}
                    </span>
                  </div>

                  {/* Name + time */}
                  <div className="flex-1 min-w-0">
                    <p className="text-white text-sm font-semibold truncate">
                      {order.customer_name}
                    </p>
                    <p className="text-zinc-500 text-xs flex items-center gap-1 mt-0.5">
                      <Clock className="h-3 w-3" />
                      {formatTime(order.created_at)}
                    </p>
                  </div>

                  {/* Amount */}
                  <p className="text-white text-sm font-bold flex-shrink-0">
                    {formatPrice(order.total)}
                  </p>

                  {/* Status badge with dot */}
                  <span
                    className={`hidden sm:inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold flex-shrink-0 ${statusCfg.bg} ${statusCfg.text}`}
                  >
                    <span className={`w-1.5 h-1.5 rounded-full ${statusCfg.dot} flex-shrink-0`} />
                    {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                  </span>
                </Link>
              );
            })}
          </div>
        )}
      </div>

    </div>
  );
}
