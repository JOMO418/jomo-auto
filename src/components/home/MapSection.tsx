"use client";

import { MapPin, Phone, Clock, Navigation } from "lucide-react";

/**
 * PREMIUM MAP SECTION - ELEGANT & MINIMAL
 * Real Google Maps with pin at Kirinyaga Road, Nairobi
 */
export function MapSection() {
  return (
    <section id="map" className="relative py-20 md:py-24 bg-gradient-to-br from-slate-900 via-gray-900 to-slate-900 overflow-hidden">
      {/* Ambient Glow */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-[#E8002D] rounded-full blur-3xl" />
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-slate-500 rounded-full blur-3xl" />
      </div>

      <div className="container mx-auto px-4 md:px-6 max-w-7xl relative z-10">
        {/* Header */}
        <div className="text-center mb-12 md:mb-16">
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-5 tracking-tight">
            Visit Our{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#E8002D] to-red-300">
              Showroom
            </span>
          </h2>
          <p className="text-lg md:text-xl text-gray-300 max-w-2xl mx-auto font-light">
            Experience our extensive collection of premium auto parts in person
          </p>
        </div>

        {/* Map & Contact Grid */}
        <div className="grid lg:grid-cols-5 gap-8">
          {/* Contact Cards - Left Side */}
          <div className="lg:col-span-2 space-y-5">
            {/* Location Card */}
            <div className="bg-white/10 backdrop-blur-xl rounded-2xl p-6 border border-white/20 hover:bg-white/[0.15] hover:border-white/30 transition-all duration-300 group">
              <div className="flex items-start gap-4">
                <div className="flex-shrink-0 w-12 h-12 bg-gradient-to-br from-[#E8002D] to-[#B8001F] rounded-xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300">
                  <MapPin className="h-6 w-6 text-white" />
                </div>
                <div className="flex-1">
                  <h3 className="text-white font-bold text-lg mb-2">Our Location</h3>
                  <p className="text-gray-200 font-light leading-relaxed mb-3">
                    Kirinyaga Road, Nairobi, Kenya
                  </p>
                  <a
                    href="https://www.google.com/maps/search/?api=1&query=Kirinyaga+Road+Nairobi"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 text-blue-400 hover:text-blue-300 font-semibold text-sm transition-colors group"
                  >
                    <Navigation className="h-4 w-4" />
                    <span>Get Directions</span>
                  </a>
                </div>
              </div>
            </div>

            {/* Phone Card */}
            <div className="bg-white/10 backdrop-blur-xl rounded-2xl p-6 border border-white/20 hover:bg-white/[0.15] hover:border-white/30 transition-all duration-300 group">
              <div className="flex items-start gap-4">
                <div className="flex-shrink-0 w-12 h-12 bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300">
                  <Phone className="h-6 w-6 text-white" />
                </div>
                <div className="flex-1">
                  <h3 className="text-white font-bold text-lg mb-2">Call or WhatsApp</h3>
                  <a
                    href="tel:+254700000000"
                    className="text-gray-200 hover:text-white font-light text-base transition-colors"
                  >
                    +254 700 000 000
                  </a>
                  <p className="text-gray-400 text-sm mt-1 font-light">Available during business hours</p>
                </div>
              </div>
            </div>

            {/* Hours Card */}
            <div className="bg-white/10 backdrop-blur-xl rounded-2xl p-6 border border-white/20 hover:bg-white/[0.15] hover:border-white/30 transition-all duration-300 group">
              <div className="flex items-start gap-4">
                <div className="flex-shrink-0 w-12 h-12 bg-gradient-to-br from-orange-500 to-orange-600 rounded-xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300">
                  <Clock className="h-6 w-6 text-white" />
                </div>
                <div className="flex-1">
                  <h3 className="text-white font-bold text-lg mb-2">Business Hours</h3>
                  <p className="text-gray-200 font-light">Monday - Saturday</p>
                  <p className="text-gray-200 font-semibold text-lg">8:00 AM - 6:00 PM</p>
                  <p className="text-gray-400 text-sm mt-1 font-light">Sunday: Closed</p>
                </div>
              </div>
            </div>
          </div>

          {/* Google Maps - Right Side */}
          <div className="lg:col-span-3">
            <div className="relative rounded-3xl overflow-hidden shadow-2xl border-4 border-white/10 h-full min-h-[450px] lg:min-h-[550px]">
              {/* Real Google Maps Embed - Kirinyaga Road, Nairobi */}
              <iframe
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3988.8157739384446!2d36.82844431475394!3d-1.2843154359888!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x182f10d6d4c1e6e3%3A0x8b8e8c8e8c8e8c8e!2sKirinyaga%20Road%2C%20Nairobi!5e0!3m2!1sen!2ske!4v1620000000000!5m2!1sen!2ske"
                width="100%"
                height="100%"
                style={{ border: 0 }}
                allowFullScreen
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                className="absolute inset-0"
                title="Jomo Auto World - Kirinyaga Road, Nairobi"
              />

              {/* Map Branding Overlay */}
              <div className="absolute bottom-4 left-4 right-4 md:right-auto md:max-w-xs bg-white/95 backdrop-blur-sm px-5 py-4 rounded-2xl shadow-2xl border border-gray-100">
                <div className="flex items-center gap-3">
                  <div className="flex-shrink-0 w-10 h-10 bg-gradient-to-br from-[#E8002D] to-[#B8001F] rounded-xl flex items-center justify-center">
                    <MapPin className="h-5 w-5 text-white" />
                  </div>
                  <div>
                    <p className="text-gray-900 font-bold text-sm">Jomo Auto World</p>
                    <p className="text-gray-600 text-xs font-light">Kirinyaga Road, Nairobi</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
