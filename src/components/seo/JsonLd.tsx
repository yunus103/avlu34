import { getSiteUrl } from "@/lib/utils";
import { SiteSettings, Store, Campaign, Event, SocialLink } from "@/types";

export function JsonLd({ data }: { data: Record<string, unknown> }) {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
}

export function organizationJsonLd(settings?: SiteSettings) {
  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: settings?.siteName,
    url: getSiteUrl(),
    ...(settings?.contactInfo?.phone && { telephone: settings.contactInfo.phone }),
    ...(settings?.contactInfo?.email && { email: settings.contactInfo.email }),
    ...(settings?.contactInfo?.address && {
      address: { "@type": "PostalAddress", streetAddress: settings.contactInfo.address },
    }),
    sameAs: settings?.socialLinks?.map((s: SocialLink) => s.url).filter(Boolean) || [],
  };
}

export function websiteJsonLd(settings?: SiteSettings) {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: settings?.siteName || "Site Adı",
    url: getSiteUrl(),
    ...(settings?.siteTagline && { alternateName: settings.siteTagline }),
  };
}

export function storeJsonLd(store?: Store) {
  return {
    "@context": "https://schema.org",
    "@type": "LocalBusiness",
    name: store?.title,
    url: `${getSiteUrl()}/magazalar/${store?.slug?.current}`,
    ...(store?.logo?.asset?.url && { image: store.logo.asset.url }),
    ...(store?.phone && { telephone: store.phone }),
  };
}

export function campaignJsonLd(campaign?: Campaign) {
  return {
    "@context": "https://schema.org",
    "@type": "SpecialAnnouncement",
    name: campaign?.title,
    url: `${getSiteUrl()}/kampanyalar/${campaign?.slug?.current}`,
    ...(campaign?.image?.asset?.url && { image: campaign.image.asset.url }),
    startDate: campaign?.startsAt,
    endDate: campaign?.endsAt,
  };
}

export function eventJsonLd(event?: Event) {
  return {
    "@context": "https://schema.org",
    "@type": "Event",
    name: event?.title,
    url: `${getSiteUrl()}/etkinlikler/${event?.slug?.current}`,
    ...(event?.image?.asset?.url && { image: event.image.asset.url }),
    startDate: event?.startsAt,
    endDate: event?.endsAt,
    eventAttendanceMode: "https://schema.org/OfflineEventAttendanceMode",
    eventStatus: "https://schema.org/EventScheduled",
    location: {
      "@type": "Place",
      name: "AVLU34 AVM",
      address: {
        "@type": "PostalAddress",
        streetAddress: "Arnavutköy",
        addressLocality: "İstanbul",
        addressCountry: "TR",
      },
    },
  };
}

export function faqPageJsonLd(faqs: { question: string; answer: string }[]) {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map((faq) => ({
      "@type": "Question",
      name: faq.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: faq.answer,
      },
    })),
  };
}

export function breadcrumbListJsonLd(items: { label: string; href: string }[]) {
  const siteUrl = getSiteUrl();
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.label,
      item: item.href.startsWith("http") ? item.href : `${siteUrl}${item.href}`,
    })),
  };
}
