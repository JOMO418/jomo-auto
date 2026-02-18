"use client";

/**
 * PREMIUM SLIDE 3: OUR PROMISE
 * Mobile-first, clean 2x2 grid design
 */
export function OurPromiseSlide() {
  return (
    <div className="relative w-full h-full bg-gradient-to-br from-slate-900 via-slate-800 to-gray-900 overflow-hidden flex items-center justify-center px-4 py-8">
      {/* Elegant Background Glow */}
      <div className="absolute inset-0 opacity-20">
        <div className="absolute top-1/4 right-0 w-96 h-96 bg-[#E8002D] rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 left-0 w-96 h-96 bg-[#0A0A0A] rounded-full blur-3xl" />
      </div>

      {/* Content */}
      <div className="relative z-10 max-w-5xl mx-auto text-center w-full">
        {/* Header */}
        <div className="mb-6 md:mb-8">
          <div className="inline-flex items-center gap-2 mb-2 md:mb-3 px-3 py-1.5 bg-gradient-to-r from-yellow-400/20 to-orange-500/20 backdrop-blur-sm border border-yellow-400/30 rounded-full">
            <svg className="w-3 h-3 md:w-4 md:h-4 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
              <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
            </svg>
            <span className="text-white text-xs md:text-sm font-semibold uppercase tracking-wide">
              Our Promise
            </span>
          </div>
          <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-white">
            Quality You Can <span className="text-yellow-400">Trust</span>
          </h2>
        </div>

        {/* 2x2 Grid - Mobile optimized */}
        <div className="grid grid-cols-2 gap-3 md:gap-4 lg:gap-6 max-w-3xl mx-auto">
          {/* Quality */}
          <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-xl md:rounded-2xl p-4 md:p-6 hover:bg-white/15 transition-all duration-300">
            <div className="w-10 h-10 md:w-12 md:h-12 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-lg md:rounded-xl flex items-center justify-center mx-auto mb-3 md:mb-4">
              <svg className="w-5 h-5 md:w-6 md:h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h3 className="text-sm md:text-base lg:text-lg font-bold text-white mb-1 md:mb-2">
              100% Genuine
            </h3>
            <p className="text-xs md:text-sm text-gray-300 leading-relaxed">
              Certified OEM parts
            </p>
          </div>

          {/* Fast Delivery */}
          <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-xl md:rounded-2xl p-4 md:p-6 hover:bg-white/15 transition-all duration-300">
            <div className="w-10 h-10 md:w-12 md:h-12 bg-gradient-to-br from-green-400 to-emerald-500 rounded-lg md:rounded-xl flex items-center justify-center mx-auto mb-3 md:mb-4">
              <svg className="w-5 h-5 md:w-6 md:h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
            </div>
            <h3 className="text-sm md:text-base lg:text-lg font-bold text-white mb-1 md:mb-2">
              Fast Delivery
            </h3>
            <p className="text-xs md:text-sm text-gray-300 leading-relaxed">
              Same-day Nairobi
            </p>
          </div>

          {/* Warranty */}
          <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-xl md:rounded-2xl p-4 md:p-6 hover:bg-white/15 transition-all duration-300">
            <div className="w-10 h-10 md:w-12 md:h-12 bg-gradient-to-br from-[#E8002D] to-[#B8001F] rounded-lg md:rounded-xl flex items-center justify-center mx-auto mb-3 md:mb-4">
              <svg className="w-5 h-5 md:w-6 md:h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
              </svg>
            </div>
            <h3 className="text-sm md:text-base lg:text-lg font-bold text-white mb-1 md:mb-2">
              Warranty
            </h3>
            <p className="text-xs md:text-sm text-gray-300 leading-relaxed">
              Full protection
            </p>
          </div>

          {/* Expert Support */}
          <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-xl md:rounded-2xl p-4 md:p-6 hover:bg-white/15 transition-all duration-300">
            <div className="w-10 h-10 md:w-12 md:h-12 bg-gradient-to-br from-purple-400 to-pink-500 rounded-lg md:rounded-xl flex items-center justify-center mx-auto mb-3 md:mb-4">
              <svg className="w-5 h-5 md:w-6 md:h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
              </svg>
            </div>
            <h3 className="text-sm md:text-base lg:text-lg font-bold text-white mb-1 md:mb-2">
              Expert Help
            </h3>
            <p className="text-xs md:text-sm text-gray-300 leading-relaxed">
              Professional advice
            </p>
          </div>
        </div>

        {/* Trust Badge */}
        <div className="mt-6 md:mt-8">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/5 backdrop-blur-sm border border-white/10 rounded-full">
            <svg className="w-4 h-4 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
              <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
            </svg>
            <span className="text-white text-xs md:text-sm font-medium">
              Trusted by 5,000+ Customers
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
