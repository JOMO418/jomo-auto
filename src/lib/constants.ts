// ================================================
// VEHICLE & CATEGORY CONSTANTS
// Vehicle year data researched from manufacturer records
// Toyota models listed first (primary brand)
// ================================================

export const CATEGORIES = [
  "Body",
  "Brakes",
  "Electrical",
  "Engine",
  "Interior",
  "Suspension",
  "Transmission",
  "Wheels & Tires"
] as const;

/**
 * Comprehensive vehicle database with accurate manufacturing years.
 * Sorted: Toyota first (primary brand), then Nissan, Mazda, others.
 * Each entry = one specific generation/chassis code with exact year range.
 *
 * Compatibility string format: "Brand Model CODE (year_start-year_end)"
 * e.g. "Toyota Fielder NZE141 (2006-2012)"
 */
export const VEHICLE_DATA = [
  // ═══════════════════════════════════════════════════
  // TOYOTA — Primary Brand (listed first)
  // ═══════════════════════════════════════════════════

  // ── Toyota Corolla Fielder ──────────────────────────
  // Most popular wagon in Kenya — 3 generations
  { brand: "Toyota", model: "Fielder", code: "NZE121",  year_start: 2000, year_end: 2006, popular: true  },
  { brand: "Toyota", model: "Fielder", code: "NZE141",  year_start: 2006, year_end: 2012, popular: true  },
  { brand: "Toyota", model: "Fielder", code: "NZE161",  year_start: 2012, year_end: 2019, popular: true  },

  // ── Toyota Corolla Axio ─────────────────────────────
  { brand: "Toyota", model: "Axio",    code: "NZE141",  year_start: 2006, year_end: 2012, popular: true  },
  { brand: "Toyota", model: "Axio",    code: "NZE161",  year_start: 2012, year_end: 2019, popular: false },

  // ── Toyota Corolla (sedan) ──────────────────────────
  { brand: "Toyota", model: "Corolla", code: "AE110",   year_start: 1995, year_end: 2000, popular: false },
  { brand: "Toyota", model: "Corolla", code: "AE111",   year_start: 2000, year_end: 2002, popular: false },
  { brand: "Toyota", model: "Corolla", code: "NZE120",  year_start: 2002, year_end: 2006, popular: true  },
  { brand: "Toyota", model: "Corolla", code: "NZE150",  year_start: 2007, year_end: 2013, popular: true  },

  // ── Toyota Vitz (Yaris) ─────────────────────────────
  // Called "Vitz" in Kenya — very common city car
  { brand: "Toyota", model: "Vitz",    code: "SCP10",   year_start: 1999, year_end: 2005, popular: false },
  { brand: "Toyota", model: "Vitz",    code: "NCP91",   year_start: 2005, year_end: 2010, popular: true  },
  { brand: "Toyota", model: "Vitz",    code: "KSP90",   year_start: 2005, year_end: 2010, popular: true  },
  { brand: "Toyota", model: "Vitz",    code: "NSP130",  year_start: 2010, year_end: 2017, popular: true  },

  // ── Toyota Probox ───────────────────────────────────
  // Workhorse — extremely common for business use
  { brand: "Toyota", model: "Probox",  code: "NCP51",   year_start: 2002, year_end: 2014, popular: true  },
  { brand: "Toyota", model: "Probox",  code: "NCP160",  year_start: 2014, year_end: 2024, popular: true  },

  // ── Toyota Hiace ────────────────────────────────────
  // Most common minibus/matatu in Kenya — 3 engine variants
  // "5L" refers to the 5L petrol engine (older H100 models)
  { brand: "Toyota", model: "Hiace",   code: "LH113 2L", year_start: 1989, year_end: 1998, popular: false },
  { brand: "Toyota", model: "Hiace",   code: "LH119 5L", year_start: 1995, year_end: 2004, popular: true  },
  { brand: "Toyota", model: "Hiace",   code: "KDH200 2KD", year_start: 2004, year_end: 2015, popular: true  },
  { brand: "Toyota", model: "Hiace",   code: "KDH201 1GD", year_start: 2015, year_end: 2024, popular: true  },

  // ── Toyota Noah ─────────────────────────────────────
  { brand: "Toyota", model: "Noah",    code: "AZR60",   year_start: 2001, year_end: 2007, popular: true  },
  { brand: "Toyota", model: "Noah",    code: "ZRR70",   year_start: 2007, year_end: 2014, popular: true  },
  { brand: "Toyota", model: "Noah",    code: "ZWR80",   year_start: 2014, year_end: 2021, popular: true  },

  // ── Toyota Voxy ─────────────────────────────────────
  { brand: "Toyota", model: "Voxy",    code: "AZR60",   year_start: 2001, year_end: 2007, popular: true  },
  { brand: "Toyota", model: "Voxy",    code: "ZRR70",   year_start: 2007, year_end: 2014, popular: true  },
  { brand: "Toyota", model: "Voxy",    code: "ZWR80",   year_start: 2014, year_end: 2021, popular: false },

  // ── Toyota Land Cruiser Prado ───────────────────────
  { brand: "Toyota", model: "Prado",   code: "90",      year_start: 1996, year_end: 2002, popular: false },
  { brand: "Toyota", model: "Prado",   code: "120",     year_start: 2002, year_end: 2009, popular: true  },
  { brand: "Toyota", model: "Prado",   code: "150",     year_start: 2009, year_end: 2022, popular: true  },

  // ── Toyota Wish ─────────────────────────────────────
  { brand: "Toyota", model: "Wish",    code: "ZNE10",   year_start: 2003, year_end: 2009, popular: true  },
  { brand: "Toyota", model: "Wish",    code: "ZGE20",   year_start: 2009, year_end: 2017, popular: true  },

  // ── Toyota Belta ────────────────────────────────────
  { brand: "Toyota", model: "Belta",   code: "SCP92",   year_start: 2005, year_end: 2012, popular: false },
  { brand: "Toyota", model: "Belta",   code: "NCP96",   year_start: 2005, year_end: 2012, popular: true  },

  // ── Toyota Ractis ───────────────────────────────────
  { brand: "Toyota", model: "Ractis",  code: "NCP100",  year_start: 2005, year_end: 2010, popular: false },
  { brand: "Toyota", model: "Ractis",  code: "NCP120",  year_start: 2010, year_end: 2016, popular: false },

  // ── Toyota Allion ───────────────────────────────────
  { brand: "Toyota", model: "Allion",  code: "ZZT240",  year_start: 2001, year_end: 2007, popular: false },
  { brand: "Toyota", model: "Allion",  code: "NZT260",  year_start: 2007, year_end: 2021, popular: false },

  // ── Toyota Premio ───────────────────────────────────
  { brand: "Toyota", model: "Premio",  code: "ZZT240",  year_start: 2001, year_end: 2007, popular: false },
  { brand: "Toyota", model: "Premio",  code: "NZT260",  year_start: 2007, year_end: 2021, popular: false },

  // ── Toyota Mark X ───────────────────────────────────
  { brand: "Toyota", model: "Mark X",  code: "GRX120",  year_start: 2004, year_end: 2009, popular: false },
  { brand: "Toyota", model: "Mark X",  code: "GRX130",  year_start: 2009, year_end: 2019, popular: false },

  // ── Toyota Harrier ──────────────────────────────────
  { brand: "Toyota", model: "Harrier", code: "ACU30",   year_start: 2003, year_end: 2013, popular: false },
  { brand: "Toyota", model: "Harrier", code: "ZSU60",   year_start: 2013, year_end: 2020, popular: false },

  // ═══════════════════════════════════════════════════
  // NISSAN — Secondary Brand
  // ═══════════════════════════════════════════════════

  // ── Nissan Tiida ────────────────────────────────────
  { brand: "Nissan", model: "Tiida",     code: "C11",   year_start: 2004, year_end: 2012, popular: true  },
  { brand: "Nissan", model: "Tiida",     code: "C13",   year_start: 2012, year_end: 2018, popular: false },

  // ── Nissan Note ─────────────────────────────────────
  { brand: "Nissan", model: "Note",      code: "E11",   year_start: 2005, year_end: 2012, popular: true  },
  { brand: "Nissan", model: "Note",      code: "E12",   year_start: 2012, year_end: 2020, popular: true  },

  // ── Nissan Wingroad ─────────────────────────────────
  { brand: "Nissan", model: "Wingroad",  code: "Y11",   year_start: 1999, year_end: 2005, popular: false },
  { brand: "Nissan", model: "Wingroad",  code: "Y12",   year_start: 2005, year_end: 2018, popular: true  },

  // ── Nissan Serena ───────────────────────────────────
  { brand: "Nissan", model: "Serena",    code: "C24",   year_start: 1999, year_end: 2005, popular: false },
  { brand: "Nissan", model: "Serena",    code: "C25",   year_start: 2005, year_end: 2010, popular: false },
  { brand: "Nissan", model: "Serena",    code: "C26",   year_start: 2010, year_end: 2016, popular: false },

  // ── Nissan X-Trail ──────────────────────────────────
  { brand: "Nissan", model: "X-Trail",   code: "T30",   year_start: 2000, year_end: 2007, popular: false },
  { brand: "Nissan", model: "X-Trail",   code: "T31",   year_start: 2007, year_end: 2013, popular: false },

  // ── Nissan March (Micra) ────────────────────────────
  { brand: "Nissan", model: "March",     code: "K12",   year_start: 2002, year_end: 2010, popular: false },
  { brand: "Nissan", model: "March",     code: "K13",   year_start: 2010, year_end: 2016, popular: false },

  // ═══════════════════════════════════════════════════
  // MAZDA
  // ═══════════════════════════════════════════════════

  // ── Mazda Demio ─────────────────────────────────────
  { brand: "Mazda", model: "Demio",   code: "DY",    year_start: 2002, year_end: 2007, popular: true  },
  { brand: "Mazda", model: "Demio",   code: "DE",    year_start: 2007, year_end: 2014, popular: true  },
  { brand: "Mazda", model: "Demio",   code: "DJ",    year_start: 2014, year_end: 2019, popular: false },

  // ── Mazda Axela ─────────────────────────────────────
  { brand: "Mazda", model: "Axela",   code: "BK",    year_start: 2003, year_end: 2009, popular: false },
  { brand: "Mazda", model: "Axela",   code: "BL",    year_start: 2009, year_end: 2013, popular: false },
  { brand: "Mazda", model: "Axela",   code: "BM",    year_start: 2013, year_end: 2019, popular: false },

  // ── Mazda Atenza ────────────────────────────────────
  { brand: "Mazda", model: "Atenza",  code: "GG",    year_start: 2002, year_end: 2008, popular: false },
  { brand: "Mazda", model: "Atenza",  code: "GH",    year_start: 2008, year_end: 2012, popular: false },

  // ═══════════════════════════════════════════════════
  // SUBARU
  // ═══════════════════════════════════════════════════
  { brand: "Subaru", model: "Forester",  code: "SG",  year_start: 2002, year_end: 2008, popular: false },
  { brand: "Subaru", model: "Forester",  code: "SH",  year_start: 2008, year_end: 2013, popular: false },
  { brand: "Subaru", model: "Impreza",   code: "GD",  year_start: 2000, year_end: 2007, popular: false },
  { brand: "Subaru", model: "Legacy",    code: "BP",  year_start: 2003, year_end: 2009, popular: false },

  // ═══════════════════════════════════════════════════
  // HONDA
  // ═══════════════════════════════════════════════════
  { brand: "Honda",  model: "Fit",       code: "GD",  year_start: 2001, year_end: 2008, popular: false },
  { brand: "Honda",  model: "Fit",       code: "GE",  year_start: 2008, year_end: 2014, popular: false },
  { brand: "Honda",  model: "CR-V",      code: "RD",  year_start: 2001, year_end: 2006, popular: false },
  { brand: "Honda",  model: "CR-V",      code: "RE",  year_start: 2006, year_end: 2012, popular: false },

] as const;

// Derived full name list (for backwards compatibility with any code that uses VEHICLE_MODELS)
export const VEHICLE_MODELS = VEHICLE_DATA.map(
  (v) => `${v.brand} ${v.model}`
) as unknown as readonly string[];

// Contact information
export const CONTACT_INFO = {
  phone: "+254798433973",
  email: "info@jomoautoworld.com",
  address: "Nairobi, Kenya",
  whatsapp: "254798433973",
  mpesaTill: "123456"
} as const;

export const PLACEHOLDER_IMAGE = "https://images.unsplash.com/photo-1486262715619-67b85e0b08d3?w=800&h=800&fit=crop";
