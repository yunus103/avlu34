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
    title: isEn ? "Dining" : "Yeme-İçme",
    canonicalPath: getPublicPath("yeme-icme", locale as Locale),
  });
}

export default async function DiningPage({ params }: Props) {
  const { locale } = await params;
  const isEn = locale === "en";
  const title = isEn ? "Dining" : "Yeme-İçme";
  const subtitle = isEn ? "Taste local and international flavors" : "Yerel ve dünya lezzetlerini tadın";

  return (
    <div className="flex flex-col gap-12 pb-16">
      <PageHero title={title} subtitle={subtitle} />
      <div className="container mx-auto px-4">
        <p className="text-muted-foreground">
          {isEn ? "Restaurants and cafes list will be here." : "Restoran ve kafelerin listesi burada yer alacak."}
        </p>
      </div>
    </div>
  );
}
