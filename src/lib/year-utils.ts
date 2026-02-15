/**
 * Year Utilities - Extract and manage year information from compatibility strings
 * Handles year ranges, individual years, and filtering
 */

import type { Product } from "./types";

export interface YearRange {
  start: number;
  end: number;
}

/**
 * Extract year ranges from compatibility string
 * "Corolla AE110 (1995-2002)" → [{ start: 1995, end: 2002 }]
 * "Corolla (2015)" → [{ start: 2015, end: 2015 }]
 * "Corolla (2006-2012, 2015-2018)" → [{ start: 2006, end: 2012 }, { start: 2015, end: 2018 }]
 */
export function extractYearRanges(compatibilityString: string): YearRange[] {
  const yearRanges: YearRange[] = [];

  // Match patterns like (1995-2002) or (2015)
  const yearPattern = /\(([0-9, \-]+)\)/g;
  const matches = compatibilityString.matchAll(yearPattern);

  for (const match of matches) {
    const yearString = match[1];

    // Split by comma for multiple ranges: "2006-2012, 2015-2018"
    const ranges = yearString.split(',').map((s) => s.trim());

    ranges.forEach((range) => {
      if (range.includes('-')) {
        // Year range: "2006-2012"
        const [start, end] = range.split('-').map((y) => parseInt(y.trim()));
        if (!isNaN(start) && !isNaN(end)) {
          yearRanges.push({ start, end });
        }
      } else {
        // Single year: "2015"
        const year = parseInt(range);
        if (!isNaN(year)) {
          yearRanges.push({ start: year, end: year });
        }
      }
    });
  }

  return yearRanges;
}

/**
 * Check if a year falls within any of the year ranges
 */
export function isYearInRanges(year: number, ranges: YearRange[]): boolean {
  return ranges.some((range) => year >= range.start && year <= range.end);
}

/**
 * Get all unique years from year ranges
 * [{ start: 2006, end: 2012 }] → [2006, 2007, 2008, 2009, 2010, 2011, 2012]
 */
export function expandYearRanges(ranges: YearRange[]): number[] {
  const years = new Set<number>();

  ranges.forEach((range) => {
    for (let year = range.start; year <= range.end; year++) {
      years.add(year);
    }
  });

  return Array.from(years).sort((a, b) => b - a); // Newest first
}

/**
 * Get all unique years for a vehicle from products
 */
export function getVehicleYears(products: Product[]): number[] {
  const allYears = new Set<number>();

  products.forEach((product) => {
    product.compatibility.forEach((compatString) => {
      const ranges = extractYearRanges(compatString);
      const years = expandYearRanges(ranges);
      years.forEach((year) => allYears.add(year));
    });
  });

  return Array.from(allYears).sort((a, b) => b - a); // Newest first
}

/**
 * Filter products that are compatible with a specific year
 */
export function filterProductsByYear(
  products: Product[],
  year: number
): Product[] {
  return products.filter((product) =>
    product.compatibility.some((compatString) => {
      const ranges = extractYearRanges(compatString);
      return isYearInRanges(year, ranges);
    })
  );
}

/**
 * Group years into ranges for display
 * [2006, 2007, 2008, 2009, 2010, 2011, 2012] → "2006-2012"
 * [2006, 2007, 2008, 2015, 2016] → "2006-2008, 2015-2016"
 */
export function groupYearsIntoRanges(years: number[]): string {
  if (years.length === 0) return "";
  if (years.length === 1) return years[0].toString();

  const sorted = [...years].sort((a, b) => a - b);
  const ranges: string[] = [];
  let start = sorted[0];
  let end = sorted[0];

  for (let i = 1; i < sorted.length; i++) {
    if (sorted[i] === end + 1) {
      end = sorted[i];
    } else {
      ranges.push(start === end ? `${start}` : `${start}-${end}`);
      start = sorted[i];
      end = sorted[i];
    }
  }

  ranges.push(start === end ? `${start}` : `${start}-${end}`);
  return ranges.join(", ");
}

/**
 * Format year range for display
 * { start: 2006, end: 2012 } → "2006-2012"
 * { start: 2015, end: 2015 } → "2015"
 */
export function formatYearRange(range: YearRange): string {
  return range.start === range.end
    ? `${range.start}`
    : `${range.start}-${range.end}`;
}

/**
 * Get display text for year filter
 */
export function getYearDisplayText(
  year: number | null,
  availableYears: number[]
): string {
  if (year === null) {
    return "All Years";
  }

  // Check if this year is part of a continuous range
  const ranges = groupYearsIntoRanges(availableYears);
  return `${year}`;
}
