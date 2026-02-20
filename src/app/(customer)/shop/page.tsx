import { unstable_cache } from "next/cache";
import { getAllProducts } from "@/lib/db";
import { ShopPageClient } from "./ShopPageClient";

const getCachedProducts = unstable_cache(
  () => getAllProducts(),
  ["shop-all-products"],
  { revalidate: 60, tags: ['products'] }
);

export default async function ShopPage() {
  const allProducts = await getCachedProducts();

  return <ShopPageClient allProducts={allProducts} />;
}
