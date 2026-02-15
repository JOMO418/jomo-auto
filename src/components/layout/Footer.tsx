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
    <footer className="relative bg-gradient-to-br from-slate-900 via-gray-900 to-slate-900 text-white overflow-hidden">
      {/* Subtle Ambient Glow */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-blue-500 rounded-full blur-3xl" />
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-slate-600 rounded-full blur-3xl" />
      </div>

      {/* Main Footer Content - Compact */}
      <div className="relative container mx-auto px-4 sm:px-6 py-10 md:py-12 max-w-7xl">
        <div className="grid md:grid-cols-3 gap-8 mb-8">
          {/* Column 1: Brand */}
          <div>
            {/* Logo */}
            <Link href="/" className="inline-block group mb-4">
              <div className="flex items-center gap-2.5">
                <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300">
                  <Sparkles className="h-5 w-5 text-white" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-white tracking-tight">
                    Jomo Auto World
                  </h3>
                  <p className="text-[10px] text-gray-400 font-light">Premium Ex-Japan Parts</p>
                </div>
              </div>
            </Link>

            {/* Mission - Compact */}
            <p className="text-gray-300 text-sm leading-relaxed mb-4 font-light">
              Kenya's trusted source for authentic ex-Japan automotive parts.
            </p>
          </div>

          {/* Column 2: Quick Links */}
          <div>
            <h4 className="text-sm font-bold text-white mb-4 tracking-tight">Quick Links</h4>
            <ul className="space-y-2">
              {['Shop', 'New Arrivals', 'Deals', 'Wholesale'].map((link) => (
                <li key={link}>
                  <Link
                    href={`/${link.toLowerCase().replace(' ', '-')}`}
                    className="text-gray-300 hover:text-white transition-colors font-light text-sm inline-flex items-center gap-2 group"
                  >
                    <span className="w-1 h-1 bg-blue-500 rounded-full group-hover:w-2 group-hover:bg-blue-400 transition-all duration-200" />
                    {link}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 3: Contact - Compact */}
          <div>
            <h4 className="text-sm font-bold text-white mb-4 tracking-tight">Contact</h4>
            <ul className="space-y-2.5">
              <li className="flex items-start gap-2.5">
                <MapPin className="h-4 w-4 text-blue-400 mt-0.5 flex-shrink-0" />
                <p className="text-gray-300 text-sm font-light">
                  Kirinyaga Road, Nairobi
                </p>
              </li>
              <li className="flex items-start gap-2.5">
                <Phone className="h-4 w-4 text-emerald-400 mt-0.5 flex-shrink-0" />
                <a
                  href="tel:+254700000000"
                  className="text-gray-300 hover:text-emerald-400 text-sm font-light transition-colors"
                >
                  +254 700 000 000
                </a>
              </li>
              <li className="flex items-start gap-2.5">
                <Mail className="h-4 w-4 text-orange-400 mt-0.5 flex-shrink-0" />
                <a
                  href="mailto:info@jomoautoworld.co.ke"
                  className="text-gray-300 hover:text-orange-400 text-sm font-light transition-colors"
                >
                  info@jomoautoworld.co.ke
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar - Minimal */}
        <div className="border-t border-white/10 pt-6">
          <div className="flex flex-col md:flex-row items-center justify-between gap-3">
            {/* Copyright */}
            <p className="text-gray-400 text-xs font-light text-center md:text-left">
              © {currentYear}{" "}
              <span className="font-semibold text-white">Jomo Auto World</span>.{" "}
              All rights reserved.
            </p>

            {/* Legal Links - Compact */}
            <div className="flex items-center gap-4">
              <Link
                href="/privacy"
                className="text-gray-400 hover:text-white text-xs font-light transition-colors"
              >
                Privacy
              </Link>
              <Link
                href="/terms"
                className="text-gray-400 hover:text-white text-xs font-light transition-colors"
              >
                Terms
              </Link>
              <Link
                href="/returns"
                className="text-gray-400 hover:text-white text-xs font-light transition-colors"
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
