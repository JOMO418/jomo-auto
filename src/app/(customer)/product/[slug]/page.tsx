import { notFound } from "next/navigation";
import { getProductBySlug, getProductsByCategory } from "@/lib/supabase-queries";
import { ProductPageClient } from "@/components/product/ProductPageClient";

interface ProductPageProps {
  params: Promise<{ slug: string }>;
}

export default async function ProductPage({ params }: ProductPageProps) {
  const { slug } = await params;
  const product = await getProductBySlug(slug);

  if (!product) {
    notFound();
  }

  // Get related products from same category
  const allCategoryProducts = await getProductsByCategory(product.category.slug);

  // Filter out current product and limit to 4 related products
  const relatedProducts = allCategoryProducts
    .filter(p => p.id !== product.id)
    .slice(0, 4);

  return <ProductPageClient product={product} relatedProducts={relatedProducts} />;
}
