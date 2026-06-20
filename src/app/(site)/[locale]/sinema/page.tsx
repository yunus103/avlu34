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
    title: isEn ? "Cinema" : "Sinema",
    canonicalPath: getPublicPath("sinema", locale as Locale),
  });
}

export default async function CinemaPage({ params }: Props) {
  const { locale } = await params;
  const isEn = locale === "en";
  const title = isEn ? "Cinema" : "Sinema";
  const subtitle = isEn ? "Experience movies in comfort" : "Konforlu salonlarda film keyfini yaşayın";

  return (
    <div className="flex flex-col gap-12 pb-16">
      <PageHero title={title} subtitle={subtitle} />
      <div className="container mx-auto px-4">
        <p className="text-muted-foreground">
          {isEn 
            ? "Cinema halls, visual details and movie times reference will be here." 
            : "Sinema salonları, görsel detaylar ve seanslar dış bağlantısı burada yer alacak."}
        </p>
      </div>
    </div>
  );
}
