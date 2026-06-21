import { Metadata } from "next";
import { cachedFetch } from "@/sanity/lib/client";
import { homePageQuery, activeHeroSlidesQuery } from "@/sanity/lib/queries";
import { buildMetadata, getLayoutData } from "@/lib/seo";
import { locales, Locale } from "@/lib/i18n/config";
import { HomePage as HomePageType, HeroSlide } from "@/types";
import { SanityImage } from "@/components/ui/SanityImage";
import { RichText } from "@/components/ui/RichText";
import { getPublicPath } from "@/lib/i18n/routes";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { HeroSection } from "@/components/home/HeroSection";

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
  
  // Fetch homepage configurations, active slides, and site settings in parallel
  const [data, slides, layoutData] = await Promise.all([
    cachedFetch<HomePageType>(homePageQuery, { locale }, { next: { tags: ["home"] } }),
    cachedFetch<HeroSlide[]>(activeHeroSlidesQuery, { locale }, { next: { tags: ["heroSlide"] } }),
    getLayoutData(locale),
  ]);

  return (
    <div className="flex flex-col w-full">
      {/* 1. Hero Carousel Section */}
      <HeroSection
        slides={slides || []}
        settings={layoutData?.settings}
        locale={locale as Locale}
      />

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
