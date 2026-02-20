/**
 * Vehicle Utility Functions
 *
 * Derives vehicle data from product compatibility strings stored in the DB.
 * Compatibility string format: "Brand Model CODE (year_start-year_end)"
 * e.g. "Toyota Fielder NZE141 (2006-2012)"
 *
 * All vehicle lists are now product-driven: if a vehicle has products assigned
 * to it in the admin, it appears in the shop. No static VEHICLE_DATA needed.
 * VEHICLE_DATA is still used as a fallback for the "popular" flag.
 */

import type { Product } from './types';
import { slugify } from './utils';
import { VEHICLE_DATA } from './constants';
import { extractYearRanges } from './year-utils';

export interface VehicleInfo {
  name: string;         // Model name e.g. "Fielder"
  slug: string;         // URL slug e.g. "fielder"
  brand: string;        // e.g. "Toyota"
  fullName: string;     // e.g. "Toyota Fielder"
  /** All chassis/generation codes for this model, e.g. ["NZE121","NZE141","NZE161"] */
  codes: string[];
  /** Human-readable year range spanning all variants, e.g. "2000–2019" */
  years: string;
  year_start: number | null;
  year_end: number | null;
  productCount: number;
  popular: boolean;
}

/**
 * Extract the model name from a compatibility string.
 * "Toyota Fielder NZE141 (2006-2012)" → "Fielder"
 * "Toyota Land Cruiser Prado GRJ150 (2009-2023)" → "Land Cruiser Prado"
 */
export function extractVehicleName(compatibilityString: string): string {
  // Remove year range like "(2006-2012)"
  const cleaned = compatibilityString.replace(/\s*\([^)]*\)\s*/g, '').trim();
  const parts = cleaned.split(/\s+/);

  // Edge case: "Land Cruiser" or "Land Cruiser Prado"
  if (parts[0]?.toLowerCase() === 'land') {
    if (parts[1]?.toLowerCase() === 'cruiser' && parts[2]?.toLowerCase() === 'prado') {
      return 'Land Cruiser Prado';
    }
    if (parts[1]?.toLowerCase() === 'cruiser') {
      return 'Land Cruiser';
    }
  }
  // parts[0] = Brand, parts[1] = Model name
  return parts[1] ?? parts[0] ?? '';
}

/**
 * Extract brand from a compatibility string.
 * "Toyota Fielder NZE141 (2006-2012)" → "Toyota"
 */
export function extractBrand(compatibilityString: string): string {
  const cleaned = compatibilityString.replace(/\([^)]*\)/g, '').trim();
  return cleaned.split(/\s+/)[0] ?? '';
}

/**
 * Extract chassis code from a compatibility string.
 * "Toyota Fielder NZE141 (2006-2012)" → "NZE141"
 * "Toyota Land Cruiser Prado GRJ150 (2009-2023)" → "GRJ150"
 */
function extractCode(compatibilityString: string): string {
  const cleaned = compatibilityString.replace(/\s*\([^)]*\)\s*/g, '').trim();
  const parts = cleaned.split(/\s+/);
  // Brand is parts[0], model is parts[1] (or parts[1]+parts[2] for Land Cruiser)
  if (parts[0]?.toLowerCase() === 'land' && parts[1]?.toLowerCase() === 'cruiser') {
    const offset = parts[2]?.toLowerCase() === 'prado' ? 3 : 2;
    return parts.slice(offset).join(' ');
  }
  return parts.slice(2).join(' ');
}

/**
 * Build a standardised compatibility label string from vehicle parts.
 */
export function buildCompatLabel(
  brand: string,
  model: string,
  code: string,
  year_start?: number | null,
  year_end?: number | null
): string {
  const years = year_start
    ? ` (${year_start}-${year_end ?? 'present'})`
    : '';
  return `${brand} ${model} ${code}${years}`;
}

// Popular flag lookup from static VEHICLE_DATA
const POPULAR_SET = new Set(
  VEHICLE_DATA.filter((v) => v.popular).map((v) => `${v.brand}::${v.model}`)
);

/**
 * Build unique vehicle list from product compatibility strings.
 *
 * This is the source of truth for the shop filter and vehicle pages.
 * Any vehicle that has at least one product linked to it will appear.
 * Falls back to VEHICLE_DATA entries for the "popular" flag.
 *
 * When no products have compatibility data, falls back to VEHICLE_DATA.
 */
export function getUniqueVehicles(products: Product[] = []): VehicleInfo[] {
  // Build vehicle map from compatibility strings
  const vehicleMap: Record<string, {
    brand: string;
    model: string;
    codes: Set<string>;
    yearStarts: number[];
    yearEnds: number[];
    productIds: Set<string>;
  }> = {};

  products.forEach((product) => {
    if (!product.compatibility || product.compatibility.length === 0) return;

    product.compatibility.forEach((compatStr) => {
      const brand = extractBrand(compatStr);
      const model = extractVehicleName(compatStr);
      if (!brand || !model) return;

      const key = `${brand}::${model}`;
      if (!vehicleMap[key]) {
        vehicleMap[key] = {
          brand,
          model,
          codes: new Set(),
          yearStarts: [],
          yearEnds: [],
          productIds: new Set(),
        };
      }

      vehicleMap[key].productIds.add(product.id);

      const code = extractCode(compatStr);
      if (code) vehicleMap[key].codes.add(code);

      const ranges = extractYearRanges(compatStr);
      ranges.forEach((r) => {
        vehicleMap[key].yearStarts.push(r.start);
        vehicleMap[key].yearEnds.push(r.end);
      });
    });
  });

  const hasCompatData = Object.keys(vehicleMap).length > 0;

  // If products have compatibility data, use it
  if (hasCompatData) {
    const vehicles: VehicleInfo[] = Object.entries(vehicleMap).map(([, v]) => {
      const year_start = v.yearStarts.length ? Math.min(...v.yearStarts) : null;
      const year_end   = v.yearEnds.length   ? Math.max(...v.yearEnds)   : null;
      const years      = year_start
        ? `${year_start}–${year_end ?? 'present'}`
        : '';
      const popular    = POPULAR_SET.has(`${v.brand}::${v.model}`);

      return {
        name:         v.model,
        slug:         slugify(v.model),
        brand:        v.brand,
        fullName:     `${v.brand} ${v.model}`,
        codes:        Array.from(v.codes),
        years,
        year_start,
        year_end,
        productCount: v.productIds.size,
        popular,
      };
    });

    return vehicles.sort((a, b) => {
      if (a.popular && !b.popular) return -1;
      if (!a.popular && b.popular) return 1;
      if (b.productCount !== a.productCount) return b.productCount - a.productCount;
      return a.fullName.localeCompare(b.fullName);
    });
  }

  // Fallback: derive from VEHICLE_DATA (no products loaded yet)
  const grouped: Record<string, typeof VEHICLE_DATA[number][]> = {};
  VEHICLE_DATA.forEach((v) => {
    const key = `${v.brand}::${v.model}`;
    if (!grouped[key]) grouped[key] = [];
    grouped[key].push(v);
  });

  return Object.entries(grouped)
    .map(([, variants]) => {
      const first    = variants[0];
      const brand    = first.brand;
      const model    = first.model;
      const codes    = variants.map((v) => v.code);
      const popular  = variants.some((v) => v.popular);
      const starts   = variants.map((v) => v.year_start).filter(Boolean) as number[];
      const ends     = variants.map((v) => v.year_end).filter(Boolean) as number[];
      const year_start = starts.length ? Math.min(...starts) : null;
      const year_end   = ends.length   ? Math.max(...ends)   : null;
      const years      = year_start ? `${year_start}–${year_end ?? 'present'}` : '';

      return {
        name:         model,
        slug:         slugify(model),
        brand,
        fullName:     `${brand} ${model}`,
        codes,
        years,
        year_start,
        year_end,
        productCount: 0,
        popular,
      };
    })
    .sort((a, b) => {
      if (a.popular && !b.popular) return -1;
      if (!a.popular && b.popular) return 1;
      return a.fullName.localeCompare(b.fullName);
    });
}

/**
 * Filter products compatible with a given vehicle slug.
 * Matches by model name (covers all year variants of that model).
 */
export function getProductsByVehicle(vehicleSlug: string, products: Product[]): Product[] {
  return products.filter((product) =>
    product.compatibility.some((compatStr) => {
      const vehicleName = extractVehicleName(compatStr);
      return slugify(vehicleName) === vehicleSlug;
    })
  );
}

/** Get a single VehicleInfo by slug */
export function getVehicleBySlug(slug: string, products: Product[] = []): VehicleInfo | null {
  return getUniqueVehicles(products).find((v) => v.slug === slug) ?? null;
}

/** Group products by category for a specific vehicle slug */
export function groupProductsByCategory(
  vehicleSlug: string,
  products: Product[] = []
): Record<string, Product[]> {
  const vehicleProducts = getProductsByVehicle(vehicleSlug, products);
  const grouped: Record<string, Product[]> = {};
  vehicleProducts.forEach((product) => {
    if (!grouped[product.category]) grouped[product.category] = [];
    grouped[product.category].push(product);
  });
  return grouped;
}

/** Group products by vehicle (model name) for a specific category */
export function groupProductsByVehicle(
  category: string,
  products: Product[] = []
): Record<string, Product[]> {
  const categoryProducts = products.filter(
    (p) => p.category.toLowerCase() === category.toLowerCase()
  );

  const grouped: Record<string, Product[]> = {};
  categoryProducts.forEach((product) => {
    product.compatibility.forEach((compatStr) => {
      const vehicleName = extractVehicleName(compatStr);
      if (!vehicleName) return;
      if (!grouped[vehicleName]) grouped[vehicleName] = [];
      if (!grouped[vehicleName].find((p) => p.id === product.id)) {
        grouped[vehicleName].push(product);
      }
    });
  });
  return grouped;
}

/** Get all unique categories from a products array */
export function getUniqueCategories(products: Product[] = []): string[] {
  const categories = new Set<string>();
  products.forEach((p) => categories.add(p.category));
  return Array.from(categories).sort();
}

/** Search vehicles by model name, brand, code, or year */
export function searchVehicles(query: string, products: Product[] = []): VehicleInfo[] {
  const allVehicles = getUniqueVehicles(products);
  const q = query.toLowerCase().trim();
  if (!q) return allVehicles;

  return allVehicles.filter(
    (v) =>
      v.name.toLowerCase().includes(q)     ||
      v.fullName.toLowerCase().includes(q) ||
      v.brand.toLowerCase().includes(q)    ||
      v.codes.some((c) => c.toLowerCase().includes(q)) ||
      v.years.includes(q)
  );
}

/** Get only popular vehicles */
export function getPopularVehicles(products: Product[] = []): VehicleInfo[] {
  return getUniqueVehicles(products).filter((v) => v.popular);
}
