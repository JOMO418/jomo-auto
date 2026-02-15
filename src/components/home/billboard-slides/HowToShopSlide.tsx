"use client";

/**
 * PREMIUM SLIDE 2: HOW TO SHOP
 * Mobile-first, clean, minimal design
 */
export function HowToShopSlide() {
  return (
    <div className="relative w-full h-full bg-gradient-to-br from-blue-600 via-blue-700 to-indigo-800 overflow-hidden flex items-center justify-center px-4 py-8">
      {/* Subtle Background Pattern */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-0 right-0 w-64 h-64 bg-white rounded-full blur-3xl" />
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-blue-300 rounded-full blur-3xl" />
      </div>

      {/* Content */}
      <div className="relative z-10 max-w-4xl mx-auto text-center">
        {/* Header */}
        <div className="mb-6 md:mb-10">
          <div className="inline-block mb-2 md:mb-3 px-3 py-1 bg-white/20 backdrop-blur-sm border border-white/30 rounded-full">
            <span className="text-white text-xs md:text-sm font-semibold uppercase tracking-wide">
              Simple Shopping
            </span>
          </div>
          <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-2 md:mb-3">
            3 Easy Steps
          </h2>
          <p className="text-sm md:text-base text-blue-100">
            Finding parts has never been easier
          </p>
        </div>

        {/* Steps - Vertical on mobile, horizontal on desktop */}
        <div className="flex flex-col md:flex-row items-center justify-center gap-4 md:gap-6 lg:gap-8">
          {/* Step 1 */}
          <div className="flex items-center gap-4 md:flex-col md:gap-3 text-left md:text-center w-full md:w-auto max-w-sm">
            <div className="flex-shrink-0 w-14 h-14 md:w-16 md:h-16 bg-white rounded-xl md:rounded-2xl flex items-center justify-center shadow-lg">
              <div className="text-2xl md:text-3xl font-bold text-blue-600">1</div>
            </div>
            <div className="flex-1 md:flex-initial">
              <h3 className="text-base md:text-lg font-bold text-white mb-1">
                Find Your Part
              </h3>
              <p className="text-xs md:text-sm text-blue-100">
                Search by vehicle or category
              </p>
            </div>
          </div>

          {/* Arrow - Hidden on mobile */}
          <div className="hidden md:block text-white/50">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
            </svg>
          </div>

          {/* Step 2 */}
          <div className="flex items-center gap-4 md:flex-col md:gap-3 text-left md:text-center w-full md:w-auto max-w-sm">
            <div className="flex-shrink-0 w-14 h-14 md:w-16 md:h-16 bg-white rounded-xl md:rounded-2xl flex items-center justify-center shadow-lg">
              <div className="text-2xl md:text-3xl font-bold text-blue-600">2</div>
            </div>
            <div className="flex-1 md:flex-initial">
              <h3 className="text-base md:text-lg font-bold text-white mb-1">
                Add to Cart
              </h3>
              <p className="text-xs md:text-sm text-blue-100">
                Select quantity & checkout
              </p>
            </div>
          </div>

          {/* Arrow - Hidden on mobile */}
          <div className="hidden md:block text-white/50">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
            </svg>
          </div>

          {/* Step 3 */}
          <div className="flex items-center gap-4 md:flex-col md:gap-3 text-left md:text-center w-full md:w-auto max-w-sm">
            <div className="flex-shrink-0 w-14 h-14 md:w-16 md:h-16 bg-white rounded-xl md:rounded-2xl flex items-center justify-center shadow-lg">
              <div className="text-2xl md:text-3xl font-bold text-blue-600">3</div>
            </div>
            <div className="flex-1 md:flex-initial">
              <h3 className="text-base md:text-lg font-bold text-white mb-1">
                Fast Delivery
              </h3>
              <p className="text-xs md:text-sm text-blue-100">
                Same-day in Nairobi
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
