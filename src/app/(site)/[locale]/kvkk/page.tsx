import { Metadata } from "next";
import { PageHero } from "@/components/layout/PageHero";
import { locales, Locale } from "@/lib/i18n/config";
import { buildMetadata } from "@/lib/seo";
import { getPublicPath } from "@/lib/i18n/routes";
import { cachedFetch } from "@/sanity/lib/client";
import { kvkkPageQuery } from "@/sanity/lib/queries";
import type { KvkkPage as KvkkPageType } from "@/types";
import { RichText } from "@/components/ui/RichText";
import { FadeIn } from "@/components/ui/FadeIn";

type Props = {
  params: Promise<{ locale: string }>;
};

export async function generateStaticParams() {
  return locales.map((locale) => ({ locale }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const pageData = await cachedFetch<KvkkPageType>(
    kvkkPageQuery,
    { locale },
    { next: { tags: ["kvkk"] } }
  );

  const isEn = locale === "en";
  const defaultTitle = isEn ? "Privacy Policy" : "KVKK ve Gizlilik Politikası";
  const title = pageData?.pageTitle || pageData?.heroTitle || defaultTitle;
  const description = pageData?.heroSubtitle || "";
  const ogImage = pageData?.heroImage;
  const pageSeo = pageData?.seo ? {
    metaTitle: pageData.seo.metaTitle,
    metaDescription: pageData.seo.metaDescription,
    ogImage: pageData.seo.shareGraphic,
  } : undefined;

  return buildMetadata({
    title,
    description,
    ogImage,
    canonicalPath: getPublicPath("kvkk", locale as Locale),
    locale,
    pageSeo,
  });
}

export default async function KvkkPage({ params }: Props) {
  const { locale } = await params;
  const isEn = locale === "en";

  const pageData = await cachedFetch<KvkkPageType>(
    kvkkPageQuery,
    { locale },
    { next: { tags: ["kvkk"] } }
  );

  const defaultTitle = isEn ? "Privacy Policy" : "KVKK ve Gizlilik Politikası";
  const title = pageData?.heroTitle || pageData?.pageTitle || defaultTitle;
  const subtitle = pageData?.heroSubtitle || "";
  const backgroundImage = pageData?.heroImage;

  // Breadcrumbs items for PageHero
  const breadcrumbs = [
    { label: locale === "en" ? "Home" : "Ana Sayfa", href: locale === "en" ? "/en" : "/" },
    { label: pageData?.pageTitle || defaultTitle, href: getPublicPath("kvkk", locale as Locale), active: true },
  ];

  return (
    <div className="flex flex-col pb-16 bg-white min-h-screen">
      <PageHero
        title={title}
        subtitle={subtitle}
        backgroundImage={backgroundImage}
        breadcrumbs={breadcrumbs}
      />
      <div className="container mx-auto px-4 py-8 md:py-12">
        <FadeIn direction="up" duration={0.5}>
          <div className="max-w-4xl">
            {pageData?.body ? (
              <RichText 
                value={pageData.body} 
                className="prose-sm md:prose-base [&_p]:my-3 [&_h2]:mt-6 [&_h2]:mb-3 [&_h3]:mt-4 [&_h3]:mb-2 [&_li]:my-1 text-neutral-800" 
              />
            ) : (
              <p className="text-neutral-500 py-12">
                {isEn 
                  ? "Privacy notice and GDPR (KVKK) documents will be listed here." 
                  : "Kişisel verilerin korunması ve gizlilik metinleri burada yer alacak."}
              </p>
            )}
          </div>
        </FadeIn>
      </div>
    </div>
  );
}
