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
  const displayTitle = title || (locale === "en" ? "THE MEETING POINT OF ARNAVUTKOY" : "ARNAVUTKÖY'ÜN BULUŞMA NOKTASI");
  const displayCtaLabel = ctaLabel || (locale === "en" ? "EXPLORE MORE" : "AVLU34'Ü KEŞFET");

  return (
    <section className="py-20 md:py-28 bg-white overflow-hidden border-b border-neutral-100">
      <div className="w-full max-w-[1600px] mx-auto px-6 md:px-16 lg:px-20 grid grid-cols-1 md:grid-cols-12 gap-8 md:gap-12 lg:gap-24 items-center">
        
        {/* Left Column: Premium Monochrome Image (Redefining Luxury style) */}
        {image && (
          <div className="md:col-span-6 relative w-full aspect-[4/5] sm:aspect-[3/2] md:aspect-[3/4] overflow-hidden bg-neutral-50 shadow-sm border border-neutral-100">
            <SanityImage
              image={image}
              fill
              sizes="(max-width: 768px) 100vw, 50vw"
              className="object-cover grayscale hover:grayscale-0 transition-all duration-700 ease-out"
              priority
              noBlur
            />
          </div>
        )}

        {/* Right Column: Clean Monochromatic Content (Redefining Luxury style) */}
        <div className={`md:col-span-6 flex flex-col justify-center items-start text-left space-y-6 ${!image ? "col-span-full max-w-4xl mx-auto" : ""}`}>
          <div>
            {/* Tag / Badge */}
            <span className="font-bold text-xs tracking-[0.25em] uppercase text-neutral-500 block mb-3">
              {displayTag}
            </span>
            
            {/* Main Title (Playfair Display, Medium) */}
            <h2 className="text-2xl sm:text-3xl lg:text-[40px] font-medium font-serif uppercase tracking-wide leading-tight text-neutral-900 select-text">
              {displayTitle}
            </h2>
          </div>

          {/* Description Text */}
          {text && text.length > 0 && (
            <div className="text-neutral-600 font-sans font-light text-sm sm:text-base leading-relaxed select-text pr-0 lg:pr-8">
              <RichText value={text} />
            </div>
          )}

          {/* CTA Button */}
          <div className="pt-2">
            <Link
              href={getPublicPath("hakkimizda", locale)}
              className="inline-block border border-neutral-900 text-neutral-900 hover:bg-neutral-900 hover:text-white transition-all duration-300 uppercase tracking-[0.2em] text-xs font-semibold py-3.5 px-8 rounded-none cursor-pointer"
            >
              {displayCtaLabel}
            </Link>
          </div>
        </div>

      </div>
    </section>
  );
}
