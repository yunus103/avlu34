import { Metadata } from "next";
import { notFound } from "next/navigation";
import { PageHero } from "@/components/layout/PageHero";
import { buildMetadata } from "@/lib/seo";
import { getPublicPath } from "@/lib/i18n/routes";
import { Locale } from "@/lib/i18n/config";
import { cachedFetch } from "@/sanity/lib/client";
import { diningBySlugQuery, foodCategoryBySlugQuery, diningPageQuery, foodCategoriesQuery, diningListQuery } from "@/sanity/lib/queries";
import { Store, FoodCategory } from "@/types";
import { DirectoryTemplate } from "@/components/layout/DirectoryTemplate";

type Props = {
  params: Promise<{ locale: string; kategori: string }>;
};

export const dynamicParams = true;

export async function generateStaticParams() {
  return [];
}

// Fetch dining place or food category dynamically with React cache deduplication
async function getDiningOrCategory(kategori: string, locale: string) {
  // Try to find as a dining place first
  const dining = await cachedFetch<Store | null>(
    diningBySlugQuery,
    { slug: kategori, locale },
    { next: { tags: [`store:${kategori}`, "store"] } }
  );

  if (dining) {
    return { type: "dining" as const, data: dining };
  }

  // If not a dining place, try to find as a food category
  const category = await cachedFetch<FoodCategory | null>(
    foodCategoryBySlugQuery,
    { slug: kategori, locale },
    { next: { tags: [`foodCategory:${kategori}`, "foodCategory"] } }
  );

  if (category) {
    return { type: "category" as const, data: category };
  }

  return null;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale, kategori } = await params;
  const result = await getDiningOrCategory(kategori, locale);

  if (!result) {
    return {};
  }

  const title = result.type === "dining" ? result.data.title : result.data.title;
  const pageSeo = result.type === "dining" && result.data.seo ? {
    metaTitle: result.data.seo.metaTitle,
    metaDescription: result.data.seo.metaDescription,
    ogImage: result.data.seo.shareGraphic,
  } : undefined;

  return buildMetadata({
    title,
    canonicalPath: `${getPublicPath("yeme-icme", locale as Locale)}/${kategori}`,
    locale,
    pageSeo
  });
}

export default async function DiningCategoryPage({ params }: Props) {
  const { locale, kategori } = await params;
  const isEn = locale === "en";

  const result = await getDiningOrCategory(kategori, locale);

  if (!result) {
    notFound();
  }

  const parentPath = getPublicPath("yeme-icme", locale as Locale);
  const parentLabel = isEn ? "Dining" : "Yeme-İçme";

  const breadcrumbs = [
    { label: parentLabel, href: parentPath },
    { label: result.data.title, href: `${parentPath}/${kategori}`, active: true }
  ];

  if (result.type === "category") {
    // Run parallel fetches for category listing
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

    const title = result.data.title;
    const subtitle = isEn 
      ? `Taste our best ${result.data.title.toLowerCase()} options` 
      : `AVLU34 bünyesindeki en leziz ${result.data.title.toLowerCase()} seçenekleri`;
    const backgroundImage = pageData?.heroImage;

    return (
      <DirectoryTemplate
        title={title}
        subtitle={subtitle}
        backgroundImage={backgroundImage}
        categories={categories}
        items={items}
        type="dining"
        activeCategorySlug={kategori}
        locale={locale as Locale}
      />
    );
  }

  return (
    <div className="flex flex-col gap-12 pb-16">
      <PageHero 
        title={result.data.title} 
        subtitle={isEn ? "Dining Details" : "Yeme-İçme Detayları"} 
        breadcrumbs={breadcrumbs}
      />
      <div className="container mx-auto px-4">
        <p className="text-muted-foreground">
          {isEn 
            ? `Detail page for place: ${result.data.title}` 
            : `${result.data.title} detay sayfası.`}
        </p>
      </div>
    </div>
  );
}
