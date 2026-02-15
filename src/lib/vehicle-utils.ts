/**
 * Vehicle Utility Functions
 * Extract and manage vehicle data from product compatibility strings
 */

import { products, getAllProducts } from "./dummy-data";
import type { Product } from "./types";
import { slugify } from "./utils";
import { VEHICLE_DATA } from "./constants";

export interface VehicleInfo {
  name: string;           // e.g., "Fielder"
  slug: string;           // e.g., "fielder"
  brand: string;          // e.g., "Toyota"
  fullName: string;       // e.g., "Toyota Fielder"
  code: string;           // e.g., "NZE141"
  models: string[];       // e.g., ["NZE141", "NZE144"]
  years: string;          // e.g., "2006-2012"
  productCount: number;   // Number of parts available
  popular: boolean;       // Is this a popular vehicle?
}

/**
 * Extract vehicle name from compatibility string
 * "Fielder NZE141 (2006-2012)" -> "Fielder"
 */
export function extractVehicleName(compatibilityString: string): string {
  // Remove everything in parentheses and model codes
  const cleaned = compatibilityString
    .replace(/\([^)]*\)/g, '') // Remove (year ranges)
    .replace(/[A-Z]{2,}\d+/g, '') // Remove model codes like NZE141
    .trim();

  // Get the main vehicle name (usually first word or two)
  const parts = cleaned.split(' ');

  // Handle cases like "Land Cruiser Prado" -> "Prado"
  // or "Corolla AE110" -> "Corolla"
  if (parts.length > 1 && parts[0].toLowerCase() === 'land') {
    return parts[parts.length - 1]; // Return "Prado"
  }

  return parts[0]; // Return first word (Fielder, Corolla, etc.)
}

/**
 * Get all unique vehicles from VEHICLE_DATA
 */
export function getUniqueVehicles(): VehicleInfo[] {
  // Use the comprehensive VEHICLE_DATA
  const vehicles: VehicleInfo[] = VEHICLE_DATA.map((vehicleData) => {
    const slug = slugify(vehicleData.model);

    // Count actual products for this vehicle (if any)
    const allProducts = getAllProducts();
    let productCount = 0;

    allProducts.forEach((product) => {
      const hasMatch = product.compatibility.some((compatString) => {
        const vehicleName = extractVehicleName(compatString);
        return vehicleName.toLowerCase() === vehicleData.model.toLowerCase();
      });
      if (hasMatch) productCount++;
    });

    // If no products found, assign a random count for demo purposes
    if (productCount === 0) {
      productCount = Math.floor(Math.random() * 50) + 10; // 10-60 parts
    }

    return {
      name: vehicleData.model,
      slug,
      brand: vehicleData.brand,
      fullName: `${vehicleData.brand} ${vehicleData.model}`,
      code: vehicleData.code,
      models: [vehicleData.code],
      years: '', // Can be populated later
      productCount,
      popular: vehicleData.popular,
    };
  });

  // Sort by popular first, then by product count
  return vehicles.sort((a, b) => {
    if (a.popular && !b.popular) return -1;
    if (!a.popular && b.popular) return 1;
    return b.productCount - a.productCount;
  });
}

/**
 * Get products for a specific vehicle
 */
export function getProductsByVehicle(vehicleSlug: string): Product[] {
  const allProducts = getAllProducts();

  return allProducts.filter((product) =>
    product.compatibility.some((compatString) => {
      const vehicleName = extractVehicleName(compatString);
      return slugify(vehicleName) === vehicleSlug;
    })
  );
}

/**
 * Get vehicle info by slug
 */
export function getVehicleBySlug(slug: string): VehicleInfo | null {
  const vehicles = getUniqueVehicles();
  return vehicles.find((v) => v.slug === slug) || null;
}

/**
 * Group products by category for a specific vehicle
 */
export function groupProductsByCategory(
  vehicleSlug: string
): Record<string, Product[]> {
  const vehicleProducts = getProductsByVehicle(vehicleSlug);
  const grouped: Record<string, Product[]> = {};

  vehicleProducts.forEach((product) => {
    if (!grouped[product.category]) {
      grouped[product.category] = [];
    }
    grouped[product.category].push(product);
  });

  return grouped;
}

/**
 * Group products by vehicle for a specific category
 */
export function groupProductsByVehicle(
  category: string
): Record<string, Product[]> {
  const allProducts = getAllProducts();
  const categoryProducts = allProducts.filter(
    (p) => p.category.toLowerCase() === category.toLowerCase()
  );

  const grouped: Record<string, Product[]> = {};

  categoryProducts.forEach((product) => {
    product.compatibility.forEach((compatString) => {
      const vehicleName = extractVehicleName(compatString);
      const slug = slugify(vehicleName);

      if (!grouped[vehicleName]) {
        grouped[vehicleName] = [];
      }

      // Avoid duplicates
      if (!grouped[vehicleName].find((p) => p.id === product.id)) {
        grouped[vehicleName].push(product);
      }
    });
  });

  return grouped;
}

/**
 * Get all unique categories
 */
export function getUniqueCategories(): string[] {
  const allProducts = getAllProducts();
  const categories = new Set<string>();

  allProducts.forEach((product) => {
    categories.add(product.category);
  });

  return Array.from(categories).sort();
}

/**
 * Search vehicles by name
 */
export function searchVehicles(query: string): VehicleInfo[] {
  const allVehicles = getUniqueVehicles();
  const lowerQuery = query.toLowerCase();

  return allVehicles.filter(
    (v) =>
      v.name.toLowerCase().includes(lowerQuery) ||
      v.fullName.toLowerCase().includes(lowerQuery) ||
      v.models.some((m) => m.toLowerCase().includes(lowerQuery))
  );
}

/**
 * Get popular vehicles (top 6)
 */
export function getPopularVehicles(): VehicleInfo[] {
  return getUniqueVehicles().filter((v) => v.popular);
}
