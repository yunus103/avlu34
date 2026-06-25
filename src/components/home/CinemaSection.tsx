import { SanityImage } from "@/components/ui/SanityImage";
import { SanityImage as SanityImageType } from "@/types";
import Link from "next/link";
import { getPublicPath } from "@/lib/i18n/routes";
import { Locale } from "@/lib/i18n/config";

interface CinemaSectionProps {
  cinemaTag?: string;
  cinemaTitle?: string;
  cinemaSubtitle?: string;
  cinemaImage?: SanityImageType;
  cinemaCtaLabel?: string;
  locale: Locale;
}

export function CinemaSection({
  cinemaTag,
  cinemaTitle,
  cinemaSubtitle,
  cinemaImage,
  cinemaCtaLabel,
  locale,
}: CinemaSectionProps) {
  // Fallbacks
  const displayTag = cinemaTag || (locale === "en" ? "ENTERTAIN" : "SİNEMA / EĞLENCE");
  const displayTitle = cinemaTitle || (locale === "en" ? "AVLU34 CINEMA EXPERIENCE" : "AVLU34 SİNEMA DENEYİMİ");
  const displayCta = cinemaCtaLabel || (locale === "en" ? "EXPLORE CINEMA" : "SALONLARI İNCELE");

  const textShadowStyle = {
    textShadow: "0 2px 4px rgba(0, 0, 0, 0.75), 0 1px 2px rgba(0, 0, 0, 0.5)",
  };

  return (
    <section className="relative w-full h-[380px] sm:h-[450px] md:h-[550px] bg-neutral-950 overflow-hidden group border-b border-neutral-100">
      
      {/* Background Image */}
      {cinemaImage && (
        <div className="absolute inset-0 z-0">
          <SanityImage
            image={cinemaImage}
            fill
            sizes="100vw"
            quality={90}
            className="object-cover transition-transform duration-700 ease-out group-hover:scale-103"
            noBlur
          />
          {/* Black solid overlay + gradient overlay */}
          <div className="absolute inset-0 bg-black/20" />
          <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/30 to-transparent" />
        </div>
      )}

      {/* Content Overlay (Dubai Mall Entertain style) */}
      <div className="absolute inset-0 z-10 flex flex-col justify-end pb-12 md:pb-20">
        <div className="w-full max-w-[1600px] mx-auto px-6 md:px-16 lg:px-20">
          <div className="text-white space-y-4 max-w-2xl">
            {/* Tag */}
            <span 
              style={textShadowStyle}
              className="font-bold text-xs tracking-[0.25em] uppercase text-white/90 block select-none"
            >
              {displayTag}
            </span>
            
            {/* Title (Playfair Display) */}
            <h3 
              style={textShadowStyle}
              className="text-2xl sm:text-3xl lg:text-[40px] font-medium font-serif uppercase tracking-wide leading-tight select-text"
            >
              {displayTitle}
            </h3>
            
            {/* Subtitle / Description */}
            {cinemaSubtitle && (
              <p 
                style={textShadowStyle}
                className="text-xs sm:text-sm text-white/80 font-normal leading-relaxed select-text"
              >
                {cinemaSubtitle}
              </p>
            )}
            
            {/* Button */}
            <div className="pt-2">
              <Link
                href={getPublicPath("sinema", locale)}
                className="inline-block border border-white text-white hover:bg-white hover:text-black transition-all duration-300 uppercase tracking-[0.2em] text-xs font-semibold py-3.5 px-7 rounded-none cursor-pointer"
              >
                {displayCta}
              </Link>
            </div>
          </div>
        </div>
      </div>

    </section>
  );
}
