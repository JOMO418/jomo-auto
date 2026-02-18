"use client";

import { useState, useEffect, useCallback, ReactNode } from "react";
import Image from "next/image";

interface BillboardSlide {
  id: number;
  image?: string; // Optional - for image-based slides
  component?: ReactNode; // Optional - for custom component slides
  alt: string;
  title?: string;
  subtitle?: string;
  cta?: {
    text: string;
    href: string;
  };
}

interface HeroBillboardProps {
  slides: BillboardSlide[];
  autoplayInterval?: number;
  showControls?: boolean;
}

/**
 * Professional Auto-Rotating Billboard Carousel
 * Apple/Amazon Standard - Clean, Minimal, Effective
 */
export function HeroBillboard({
  slides,
  autoplayInterval = 5000,
  showControls = true,
}: HeroBillboardProps) {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isPlaying, setIsPlaying] = useState(true);
  const [isPaused, setIsPaused] = useState(false);
  const [progress, setProgress] = useState(0);

  // Auto-advance slides with progress bar
  useEffect(() => {
    if (!isPlaying || isPaused || slides.length <= 1) {
      setProgress(0);
      return;
    }

    // Reset progress when slide changes
    setProgress(0);

    // Update progress bar smoothly
    const progressInterval = 50; // Update every 50ms for smooth animation
    const progressStep = (progressInterval / autoplayInterval) * 100;

    const progressTimer = setInterval(() => {
      setProgress((prev) => {
        const newProgress = prev + progressStep;
        return newProgress >= 100 ? 100 : newProgress;
      });
    }, progressInterval);

    // Advance to next slide
    const slideTimer = setTimeout(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, autoplayInterval);

    return () => {
      clearInterval(progressTimer);
      clearTimeout(slideTimer);
    };
  }, [isPlaying, isPaused, autoplayInterval, slides.length, currentSlide]);

  // Navigate to specific slide
  const goToSlide = useCallback((index: number) => {
    setCurrentSlide(index);
  }, []);

  // Next/Previous handlers
  const goToNext = useCallback(() => {
    setCurrentSlide((prev) => (prev + 1) % slides.length);
  }, [slides.length]);

  const goToPrevious = useCallback(() => {
    setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length);
  }, [slides.length]);

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "ArrowLeft") goToPrevious();
      if (e.key === "ArrowRight") goToNext();
      if (e.key === " ") {
        e.preventDefault();
        setIsPlaying((prev) => !prev);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [goToNext, goToPrevious]);

  if (slides.length === 0) {
    return (
      <div className="relative w-full bg-gray-100 flex items-center justify-center aspect-[21/9] md:aspect-[21/9]">
        <p className="text-gray-400 text-sm">No slides available</p>
      </div>
    );
  }

  return (
    <section
      className="relative w-full bg-gray-900 overflow-hidden group"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
      aria-label="Hero Billboard Carousel"
      aria-live="polite"
    >
      {/* Slides Container */}
      <div className="relative w-full aspect-[16/9] md:aspect-[21/9] lg:h-[22rem]">
        {slides.map((slide, index) => (
          <div
            key={slide.id}
            className={`
              absolute inset-0 transition-opacity duration-700 ease-in-out
              ${index === currentSlide ? "opacity-100 z-10" : "opacity-0 z-0"}
            `}
            aria-hidden={index !== currentSlide}
          >
            {/* Component-based slide */}
            {slide.component ? (
              <div className="w-full h-full">{slide.component}</div>
            ) : slide.image ? (
              /* Image-based slide */
              <>
                <Image
                  src={slide.image}
                  alt={slide.alt}
                  fill
                  className="object-cover"
                  priority={index === 0}
                  quality={90}
                  sizes="100vw"
                />

                {/* Gradient Overlay (subtle) */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent" />

                {/* Optional Text Content */}
                {(slide.title || slide.subtitle || slide.cta) && (
                  <div className="absolute inset-0 flex items-end">
                    <div className="container mx-auto px-4 md:px-6 pb-12 md:pb-14">
                      <div className="max-w-2xl">
                        {slide.title && (
                          <h2 className="text-3xl md:text-5xl lg:text-5xl font-bold text-white mb-3 md:mb-4 drop-shadow-lg">
                            {slide.title}
                          </h2>
                        )}
                        {slide.subtitle && (
                          <p className="text-base md:text-xl lg:text-lg text-white/90 mb-4 md:mb-5 drop-shadow-md">
                            {slide.subtitle}
                          </p>
                        )}
                        {slide.cta && (
                          <a
                            href={slide.cta.href}
                            className="inline-block px-6 md:px-8 py-3 md:py-4 bg-white text-gray-900 font-semibold rounded-lg hover:bg-gray-100 transition-colors duration-200 shadow-lg"
                          >
                            {slide.cta.text}
                          </a>
                        )}
                      </div>
                    </div>
                  </div>
                )}
              </>
            ) : null}
          </div>
        ))}
      </div>

      {/* Centered Shop Now Button - Always Visible on All Slides */}
      <div className="absolute inset-0 z-20 flex items-center justify-center pointer-events-none">
        {/* Outer pulse ring */}
        <div className="absolute w-56 md:w-72 lg:w-80 h-16 md:h-20 lg:h-24 rounded-2xl bg-[#E8002D]/20 animate-ping opacity-30 pointer-events-none"></div>
        <a
          href="/shop"
          className="pointer-events-auto group relative px-8 md:px-14 lg:px-16 py-4 md:py-5 lg:py-6 bg-gradient-to-r from-[#E8002D] via-[#D0001F] to-[#B8001F] hover:from-[#B8001F] hover:via-[#E8002D] hover:to-[#B8001F] text-white font-bold text-base md:text-xl lg:text-2xl rounded-xl md:rounded-2xl shadow-2xl shadow-red-900/60 hover:shadow-red-700/80 transition-all duration-300 hover:scale-105 active:scale-100 border-2 border-white/30 hover:border-white/50 backdrop-blur-sm ring-4 ring-white/10 hover:ring-white/20"
        >
          <span className="relative z-10 flex items-center gap-2 md:gap-3 tracking-wide">
            <svg
              className="w-5 h-5 md:w-6 md:h-6 lg:w-7 lg:h-7"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"
              />
            </svg>
            Shop Now
            <svg
              className="w-5 h-5 md:w-6 md:h-6 lg:w-7 lg:h-7 group-hover:translate-x-1.5 transition-transform duration-300"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 5l7 7-7 7"
              />
            </svg>
          </span>
          {/* Animated shine sweep */}
          <div className="absolute inset-0 rounded-xl md:rounded-2xl bg-gradient-to-r from-transparent via-white/25 to-transparent translate-x-[-200%] group-hover:translate-x-[200%] transition-transform duration-700"></div>
        </a>
      </div>

      {/* Navigation Dots ONLY - Clean, Minimal */}
      {showControls && slides.length > 1 && (
        <div className="absolute bottom-4 md:bottom-6 left-1/2 -translate-x-1/2 z-20 flex items-center gap-2">
          {slides.map((_, index) => (
            <button
              key={index}
              onClick={() => goToSlide(index)}
              className={`
                transition-all duration-300 rounded-full
                ${
                  index === currentSlide
                    ? "w-8 h-2 bg-white shadow-lg"
                    : "w-2 h-2 bg-white/50 hover:bg-white/75"
                }
              `}
              aria-label={`Go to slide ${index + 1}`}
              aria-current={index === currentSlide}
            />
          ))}
        </div>
      )}

      {/* Screen Reader Announcements */}
      <div className="sr-only" aria-live="polite" aria-atomic="true">
        Slide {currentSlide + 1} of {slides.length}
        {slides[currentSlide].alt && `: ${slides[currentSlide].alt}`}
      </div>
    </section>
  );
}

/**
 * Hero Billboard - Your JOMO Image Only
 * Clean, pure image display
 */
export const defaultBillboardSlides: BillboardSlide[] = [
  {
    id: 1,
    image: "/product-images/jomo.png",
    alt: "Welcome to JOMO AUTO WORLD - Kenya's Premier Auto Parts Destination",
  },
];
