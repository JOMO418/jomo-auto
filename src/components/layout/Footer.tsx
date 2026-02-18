"use client";

import Link from "next/link";
import { Phone, Mail, MapPin, Sparkles } from "lucide-react";

/**
 * MINIMAL PREMIUM FOOTER
 * Compact, essential information only
 */
export function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="relative bg-gradient-to-br from-[#0A0A0A] via-[#1A1A1A] to-[#0A0A0A] text-white overflow-hidden">
      {/* Subtle Ambient Glow */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-red-500 rounded-full blur-3xl" />
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-gray-800 rounded-full blur-3xl" />
      </div>

      {/* Main Footer Content - Compact */}
      <div className="relative container mx-auto px-4 sm:px-6 md:px-8 lg:px-10 xl:px-12 2xl:px-16 py-10 md:py-12 lg:py-14 xl:py-16 max-w-[1920px] 2xl:max-w-full">
        <div className="grid md:grid-cols-3 gap-8 lg:gap-10 xl:gap-12 mb-8 lg:mb-10">
          {/* Column 1: Brand */}
          <div>
            {/* Logo */}
            <Link href="/" className="inline-block group mb-4 lg:mb-5">
              <div className="flex items-center gap-2.5 lg:gap-3">
                <div className="w-10 h-10 lg:w-12 lg:h-12 xl:w-14 xl:h-14 bg-gradient-to-br from-[#E8002D] to-[#B8001F] rounded-xl lg:rounded-2xl flex items-center justify-center shadow-lg shadow-red-900/40 group-hover:scale-110 transition-transform duration-300">
                  <Sparkles className="h-5 w-5 lg:h-6 lg:w-6 xl:h-7 xl:w-7 text-white" />
                </div>
                <div>
                  <h3 className="text-xl lg:text-2xl xl:text-3xl font-bold text-white tracking-tight">
                    Jomo Auto World
                  </h3>
                  <p className="text-[10px] lg:text-xs text-gray-400 font-light">Premium Ex-Japan Parts</p>
                </div>
              </div>
            </Link>

            {/* Mission - Compact */}
            <p className="text-gray-300 text-sm lg:text-base xl:text-lg leading-relaxed mb-4 font-light">
              Kenya's trusted source for authentic ex-Japan automotive parts.
            </p>
          </div>

          {/* Column 2: Quick Links */}
          <div>
            <h4 className="text-sm lg:text-base xl:text-lg font-bold text-white mb-4 lg:mb-5 tracking-tight">Quick Links</h4>
            <ul className="space-y-2 lg:space-y-3">
              {['Shop', 'New Arrivals', 'Deals', 'Wholesale'].map((link) => (
                <li key={link}>
                  <Link
                    href={`/${link.toLowerCase().replace(' ', '-')}`}
                    className="text-gray-300 hover:text-white transition-colors font-light text-sm lg:text-base xl:text-lg inline-flex items-center gap-2 lg:gap-3 group"
                  >
                    <span className="w-1 h-1 lg:w-1.5 lg:h-1.5 bg-red-500 rounded-full group-hover:w-2 group-hover:bg-red-400 transition-all duration-200" />
                    {link}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 3: Contact - Compact */}
          <div>
            <h4 className="text-sm lg:text-base xl:text-lg font-bold text-white mb-4 lg:mb-5 tracking-tight">Contact</h4>
            <ul className="space-y-2.5 lg:space-y-3">
              <li className="flex items-start gap-2.5 lg:gap-3">
                <MapPin className="h-4 w-4 lg:h-5 lg:w-5 xl:h-6 xl:w-6 text-red-400 mt-0.5 flex-shrink-0" />
                <p className="text-gray-300 text-sm lg:text-base xl:text-lg font-light">
                  Kirinyaga Road, Nairobi
                </p>
              </li>
              <li className="flex items-start gap-2.5 lg:gap-3">
                <Phone className="h-4 w-4 lg:h-5 lg:w-5 xl:h-6 xl:w-6 text-[#E8002D] mt-0.5 flex-shrink-0" />
                <a
                  href="tel:+254700000000"
                  className="text-gray-300 hover:text-[#E8002D] text-sm lg:text-base xl:text-lg font-light transition-colors"
                >
                  +254 700 000 000
                </a>
              </li>
              <li className="flex items-start gap-2.5 lg:gap-3">
                <Mail className="h-4 w-4 lg:h-5 lg:w-5 xl:h-6 xl:w-6 text-[#E8002D] mt-0.5 flex-shrink-0" />
                <a
                  href="mailto:info@jomoautoworld.co.ke"
                  className="text-gray-300 hover:text-[#E8002D] text-sm lg:text-base xl:text-lg font-light transition-colors"
                >
                  info@jomoautoworld.co.ke
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar - Minimal */}
        <div className="border-t border-white/10 pt-6 lg:pt-8">
          <div className="flex flex-col md:flex-row items-center justify-between gap-3 lg:gap-4">
            {/* Copyright */}
            <p className="text-gray-400 text-xs lg:text-sm xl:text-base font-light text-center md:text-left">
              © {currentYear}{" "}
              <span className="font-semibold text-white">Jomo Auto World</span>.{" "}
              All rights reserved.
            </p>

            {/* Legal Links - Compact */}
            <div className="flex items-center gap-4 lg:gap-6">
              <Link
                href="/privacy"
                className="text-gray-400 hover:text-white text-xs lg:text-sm xl:text-base font-light transition-colors"
              >
                Privacy
              </Link>
              <Link
                href="/terms"
                className="text-gray-400 hover:text-white text-xs lg:text-sm xl:text-base font-light transition-colors"
              >
                Terms
              </Link>
              <Link
                href="/returns"
                className="text-gray-400 hover:text-white text-xs lg:text-sm xl:text-base font-light transition-colors"
              >
                Returns
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
