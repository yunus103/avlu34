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
    title: isEn ? "Events" : "Etkinlikler",
    canonicalPath: getPublicPath("etkinlikler", locale as Locale),
  });
}

export default async function EventsPage({ params }: Props) {
  const { locale } = await params;
  const isEn = locale === "en";
  const title = isEn ? "Events" : "Etkinlikler";
  const subtitle = isEn ? "Join our cultural and entertainment events" : "Kültür, sanat ve eğlence dolu etkinliklerimize katılın";

  return (
    <div className="flex flex-col gap-12 pb-16">
      <PageHero title={title} subtitle={subtitle} />
      <div className="container mx-auto px-4">
        <p className="text-muted-foreground">
          {isEn ? "Upcoming and past events list will be here." : "Gelecek ve geçmiş etkinlikler listesi burada yer alacak."}
        </p>
      </div>
    </div>
  );
}
