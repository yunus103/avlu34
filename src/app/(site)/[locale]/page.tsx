import { Metadata } from "next";
import { cachedFetch } from "@/sanity/lib/client";
import { homePageQuery, activeHeroSlidesQuery } from "@/sanity/lib/queries";
import { buildMetadata } from "@/lib/seo";
import { locales, Locale } from "@/lib/i18n/config";
import { HomePage as HomePageType, HeroSlide } from "@/types";
import { SanityImage } from "@/components/ui/SanityImage";
import { RichText } from "@/components/ui/RichText";
import { getPublicPath } from "@/lib/i18n/routes";
import Link from "next/link";
import { Button } from "@/components/ui/button";

type Props = {
  params: Promise<{ locale: string }>;
};

export async function generateStaticParams() {
  return locales.map((locale) => ({ locale }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const data = await cachedFetch<HomePageType>(homePageQuery, { locale }, { next: { tags: ["home"] } });
  return buildMetadata({
    canonicalPath: "/",
    pageSeo: data?.seo,
    locale,
  });
}

export default async function HomePage({ params }: Props) {
  const { locale } = await params;
  
  // Fetch homepage configurations and active slides in parallel
  const [data, slides] = await Promise.all([
    cachedFetch<HomePageType>(homePageQuery, { locale }, { next: { tags: ["home"] } }),
    cachedFetch<HeroSlide[]>(activeHeroSlidesQuery, { locale }, { next: { tags: ["heroSlide"] } }),
  ]);

  const activeSlide = slides?.[0]; // Fallback to first active slide for hero placeholder

  return (
    <div className="flex flex-col w-full">
      {/* 1. Hero Slide Section (Simple Placeholder) */}
      <section className="relative min-h-[70vh] flex items-center bg-muted overflow-hidden">
        {activeSlide?.desktopImage && (
          <div className="absolute inset-0 z-0">
            <SanityImage
              image={activeSlide.desktopImage}
              fill
              sizes="100vw"
              quality={90}
              className="object-cover"
              priority
            />
            <div className="absolute inset-0 bg-black/50" />
          </div>
        )}
        <div className="relative z-10 container mx-auto px-4 py-20 text-white">
          <div className="max-w-3xl">
            <h1 className="text-4xl md:text-6xl font-bold mb-4">
              {activeSlide?.title || "AVLU34 AVM"}
            </h1>
            {activeSlide?.subtitle && (
              <p className="text-lg md:text-xl text-white/80 mb-8 max-w-2xl">
                {activeSlide.subtitle}
              </p>
            )}
            {activeSlide?.ctaLabel && activeSlide?.ctaLink && (
              <Button size="lg" render={<Link href={activeSlide.ctaLink} />}>
                {activeSlide.ctaLabel}
              </Button>
            )}
          </div>
        </div>
      </section>

      {/* 2. Hakkımızda Önizleme */}
      {data?.aboutTitle && (
        <section className="py-16 bg-background">
          <div className="container mx-auto px-4 grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            <div className="lg:col-span-7">
              <h2 className="text-3xl font-bold mb-4">{data.aboutTitle}</h2>
              {data.aboutSubtitle && <p className="text-lg text-muted-foreground mb-6">{data.aboutSubtitle}</p>}
              <RichText value={data.aboutText} />
              {data.aboutCtaLabel && (
                <Button className="mt-6" variant="outline" render={<Link href={getPublicPath("hakkimizda", locale as Locale)} />}>
                  {data.aboutCtaLabel}
                </Button>
              )}
            </div>
            {data.aboutImage && (
              <div className="lg:col-span-5 relative aspect-[4/3] rounded-2xl overflow-hidden shadow-xl">
                <SanityImage image={data.aboutImage} fill sizes="(max-width: 1024px) 100vw, 40vw" className="object-cover" />
              </div>
            )}
          </div>
        </section>
      )}

      {/* 3. Kampanyalar & Etkinlikler CTA Alanları */}
      <section className="py-16 bg-muted/30 border-y">
        <div className="container mx-auto px-4 grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Kampanyalar */}
          <div className="bg-background p-8 rounded-2xl border flex flex-col justify-between">
            <div>
              <h3 className="text-2xl font-bold mb-2">{data?.campaignsTitle || "Kampanyalar"}</h3>
              <p className="text-muted-foreground mb-6">{data?.campaignsSubtitle || "AVLU34 AVM güncel fırsatları."}</p>
            </div>
            <Button render={<Link href={getPublicPath("kampanyalar", locale as Locale)} />}>
              {locale === "en" ? "View Offers" : "Kampanyaları Gör"}
            </Button>
          </div>

          {/* Etkinlikler */}
          <div className="bg-background p-8 rounded-2xl border flex flex-col justify-between">
            <div>
              <h3 className="text-2xl font-bold mb-2">{data?.eventsTitle || "Etkinlikler"}</h3>
              <p className="text-muted-foreground mb-6">{data?.eventsSubtitle || "AVLU34 eğlenceli etkinlikleri."}</p>
            </div>
            <Button render={<Link href={getPublicPath("etkinlikler", locale as Locale)} />}>
              {locale === "en" ? "View Events" : "Etkinlikleri Gör"}
            </Button>
          </div>
        </div>
      </section>

      {/* 4. Mağaza & Yeme-İçme Keşif Linkleri */}
      <section className="py-16 bg-background">
        <div className="container mx-auto px-4 grid grid-cols-1 md:grid-cols-2 gap-8 text-center">
          <div className="p-8 border rounded-2xl bg-muted/10">
            <h3 className="text-2xl font-bold mb-4">{data?.storesTitle || "Mağazalar"}</h3>
            <p className="text-muted-foreground mb-6">{data?.storesSubtitle || "Tüm mağazalarımızı keşfedin."}</p>
            <Button variant="outline" render={<Link href={getPublicPath("magazalar", locale as Locale)} />}>
              {locale === "en" ? "Explore Brands" : "Mağazaları Keşfet"}
            </Button>
          </div>
          <div className="p-8 border rounded-2xl bg-muted/10">
            <h3 className="text-2xl font-bold mb-4">{data?.diningTitle || "Yeme-İçme"}</h3>
            <p className="text-muted-foreground mb-6">{data?.diningSubtitle || "Lezzetli restoranlar ve kafeler."}</p>
            <Button variant="outline" render={<Link href={getPublicPath("yeme-icme", locale as Locale)} />}>
              {locale === "en" ? "Explore Dining" : "Lezzetleri Keşfet"}
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
}
