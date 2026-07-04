import { Metadata } from "next";
import { cachedFetch } from "@/sanity/lib/client";
import { cinemaPageQuery } from "@/sanity/lib/queries";
import { PageHero } from "@/components/layout/PageHero";
import { CinemaDetails } from "@/components/cinema/CinemaDetails";
import { locales, Locale } from "@/lib/i18n/config";
import { buildMetadata } from "@/lib/seo";
import { getPublicPath } from "@/lib/i18n/routes";
import { CinemaPage as CinemaPageType } from "@/types";

type Props = {
  params: Promise<{ locale: string }>;
};

export async function generateStaticParams() {
  return locales.map((locale) => ({ locale }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const data = await cachedFetch<CinemaPageType>(
    cinemaPageQuery,
    { locale },
    { next: { tags: ["cinema", "campaign"] } }
  );

  const defaultTitle = locale === "en" ? "Cinema" : "Sinema";
  const title = data?.heroTitle || data?.pageTitle || defaultTitle;
  const description = data?.heroSubtitle || "";
  const ogImage = data?.heroImage;
  const pageSeo = data?.seo ? {
    metaTitle: data.seo.metaTitle,
    metaDescription: data.seo.metaDescription,
    ogImage: data.seo.shareGraphic,
  } : undefined;

  return buildMetadata({
    title,
    description,
    ogImage,
    canonicalPath: getPublicPath("sinema", locale as Locale),
    locale,
    pageSeo,
  });
}

export default async function CinemaPage({ params }: Props) {
  const { locale } = await params;
  const isEn = locale === "en";

  const data = await cachedFetch<CinemaPageType>(
    cinemaPageQuery,
    { locale },
    { next: { tags: ["cinema", "campaign"] } }
  );

  const defaultTitle = isEn ? "Cinema" : "Sinema";
  const defaultSubtitle = isEn ? "Experience movies in comfort" : "Konforlu salonlarda film keyfini yaşayın";

  const title = data?.heroTitle || data?.pageTitle || defaultTitle;
  const subtitle = data?.heroSubtitle || defaultSubtitle;
  const backgroundImage = data?.heroImage;

  // Breadcrumbs items for PageHero
  const breadcrumbs = [
    { label: isEn ? "Home" : "Ana Sayfa", href: isEn ? "/en" : "/" },
    { label: title, href: getPublicPath("sinema", locale as Locale), active: true },
  ];

  return (
    <div className="flex flex-col pb-16 bg-white min-h-screen">
      <PageHero
        title={title}
        subtitle={subtitle}
        backgroundImage={backgroundImage}
        breadcrumbs={breadcrumbs}
      />
      {data && (
        <CinemaDetails data={data} locale={locale as Locale} />
      )}
    </div>
  );
}
