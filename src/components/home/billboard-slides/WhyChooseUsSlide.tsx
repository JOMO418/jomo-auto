"use client";

/**
 * PREMIUM SLIDE 4: WHY CHOOSE US
 * Mobile-first, statistics-focused design
 */
export function WhyChooseUsSlide() {
  return (
    <div className="relative w-full h-full bg-gradient-to-br from-teal-600 via-cyan-700 to-blue-800 overflow-hidden flex items-center justify-center px-4 py-8">
      {/* Elegant Background */}
      <div className="absolute inset-0 opacity-20">
        <div className="absolute top-0 left-1/4 w-72 h-72 bg-white rounded-full blur-3xl" />
        <div className="absolute bottom-0 right-1/4 w-72 h-72 bg-teal-300 rounded-full blur-3xl" />
      </div>

      {/* Content */}
      <div className="relative z-10 max-w-4xl mx-auto text-center w-full">
        {/* Header */}
        <div className="mb-6 md:mb-8">
          <div className="inline-flex items-center gap-2 mb-2 md:mb-3 px-3 py-1.5 bg-white/20 backdrop-blur-sm border border-white/30 rounded-full">
            <svg className="w-3 h-3 md:w-4 md:h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
            </svg>
            <span className="text-white text-xs md:text-sm font-semibold uppercase tracking-wide">
              Why Choose Us
            </span>
          </div>
          <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-2 md:mb-3">
            Trusted by <span className="text-yellow-300">Thousands</span>
          </h2>
          <p className="text-sm md:text-base text-teal-100">
            Excellence in every part, every time
          </p>
        </div>

        {/* Stats Grid - 2x2 on mobile, 4 columns on desktop */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6 mb-6 md:mb-8">
          {/* Stat 1 */}
          <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-xl md:rounded-2xl p-4 md:p-5 hover:bg-white/15 transition-all duration-300 hover:scale-105">
            <div className="text-3xl md:text-4xl font-bold text-white mb-1 md:mb-2">
              5K+
            </div>
            <div className="text-xs md:text-sm text-teal-100 font-medium">
              Happy Customers
            </div>
          </div>

          {/* Stat 2 */}
          <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-xl md:rounded-2xl p-4 md:p-5 hover:bg-white/15 transition-all duration-300 hover:scale-105">
            <div className="text-3xl md:text-4xl font-bold text-white mb-1 md:mb-2">
              15+
            </div>
            <div className="text-xs md:text-sm text-teal-100 font-medium">
              Years Experience
            </div>
          </div>

          {/* Stat 3 */}
          <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-xl md:rounded-2xl p-4 md:p-5 hover:bg-white/15 transition-all duration-300 hover:scale-105">
            <div className="flex items-center justify-center gap-1 text-3xl md:text-4xl font-bold text-white mb-1 md:mb-2">
              <span>4.8</span>
              <svg className="w-6 h-6 md:w-7 md:h-7 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
              </svg>
            </div>
            <div className="text-xs md:text-sm text-teal-100 font-medium">
              Average Rating
            </div>
          </div>

          {/* Stat 4 */}
          <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-xl md:rounded-2xl p-4 md:p-5 hover:bg-white/15 transition-all duration-300 hover:scale-105">
            <div className="text-3xl md:text-4xl font-bold text-white mb-1 md:mb-2">
              24/7
            </div>
            <div className="text-xs md:text-sm text-teal-100 font-medium">
              Support Available
            </div>
          </div>
        </div>

        {/* Features - Horizontal scroll on mobile */}
        <div className="flex flex-nowrap md:flex-wrap md:justify-center gap-3 md:gap-4 overflow-x-auto pb-2 md:pb-0 scrollbar-hide">
          <div className="flex-shrink-0 flex items-center gap-2 px-4 py-2 bg-white/10 backdrop-blur-sm border border-white/20 rounded-full">
            <svg className="w-4 h-4 text-white flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
            <span className="text-white text-xs md:text-sm font-medium whitespace-nowrap">
              Nairobi CBD
            </span>
          </div>

          <div className="flex-shrink-0 flex items-center gap-2 px-4 py-2 bg-white/10 backdrop-blur-sm border border-white/20 rounded-full">
            <svg className="w-4 h-4 text-white flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <span className="text-white text-xs md:text-sm font-medium whitespace-nowrap">
              Best Prices
            </span>
          </div>

          <div className="flex-shrink-0 flex items-center gap-2 px-4 py-2 bg-white/10 backdrop-blur-sm border border-white/20 rounded-full">
            <svg className="w-4 h-4 text-white flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
            </svg>
            <span className="text-white text-xs md:text-sm font-medium whitespace-nowrap">
              Quality Guaranteed
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
