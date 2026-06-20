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
    title: isEn ? "Visit Plan" : "Ziyaret Planı",
    canonicalPath: getPublicPath("ziyaret-plani", locale as Locale),
  });
}

export default async function VisitPlanPage({ params }: Props) {
  const { locale } = await params;
  const isEn = locale === "en";
  const title = isEn ? "Visit Plan" : "Ziyaret Planı";
  const subtitle = isEn ? "How to get to AVLU34, hours, services" : "AVLU34'e nasıl ulaşacağınızı, çalışma saatlerini ve hizmetlerimizi inceleyin";

  return (
    <div className="flex flex-col gap-12 pb-16">
      <PageHero title={title} subtitle={subtitle} />
      <div className="container mx-auto px-4">
        <p className="text-muted-foreground">
          {isEn 
            ? "Transportation info, address, parking, working hours, and services details will be here." 
            : "Ulaşım bilgileri, adres, otopark, çalışma saatleri ve AVM hizmetleri burada yer alacak."}
        </p>
      </div>
    </div>
  );
}
