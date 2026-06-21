"use client";

import React, { useState, useEffect, useCallback, useRef } from "react";
import { motion, AnimatePresence, Variants } from "framer-motion";
import { ChevronLeft, ChevronRight, Clock, MapPin } from "lucide-react";
import { SanityImage } from "@/components/ui/SanityImage";
import { HeroSlide, SiteSettings } from "@/types";
import Link from "next/link";
import { getPublicPath } from "@/lib/i18n/routes";
import { Locale } from "@/lib/i18n/config";

interface HeroSectionProps {
  slides: HeroSlide[];
  settings?: SiteSettings;
  locale: Locale;
}

export function HeroSection({ slides, settings, locale }: HeroSectionProps) {
  const [activeIndex, setActiveIndex] = useState(0);
  const [direction, setDirection] = useState(0); // -1 for left, 1 for right
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  const slideCount = slides?.length || 0;

  // Clear timer
  const clearAutoplay = useCallback(() => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
  }, []);

  // Setup autoplay timer (6 seconds)
  const startAutoplay = useCallback(() => {
    clearAutoplay();
    if (slideCount <= 1) return;
    
    timerRef.current = setInterval(() => {
      setDirection(1);
      setActiveIndex((prevIndex) => (prevIndex + 1) % slideCount);
    }, 6000);
  }, [slideCount, clearAutoplay]);

  // Reset autoplay timer on interaction
  const resetAutoplay = useCallback(() => {
    startAutoplay();
  }, [startAutoplay]);

  useEffect(() => {
    startAutoplay();
    return () => clearAutoplay();
  }, [startAutoplay, clearAutoplay]);

  if (slideCount === 0) return null;

  const activeSlide = slides[activeIndex];

  // Paginate handler
  const paginate = (newDirection: number) => {
    setDirection(newDirection);
    if (newDirection === 1) {
      setActiveIndex((prev) => (prev + 1) % slideCount);
    } else {
      setActiveIndex((prev) => (prev - 1 + slideCount) % slideCount);
    }
    resetAutoplay();
  };

  // Localized static strings
  const strings = {
    openToday: locale === "en" ? "OPEN TODAY" : "BUGÜN AÇIK",
    planVisit: locale === "en" ? "PLAN YOUR VISIT" : "ZİYARETİNİZİ PLANLAYIN",
  };

  // Helper to localize CTA link
  const getLocalizedCtaLink = (link?: string) => {
    if (!link) return "/";
    if (link.startsWith("http://") || link.startsWith("https://")) return link;
    const cleanPath = link.startsWith("/") ? link.slice(1) : link;
    return getPublicPath(cleanPath, locale);
  };

  // Text shadow style to ensure readability on any background (light reflections, pavement)
  const textShadowStyle = {
    textShadow: "0 2px 4px rgba(0, 0, 0, 0.75), 0 1px 2px rgba(0, 0, 0, 0.5)",
  };

  // Framer Motion Sliding Animation Variants
  const slideVariants: Variants = {
    enter: (dir: number) => ({
      x: dir > 0 ? "100%" : "-100%",
      opacity: 0,
    }),
    center: {
      x: 0,
      opacity: 1,
      transition: {
        x: { type: "spring" as const, stiffness: 300, damping: 30 },
        opacity: { duration: 0.3 },
      },
    },
    exit: (dir: number) => ({
      x: dir < 0 ? "100%" : "-100%",
      opacity: 0,
      transition: {
        x: { type: "spring" as const, stiffness: 300, damping: 30 },
        opacity: { duration: 0.3 },
      },
    }),
  };

  return (
    <section className="relative w-full h-[calc(100vh-80px)] md:h-[calc(100vh-128px)] bg-neutral-950 overflow-hidden select-none">
      {/* 1. Slides Container */}
      <div className="relative w-full h-full">
        <AnimatePresence initial={false} custom={direction} mode="popLayout">
          <motion.div
            key={activeIndex}
            custom={direction}
            variants={slideVariants}
            initial="enter"
            animate="center"
            exit="exit"
            drag="x"
            dragConstraints={{ left: 0, right: 0 }}
            dragElastic={0.4}
            onDragEnd={(e, { offset }) => {
              if (offset.x < -50) {
                paginate(1);
              } else if (offset.x > 50) {
                paginate(-1);
              }
            }}
            className="absolute inset-0 w-full h-full cursor-default"
          >
            {/* Background Images */}
            {activeSlide?.desktopImage && (
              <div className="absolute inset-0 z-0">
                {/* Desktop Background Image */}
                <div className={activeSlide.mobileImage ? "hidden md:block w-full h-full relative" : "w-full h-full relative"}>
                  <SanityImage
                    image={activeSlide.desktopImage}
                    fill
                    sizes="100vw"
                    quality={90}
                    className="object-cover pointer-events-none"
                    priority
                    noBlur
                  />
                </div>
                
                {/* Mobile Background Image (if available) */}
                {activeSlide.mobileImage && (
                  <div className="block md:hidden w-full h-full relative">
                    <SanityImage
                      image={activeSlide.mobileImage}
                      fill
                      sizes="100vw"
                      quality={90}
                      className="object-cover pointer-events-none"
                      priority
                      noBlur
                    />
                  </div>
                )}
                
                {/* Optimized bottom-heavy linear gradient overlay (dark at the pavement level, clear at the sky level) */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/35 to-transparent" />
              </div>
            )}

            {/* Slide Content Overlay */}
            <div className="absolute inset-0 z-10 flex flex-col justify-end pb-20 md:pb-32">
              <div className="w-full max-w-[1600px] mx-auto px-6 md:px-16 lg:px-20">
                {/* Top Section: Tag and Large Title above the line */}
                <div className="text-white">
                  {/* Localized optional Tag / Category label */}
                  {activeSlide?.tag && (
                    <span 
                      style={textShadowStyle}
                      className="font-bold text-xs tracking-[0.25em] uppercase text-white block mb-3 md:mb-4 select-none"
                    >
                      {activeSlide.tag}
                    </span>
                  )}
                  
                  {/* Slide Main Title (Medium weight Serif, responsive size to stay on single line on desktop) */}
                  <h1 
                    style={textShadowStyle}
                    className="text-xl sm:text-2xl md:text-4xl lg:text-[44px] xl:text-[52px] font-medium font-serif uppercase tracking-[0.05em] leading-tight mb-2 select-text max-w-full"
                  >
                    {activeSlide.title}
                  </h1>
                </div>

                {/* Horizontal dividing line - right under title (highly distinct) */}
                <div className="w-full h-[1.5px] bg-white/45 my-5" />

                {/* Bottom Section: Split Columns (Description + Button on Left, Info Block on Right) */}
                <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-start text-white">
                  
                  {/* Left Column: Subtitle & CTA Button */}
                  <div className="md:col-span-7 lg:col-span-8 flex flex-col gap-5 items-start">
                    {activeSlide?.subtitle && (
                      <p 
                        style={textShadowStyle}
                        className="text-xs sm:text-sm md:text-base text-white font-medium leading-relaxed max-w-2xl select-text"
                      >
                        {activeSlide.subtitle}
                      </p>
                    )}
                    {activeSlide?.ctaLabel && activeSlide?.ctaLink && (
                      <div className="pt-1">
                        <Link
                          href={getLocalizedCtaLink(activeSlide.ctaLink)}
                          onPointerDown={(e) => e.stopPropagation()}
                          className="inline-block border border-white/85 text-white hover:bg-white hover:text-black transition-all duration-300 uppercase tracking-[0.2em] text-[10px] md:text-xs font-semibold py-3.5 px-7 rounded-none cursor-pointer"
                        >
                          {activeSlide.ctaLabel}
                        </Link>
                      </div>
                    )}
                  </div>

                  {/* Right Column: Working Hours & Plan Visit Quick Links (Responsive layout: side-by-side on mobile, larger icons/text) */}
                  <div className="md:col-span-5 lg:col-span-4 flex flex-row items-center justify-between md:justify-end gap-4 sm:gap-6 md:gap-8 pt-3 md:pt-0 w-full">
                    {/* Working Hours Block */}
                    <div className="flex items-center gap-3">
                      <Clock className="w-5 h-5 sm:w-6 sm:h-6 text-white/90 stroke-[1.5] flex-shrink-0" style={{ filter: "drop-shadow(0px 2px 3px rgba(0,0,0,0.5))" }} />
                      <div>
                        <span 
                          style={textShadowStyle}
                          className="font-bold block uppercase tracking-wider text-[9px] sm:text-[10px] md:text-xs text-white/70 leading-none mb-1"
                        >
                          {strings.openToday}
                        </span>
                        <span 
                          style={textShadowStyle}
                          className="font-medium text-white text-xs sm:text-sm md:text-base whitespace-nowrap"
                        >
                          {settings?.workingHours || (locale === "en" ? "10:00 AM - 10:00 PM" : "10:00 - 22:00")}
                        </span>
                      </div>
                    </div>

                    {/* Separator for tablet/desktop */}
                    <div className="hidden md:block lg:block w-[1px] h-8 bg-white/10" />

                    {/* Plan Visit Link Block */}
                    <div className="flex items-center gap-3">
                      <MapPin className="w-5 h-5 sm:w-6 sm:h-6 text-white/90 stroke-[1.5] flex-shrink-0" style={{ filter: "drop-shadow(0px 2px 3px rgba(0,0,0,0.5))" }} />
                      <div>
                        <span 
                          style={textShadowStyle}
                          className="font-bold block uppercase tracking-wider text-[9px] sm:text-[10px] md:text-xs text-white/70 leading-none mb-1"
                        >
                          {strings.planVisit}
                        </span>
                        <Link
                          href={getPublicPath("ziyaret-plani", locale)}
                          onPointerDown={(e) => e.stopPropagation()}
                          style={textShadowStyle}
                          className="font-medium text-white hover:text-neutral-300 underline transition-colors whitespace-nowrap text-xs sm:text-sm md:text-base cursor-pointer"
                        >
                          {locale === "en" ? "View Details" : "Detaylı Bilgi"}
                        </Link>
                      </div>
                    </div>
                  </div>

                </div>
              </div>
            </div>
          </motion.div>
        </AnimatePresence>
      </div>

      {/* 2. Left / Right Navigation Arrows - Vertically aligned with the Title line */}
      <button
        onClick={() => paginate(-1)}
        onPointerDown={(e) => e.stopPropagation()}
        className="absolute left-4 lg:left-8 bottom-[200px] md:bottom-[250px] z-30 p-2 text-white/70 hover:text-white hover:scale-105 transition-all focus:outline-none hidden md:block cursor-pointer"
        aria-label="Önceki Slayt"
      >
        <ChevronLeft className="w-8 h-8 md:w-10 md:h-10 stroke-[1.5]" style={{ filter: "drop-shadow(0px 2px 4px rgba(0,0,0,0.5))" }} />
      </button>
      <button
        onClick={() => paginate(1)}
        onPointerDown={(e) => e.stopPropagation()}
        className="absolute right-4 lg:right-8 bottom-[200px] md:bottom-[250px] z-30 p-2 text-white/70 hover:text-white hover:scale-105 transition-all focus:outline-none hidden md:block cursor-pointer"
        aria-label="Sonraki Slayt"
      >
        <ChevronRight className="w-8 h-8 md:w-10 md:h-10 stroke-[1.5]" style={{ filter: "drop-shadow(0px 2px 4px rgba(0,0,0,0.5))" }} />
      </button>

      {/* 3. Dots Panel at the bottom center */}
      <div className="absolute bottom-4 md:bottom-6 left-1/2 -translate-x-1/2 z-30 flex gap-2.5">
        {slides.map((_, index) => (
          <button
            key={index}
            onClick={() => {
              const newDirection = index > activeIndex ? 1 : -1;
              setDirection(newDirection);
              setActiveIndex(index);
              resetAutoplay();
            }}
            onPointerDown={(e) => e.stopPropagation()}
            className={`w-2 h-2 rounded-full transition-all duration-300 focus:outline-none cursor-pointer ${
              index === activeIndex ? "bg-white scale-125" : "bg-white/40 hover:bg-white/60"
            }`}
            aria-label={`Slayt ${index + 1}`}
            style={{ filter: "drop-shadow(0px 1px 2px rgba(0,0,0,0.6))" }}
          />
        ))}
      </div>
    </section>
  );
}
