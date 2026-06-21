import { SanityImage } from "@/components/ui/SanityImage";
import { RichText } from "@/components/ui/RichText";
import Link from "next/link";
import { SanityImage as SanityImageType } from "@/types";
import { Locale } from "@/lib/i18n/config";
import { getPublicPath } from "@/lib/i18n/routes";

interface AboutSectionProps {
  tag?: string;
  title?: string;
  subtitle?: string;
  text?: any[];
  image?: SanityImageType;
  ctaLabel?: string;
  locale: Locale;
}

export function AboutSection({
  tag,
  title,
  text,
  image,
  ctaLabel,
  locale,
}: AboutSectionProps) {
  const displayTag = tag || (locale === "en" ? "ABOUT US" : "HAKKIMIZDA");
  const displayTitle = title || (locale === "en" ? "REDEFINING LUXURY" : "LÜKSÜN YENİ TANIMI");
  const displayCtaLabel = ctaLabel || (locale === "en" ? "EXPLORE MORE" : "DAHA FAZLA KEŞFET");

  return (
    <section className="w-full bg-white grid grid-cols-1 md:grid-cols-2 border-b border-neutral-100 min-h-[450px] sm:min-h-[550px] md:min-h-[650px] lg:min-h-[750px]">
      
      {/* Left Column: Full-Bleed Monochrome Image (No margins/padding) */}
      <div className="relative w-full h-[350px] md:h-auto overflow-hidden bg-neutral-50">
        {image && (
          <SanityImage
            image={image}
            fill
            sizes="(max-width: 768px) 100vw, 50vw"
            className="object-cover grayscale hover:grayscale-0 transition-all duration-700 ease-out"
            priority
            noBlur
          />
        )}
      </div>

      {/* Right Column: Centered Content Block */}
      <div className="flex flex-col justify-center items-center text-center py-16 px-6 sm:px-12 md:px-16 lg:px-24 bg-white">
        <div className="w-full max-w-md flex flex-col items-center">
          
          {/* Subtitle / Tag (e.g. FASHION AVENUE style) */}
          <span className="font-sans font-semibold text-[10px] sm:text-xs tracking-[0.3em] uppercase text-neutral-500 block mb-6 sm:mb-8 select-none">
            {displayTag}
          </span>
          
          {/* Main Title (Playfair Display, Medium Serif) */}
          <h2 className="text-2xl sm:text-3xl lg:text-[40px] font-normal font-serif uppercase tracking-wider leading-tight text-neutral-900 mb-6 select-text">
            {displayTitle}
          </h2>
          
          {/* Short description or Rich Text */}
          {text && text.length > 0 && (
            <div className="text-neutral-500 font-sans font-light text-xs sm:text-sm leading-relaxed max-w-sm select-text mb-8 sm:mb-12">
              <RichText value={text} />
            </div>
          )}

          {/* Wide Outline Button */}
          <div className="w-full">
            <Link
              href={getPublicPath("hakkimizda", locale)}
              className="inline-block w-full border border-neutral-950 text-neutral-950 hover:bg-neutral-950 hover:text-white transition-all duration-300 uppercase tracking-[0.2em] text-xs font-semibold py-3.5 rounded-none cursor-pointer text-center"
            >
              {displayCtaLabel}
            </Link>
          </div>

        </div>
      </div>

    </section>
  );
}
