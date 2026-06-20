import { Metadata } from "next";
import { PageHero } from "@/components/layout/PageHero";
import { buildMetadata } from "@/lib/seo";
import { getPublicPath } from "@/lib/i18n/routes";
import { Locale } from "@/lib/i18n/config";

type Props = {
  params: Promise<{ locale: string; kategori: string }>;
};

export const dynamicParams = true;

export async function generateStaticParams() {
  return [];
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale, kategori } = await params;
  return buildMetadata({
    title: kategori,
    canonicalPath: `${getPublicPath("yeme-icme", locale as Locale)}/${kategori}`,
  });
}

export default async function DiningCategoryPage({ params }: Props) {
  const { locale, kategori } = await params;
  const isEn = locale === "en";

  return (
    <div className="flex flex-col gap-12 pb-16">
      <PageHero 
        title={kategori.toUpperCase()} 
        subtitle={isEn ? "Dining Category" : "Yeme-İçme Kategorisi"} 
      />
      <div className="container mx-auto px-4">
        <p className="text-muted-foreground">
          {isEn 
            ? `List of places in category: ${kategori}` 
            : `${kategori} kategorisindeki lezzet durakları.`}
        </p>
      </div>
    </div>
  );
}
