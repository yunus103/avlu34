import { SanityImage } from "@/components/ui/SanityImage";
import { SanityImage as SanityImageType } from "@/types";
import Link from "next/link";
import { getPublicPath } from "@/lib/i18n/routes";
import { Locale } from "@/lib/i18n/config";
import { Clock, Car } from "lucide-react";

interface VisitSectionProps {
  visitTag?: string;
  visitTitle?: string;
  visitSubtitle?: string;
  visitImage?: SanityImageType;
  visitCtaLabel?: string;
  workingHours?: string;
  visitParking?: string;
  locale: Locale;
}

export function VisitSection({
  visitTag,
  visitTitle,
  visitSubtitle,
  visitImage,
  visitCtaLabel,
  workingHours,
  visitParking,
  locale,
}: VisitSectionProps) {
  // Localization fallbacks
  const displayTag = visitTag || (locale === "en" ? "PLAN YOUR VISIT" : "ZİYARETİNİZİ PLANLAYIN");
  const displayTitle = visitTitle || (locale === "en" ? "PLAN YOUR VISIT" : "ZİYARETİNİZİ PLANLAYIN");
  const displaySubtitle = visitSubtitle || 
    (locale === "en" ? "AVLU34 is located in the heart of Arnavutkoy, providing convenient access and services." : "Arnavutköy'ün merkezinde yer alan AVLU34 AVM, konforlu ulaşım yolları ve otopark hizmetleriyle sizleri bekliyor.");
  const displayCta = visitCtaLabel || (locale === "en" ? "ACCESS & DIRECTIONS" : "ULAŞIM VE BİLGİLER");

  const displayWorkingHours = workingHours || (locale === "en" ? "Every Day: 10:00 - 22:00" : "Her Gün: 10:00 - 22:00");
  const displayParking = visitParking || (locale === "en" ? "Free / 1000+ Capacity" : "Ücretsiz / 1000+ Araç");

  return (
    <section className="w-full bg-white grid grid-cols-1 md:grid-cols-2 border-b border-neutral-100 min-h-[450px] sm:min-h-[550px] md:min-h-[650px] lg:min-h-[750px]">
      
      {/* Left Column: Full-Bleed Image (AVM entrance / lobby) */}
      <div className="relative w-full h-[350px] md:h-auto overflow-hidden bg-neutral-50 group">
        {visitImage ? (
          <SanityImage
            image={visitImage}
            fill
            sizes="(max-width: 768px) 100vw, 50vw"
            className="object-cover transition-transform duration-700 ease-out group-hover:scale-103"
            priority
            noBlur
          />
        ) : (
          /* Placeholder visual if no image is uploaded */
          <div className="absolute inset-0 bg-neutral-100 flex items-center justify-center">
            <span className="text-neutral-300 font-serif text-lg italic">AVLU34 AVM</span>
          </div>
        )}
      </div>

      {/* Right Column: Centered Info Card */}
      <div className="flex flex-col justify-center items-center text-center py-16 px-6 sm:px-12 md:px-16 lg:px-24 bg-white">
        <div className="w-full max-w-md flex flex-col items-center">
          
          {/* Subtitle / Tag */}
          <span className="font-sans font-semibold text-[10px] sm:text-xs tracking-[0.3em] uppercase text-neutral-500 block mb-6 sm:mb-8 select-none">
            {displayTag}
          </span>
          
          {/* Main Title (Playfair Display, Medium Serif) */}
          <h2 className="text-2xl sm:text-3xl lg:text-[40px] font-normal font-serif uppercase tracking-wider leading-tight text-neutral-900 mb-6 select-text">
            {displayTitle}
          </h2>
          
          {/* Description Text */}
          {displaySubtitle && (
            <p className="text-neutral-500 font-sans font-light text-xs sm:text-sm leading-relaxed max-w-sm select-text mb-8 sm:mb-10">
              {displaySubtitle}
            </p>
          )}

          {/* Quick Info Grid (Two clean columns side by side) */}
          <div className="grid grid-cols-2 gap-4 w-full border-t border-b border-neutral-100 py-6 mb-8 sm:mb-12">
            
            {/* 1. Working Hours */}
            <div className="flex flex-col items-center justify-center space-y-2 border-r border-neutral-100 px-2">
              <Clock className="w-5 h-5 text-neutral-600 stroke-[1.25]" />
              <span className="font-sans font-semibold text-[10px] tracking-[0.15em] uppercase text-neutral-400">
                {locale === "en" ? "WORKING HOURS" : "ÇALIŞMA SAATLERİ"}
              </span>
              <span className="font-sans font-medium text-[11px] sm:text-xs text-neutral-700 leading-tight">
                {displayWorkingHours}
              </span>
            </div>

            {/* 2. Parking Information */}
            <div className="flex flex-col items-center justify-center space-y-2 px-2">
              <Car className="w-5 h-5 text-neutral-600 stroke-[1.25]" />
              <span className="font-sans font-semibold text-[10px] tracking-[0.15em] uppercase text-neutral-400">
                {locale === "en" ? "PARKING" : "OTOPARK"}
              </span>
              <span className="font-sans font-medium text-[11px] sm:text-xs text-neutral-700 leading-tight line-clamp-2 max-w-[140px]">
                {displayParking}
              </span>
            </div>

          </div>

          {/* Wide Outline CTA Button */}
          <div className="w-full">
            <Link
              href={getPublicPath("ziyaret-plani", locale)}
              className="inline-block w-full border border-neutral-950 text-neutral-950 hover:bg-neutral-950 hover:text-white transition-all duration-300 uppercase tracking-[0.2em] text-xs font-semibold py-3.5 rounded-none cursor-pointer text-center"
            >
              {displayCta}
            </Link>
          </div>

        </div>
      </div>

    </section>
  );
}
