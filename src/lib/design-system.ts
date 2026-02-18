/**
 * JOMO AUTO WORLD - Design System Constants
 * Premium Black & Red Automotive Theme
 *
 * Black structure · Red action · White space
 */

// ============================================
// COLORS - Premium Black + Red Palette
// ============================================

export const colors = {
  // Brand Reds
  red: {
    tint:   '#FFF0F3',   // Barely-there red backgrounds
    100:    '#FFD6DE',   // Light red (badges, tags)
    300:    '#FF6B85',   // Mid-light red
    400:    '#FF3355',   // Bright red (highlights)
    500:    '#E8002D',   // PRIMARY — CTAs, prices, active states
    600:    '#B8001F',   // Hover/depth (gradient end)
    700:    '#8A0015',   // Pressed states
    800:    '#5C000D',   // Deep red (shadows)
  },

  // Carbon Black Palette
  black: {
    pure:     '#000000',   // Absolute black (rare accents)
    jet:      '#0A0A0A',   // Header, footer, sidebar backgrounds
    carbon:   '#1A1A1A',   // Elevated dark surfaces, dropdowns
    graphite: '#2D2D2D',   // Borders on dark surfaces
    smoke:    '#404040',   // Muted icons on dark bg
  },

  // Neutral Grays (kept from original — these are correct)
  gray: {
    50:  '#F9FAFB',
    100: '#F3F4F6',
    200: '#E5E7EB',
    300: '#D1D5DB',
    400: '#9CA3AF',
    500: '#6B7280',
    600: '#4B5563',
    700: '#374151',
    800: '#1F2937',
    900: '#111827',
  },

  // Semantic Colors
  primary: '#E8002D',      // Racing Red — CTAs, links, active
  success: '#16A34A',      // Green — cart confirmations, in-stock
  warning: '#D97706',      // Amber — promotions, deals, low stock
  error:   '#E8002D',      // Same as primary red

  // Background & Surface
  white:      '#FFFFFF',
  background: '#F8F8F8',   // Slightly off-white page background
  surface:    '#FFFFFF',   // Card backgrounds

  // Borders
  border: {
    light:   '#E5E7EB',    // Light dividers on white
    default: '#D4D4D4',    // Standard borders
    dark:    '#404040',    // Borders on dark surfaces
    red:     '#E8002D',    // Red highlight borders (hover states)
  },

  // Text
  text: {
    primary:   '#0A0A0A',  // Body text on white
    secondary: '#4B5563',  // Supporting text
    tertiary:  '#6B7280',  // Muted/meta text
    inverse:   '#FFFFFF',  // Text on dark backgrounds
    red:       '#E8002D',  // Red emphasis (prices, active labels)
  },

  // Gradients — defined once, used everywhere
  gradient: {
    // Structural: Header, Sidebar, Footer, dark bars
    structural:    'from-[#0A0A0A] via-[#1A1A1A] to-[#0A0A0A]',
    // Primary CTA: Order Now, Checkout, Shop All buttons
    primary:       'from-[#E8002D] to-[#B8001F]',
    primaryHover:  'from-[#B8001F] to-[#8A0015]',
    // Hero / banner sections: dramatic diagonal black-to-red
    hero:          'from-[#0A0A0A] via-[#1A1A1A] to-[#B8001F]',
    // Subtle red tint for section accents
    redAccent:     'from-[#E8002D] via-[#FF3355] to-[#E8002D]',
  },
} as const;

// ============================================
// TYPOGRAPHY - Inter + Outfit
// ============================================

export const typography = {
  // Font Families
  fontFamily: {
    sans: 'var(--font-inter), system-ui, -apple-system, sans-serif',
    heading: 'var(--font-outfit), system-ui, -apple-system, sans-serif',
  },

  // Font Sizes (rem-based, 16px base)
  fontSize: {
    xs: '0.75rem',      // 12px
    sm: '0.875rem',     // 14px
    base: '1rem',       // 16px
    lg: '1.125rem',     // 18px
    xl: '1.25rem',      // 20px
    '2xl': '1.5rem',    // 24px
    '3xl': '1.875rem',  // 30px
    '4xl': '2.25rem',   // 36px
    '5xl': '3rem',      // 48px
  },

  // Font Weights
  fontWeight: {
    normal: '400',
    medium: '500',
    semibold: '600',
    bold: '700',
  },

  // Line Heights
  lineHeight: {
    tight: '1.2',
    snug: '1.3',
    normal: '1.5',
    relaxed: '1.6',
    loose: '1.8',
  },

  // Letter Spacing
  letterSpacing: {
    tighter: '-0.02em',
    tight: '-0.01em',
    normal: '0',
    wide: '0.01em',
    wider: '0.02em',
  },
} as const;

// ============================================
// SPACING - 8px Grid System
// ============================================

export const spacing = {
  0: '0',
  px: '1px',
  0.5: '0.125rem',  // 2px
  1: '0.25rem',     // 4px
  2: '0.5rem',      // 8px
  3: '0.75rem',     // 12px
  4: '1rem',        // 16px
  5: '1.25rem',     // 20px
  6: '1.5rem',      // 24px
  8: '2rem',        // 32px
  10: '2.5rem',     // 40px
  12: '3rem',       // 48px
  16: '4rem',       // 64px
  20: '5rem',       // 80px
  24: '6rem',       // 96px
} as const;

// ============================================
// BORDER RADIUS - Clean, Subtle Curves
// ============================================

export const borderRadius = {
  none: '0',
  sm: '0.25rem',    // 4px
  md: '0.5rem',     // 8px
  lg: '0.75rem',    // 12px
  xl: '1rem',       // 16px
  '2xl': '1.5rem',  // 24px
  full: '9999px',   // Pill shape
} as const;

// ============================================
// SHADOWS - Subtle, Realistic Depth
// ============================================

export const shadows = {
  sm: '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
  md: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
  lg: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
  xl: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
  none: 'none',
} as const;

// ============================================
// TRANSITIONS - Fast, Purposeful
// ============================================

export const transitions = {
  fast: '100ms ease',
  normal: '200ms ease',
  slow: '300ms ease',
  carousel: '600ms ease-in-out',

  // Easing functions
  easing: {
    linear: 'linear',
    ease: 'ease',
    easeIn: 'ease-in',
    easeOut: 'ease-out',
    easeInOut: 'ease-in-out',
  },
} as const;

// ============================================
// BREAKPOINTS - Responsive Design
// ============================================

export const breakpoints = {
  sm: '640px',    // Mobile landscape
  md: '768px',    // Tablet portrait
  lg: '1024px',   // Desktop
  xl: '1280px',   // Large desktop
  '2xl': '1536px', // Extra large
} as const;

// ============================================
// Z-INDEX SCALE - Consistent Layering
// ============================================

export const zIndex = {
  base: 0,
  dropdown: 10,
  sticky: 20,
  fixed: 30,
  modalBackdrop: 40,
  modal: 50,
  popover: 60,
  tooltip: 70,
} as const;

// ============================================
// COMPONENT-SPECIFIC VALUES
// ============================================

export const components = {
  // Buttons
  button: {
    height: {
      sm: '2rem',      // 32px
      md: '2.5rem',    // 40px
      lg: '3rem',      // 48px
    },
    padding: {
      sm: '0.5rem 1rem',
      md: '0.75rem 1.5rem',
      lg: '1rem 2rem',
    },
  },

  // Inputs
  input: {
    height: {
      sm: '2rem',
      md: '2.5rem',
      lg: '3rem',
    },
    padding: '0.75rem 1rem',
    borderWidth: '1px',
  },

  // Cards
  card: {
    padding: '1.5rem',
    borderRadius: borderRadius.lg,
    shadow: shadows.md,
  },

  // Header
  header: {
    height: {
      mobile: '3.5rem',   // 56px
      desktop: '5rem',    // 80px
    },
  },

  // Billboard Carousel
  billboard: {
    aspectRatio: {
      desktop: '21 / 9',   // Cinematic
      mobile: '16 / 9',    // Standard
    },
    height: {
      desktop: '28rem',    // 448px
      mobile: '15rem',     // 240px
    },
    autoplayInterval: 5000, // 5 seconds
    transitionDuration: 600, // ms
  },

  // Dropdown
  dropdown: {
    maxHeight: '25rem',  // 400px
    itemHeight: '2.5rem', // 40px
  },
} as const;

// ============================================
// HELPER FUNCTIONS
// ============================================

/**
 * Get responsive value based on breakpoint
 */
export const responsive = {
  mobile: (value: string | number) => `@media (max-width: ${breakpoints.sm})`,
  tablet: (value: string | number) => `@media (min-width: ${breakpoints.sm}) and (max-width: ${breakpoints.lg})`,
  desktop: (value: string | number) => `@media (min-width: ${breakpoints.lg})`,
};

/**
 * Create consistent focus ring styles
 */
export const focusRing = {
  default: `
    outline: 2px solid ${colors.red[500]};
    outline-offset: 2px;
  `,
  within: `
    outline: 2px solid ${colors.red[500]};
    outline-offset: -2px;
  `,
};

export default {
  colors,
  typography,
  spacing,
  borderRadius,
  shadows,
  transitions,
  breakpoints,
  zIndex,
  components,
};
