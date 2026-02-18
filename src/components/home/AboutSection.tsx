"use client";

import { Shield, Package, Users, Award } from "lucide-react";

/**
 * PREMIUM ABOUT SECTION - MASTERPIECE
 * Sophisticated, minimal, trustworthy copywriting
 * Emphasizes Ex-Japan quality & customer diversity
 */
export function AboutSection() {
  return (
    <section className="relative py-16 md:py-20 bg-gradient-to-br from-white via-gray-50/50 to-white overflow-hidden">
      {/* Elegant Ambient Glow */}
      <div className="absolute inset-0 opacity-[0.015]">
        <div className="absolute top-1/3 right-0 w-[600px] h-[600px] bg-[#E8002D] rounded-full blur-3xl" />
        <div className="absolute bottom-1/3 left-0 w-[600px] h-[600px] bg-[#0A0A0A] rounded-full blur-3xl" />
      </div>

      <div className="container mx-auto px-4 md:px-6 max-w-6xl relative z-10">
        {/* Premium Header */}
        <div className="text-center mb-10 md:mb-12">
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 mb-6 leading-[1.15] tracking-tight">
            Where{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#E8002D] via-[#D0001F] to-[#0A0A0A]">
              Quality
            </span>{" "}
            Meets{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#0A0A0A] via-[#B8001F] to-[#E8002D]">
              Variety
            </span>
          </h2>

          {/* Impressive Copy - Brief & Powerful */}
          <div className="max-w-4xl mx-auto space-y-5">
            <p className="text-xl md:text-2xl text-gray-700 leading-relaxed font-light">
              Jomo Auto World is Kenya's leading online automotive store, specializing in{" "}
              <span className="font-semibold text-gray-900">premium ex-Japan parts</span>{" "}
              that set the standard for quality and reliability.
            </p>
            <p className="text-lg md:text-xl text-gray-600 leading-relaxed font-light">
              From our showroom on{" "}
              <span className="font-medium text-gray-800">Kirinyaga Road, Nairobi</span>, we deliver excellence
              across Kenya—same day. Serving{" "}
              <span className="font-medium text-gray-800">mechanics, shop owners, fleet managers, and vehicle enthusiasts</span>{" "}
              with passion and expertise.
            </p>
          </div>
        </div>

        {/* Trust Cards - 2 Compact Cards Side-by-Side */}
        <div className="grid md:grid-cols-2 gap-5 mb-12 max-w-5xl mx-auto">
          {/* Card 1: Ex-Japan Excellence */}
          <div className="group relative bg-white rounded-2xl p-6 md:p-7 shadow-lg hover:shadow-xl border border-gray-200 hover:border-[#E8002D]/40 transition-all duration-300 hover:-translate-y-1">
            <div className="flex items-start gap-4">
              {/* Icon */}
              <div className="flex-shrink-0 w-12 h-12 bg-gradient-to-br from-[#E8002D] to-[#B8001F] rounded-xl flex items-center justify-center shadow-md group-hover:scale-110 transition-transform duration-300">
                <Package className="h-6 w-6 text-white" />
              </div>

              <div className="flex-1">
                {/* Title */}
                <h3 className="text-lg md:text-xl font-bold text-gray-900 mb-2 tracking-tight">
                  Premium Ex-Japan Parts
                </h3>

                {/* Copy */}
                <p className="text-sm md:text-base text-gray-600 leading-relaxed font-light">
                  Authentic, high-quality components shipped directly from Japan with rigorous quality control.
                </p>
              </div>
            </div>
          </div>

          {/* Card 2: Serving the Industry */}
          <div className="group relative bg-white rounded-2xl p-6 md:p-7 shadow-lg hover:shadow-xl border border-gray-200 hover:border-[#0A0A0A]/20 transition-all duration-300 hover:-translate-y-1">
            <div className="flex items-start gap-4">
              {/* Icon */}
              <div className="flex-shrink-0 w-12 h-12 bg-gradient-to-br from-[#0A0A0A] to-[#2D2D2D] rounded-xl flex items-center justify-center shadow-md group-hover:scale-110 transition-transform duration-300">
                <Users className="h-6 w-6 text-white" />
              </div>

              <div className="flex-1">
                {/* Title */}
                <h3 className="text-lg md:text-xl font-bold text-gray-900 mb-2 tracking-tight">
                  Serving Every Customer
                </h3>

                {/* Copy */}
                <p className="text-sm md:text-base text-gray-600 leading-relaxed font-light">
                  Mechanics, shop owners, fleet managers—we serve all with wholesale pricing and expertise.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Trust Indicators - Compact 4 Column Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-4xl mx-auto">
          {/* Indicator 1 */}
          <div className="text-center group">
            <div className="inline-flex items-center justify-center w-12 h-12 bg-gradient-to-br from-red-50 to-red-100/80 rounded-xl mb-3 group-hover:scale-110 transition-transform duration-300">
              <Shield className="h-6 w-6 text-[#E8002D]" />
            </div>
            <h4 className="font-bold text-gray-900 mb-1 text-sm">
              100% Authentic
            </h4>
            <p className="text-xs text-gray-600 font-light">
              Genuine ex-Japan
            </p>
          </div>

          {/* Indicator 2 */}
          <div className="text-center group">
            <div className="inline-flex items-center justify-center w-12 h-12 bg-gradient-to-br from-emerald-50 to-emerald-100/80 rounded-xl mb-3 group-hover:scale-110 transition-transform duration-300">
              <svg className="w-6 h-6 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
            </div>
            <h4 className="font-bold text-gray-900 mb-1 text-sm">
              Same-Day Delivery
            </h4>
            <p className="text-xs text-gray-600 font-light">
              Nationwide reach
            </p>
          </div>

          {/* Indicator 3 */}
          <div className="text-center group">
            <div className="inline-flex items-center justify-center w-12 h-12 bg-gradient-to-br from-purple-50 to-purple-100/80 rounded-xl mb-3 group-hover:scale-110 transition-transform duration-300">
              <Award className="h-6 w-6 text-purple-600" />
            </div>
            <h4 className="font-bold text-gray-900 mb-1 text-sm">
              Wholesale Pricing
            </h4>
            <p className="text-xs text-gray-600 font-light">
              Bulk discounts
            </p>
          </div>

          {/* Indicator 4 */}
          <div className="text-center group">
            <div className="inline-flex items-center justify-center w-12 h-12 bg-gradient-to-br from-orange-50 to-orange-100/80 rounded-xl mb-3 group-hover:scale-110 transition-transform duration-300">
              <svg className="w-6 h-6 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h4 className="font-bold text-gray-900 mb-1 text-sm">
              Expert Support
            </h4>
            <p className="text-xs text-gray-600 font-light">
              Professional team
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
