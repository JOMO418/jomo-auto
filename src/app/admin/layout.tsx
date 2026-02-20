'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useState } from 'react';
import {
  LayoutDashboard,
  Package,
  ShoppingCart,
  CreditCard,
  Users,
  BarChart3,
  Layers,
  ExternalLink,
  LogOut,
  Menu,
  X,
  ChevronRight,
  Shield,
  Car,
} from 'lucide-react';
import { cn } from '@/lib/utils';

const NAV_ITEMS = [
  { href: '/admin', label: 'Overview', icon: LayoutDashboard, exact: true },
  { href: '/admin/products', label: 'Products', icon: Package },
  { href: '/admin/vehicles-categories', label: 'Vehicles & Categories', icon: Car },
  { href: '/admin/orders', label: 'Orders', icon: ShoppingCart },
  { href: '/admin/payments', label: 'Payments', icon: CreditCard },
  { href: '/admin/customers', label: 'Customers', icon: Users },
  { href: '/admin/analytics', label: 'Analytics', icon: BarChart3 },
  { href: '/admin/inventory', label: 'Inventory', icon: Layers },
];

function NavLink({
  href,
  label,
  icon: Icon,
  exact,
  onClick,
}: {
  href: string;
  label: string;
  icon: React.ElementType;
  exact?: boolean;
  onClick?: () => void;
}) {
  const pathname = usePathname();
  const isActive = exact ? pathname === href : pathname.startsWith(href);

  return (
    <Link
      href={href}
      onClick={onClick}
      className={cn(
        'flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-150 group relative',
        isActive
          ? 'bg-[#E8002D]/10 text-[#E8002D] border-l-2 border-[#E8002D] pl-[10px]'
          : 'text-zinc-400 hover:text-white hover:bg-white/5 border-l-2 border-transparent'
      )}
    >
      <Icon
        className={cn(
          'h-4 w-4 flex-shrink-0',
          isActive ? 'text-[#E8002D]' : 'text-zinc-500 group-hover:text-white'
        )}
      />
      <span>{label}</span>
      {isActive && <ChevronRight className="ml-auto h-3 w-3 text-[#E8002D]/60" />}
    </Link>
  );
}

function SidebarContent({ onClose }: { onClose?: () => void }) {
  const router = useRouter();

  async function handleLogout() {
    await fetch('/api/admin/logout', { method: 'POST' });
    router.push('/');
    router.refresh();
  }

  return (
    <div className="flex flex-col h-full">
      {/* Brand */}
      <div className="px-4 py-5 border-b border-white/[0.08]">
        <div className="flex items-center gap-2.5">
          <div className="w-7 h-7 rounded-lg bg-[#E8002D] flex items-center justify-center flex-shrink-0">
            <Shield className="h-4 w-4 text-white" />
          </div>
          <div>
            <p className="text-white font-bold text-sm leading-none">JOMO AUTO WORLD</p>
            <p className="text-zinc-500 text-[10px] uppercase tracking-widest mt-0.5">
              Admin Panel
            </p>
          </div>
        </div>
      </div>

      {/* Nav */}
      <nav className="flex-1 px-3 py-4 space-y-0.5 overflow-y-auto">
        {NAV_ITEMS.map((item) => (
          <NavLink key={item.href} {...item} onClick={onClose} />
        ))}

        <div className="my-3 border-t border-white/[0.08]" />

        <Link
          href="/"
          onClick={onClose}
          className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-zinc-400 hover:text-white hover:bg-white/5 transition-all border-l-2 border-transparent"
        >
          <ExternalLink className="h-4 w-4 text-zinc-500" />
          Back to Store
        </Link>

        <button
          onClick={handleLogout}
          className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-zinc-400 hover:text-red-400 hover:bg-red-950/30 transition-all border-l-2 border-transparent"
        >
          <LogOut className="h-4 w-4 text-zinc-500" />
          Logout
        </button>
      </nav>
    </div>
  );
}

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="min-h-screen bg-[#0F0F0F] flex">
      {/* Desktop Sidebar — fixed */}
      <aside className="hidden md:flex flex-col w-56 bg-[#0A0A0A] border-r border-white/[0.08] fixed inset-y-0 left-0 z-30">
        <SidebarContent />
      </aside>

      {/* Mobile Overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/70 md:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Mobile Drawer */}
      <aside
        className={cn(
          'fixed inset-y-0 left-0 z-50 w-64 bg-[#0A0A0A] border-r border-white/[0.08] transition-transform duration-300 md:hidden',
          sidebarOpen ? 'translate-x-0' : '-translate-x-full'
        )}
      >
        <button
          onClick={() => setSidebarOpen(false)}
          className="absolute top-4 right-4 p-1.5 rounded-lg text-zinc-400 hover:text-white hover:bg-white/10 transition-colors z-10"
        >
          <X className="h-4 w-4" />
        </button>
        <SidebarContent onClose={() => setSidebarOpen(false)} />
      </aside>

      {/* Content area — pushed right on desktop */}
      <div className="flex-1 flex flex-col md:ml-56 min-w-0">
        {/* Mobile Top Bar */}
        <header className="md:hidden sticky top-0 z-20 bg-[#0A0A0A] border-b border-white/[0.08] px-4 py-3 flex items-center gap-3">
          <button
            onClick={() => setSidebarOpen(true)}
            className="p-2 rounded-lg text-zinc-400 hover:text-white hover:bg-white/10 transition-colors"
          >
            <Menu className="h-5 w-5" />
          </button>
          <div className="flex items-center gap-2">
            <div className="w-5 h-5 rounded bg-[#E8002D] flex items-center justify-center">
              <Shield className="h-3 w-3 text-white" />
            </div>
            <span className="text-white font-semibold text-sm">Admin Panel</span>
          </div>
        </header>

        {/* Page content */}
        <main className="flex-1 p-4 md:p-6 lg:p-8 overflow-x-hidden">
          {children}
        </main>
      </div>
    </div>
  );
}
