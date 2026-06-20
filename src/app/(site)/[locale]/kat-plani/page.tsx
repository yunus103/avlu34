import { Metadata } from "next";
import { PageHero } from "@/components/layout/PageHero";
import { locales, Locale } from "@/lib/i18n/config";
import { buildMetadata } from "@/lib/seo";
import { getPublicPath } from "@/lib/i18n/routes";

type Props = {
  params: Promise<{ locale: string }>;
};

export async function generateStaticParams() {
  return locales.map((locale) => ({ locale }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const isEn = locale === "en";
  return buildMetadata({
    title: isEn ? "Floor Plan" : "Kat Planı",
    canonicalPath: getPublicPath("kat-plani", locale as Locale),
  });
}

export default async function FloorPlanPage({ params }: Props) {
  const { locale } = await params;
  const isEn = locale === "en";
  const title = isEn ? "Floor Plan" : "Kat Planı";
  const subtitle = isEn ? "Easily locate your favorite spots" : "Aradığınız yeri kolayca bulun";

  return (
    <div className="flex flex-col gap-12 pb-16">
      <PageHero title={title} subtitle={subtitle} />
      <div className="container mx-auto px-4">
        <p className="text-muted-foreground">
          {isEn 
            ? "Interactive PDF/Image floor plan download and view options will be here." 
            : "Etkileşimli PDF/Görsel kat planı indirme ve görüntüleme seçenekleri burada yer alacak."}
        </p>
      </div>
    </div>
  );
}
