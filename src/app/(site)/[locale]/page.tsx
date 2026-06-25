import { Metadata } from "next";
import { cachedFetch } from "@/sanity/lib/client";
import { homePageQuery, activeHeroSlidesQuery } from "@/sanity/lib/queries";
import { buildMetadata, getLayoutData } from "@/lib/seo";
import { locales, Locale } from "@/lib/i18n/config";
import { HomePage as HomePageType, HeroSlide } from "@/types";
import { HeroSection } from "@/components/home/HeroSection";
import { AboutSection } from "@/components/home/AboutSection";
import { ShopDineSection } from "@/components/home/ShopDineSection";
import { CinemaSection } from "@/components/home/CinemaSection";
import { CampaignsEventsSection } from "@/components/home/CampaignsEventsSection";
import { VisitSection } from "@/components/home/VisitSection";

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

      {/* 2. Hakkımızda (About Us) Section */}
      <AboutSection
        tag={data?.aboutTag}
        title={data?.aboutTitle}
        text={data?.aboutText}
        image={data?.aboutImage || data?.campaignsImage} // Fallback to campaignsImage if aboutImage is not set
        ctaLabel={data?.aboutCtaLabel}
        locale={locale as Locale}
      />

      {/* 3. Sinema (Cinema) Section */}
      <CinemaSection
        cinemaTag={data?.cinemaTag}
        cinemaTitle={data?.cinemaTitle}
        cinemaSubtitle={data?.cinemaSubtitle}
        cinemaImage={data?.cinemaImage}
        cinemaCtaLabel={data?.cinemaCtaLabel}
        locale={locale as Locale}
      />

      {/* 4. Mağazalar & Yeme-İçme (Shop & Dine) Section */}
      <ShopDineSection
        storesTag={data?.storesTag}
        storesTitle={data?.storesTitle}
        storesImage={data?.storesImage}
        storesCtaLabel={data?.storesCtaLabel}
        diningTag={data?.diningTag}
        diningTitle={data?.diningTitle}
        diningImage={data?.diningImage}
        diningCtaLabel={data?.diningCtaLabel}
        locale={locale as Locale}
      />


      {/* 5. Kampanyalar & Etkinlikler (Campaigns & Events) Section */}
      <CampaignsEventsSection
        campaignsTitle={data?.campaignsTitle}
        campaignsSubtitle={data?.campaignsSubtitle}
        campaignsImage={data?.campaignsImage}
        campaignsCtaLabel={data?.campaignsCtaLabel}
        eventsTitle={data?.eventsTitle}
        eventsSubtitle={data?.eventsSubtitle}
        eventsImage={data?.eventsImage}
        eventsCtaLabel={data?.eventsCtaLabel}
        locale={locale as Locale}
      />

      {/* 6. Ziyaret Planı (Visit Plan) Section */}
      <VisitSection
        visitTag={data?.visitTag}
        visitTitle={data?.visitTitle}
        visitSubtitle={data?.visitSubtitle}
        visitImage={data?.visitImage}
        visitCtaLabel={data?.visitCtaLabel}
        workingHours={layoutData?.settings?.workingHours}
        visitParking={data?.visitParking}
        locale={locale as Locale}
      />
    </div>
  );
}
