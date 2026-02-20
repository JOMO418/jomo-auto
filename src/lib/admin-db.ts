/**
 * admin-db.ts — Admin-only Supabase queries
 * Uses the service role key for full read/write access.
 */

import { createClient } from '@supabase/supabase-js';

function getAdminClient() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  );
}

// ─── Types ────────────────────────────────────────────────────────────────────

export interface Order {
  id: string;
  customer_name: string;
  customer_phone: string | null;
  customer_email: string | null;
  customer_address: string | null;
  status: 'pending' | 'approved' | 'dispatched' | 'delivered' | 'cancelled';
  payment_status: 'pending' | 'paid' | 'failed';
  payment_method: string | null;
  mpesa_code: string | null;
  total: number;
  notes: string | null;
  created_at: string;
  updated_at: string;
  items?: OrderItem[];
}

export interface OrderItem {
  id: string;
  order_id: string;
  product_id: string | null;
  product_name: string;
  product_image: string | null;
  quantity: number;
  unit_price: number;
  total_price: number;
}

export interface Customer {
  id: string;
  name: string;
  phone: string | null;
  email: string | null;
  address: string | null;
  notes: string | null;
  created_at: string;
  order_count?: number;
  total_spent?: number;
}

export interface AdminProduct {
  id: string;
  slug: string;
  name: string;
  images: string[];
  price: number;
  original_price: number | null;
  stock: number;
  condition: string;
  category_id: string | null;
  category_name: string | null;
  description: string | null;
  specs: Record<string, string>;
  origin: string | null;
  featured: boolean;
  new_arrival: boolean;
  flash_deal: boolean;
  created_at: string;
  updated_at: string;
}

export interface AnalyticsData {
  revenueToday: number;
  revenueWeek: number;
  revenueMonth: number;
  ordersToday: number;
  topProducts: { name: string; quantity: number; revenue: number }[];
  salesByCategory: { category: string; total: number }[];
}

// ─── Dashboard ────────────────────────────────────────────────────────────────

export async function getDashboardStats() {
  const supabase = getAdminClient();

  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const todayISO = today.toISOString();

  const [productCount, ordersToday, recentOrders, lowStockResult] =
    await Promise.all([
      supabase.from('products').select('id', { count: 'exact', head: true }),
      supabase
        .from('orders')
        .select('id, total', { count: 'exact' })
        .gte('created_at', todayISO),
      supabase
        .from('orders')
        .select('id, customer_name, total, status, payment_status, created_at')
        .order('created_at', { ascending: false })
        .limit(10),
      supabase
        .from('products')
        .select('id', { count: 'exact', head: true })
        .lte('stock', 10),
    ]);

  const todayRevenue = (ordersToday.data ?? []).reduce(
    (sum, o) => sum + (o.total ?? 0),
    0
  );

  return {
    totalProducts: productCount.count ?? 0,
    ordersToday: ordersToday.count ?? 0,
    revenueToday: todayRevenue,
    lowStockCount: lowStockResult.count ?? 0,
    recentOrders: recentOrders.data ?? [],
  };
}

// ─── Orders ───────────────────────────────────────────────────────────────────

export async function getOrders(status?: string): Promise<Order[]> {
  const supabase = getAdminClient();
  let query = supabase
    .from('orders')
    .select('*')
    .order('created_at', { ascending: false });

  if (status && status !== 'all') {
    query = query.eq('status', status);
  }

  const { data, error } = await query;
  if (error) {
    console.error('[admin-db] getOrders error:', error.message);
    return [];
  }
  return data ?? [];
}

export async function getOrderById(id: string): Promise<Order | null> {
  const supabase = getAdminClient();
  const [orderResult, itemsResult] = await Promise.all([
    supabase.from('orders').select('*').eq('id', id).single(),
    supabase.from('order_items').select('*').eq('order_id', id),
  ]);

  if (orderResult.error) return null;
  return {
    ...orderResult.data,
    items: itemsResult.data ?? [],
  };
}

export async function updateOrderStatus(
  id: string,
  status: Order['status']
): Promise<boolean> {
  const supabase = getAdminClient();
  const { error } = await supabase
    .from('orders')
    .update({ status, updated_at: new Date().toISOString() })
    .eq('id', id);
  return !error;
}

export async function updatePaymentStatus(
  orderId: string,
  payment_status: 'paid' | 'failed' | 'pending',
  mpesa_code?: string
): Promise<boolean> {
  const supabase = getAdminClient();
  const { error } = await supabase
    .from('orders')
    .update({
      payment_status,
      ...(mpesa_code ? { mpesa_code } : {}),
      updated_at: new Date().toISOString(),
    })
    .eq('id', orderId);
  return !error;
}

// ─── Payments ─────────────────────────────────────────────────────────────────

export async function getPayments(paymentStatus?: string) {
  const supabase = getAdminClient();
  let query = supabase
    .from('orders')
    .select(
      'id, customer_name, total, payment_status, payment_method, mpesa_code, created_at, status'
    )
    .order('created_at', { ascending: false });

  if (paymentStatus && paymentStatus !== 'all') {
    query = query.eq('payment_status', paymentStatus);
  }

  const { data, error } = await query;
  if (error) {
    console.error('[admin-db] getPayments error:', error.message);
    return [];
  }
  return data ?? [];
}

// ─── Customers ────────────────────────────────────────────────────────────────

export async function getCustomers(): Promise<Customer[]> {
  const supabase = getAdminClient();
  const { data, error } = await supabase
    .from('customers')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) {
    console.error('[admin-db] getCustomers error:', error.message);
    return [];
  }
  return data ?? [];
}

export async function createCustomer(customer: Omit<Customer, 'id' | 'created_at'>): Promise<string | null> {
  const supabase = getAdminClient();
  const { data, error } = await supabase
    .from('customers')
    .insert(customer)
    .select('id')
    .single();

  if (error) {
    console.error('[admin-db] createCustomer error:', error.message);
    return null;
  }
  return data?.id ?? null;
}

// ─── Analytics ────────────────────────────────────────────────────────────────

export async function getAnalytics(): Promise<AnalyticsData> {
  const supabase = getAdminClient();

  const now = new Date();
  const todayStart = new Date(now);
  todayStart.setHours(0, 0, 0, 0);

  const weekStart = new Date(now);
  weekStart.setDate(now.getDate() - 7);

  const monthStart = new Date(now);
  monthStart.setDate(1);
  monthStart.setHours(0, 0, 0, 0);

  const [todayOrders, weekOrders, monthOrders, itemData] = await Promise.all([
    supabase
      .from('orders')
      .select('total')
      .gte('created_at', todayStart.toISOString())
      .eq('payment_status', 'paid'),
    supabase
      .from('orders')
      .select('total')
      .gte('created_at', weekStart.toISOString())
      .eq('payment_status', 'paid'),
    supabase
      .from('orders')
      .select('total, created_at')
      .gte('created_at', monthStart.toISOString())
      .eq('payment_status', 'paid'),
    supabase.from('order_items').select('product_name, quantity, total_price'),
  ]);

  const sum = (rows: { total: number }[]) =>
    (rows ?? []).reduce((s, r) => s + (r.total ?? 0), 0);

  // Top products by quantity
  const productMap: Record<string, { quantity: number; revenue: number }> = {};
  for (const item of itemData.data ?? []) {
    if (!productMap[item.product_name]) {
      productMap[item.product_name] = { quantity: 0, revenue: 0 };
    }
    productMap[item.product_name].quantity += item.quantity;
    productMap[item.product_name].revenue += item.total_price;
  }

  const topProducts = Object.entries(productMap)
    .map(([name, v]) => ({ name, ...v }))
    .sort((a, b) => b.quantity - a.quantity)
    .slice(0, 5);

  return {
    revenueToday: sum(todayOrders.data ?? []),
    revenueWeek: sum(weekOrders.data ?? []),
    revenueMonth: sum(monthOrders.data ?? []),
    ordersToday: todayOrders.data?.length ?? 0,
    topProducts,
    salesByCategory: [], // populated from products join in the page
  };
}

// ─── Inventory / Products ─────────────────────────────────────────────────────

export async function getAdminProducts(): Promise<AdminProduct[]> {
  const supabase = getAdminClient();

  // Try with category join
  const { data, error } = await supabase
    .from('products')
    .select('*, category:categories(name)')
    .order('created_at', { ascending: false });

  if (error) {
    console.error('[admin-db] getAdminProducts join error:', error.message, '| code:', error.code);

    // Fallback: fetch without join so we at least show products
    const { data: fallback, error: fallbackError } = await supabase
      .from('products')
      .select('*')
      .order('created_at', { ascending: false });

    if (fallbackError) {
      console.error('[admin-db] getAdminProducts fallback error:', fallbackError.message);
      return [];
    }

    return (fallback ?? []).map((row) => ({
      ...row,
      images: Array.isArray(row.images) ? row.images : [],
      specs: (row.specs && typeof row.specs === 'object') ? row.specs : {},
      category_name: null,
      new_arrival: row.new_arrival ?? false,
      flash_deal: row.flash_deal ?? false,
    }));
  }

  return (data ?? []).map((row) => ({
    ...row,
    images: Array.isArray(row.images) ? row.images : [],
    specs: (row.specs && typeof row.specs === 'object') ? row.specs : {},
    category_name: (row.category as { name: string } | null)?.name ?? null,
    new_arrival: row.new_arrival ?? false,
    flash_deal: row.flash_deal ?? false,
  }));
}

export async function updateProductStock(
  productId: string,
  stock: number
): Promise<boolean> {
  const supabase = getAdminClient();
  const { error } = await supabase
    .from('products')
    .update({ stock, updated_at: new Date().toISOString() })
    .eq('id', productId);
  return !error;
}

export async function toggleProductFeatured(
  productId: string,
  featured: boolean
): Promise<boolean> {
  const supabase = getAdminClient();
  const { error } = await supabase
    .from('products')
    .update({ featured, updated_at: new Date().toISOString() })
    .eq('id', productId);
  return !error;
}

export async function deleteProduct(productId: string): Promise<boolean> {
  const supabase = getAdminClient();
  const { error } = await supabase
    .from('products')
    .delete()
    .eq('id', productId);
  return !error;
}

export async function getCategories() {
  const supabase = getAdminClient();
  const { data } = await supabase
    .from('categories')
    .select('id, name')
    .order('name');
  return data ?? [];
}
