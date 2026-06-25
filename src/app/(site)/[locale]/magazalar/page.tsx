import { Metadata } from "next";
import { locales, Locale } from "@/lib/i18n/config";
import { buildMetadata } from "@/lib/seo";
import { getPublicPath } from "@/lib/i18n/routes";
import { cachedFetch } from "@/sanity/lib/client";
import { storesPageQuery, storeCategoriesQuery, storeListQuery } from "@/sanity/lib/queries";
import { DirectoryTemplate } from "@/components/layout/DirectoryTemplate";
import { Store, StoreCategory } from "@/types";

type Props = {
  params: Promise<{ locale: string }>;
};

export async function generateStaticParams() {
  return locales.map((locale) => ({ locale }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const pageData = await cachedFetch<any>(
    storesPageQuery,
    { locale },
    { next: { tags: ["storesPage"] } }
  );

  const title = pageData?.title || (locale === "en" ? "Stores" : "Mağazalar");
  const pageSeo = pageData?.seo ? {
    metaTitle: pageData.seo.metaTitle,
    metaDescription: pageData.seo.metaDescription,
    ogImage: pageData.seo.shareGraphic,
  } : undefined;

  return buildMetadata({
    title,
    canonicalPath: getPublicPath("magazalar", locale as Locale),
    locale,
    pageSeo
  });
}

export default async function StoresPage({ params }: Props) {
  const { locale } = await params;

  // Run fetches in parallel for performance
  const [pageData, categories, items] = await Promise.all([
    cachedFetch<any>(
      storesPageQuery, 
      { locale }, 
      { next: { tags: ["storesPage"] } }
    ),
    cachedFetch<StoreCategory[]>(
      storeCategoriesQuery, 
      { locale }, 
      { next: { tags: ["storeCategory"] } }
    ),
    cachedFetch<Store[]>(
      storeListQuery, 
      { locale }, 
      { next: { tags: ["store"] } }
    ),
  ]);

  const defaultTitle = locale === "en" ? "Stores" : "Mağazalar";
  const defaultSubtitle = locale === "en" ? "Discover your favorite brands" : "En sevdiğiniz markaları keşfedin";

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
      type="store"
      locale={locale as Locale}
    />
  );
}
