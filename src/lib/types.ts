export interface Product {
  id: string;
  slug: string;
  name: string;
  images: string[];
  price: number;
  originalPrice?: number;
  stock: number;
  condition: "New" | "Used" | "Refurbished";
  category: string;
  compatibility: string[];
  description: string;
  specs: Record<string, string>;
  origin: string;
  featured: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface CartItem {
  product: Product;
  quantity: number;
}

export interface CartStore {
  items: CartItem[];
  addItem: (product: Product, quantity: number) => void;
  removeItem: (productId: string) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  clearCart: () => void;
  getTotalItems: () => number;
  getTotalPrice: () => number;
  isInCart: (productId: string) => boolean;
}
