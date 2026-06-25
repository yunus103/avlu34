import { Metadata } from "next";
import { notFound } from "next/navigation";
import { PageHero } from "@/components/layout/PageHero";
import { buildMetadata } from "@/lib/seo";
import { getPublicPath } from "@/lib/i18n/routes";
import { Locale } from "@/lib/i18n/config";
import { cachedFetch } from "@/sanity/lib/client";
import { storeBySlugQuery, storeCategoryBySlugQuery } from "@/sanity/lib/queries";
import { Store, StoreCategory } from "@/types";

type Props = {
  params: Promise<{ locale: string; slug: string }>;
};

export const dynamicParams = true;

export async function generateStaticParams() {
  return [];
}

// Fetch store or category dynamically with React cache deduplication
async function getStoreOrCategory(slug: string, locale: string) {
  // Try to find as a store first
  const store = await cachedFetch<Store | null>(
    storeBySlugQuery,
    { slug, locale },
    { next: { tags: [`store:${slug}`, "store"] } }
  );

  if (store) {
    return { type: "store" as const, data: store };
  }

  // If not a store, try to find as a store category
  const category = await cachedFetch<StoreCategory | null>(
    storeCategoryBySlugQuery,
    { slug, locale },
    { next: { tags: [`storeCategory:${slug}`, "storeCategory"] } }
  );

  if (category) {
    return { type: "category" as const, data: category };
  }

  return null;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale, slug } = await params;
  const result = await getStoreOrCategory(slug, locale);

  if (!result) {
    return {};
  }

  const title = result.type === "store" ? result.data.title : result.data.title;
  const pageSeo = result.type === "store" && result.data.seo ? {
    metaTitle: result.data.seo.metaTitle,
    metaDescription: result.data.seo.metaDescription,
    ogImage: result.data.seo.shareGraphic,
  } : undefined;

  return buildMetadata({
    title,
    canonicalPath: `${getPublicPath("magazalar", locale as Locale)}/${slug}`,
    locale,
    pageSeo
  });
}

export default async function StoreDetailPage({ params }: Props) {
  const { locale, slug } = await params;
  const isEn = locale === "en";

  const result = await getStoreOrCategory(slug, locale);

  if (!result) {
    notFound();
  }

  if (result.type === "category") {
    return (
      <div className="flex flex-col gap-12 pb-16">
        <PageHero 
          title={result.data.title.toUpperCase()} 
          subtitle={isEn ? `Category: ${result.data.title}` : `Kategori: ${result.data.title}`} 
        />
        <div className="container mx-auto px-4">
          <p className="text-muted-foreground">
            {isEn 
              ? `Stores in category: ${result.data.title}` 
              : `${result.data.title} kategorisindeki mağazalar burada listelenecek.`}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-12 pb-16">
      <PageHero 
        title={result.data.title} 
        subtitle={isEn ? "Store Details" : "Mağaza Detayları"} 
      />
      <div className="container mx-auto px-4">
        <p className="text-muted-foreground">
          {isEn 
            ? `Detail page for store: ${result.data.title}` 
            : `${result.data.title} mağaza detay sayfası.`}
        </p>
      </div>
    </div>
  );
}
