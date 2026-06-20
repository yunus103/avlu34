import { Metadata } from "next";
import { PageHero } from "@/components/layout/PageHero";
import { buildMetadata } from "@/lib/seo";
import { getPublicPath } from "@/lib/i18n/routes";
import { Locale } from "@/lib/i18n/config";

type Props = {
  params: Promise<{ locale: string; slug: string }>;
};

export const dynamicParams = true;

export async function generateStaticParams() {
  return [];
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale, slug } = await params;
  return buildMetadata({
    title: slug,
    canonicalPath: `${getPublicPath("etkinlikler", locale as Locale)}/${slug}`,
    locale
  });
}

export default async function EventDetailPage({ params }: Props) {
  const { locale, slug } = await params;
  const isEn = locale === "en";

  return (
    <div className="flex flex-col gap-12 pb-16">
      <PageHero 
        title={slug.toUpperCase()} 
        subtitle={isEn ? "Event Details" : "Etkinlik Detayları"} 
      />
      <div className="container mx-auto px-4">
        <p className="text-muted-foreground">
          {isEn 
            ? `Detail page for event: ${slug}` 
            : `Etkinlik detay sayfası: ${slug}`}
        </p>
      </div>
    </div>
  );
}
