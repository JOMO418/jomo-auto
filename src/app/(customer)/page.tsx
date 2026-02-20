import { unstable_cache } from "next/cache";
import { getAllProducts, getCategories } from "@/lib/db";
import { HomePageClient } from "./HomePageClient";

const getCachedProducts = unstable_cache(
  () => getAllProducts(),
  ["home-all-products"],
  { revalidate: 60, tags: ['products'] }
);

// Categories change rarely — cache longer
const getCachedCategories = unstable_cache(
  () => getCategories(),
  ["all-categories"],
  { revalidate: 300, tags: ['products'] }
);

export default async function HomePage() {
  const [allProducts, categories] = await Promise.all([
    getCachedProducts(),
    getCachedCategories(),
  ]);

  return <HomePageClient allProducts={allProducts} categories={categories} />;
}
