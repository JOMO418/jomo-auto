import Link from "next/link";
import { ChevronRight, Home, Package } from "lucide-react";
import { ProductGrid } from "@/components/product/ProductGrid";
import { getAllProducts } from "@/lib/db";
import { groupProductsByVehicle } from "@/lib/vehicle-utils";
import { CATEGORIES } from "@/lib/constants";
import { notFound } from "next/navigation";
import { slugify } from "@/lib/utils";

interface CategoryPageProps {
  params: Promise<{ slug: string }>;
}

export default async function CategoryPage({ params }: CategoryPageProps) {
  const { slug } = await params;

  const category = CATEGORIES.find((cat) => slugify(cat) === slug);
  if (!category) notFound();

  const allProducts = await getAllProducts();
  const productsByVehicle = groupProductsByVehicle(category, allProducts);
  const vehicles = Object.keys(productsByVehicle).sort();
  const totalCount = allProducts.filter(
    (p) => p.category.toLowerCase() === category.toLowerCase()
  ).length;

  return (
    <div className="min-h-screen bg-gray-50 overflow-x-hidden">
      <div className="bg-white border-b border-gray-200">
        <div className="container mx-auto px-3 sm:px-4 py-3">
          <nav className="flex items-center gap-2 text-sm" aria-label="Breadcrumb">
            <Link href="/" className="flex items-center gap-1 text-gray-600 hover:text-[#E8002D] transition-colors">
              <Home className="w-4 h-4" />
              <span className="hidden sm:inline">Home</span>
            </Link>
            <ChevronRight className="w-4 h-4 text-gray-400" />
            <span className="text-gray-400">Categories</span>
            <ChevronRight className="w-4 h-4 text-gray-400" />
            <span className="font-medium text-gray-900">{category}</span>
          </nav>
        </div>
      </div>

      <div className="bg-white border-b border-gray-200">
        <div className="container mx-auto px-3 sm:px-4 py-6 md:py-10">
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 md:w-16 md:h-16 rounded-lg bg-green-100 flex items-center justify-center flex-shrink-0">
              <Package className="w-6 h-6 md:w-8 md:h-8 text-green-600" />
            </div>
            <div className="flex-1">
              <h1 className="text-2xl md:text-4xl font-bold text-gray-900 mb-2">
                {category} Parts
              </h1>
              <p className="text-sm md:text-base text-gray-600">
                <span className="font-semibold text-green-600">{totalCount} parts</span>{" "}
                available across{" "}
                <span className="font-semibold">
                  {vehicles.length} vehicle{vehicles.length !== 1 ? "s" : ""}
                </span>
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-3 sm:px-4 py-6 md:py-8 max-w-7xl">
        {vehicles.length === 0 ? (
          <div className="text-center py-16">
            <div className="w-16 h-16 rounded-full bg-gray-100 flex items-center justify-center mx-auto mb-4">
              <Package className="w-8 h-8 text-gray-400" />
            </div>
            <h2 className="text-xl font-semibold text-gray-900 mb-2">No Parts Available</h2>
            <p className="text-gray-600 mb-6">
              We don&apos;t have any {category} parts listed yet. Check back soon.
            </p>
            <Link href="/" className="inline-block px-6 py-3 bg-gradient-to-r from-[#E8002D] to-[#B8001F] text-white font-semibold rounded-lg hover:from-[#B8001F] hover:to-[#8A0015] transition-all">
              Browse All Categories
            </Link>
          </div>
        ) : (
          vehicles.map((vehicleName) => (
            <section key={vehicleName} className="mb-12 last:mb-0">
              <div className="flex items-center justify-between mb-6 border-b border-gray-200 pb-3">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-red-100 flex items-center justify-center">
                    <Package className="w-4 h-4 text-[#E8002D]" />
                  </div>
                  <div>
                    <h2 className="text-xl md:text-2xl font-semibold text-gray-900">{vehicleName}</h2>
                    <p className="text-sm text-gray-500">
                      {productsByVehicle[vehicleName].length} {category} part
                      {productsByVehicle[vehicleName].length !== 1 ? "s" : ""}
                    </p>
                  </div>
                </div>
                <Link
                  href={`/vehicle/${slugify(vehicleName)}`}
                  className="hidden sm:flex items-center gap-1 text-sm font-medium text-[#E8002D] hover:text-[#B8001F] transition-colors"
                >
                  View all {vehicleName} parts
                  <ChevronRight className="w-4 h-4" />
                </Link>
              </div>

              <ProductGrid products={productsByVehicle[vehicleName]} />

              <div className="sm:hidden mt-4 text-center">
                <Link href={`/vehicle/${slugify(vehicleName)}`} className="inline-flex items-center gap-1 text-sm font-medium text-[#E8002D] hover:text-[#B8001F] transition-colors">
                  View all {vehicleName} parts
                  <ChevronRight className="w-4 h-4" />
                </Link>
              </div>
            </section>
          ))
        )}
      </div>

      <div className="container mx-auto px-3 sm:px-4 pb-8">
        <div className="text-center">
          <Link href="/" className="inline-flex items-center gap-2 text-[#E8002D] hover:text-[#B8001F] font-medium transition-colors">
            <ChevronRight className="w-4 h-4 rotate-180" />
            Browse other categories
          </Link>
        </div>
      </div>
    </div>
  );
}
