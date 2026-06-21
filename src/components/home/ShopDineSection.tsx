import { SanityImage } from "@/components/ui/SanityImage";
import { SanityImage as SanityImageType } from "@/types";
import Link from "next/link";
import { getPublicPath } from "@/lib/i18n/routes";
import { Locale } from "@/lib/i18n/config";

interface ShopDineSectionProps {
  storesTag?: string;
  storesTitle?: string;
  storesImage?: SanityImageType;
  storesCtaLabel?: string;
  
  diningTag?: string;
  diningTitle?: string;
  diningImage?: SanityImageType;
  diningCtaLabel?: string;
  
  locale: Locale;
}

export function ShopDineSection({
  storesTag,
  storesTitle,
  storesImage,
  storesCtaLabel,
  diningTag,
  diningTitle,
  diningImage,
  diningCtaLabel,
  locale,
}: ShopDineSectionProps) {
  // Fallback localized values
  const shopTag = storesTag || (locale === "en" ? "SHOP" : "MAĞAZALAR");
  const shopTitle = storesTitle || (locale === "en" ? "OUR STORES" : "MARKALARIMIZ");
  const shopCta = storesCtaLabel || (locale === "en" ? "EXPLORE BRANDS" : "MARKALARI GEZ");

  const dineTag = diningTag || (locale === "en" ? "DINE" : "YEME-İÇME");
  const dineTitle = diningTitle || (locale === "en" ? "DINING & CAFES" : "LEZZET NOKTALARI");
  const dineCta = diningCtaLabel || (locale === "en" ? "EXPLORE DINING" : "LEZZETLERİ KEŞFET");

  const textShadowStyle = {
    textShadow: "0 2px 4px rgba(0, 0, 0, 0.75), 0 1px 2px rgba(0, 0, 0, 0.5)",
  };

  return (
    <section className="w-full bg-white grid grid-cols-1 md:grid-cols-2 border-b border-neutral-100">
      
      {/* Left Column: Stores (Shop) */}
      <div className="relative w-full h-[400px] sm:h-[500px] md:h-[600px] overflow-hidden bg-neutral-900 group border-b md:border-b-0 md:border-r border-neutral-100">
        {storesImage && (
          <div className="absolute inset-0 z-0">
            <SanityImage
              image={storesImage}
              fill
              sizes="(max-width: 768px) 100vw, 50vw"
              className="object-cover transition-transform duration-700 ease-out group-hover:scale-105"
              noBlur
            />
            {/* Subtle Gradient Overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/25 to-transparent" />
          </div>
        )}
        
        {/* Overlay Content */}
        <div className="absolute inset-0 z-10 flex flex-col justify-end p-8 md:p-12 lg:p-16">
          <div className="text-white space-y-4 max-w-lg">
            <span 
              style={textShadowStyle}
              className="font-bold text-xs tracking-[0.25em] uppercase text-white/90 block select-none"
            >
              {shopTag}
            </span>
            <h3 
              style={textShadowStyle}
              className="text-2xl sm:text-3xl lg:text-4xl font-medium font-serif uppercase tracking-wide leading-tight select-text"
            >
              {shopTitle}
            </h3>
            <div className="pt-2">
              <Link
                href={getPublicPath("magazalar", locale)}
                className="inline-block border border-white text-white hover:bg-white hover:text-black transition-all duration-300 uppercase tracking-[0.2em] text-xs font-semibold py-3 px-6 rounded-none cursor-pointer"
              >
                {shopCta}
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Right Column: Dining (Dine) */}
      <div className="relative w-full h-[400px] sm:h-[500px] md:h-[600px] overflow-hidden bg-neutral-900 group">
        {diningImage && (
          <div className="absolute inset-0 z-0">
            <SanityImage
              image={diningImage}
              fill
              sizes="(max-width: 768px) 100vw, 50vw"
              className="object-cover transition-transform duration-700 ease-out group-hover:scale-105"
              noBlur
            />
            {/* Subtle Gradient Overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/25 to-transparent" />
          </div>
        )}
        
        {/* Overlay Content */}
        <div className="absolute inset-0 z-10 flex flex-col justify-end p-8 md:p-12 lg:p-16">
          <div className="text-white space-y-4 max-w-lg">
            <span 
              style={textShadowStyle}
              className="font-bold text-xs tracking-[0.25em] uppercase text-white/90 block select-none"
            >
              {dineTag}
            </span>
            <h3 
              style={textShadowStyle}
              className="text-2xl sm:text-3xl lg:text-4xl font-medium font-serif uppercase tracking-wide leading-tight select-text"
            >
              {dineTitle}
            </h3>
            <div className="pt-2">
              <Link
                href={getPublicPath("yeme-icme", locale)}
                className="inline-block border border-white text-white hover:bg-white hover:text-black transition-all duration-300 uppercase tracking-[0.2em] text-xs font-semibold py-3 px-6 rounded-none cursor-pointer"
              >
                {dineCta}
              </Link>
            </div>
          </div>
        </div>
      </div>

    </section>
  );
}
