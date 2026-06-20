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
    title: isEn ? "Stores" : "Mağazalar",
    canonicalPath: getPublicPath("magazalar", locale as Locale),
  });
}

export default async function StoresPage({ params }: Props) {
  const { locale } = await params;
  const isEn = locale === "en";
  const title = isEn ? "Stores" : "Mağazalar";
  const subtitle = isEn ? "Discover your favorite brands" : "En sevdiğiniz markaları keşfedin";

  return (
    <div className="flex flex-col gap-12 pb-16">
      <PageHero title={title} subtitle={subtitle} />
      <div className="container mx-auto px-4">
        <p className="text-muted-foreground">
          {isEn ? "All stores and directory listing will be here." : "Tüm mağazalar ve dizin listesi burada yer alacak."}
        </p>
      </div>
    </div>
  );
}
