import { Metadata } from "next";
import { locales, Locale } from "@/lib/i18n/config";
import { buildMetadata } from "@/lib/seo";
import { getPublicPath } from "@/lib/i18n/routes";
import { cachedFetch } from "@/sanity/lib/client";
import { PageHero } from "@/components/layout/PageHero";
import { EventList } from "@/components/events/EventList";
import {
  eventsPageQuery,
  activeEventsQuery,
  pastEventsQuery,
} from "@/sanity/lib/queries";
import { Event, StaticPageSettings } from "@/types";

type Props = {
  params: Promise<{ locale: string }>;
};

export async function generateStaticParams() {
  return locales.map((locale) => ({ locale }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const pageData = await cachedFetch<StaticPageSettings>(
    eventsPageQuery,
    { locale },
    { next: { tags: ["eventsPage"] } }
  );

  const defaultTitle = locale === "en" ? "Events" : "Etkinlikler";
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
    canonicalPath: getPublicPath("etkinlikler", locale as Locale),
    locale,
    pageSeo,
  });
}

export default async function EventsPage({ params }: Props) {
  const { locale } = await params;

  // Run fetches in parallel for optimal performance
  const [pageData, activeEvents, pastEvents] = await Promise.all([
    cachedFetch<StaticPageSettings>(
      eventsPageQuery,
      { locale },
      { next: { tags: ["eventsPage"] } }
    ),
    cachedFetch<Event[]>(
      activeEventsQuery,
      { locale },
      { next: { tags: ["event"] } }
    ),
    cachedFetch<Event[]>(
      pastEventsQuery,
      { locale },
      { next: { tags: ["event"] } }
    ),
  ]);

  const defaultTitle = locale === "en" ? "Events" : "Etkinlikler";
  const defaultSubtitle = locale === "en" ? "Discover culture and entertainment at AVLU34" : "AVLU34'teki kültür, sanat ve eğlence dolu etkinlikleri keşfedin";

  const title = pageData?.title || defaultTitle;
  const subtitle = pageData?.subtitle || defaultSubtitle;
  const backgroundImage = pageData?.heroImage;

  // Breadcrumbs items for PageHero
  const breadcrumbs = [
    { label: locale === "en" ? "Home" : "Ana Sayfa", href: locale === "en" ? "/en" : "/" },
    { label: title, href: getPublicPath("etkinlikler", locale as Locale), active: true },
  ];

  return (
    <div className="flex flex-col pb-16 bg-white min-h-screen">
      <PageHero
        title={title}
        subtitle={subtitle}
        backgroundImage={backgroundImage}
        breadcrumbs={breadcrumbs}
      />
      <EventList
        activeEvents={activeEvents || []}
        pastEvents={pastEvents || []}
        locale={locale as Locale}
      />
    </div>
  );
}
