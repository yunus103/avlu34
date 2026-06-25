import { Metadata } from "next";
import { locales, Locale } from "@/lib/i18n/config";
import { buildMetadata } from "@/lib/seo";
import { getPublicPath } from "@/lib/i18n/routes";
import { cachedFetch } from "@/sanity/lib/client";
import { diningPageQuery, foodCategoriesQuery, diningListQuery } from "@/sanity/lib/queries";
import { DirectoryTemplate } from "@/components/layout/DirectoryTemplate";
import { Store, FoodCategory } from "@/types";

type Props = {
  params: Promise<{ locale: string }>;
};

export async function generateStaticParams() {
  return locales.map((locale) => ({ locale }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const pageData = await cachedFetch<any>(
    diningPageQuery,
    { locale },
    { next: { tags: ["diningPage"] } }
  );

  const title = pageData?.title || (locale === "en" ? "Dining" : "Yeme-İçme");
  const pageSeo = pageData?.seo ? {
    metaTitle: pageData.seo.metaTitle,
    metaDescription: pageData.seo.metaDescription,
    ogImage: pageData.seo.shareGraphic,
  } : undefined;

  return buildMetadata({
    title,
    canonicalPath: getPublicPath("yeme-icme", locale as Locale),
    locale,
    pageSeo
  });
}

export default async function DiningPage({ params }: Props) {
  const { locale } = await params;

  // Run fetches in parallel for performance
  const [pageData, categories, items] = await Promise.all([
    cachedFetch<any>(
      diningPageQuery, 
      { locale }, 
      { next: { tags: ["diningPage"] } }
    ),
    cachedFetch<FoodCategory[]>(
      foodCategoriesQuery, 
      { locale }, 
      { next: { tags: ["foodCategory"] } }
    ),
    cachedFetch<Store[]>(
      diningListQuery, 
      { locale }, 
      { next: { tags: ["store"] } }
    ),
  ]);

  const defaultTitle = locale === "en" ? "Dining" : "Yeme-İçme";
  const defaultSubtitle = locale === "en" ? "Taste local and international flavors" : "Yerel ve dünya lezzetlerini tadın";

  const title = pageData?.title || defaultTitle;
  const subtitle = pageData?.subtitle || defaultSubtitle;
  const backgroundImage = pageData?.heroImage;

  return (
    <DirectoryTemplate
      title={title}
      subtitle={subtitle}
      backgroundImage={backgroundImage}
      categories={categories}
      items={items}
      type="dining"
      locale={locale as Locale}
    />
  );
}
