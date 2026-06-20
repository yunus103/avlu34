import { MetadataRoute } from "next";
import { cachedFetch } from "@/sanity/lib/client";
import { allSlugsForSitemapQuery } from "@/sanity/lib/queries";
import { getSiteUrl } from "@/lib/utils";

export const revalidate = 86400; // Cache sitemap for 24 hours on CDN Edge

type SitemapItem = {
  slug: string;
  _updatedAt?: string;
};

type SitemapPage = {
  _updatedAt?: string;
  noIndex?: boolean;
};

type SitemapData = {
  pages?: Record<"home" | "about" | "contact" | "cinema" | "mallMap" | "visitPlan" | "kvkk", SitemapPage | null>;
  stores?: SitemapItem[];
  campaigns?: SitemapItem[];
  events?: SitemapItem[];
};

function lastModified(updatedAt?: string) {
  return updatedAt ? new Date(updatedAt) : undefined;
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const base = getSiteUrl();
  const data = await cachedFetch<SitemapData>(
    allSlugsForSitemapQuery,
    {},
    { next: { tags: ["sitemap"] } }
  );
  
  const pages = data?.pages;

  // 1. Static Pages (Turkish)
  const trStaticPages: MetadataRoute.Sitemap = [
    { url: base, lastModified: lastModified(pages?.home?._updatedAt), changeFrequency: "weekly" as const, priority: 1 },
    { url: `${base}/hakkimizda`, lastModified: lastModified(pages?.about?._updatedAt), changeFrequency: "monthly" as const, priority: 0.8 },
    { url: `${base}/iletisim`, lastModified: lastModified(pages?.contact?._updatedAt), changeFrequency: "monthly" as const, priority: 0.7 },
    { url: `${base}/sinema`, lastModified: lastModified(pages?.cinema?._updatedAt), changeFrequency: "monthly" as const, priority: 0.8 },
    { url: `${base}/kat-plani`, lastModified: lastModified(pages?.mallMap?._updatedAt), changeFrequency: "monthly" as const, priority: 0.7 },
    { url: `${base}/ziyaret-plani`, lastModified: lastModified(pages?.visitPlan?._updatedAt), changeFrequency: "monthly" as const, priority: 0.8 },
    { url: `${base}/kvkk`, lastModified: lastModified(pages?.kvkk?._updatedAt), changeFrequency: "monthly" as const, priority: 0.5 },
    { url: `${base}/magazalar`, changeFrequency: "weekly" as const, priority: 0.9 },
    { url: `${base}/yeme-icme`, changeFrequency: "weekly" as const, priority: 0.9 },
    { url: `${base}/kampanyalar`, changeFrequency: "weekly" as const, priority: 0.8 },
    { url: `${base}/etkinlikler`, changeFrequency: "weekly" as const, priority: 0.8 },
  ].filter(route => {
    const path = route.url.replace(base, "") || "/";
    if (path === "/") return !pages?.home?.noIndex;
    if (path === "/hakkimizda") return !pages?.about?.noIndex;
    if (path === "/iletisim") return !pages?.contact?.noIndex;
    if (path === "/sinema") return !pages?.cinema?.noIndex;
    if (path === "/kat-plani") return !pages?.mallMap?.noIndex;
    if (path === "/ziyaret-plani") return !pages?.visitPlan?.noIndex;
    if (path === "/kvkk") return !pages?.kvkk?.noIndex;
    return true;
  });

  // 2. Static Pages (English)
  const enStaticPages: MetadataRoute.Sitemap = [
    { url: `${base}/en`, lastModified: lastModified(pages?.home?._updatedAt), changeFrequency: "weekly" as const, priority: 1 },
    { url: `${base}/en/about-us`, lastModified: lastModified(pages?.about?._updatedAt), changeFrequency: "monthly" as const, priority: 0.8 },
    { url: `${base}/en/contact`, lastModified: lastModified(pages?.contact?._updatedAt), changeFrequency: "monthly" as const, priority: 0.7 },
    { url: `${base}/en/cinema`, lastModified: lastModified(pages?.cinema?._updatedAt), changeFrequency: "monthly" as const, priority: 0.8 },
    { url: `${base}/en/floor-plan`, lastModified: lastModified(pages?.mallMap?._updatedAt), changeFrequency: "monthly" as const, priority: 0.7 },
    { url: `${base}/en/visit-plan`, lastModified: lastModified(pages?.visitPlan?._updatedAt), changeFrequency: "monthly" as const, priority: 0.8 },
    { url: `${base}/en/privacy`, lastModified: lastModified(pages?.kvkk?._updatedAt), changeFrequency: "monthly" as const, priority: 0.5 },
    { url: `${base}/en/stores`, changeFrequency: "weekly" as const, priority: 0.9 },
    { url: `${base}/en/dining`, changeFrequency: "weekly" as const, priority: 0.9 },
    { url: `${base}/en/offers`, changeFrequency: "weekly" as const, priority: 0.8 },
    { url: `${base}/en/events`, changeFrequency: "weekly" as const, priority: 0.8 },
  ].filter(route => {
    if (pages?.home?.noIndex) return false;
    return true;
  });

  // 3. Dynamic Pages (Turkish & English)
  const dynamicEntries: MetadataRoute.Sitemap = [];

  // Stores
  data?.stores?.forEach((store) => {
    // Turkish
    dynamicEntries.push({
      url: `${base}/magazalar/${store.slug}`,
      lastModified: lastModified(store._updatedAt),
      changeFrequency: "monthly" as const,
      priority: 0.7,
    });
    // English
    dynamicEntries.push({
      url: `${base}/en/stores/${store.slug}`,
      lastModified: lastModified(store._updatedAt),
      changeFrequency: "monthly" as const,
      priority: 0.7,
    });
  });

  // Campaigns
  data?.campaigns?.forEach((camp) => {
    // Turkish
    dynamicEntries.push({
      url: `${base}/kampanyalar/${camp.slug}`,
      lastModified: lastModified(camp._updatedAt),
      changeFrequency: "monthly" as const,
      priority: 0.7,
    });
    // English
    dynamicEntries.push({
      url: `${base}/en/offers/${camp.slug}`,
      lastModified: lastModified(camp._updatedAt),
      changeFrequency: "monthly" as const,
      priority: 0.7,
    });
  });

  // Events
  data?.events?.forEach((evt) => {
    // Turkish
    dynamicEntries.push({
      url: `${base}/etkinlikler/${evt.slug}`,
      lastModified: lastModified(evt._updatedAt),
      changeFrequency: "monthly" as const,
      priority: 0.7,
    });
    // English
    dynamicEntries.push({
      url: `${base}/en/events/${evt.slug}`,
      lastModified: lastModified(evt._updatedAt),
      changeFrequency: "monthly" as const,
      priority: 0.7,
    });
  });

  return [...trStaticPages, ...enStaticPages, ...dynamicEntries];
}
