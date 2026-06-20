import { Metadata } from "next";
import { cachedFetch } from "@/sanity/lib/client";
import { aboutPageQuery } from "@/sanity/lib/queries";
import { buildMetadata } from "@/lib/seo";
import { FadeIn } from "@/components/ui/FadeIn";
import { SanityImage } from "@/components/ui/SanityImage";
import { RichText } from "@/components/ui/RichText";
import { PageHero } from "@/components/layout/PageHero";
import { AboutPage as AboutPageType } from "@/types";
import { getPublicPath } from "@/lib/i18n/routes";
import { locales, Locale } from "@/lib/i18n/config";

type Props = {
  params: Promise<{ locale: string }>;
};

export async function generateStaticParams() {
  return locales.map((locale) => ({ locale }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const data = await cachedFetch<AboutPageType>(aboutPageQuery, {}, { next: { tags: ["about"] } });
  
  return buildMetadata({
    title: data?.heroTitle || data?.pageTitle || "Hakkımızda",
    canonicalPath: getPublicPath("hakkimizda", locale as Locale),
    pageSeo: data?.seo,
  });
}

export default async function AboutPage({ params }: Props) {
  const { locale } = await params;
  const data = await cachedFetch<AboutPageType>(aboutPageQuery, {}, { next: { tags: ["about"] } });

  return (
    <div className="flex flex-col gap-12 md:gap-16 pb-16">
      {/* Page Hero */}
      <PageHero
        title={data?.heroTitle || data?.pageTitle || "Hakkımızda"}
        subtitle={data?.heroSubtitle || data?.pageSubtitle}
        backgroundImage={data?.heroImage}
      />

      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
          {/* Sol Kolon: Metin İçeriği */}
          <div className="lg:col-span-7">
            <FadeIn direction="up">
              <h2 className="text-3xl font-bold tracking-tight mb-6">
                {data?.pageTitle || "Hakkımızda"}
              </h2>
            </FadeIn>

            <FadeIn delay={0.2}>
              <RichText value={data?.body} />
            </FadeIn>
          </div>

          {/* Sağ Kolon: Görsel */}
          <div className="lg:col-span-5 lg:sticky lg:top-24">
            {data?.mainImage && (
              <FadeIn direction="left" delay={0.3}>
                <div className="relative aspect-[4/3] sm:aspect-[3/2] lg:aspect-[3/4] rounded-2xl overflow-hidden shadow-2xl">
                  <SanityImage
                    image={data.mainImage}
                    fill
                    sizes="(max-width: 1024px) 100vw, 40vw"
                    className="object-cover"
                    priority
                  />
                </div>
              </FadeIn>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
