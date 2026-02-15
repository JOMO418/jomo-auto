"use client";

import { useState, useEffect, useCallback } from "react";
import Image from "next/image";

interface BillboardSlide {
  id: number;
  image: string;
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

  // Auto-advance slides
  useEffect(() => {
    if (!isPlaying || isPaused || slides.length <= 1) return;

    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, autoplayInterval);

    return () => clearInterval(timer);
  }, [isPlaying, isPaused, autoplayInterval, slides.length]);

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
      <div className="relative w-full aspect-[16/9] md:aspect-[21/9] lg:h-[28rem]">
        {slides.map((slide, index) => (
          <div
            key={slide.id}
            className={`
              absolute inset-0 transition-opacity duration-700 ease-in-out
              ${index === currentSlide ? "opacity-100 z-10" : "opacity-0 z-0"}
            `}
            aria-hidden={index !== currentSlide}
          >
            {/* Background Image */}
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
                <div className="container mx-auto px-4 md:px-6 pb-12 md:pb-16">
                  <div className="max-w-2xl">
                    {slide.title && (
                      <h2 className="text-3xl md:text-5xl lg:text-6xl font-bold text-white mb-3 md:mb-4 drop-shadow-lg">
                        {slide.title}
                      </h2>
                    )}
                    {slide.subtitle && (
                      <p className="text-base md:text-xl text-white/90 mb-4 md:mb-6 drop-shadow-md">
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
          </div>
        ))}
      </div>

      {/* No visible controls - Clean billboard presentation */}

      {/* Screen Reader Announcements */}
      <div className="sr-only" aria-live="polite" aria-atomic="true">
        Slide {currentSlide + 1} of {slides.length}
        {slides[currentSlide].alt && `: ${slides[currentSlide].alt}`}
      </div>
    </section>
  );
}

/**
 * Default/Placeholder Slides
 * Replace these with actual billboard images
 */
export const defaultBillboardSlides: BillboardSlide[] = [
  {
    id: 1,
    image: "https://images.unsplash.com/photo-1486262715619-67b85e0b08d3?w=1920&h=600&fit=crop&q=80",
    alt: "Quality Auto Parts - Professional Service",
    title: "Quality Auto Parts",
    subtitle: "Genuine parts for all Japanese & European vehicles",
  },
  {
    id: 2,
    image: "https://images.unsplash.com/photo-1492144534655-ae79c964c9d7?w=1920&h=600&fit=crop&q=80",
    alt: "Fast Delivery Across Nairobi",
    title: "Same-Day Delivery",
    subtitle: "Fast, reliable service across Nairobi",
  },
  {
    id: 3,
    image: "https://images.unsplash.com/photo-1619642751034-765dfdf7c58e?w=1920&h=600&fit=crop&q=80",
    alt: "Wide Selection of Parts",
    title: "Wide Selection",
    subtitle: "Suspension, brakes, engine parts & more",
  },
  {
    id: 4,
    image: "https://images.unsplash.com/photo-1625047509168-a7026f36de04?w=1920&h=600&fit=crop&q=80",
    alt: "Warranty Backed Quality",
    title: "Warranty Backed",
    subtitle: "All parts come with manufacturer warranty",
  },
];
