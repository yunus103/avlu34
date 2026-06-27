import { Metadata } from "next";
import { locales, Locale } from "@/lib/i18n/config";
import { buildMetadata } from "@/lib/seo";
import { getPublicPath } from "@/lib/i18n/routes";
import { cachedFetch } from "@/sanity/lib/client";
import { PageHero } from "@/components/layout/PageHero";
import { CampaignList } from "@/components/campaigns/CampaignList";
import {
  campaignsPageQuery,
  activeCampaignsQuery,
  pastCampaignsQuery,
} from "@/sanity/lib/queries";
import { Campaign, StaticPageSettings } from "@/types";

type Props = {
  params: Promise<{ locale: string }>;
};

export async function generateStaticParams() {
  return locales.map((locale) => ({ locale }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const pageData = await cachedFetch<StaticPageSettings>(
    campaignsPageQuery,
    { locale },
    { next: { tags: ["campaignsPage"] } }
  );

  const defaultTitle = locale === "en" ? "Offers" : "Kampanyalar";
  const title = pageData?.title || defaultTitle;
  const description = pageData?.subtitle || "";
  const ogImage = pageData?.heroImage;
  const pageSeo = pageData?.seo ? {
    metaTitle: pageData.seo.metaTitle,
    metaDescription: pageData.seo.metaDescription,
    ogImage: pageData.seo.shareGraphic,
  } : undefined;

  return buildMetadata({
    title,
    description,
    ogImage,
    canonicalPath: getPublicPath("kampanyalar", locale as Locale),
    locale,
    pageSeo,
  });
}

export default async function OffersPage({ params }: Props) {
  const { locale } = await params;

  // Run fetches in parallel for optimal performance
  const [pageData, activeCampaigns, pastCampaigns] = await Promise.all([
    cachedFetch<StaticPageSettings>(
      campaignsPageQuery,
      { locale },
      { next: { tags: ["campaignsPage"] } }
    ),
    cachedFetch<Campaign[]>(
      activeCampaignsQuery,
      { locale },
      { next: { tags: ["campaign"] } }
    ),
    cachedFetch<Campaign[]>(
      pastCampaignsQuery,
      { locale },
      { next: { tags: ["campaign"] } }
    ),
  ]);

  const defaultTitle = locale === "en" ? "Offers" : "Kampanyalar";
  const defaultSubtitle = locale === "en" ? "Discover special campaigns at AVLU34" : "AVLU34'teki özel kampanya ve fırsatları keşfedin";

  const title = pageData?.title || defaultTitle;
  const subtitle = pageData?.subtitle || defaultSubtitle;
  const backgroundImage = pageData?.heroImage;

  // Breadcrumbs items for PageHero
  const breadcrumbs = [
    { label: locale === "en" ? "Home" : "Ana Sayfa", href: locale === "en" ? "/en" : "/" },
    { label: title, href: getPublicPath("kampanyalar", locale as Locale), active: true },
  ];

  return (
    <div className="flex flex-col pb-16 bg-white min-h-screen">
      <PageHero
        title={title}
        subtitle={subtitle}
        backgroundImage={backgroundImage}
        breadcrumbs={breadcrumbs}
      />
      <CampaignList
        activeCampaigns={activeCampaigns || []}
        pastCampaigns={pastCampaigns || []}
        locale={locale as Locale}
      />
    </div>
  );
}
