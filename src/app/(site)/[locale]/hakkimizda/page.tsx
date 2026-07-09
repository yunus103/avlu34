import { Metadata } from "next";
import Link from "next/link";
import { cachedFetch } from "@/sanity/lib/client";
import { aboutPageQuery } from "@/sanity/lib/queries";
import { buildMetadata } from "@/lib/seo";
import { FadeIn } from "@/components/ui/FadeIn";
import { SanityImage } from "@/components/ui/SanityImage";
import { RichText } from "@/components/ui/RichText";
import { PageHero } from "@/components/layout/PageHero";
import { AboutPage as AboutPageType } from "@/types";
import { getPublicPath } from "@/lib/i18n/routes";
import { locales, Locale } from "@/lib/i18n/config";
import {
  ShoppingBag,
  Film,
  Car,
  Building2,
  ShoppingBasket,
  Heart,
  Calendar,
  Star,
  HelpCircle,
} from "lucide-react";

type Props = {
  params: Promise<{ locale: string }>;
};

export async function generateStaticParams() {
  return locales.map((locale) => ({ locale }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const data = await cachedFetch<AboutPageType>(aboutPageQuery, { locale }, { next: { tags: ["about"] } });
  
  return buildMetadata({
    title: data?.heroTitle || data?.pageTitle || "Hakkımızda",
    canonicalPath: getPublicPath("hakkimizda", locale as Locale),
    pageSeo: data?.seo,
    locale,
  });
}

function getStatIcon(iconName?: string) {
  switch (iconName) {
    case "bag":
      return <ShoppingBag className="w-6 h-6 stroke-[1.5]" />;
    case "film":
      return <Film className="w-6 h-6 stroke-[1.5]" />;
    case "car":
      return <Car className="w-6 h-6 stroke-[1.5]" />;
    case "culture":
      return <Building2 className="w-6 h-6 stroke-[1.5]" />;
    case "basket":
      return <ShoppingBasket className="w-6 h-6 stroke-[1.5]" />;
    case "heart":
      return <Heart className="w-6 h-6 stroke-[1.5]" />;
    case "calendar":
      return <Calendar className="w-6 h-6 stroke-[1.5]" />;
    case "star":
      return <Star className="w-6 h-6 stroke-[1.5]" />;
    default:
      return <HelpCircle className="w-6 h-6 stroke-[1.5]" />;
  }
}

export default async function AboutPage({ params }: Props) {
  const { locale } = await params;
  const data = await cachedFetch<AboutPageType>(aboutPageQuery, { locale }, { next: { tags: ["about"] } });

  return (
    <div className="flex flex-col gap-12 md:gap-16 pb-16">
      {/* Page Hero */}
      <PageHero
        title={data?.heroTitle || data?.pageTitle || "Hakkımızda"}
        subtitle={data?.heroSubtitle || data?.pageSubtitle}
        backgroundImage={data?.heroImage}
      />

      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
          {/* Sol Kolon: Metin İçeriği */}
          <div className="lg:col-span-7">
            <FadeIn direction="up">
              <h2 className="text-2xl sm:text-3xl font-normal font-serif uppercase tracking-wider mb-6">
                {data?.pageTitle || "Hakkımızda"}
              </h2>
            </FadeIn>

            <FadeIn delay={0.2}>
              <RichText value={data?.body} />
            </FadeIn>
          </div>

          {/* Sağ Kolon: Görsel */}
          <div className="lg:col-span-5 lg:sticky lg:top-24">
            {data?.mainImage && (
              <FadeIn direction="left" delay={0.3}>
                <div className="relative aspect-[3/2] rounded-none overflow-hidden shadow-xl border border-neutral-200">
                  <SanityImage
                    image={data.mainImage}
                    fill
                    sizes="(max-width: 1024px) 100vw, 40vw"
                    className="object-cover"
                    priority
                  />
                </div>
              </FadeIn>
            )}
          </div>
        </div>
      </div>

      {/* İstatistikler Bölümü */}
      {data?.stats && data.stats.length > 0 && (
        <div className="container mx-auto px-4 border-t border-neutral-100 pt-12 md:pt-16 mt-4">
          <FadeIn direction="up">
            <h3 className="text-xl sm:text-2xl font-normal font-serif tracking-wider uppercase mb-8 md:mb-12 text-center text-neutral-900">
              {locale === "en" ? "AVLU 34 AT A GLANCE" : "AVLU 34'TE NELER VAR?"}
            </h3>
          </FadeIn>
          
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4 sm:gap-6">
            {data.stats.map((stat, index) => (
              <FadeIn
                key={index}
                direction="up"
                delay={0.1 * index}
                className="flex flex-col items-center text-center p-6 bg-white border border-neutral-200 rounded-none transition-all duration-300 hover:border-neutral-400 group"
              >
                <div className="text-neutral-400 group-hover:text-black transition-colors duration-300 mb-4">
                  {getStatIcon(stat.icon)}
                </div>
                
                <span className="text-3xl sm:text-4xl font-normal font-serif text-neutral-900 tracking-tight mb-2 select-all">
                  {stat.value}
                </span>
                
                <span className="text-[10px] sm:text-xs font-semibold font-sans tracking-wider uppercase text-neutral-500 max-w-[120px] select-text">
                  {stat.label}
                </span>
              </FadeIn>
            ))}
          </div>
        </div>
      )}

      {/* CTA Bölümü */}
      {data?.ctaButtonLink && (
        <div className="container mx-auto px-4 border-t border-neutral-100 pt-16 mt-8 md:mt-12">
          <FadeIn direction="up">
            <div className="text-center max-w-3xl mx-auto space-y-4">
              <span className="font-bold text-xs tracking-[0.25em] uppercase text-neutral-500 block">
                {locale === "en" ? "DISCOVER MORE" : "DAHA FAZLASINI KEŞFEDİN"}
              </span>
              
              <h3 className="text-2xl sm:text-3xl lg:text-[40px] font-medium font-serif uppercase tracking-wide leading-tight text-neutral-900 select-text">
                {data.ctaTitle || (locale === "en" ? "Stores & Brands" : "Mağazalar & Markalar")}
              </h3>
              
              {data.ctaDescription && (
                <p className="text-neutral-500 font-sans font-light text-sm sm:text-base leading-relaxed select-text max-w-2xl mx-auto">
                  {data.ctaDescription}
                </p>
              )}
              
              <div className="pt-4 flex flex-wrap justify-center gap-4">
                <Link
                  href={getPublicPath(data.ctaButtonLink, locale as Locale)}
                  className="inline-block border border-neutral-900 text-neutral-900 hover:bg-neutral-900 hover:text-white transition-all duration-300 uppercase tracking-[0.2em] text-xs font-semibold py-3.5 px-8 rounded-none cursor-pointer text-center"
                >
                  {data.ctaButtonText || (locale === "en" ? "EXPLORE STORES" : "MAĞAZALARI KEŞFET")}
                </Link>
                {data.ctaButton2Link && (
                  <Link
                    href={getPublicPath(data.ctaButton2Link, locale as Locale)}
                    className="inline-block border border-neutral-900 text-neutral-900 hover:bg-neutral-900 hover:text-white transition-all duration-300 uppercase tracking-[0.2em] text-xs font-semibold py-3.5 px-8 rounded-none cursor-pointer text-center"
                  >
                    {data.ctaButton2Text || (locale === "en" ? "EXPLORE DINING" : "YEME İÇMEYİ KEŞFET")}
                  </Link>
                )}
              </div>
            </div>
          </FadeIn>
        </div>
      )}
    </div>
  );
}
