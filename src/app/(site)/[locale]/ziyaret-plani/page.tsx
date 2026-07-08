import { Metadata } from "next";
import { cachedFetch } from "@/sanity/lib/client";
import { visitPlanPageQuery } from "@/sanity/lib/queries";
import { getLayoutData, buildMetadata } from "@/lib/seo";
import { PageHero } from "@/components/layout/PageHero";
import { VisitPlanTabs } from "@/components/visit-plan/VisitPlanTabs";
import { getPublicPath } from "@/lib/i18n/routes";
import { locales, Locale } from "@/lib/i18n/config";
import { VisitPlanPage as VisitPlanPageType } from "@/types";

type Props = {
  params: Promise<{ locale: string }>;
};

export async function generateStaticParams() {
  return locales.map((locale) => ({ locale }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const data = await cachedFetch<VisitPlanPageType>(
    visitPlanPageQuery,
    { locale },
    { next: { tags: ["visitPlan"] } }
  );

  return buildMetadata({
    title: data?.heroTitle || data?.pageTitle || (locale === "en" ? "Visit Plan" : "Ziyaret Planı"),
    canonicalPath: getPublicPath("ziyaret-plani", locale as Locale),
    pageSeo: data?.seo,
    locale,
  });
}

export default async function VisitPlanPage({ params }: Props) {
  const { locale } = await params;
  
  // Fetch page content
  const data = await cachedFetch<VisitPlanPageType>(
    visitPlanPageQuery,
    { locale },
    { next: { tags: ["visitPlan"] } }
  );

  // Fetch siteSettings from layout data for googleMapsUrl and mapIframe
  const layoutData = await getLayoutData(locale);
  const settings = layoutData?.settings;
  const contactInfo = settings?.contactInfo;

  const title = data?.heroTitle || data?.pageTitle || (locale === "en" ? "Visit Plan" : "Ziyaret Planı");
  const subtitle = data?.heroSubtitle || (locale === "en" ? "How to get to AVLU34, hours, services" : "AVLU34'e nasıl ulaşacağınızı, çalışma saatlerini ve hizmetlerimizi inceleyin");

  return (
    <div className="flex flex-col gap-8 md:gap-12 pb-16">
      <PageHero
        title={title}
        subtitle={subtitle}
        backgroundImage={data?.heroImage}
      />
      
      {data && (
        <VisitPlanTabs
          data={data}
          locale={locale}
          googleMapsUrl={contactInfo?.googleMapsUrl}
          mapIframe={contactInfo?.mapIframe}
        />
      )}
    </div>
  );
}
