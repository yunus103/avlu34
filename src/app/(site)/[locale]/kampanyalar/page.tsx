import { Metadata } from "next";
import { locales, Locale } from "@/lib/i18n/config";
import { buildMetadata } from "@/lib/seo";
import { getPublicPath } from "@/lib/i18n/routes";
import { cachedFetch } from "@/sanity/lib/client";
import { PageHero } from "@/components/layout/PageHero";
import { CampaignList } from "@/components/campaigns/CampaignList";
import {
  homePageQuery,
  activeCampaignsQuery,
  pastCampaignsQuery,
} from "@/sanity/lib/queries";
import { Campaign, HomePage } from "@/types";

type Props = {
  params: Promise<{ locale: string }>;
};

export async function generateStaticParams() {
  return locales.map((locale) => ({ locale }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const pageData = await cachedFetch<HomePage>(
    homePageQuery,
    { locale },
    { next: { tags: ["home"] } }
  );

  const title = pageData?.campaignsTitle || (locale === "en" ? "Offers" : "Kampanyalar");
  const description = pageData?.campaignsSubtitle || "";
  const ogImage = pageData?.campaignsImage;

  return buildMetadata({
    title,
    description,
    ogImage,
    canonicalPath: getPublicPath("kampanyalar", locale as Locale),
    locale,
  });
}

export default async function OffersPage({ params }: Props) {
  const { locale } = await params;

  // Run fetches in parallel for optimal performance
  const [pageData, activeCampaigns, pastCampaigns] = await Promise.all([
    cachedFetch<HomePage>(
      homePageQuery,
      { locale },
      { next: { tags: ["home"] } }
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

  const title = pageData?.campaignsTitle || defaultTitle;
  const subtitle = pageData?.campaignsSubtitle || defaultSubtitle;
  const backgroundImage = pageData?.campaignsImage;

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
