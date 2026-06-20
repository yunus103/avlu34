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
    title: isEn ? "Offers" : "Kampanyalar",
    canonicalPath: getPublicPath("kampanyalar", locale as Locale),
  });
}

export default async function OffersPage({ params }: Props) {
  const { locale } = await params;
  const isEn = locale === "en";
  const title = isEn ? "Offers" : "Kampanyalar";
  const subtitle = isEn ? "Stay updated with our special offers" : "Size özel fırsat ve kampanyalardan haberdar olun";

  return (
    <div className="flex flex-col gap-12 pb-16">
      <PageHero title={title} subtitle={subtitle} />
      <div className="container mx-auto px-4">
        <p className="text-muted-foreground">
          {isEn ? "Active and past offers list will be here." : "Aktif ve geçmiş kampanyalar listesi burada yer alacak."}
        </p>
      </div>
    </div>
  );
}
