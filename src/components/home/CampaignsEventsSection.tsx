import { SanityImage } from "@/components/ui/SanityImage";
import { SanityImage as SanityImageType } from "@/types";
import Link from "next/link";
import { getPublicPath } from "@/lib/i18n/routes";
import { Locale } from "@/lib/i18n/config";

interface CampaignsEventsSectionProps {
  campaignsTitle?: string;
  campaignsSubtitle?: string;
  campaignsImage?: SanityImageType;
  campaignsCtaLabel?: string;
  
  eventsTitle?: string;
  eventsSubtitle?: string;
  eventsImage?: SanityImageType;
  eventsCtaLabel?: string;
  
  locale: Locale;
}

export function CampaignsEventsSection({
  campaignsTitle,
  campaignsSubtitle,
  campaignsImage,
  campaignsCtaLabel,
  eventsTitle,
  eventsSubtitle,
  eventsImage,
  eventsCtaLabel,
  locale,
}: CampaignsEventsSectionProps) {
  // Localization fallbacks
  const sectionTag = locale === "en" ? "WHAT'S ON" : "GÜNCEL HAREKETLİLİK";
  
  // Section Title & Subtitle. Let's make sure they are dynamic and fallback beautifully.
  // We can combine the titles or use campaignsTitle/eventsTitle appropriately.
  const displayTitle = campaignsTitle && eventsTitle 
    ? `${campaignsTitle} & ${eventsTitle}` 
    : campaignsTitle || eventsTitle || (locale === "en" ? "OFFERS & EVENTS" : "KAMPANYALAR & ETKİNLİKLER");

  const displaySubtitle = campaignsSubtitle || eventsSubtitle || 
    (locale === "en" ? "Discover the latest campaigns, events, and privileges at AVLU34." : "AVLU34 AVM'deki en son fırsatları, etkinlikleri ve ayrıcalıkları keşfedin.");

  const campaignsCta = campaignsCtaLabel || (locale === "en" ? "VIEW OFFERS" : "KAMPANYALARI GÖR");
  const eventsCta = eventsCtaLabel || (locale === "en" ? "VIEW EVENTS" : "ETKİNLİKLERİ GÖR");

  // Primary image to show as the featured banner below
  const featuredImage = campaignsImage || eventsImage;
  const bannerAlt = featuredImage?.alt || (locale === "en" ? "Featured campaign banner" : "Öne çıkan kampanya görseli");

  const textShadowStyle = {
    textShadow: "0 2px 4px rgba(0, 0, 0, 0.75), 0 1px 2px rgba(0, 0, 0, 0.5)",
  };

  return (
    <section className="py-20 md:py-28 bg-white border-b border-neutral-100">
      <div className="w-full max-w-[1600px] mx-auto px-6 md:px-16 lg:px-20">
        
        {/* Centered Header Text (Discover Events & Offers style) */}
        <div className="text-center max-w-3xl mx-auto space-y-4 mb-12">
          <span className="font-bold text-xs tracking-[0.25em] uppercase text-neutral-500 block">
            {sectionTag}
          </span>
          <h2 className="text-2xl sm:text-3xl lg:text-[40px] font-medium font-serif uppercase tracking-wide leading-tight text-neutral-900 select-text">
            {displayTitle}
          </h2>
          {displaySubtitle && (
            <p className="text-neutral-500 font-sans font-light text-sm sm:text-base leading-relaxed select-text max-w-2xl mx-auto">
              {displaySubtitle}
            </p>
          )}
          
          {/* Two Centered Outline Buttons Side-by-Side */}
          <div className="pt-4 flex flex-wrap justify-center gap-4">
            <Link
              href={getPublicPath("kampanyalar", locale)}
              className="inline-block border border-neutral-900 text-neutral-900 hover:bg-neutral-900 hover:text-white transition-all duration-300 uppercase tracking-[0.2em] text-xs font-semibold py-3.5 px-8 rounded-none cursor-pointer"
            >
              {campaignsCta}
            </Link>
            <Link
              href={getPublicPath("etkinlikler", locale)}
              className="inline-block border border-neutral-900 text-neutral-900 hover:bg-neutral-900 hover:text-white transition-all duration-300 uppercase tracking-[0.2em] text-xs font-semibold py-3.5 px-8 rounded-none cursor-pointer"
            >
              {eventsCta}
            </Link>
          </div>
        </div>

        {/* Wide Featured Teaser Banner ("Whats New" style) */}
        {featuredImage && (
          <Link
            href={getPublicPath("kampanyalar", locale)}
            className="block relative w-full aspect-[4/3] sm:aspect-[16/7] lg:aspect-[21/9] overflow-hidden bg-neutral-900 group border border-neutral-100 mt-12"
          >
            <div className="absolute inset-0 z-0">
              <SanityImage
                image={featuredImage}
                fill
                sizes="100vw"
                className="object-cover transition-transform duration-700 ease-out group-hover:scale-103"
                noBlur
              />
              {/* Dark Legibility Overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/25 to-transparent" />
            </div>

            {/* Teaser Content Overlay */}
            <div className="absolute inset-0 z-10 flex flex-col justify-end p-8 md:p-12 lg:p-16">
              <div className="text-white space-y-3 max-w-xl">
                <span 
                  style={textShadowStyle}
                  className="font-bold text-xs tracking-[0.25em] uppercase text-white/90 block select-none"
                >
                  {locale === "en" ? "FEATURED HIGHLIGHT" : "ÖNE ÇIKAN AYRICALIK"}
                </span>
                <h3 
                  style={textShadowStyle}
                  className="text-xl sm:text-2xl lg:text-3xl font-medium font-serif uppercase tracking-wide leading-tight select-text"
                >
                  {bannerAlt}
                </h3>
                <div className="pt-2">
                  <span 
                    className="inline-flex items-center text-xs font-semibold tracking-[0.2em] uppercase border-b border-white pb-1 hover:border-transparent transition-all duration-300"
                  >
                    {locale === "en" ? "DISCOVER NOW" : "ŞİMDİ KEŞFET"}
                  </span>
                </div>
              </div>
            </div>
          </Link>
        )}

      </div>
    </section>
  );
}
