import { Metadata } from "next";
import { locales, Locale } from "@/lib/i18n/config";
import { buildMetadata } from "@/lib/seo";
import { getPublicPath } from "@/lib/i18n/routes";
import { cachedFetch } from "@/sanity/lib/client";
import { PageHero } from "@/components/layout/PageHero";
import { EventList } from "@/components/events/EventList";
import {
  homePageQuery,
  activeEventsQuery,
  pastEventsQuery,
} from "@/sanity/lib/queries";
import { Event, HomePage } from "@/types";

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

  const title = pageData?.eventsTitle || (locale === "en" ? "Events" : "Etkinlikler");
  const description = pageData?.eventsSubtitle || "";
  const ogImage = pageData?.eventsImage;

  return buildMetadata({
    title,
    description,
    ogImage,
    canonicalPath: getPublicPath("etkinlikler", locale as Locale),
    locale,
  });
}

export default async function EventsPage({ params }: Props) {
  const { locale } = await params;

  // Run fetches in parallel for optimal performance
  const [pageData, activeEvents, pastEvents] = await Promise.all([
    cachedFetch<HomePage>(
      homePageQuery,
      { locale },
      { next: { tags: ["home"] } }
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

  const title = pageData?.eventsTitle || defaultTitle;
  const subtitle = pageData?.eventsSubtitle || defaultSubtitle;
  const backgroundImage = pageData?.eventsImage;

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
