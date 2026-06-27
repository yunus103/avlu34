import { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { PageHero } from "@/components/layout/PageHero";
import { SanityImage } from "@/components/ui/SanityImage";
import { RichText } from "@/components/ui/RichText";
import { buildMetadata } from "@/lib/seo";
import { getPublicPath } from "@/lib/i18n/routes";
import { Locale } from "@/lib/i18n/config";
import { cachedFetch } from "@/sanity/lib/client";
import { campaignBySlugQuery } from "@/sanity/lib/queries";
import { Campaign } from "@/types";
import { RiCalendarEventLine, RiStore2Line, RiArrowRightLine, RiAlertLine } from "react-icons/ri";

type Props = {
  params: Promise<{ locale: string; slug: string }>;
};

export const dynamicParams = true;

export async function generateStaticParams() {
  return [];
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale, slug } = await params;
  const campaign = await cachedFetch<Campaign | null>(
    campaignBySlugQuery,
    { slug, locale },
    { next: { tags: [`campaign:${slug}`, "campaign"] } }
  );

  if (!campaign) {
    return {};
  }

  const pageSeo = campaign.seo ? {
    metaTitle: campaign.seo.metaTitle,
    metaDescription: campaign.seo.metaDescription,
    ogImage: campaign.seo.shareGraphic,
  } : undefined;

  return buildMetadata({
    title: campaign.title,
    canonicalPath: `${getPublicPath("kampanyalar", locale as Locale)}/${slug}`,
    locale,
    pageSeo,
  });
}

export default async function OfferDetailPage({ params }: Props) {
  const { locale, slug } = await params;
  const isEn = locale === "en";

  const campaign = await cachedFetch<Campaign | null>(
    campaignBySlugQuery,
    { slug, locale },
    { next: { tags: [`campaign:${slug}`, "campaign"] } }
  );

  if (!campaign) {
    notFound();
  }

  const parentPath = getPublicPath("kampanyalar", locale as Locale);
  const parentLabel = isEn ? "Offers" : "Kampanyalar";

  const breadcrumbs = [
    { label: parentLabel, href: parentPath },
    { label: campaign.title, href: `${parentPath}/${slug}`, active: true },
  ];

  const isExpired = new Date(campaign.endsAt) < new Date();

  // Date range formatting
  const formatDate = (dateStr: string) => {
    const options: Intl.DateTimeFormatOptions = { day: "numeric", month: "long", year: "numeric" };
    return new Date(dateStr).toLocaleDateString(isEn ? "en-US" : "tr-TR", options);
  };

  const campaignDuration = `${formatDate(campaign.startsAt)} - ${formatDate(campaign.endsAt)}`;

  return (
    <div className="flex flex-col pb-16 bg-white min-h-screen">
      <PageHero
        title={campaign.title}
        subtitle={campaignDuration}
        backgroundImage={campaign.image}
        breadcrumbs={breadcrumbs}
      />

      <div className="container mx-auto px-4 mt-12 md:mt-16">
        {/* Expired warning */}
        {isExpired && (
          <div className="mb-10 p-4 border border-neutral-200 bg-neutral-50 flex items-center gap-3 text-neutral-600 rounded-none max-w-4xl">
            <RiAlertLine className="shrink-0 text-neutral-500" size={20} />
            <span className="text-xs md:text-sm font-sans font-medium tracking-wide">
              {isEn
                ? "This campaign has ended. Please check our active offers for current deals."
                : "Bu kampanyanın süresi dolmuştur. Güncel fırsatlar için lütfen aktif kampanyalarımızı inceleyin."}
            </span>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 md:gap-12 items-start">
          {/* Left Column: Body details & Terms (2/3 width) */}
          <div className="lg:col-span-2 flex flex-col gap-10">
            {/* Main Image displayed inside layout as well for emphasis */}
            {campaign.image && (
              <div className="relative aspect-[16/9] w-full border border-neutral-100 overflow-hidden">
                <SanityImage
                  image={campaign.image}
                  fill
                  sizes="(max-width: 1024px) 100vw, 60vw"
                  className="object-cover"
                  priority
                />
              </div>
            )}

            {/* Campaign Body Content */}
            <div className="prose max-w-none">
              <h2 className="text-xl md:text-2xl font-serif tracking-wide text-neutral-900 border-b pb-3 mb-6">
                {isEn ? "Campaign Details" : "Kampanya Detayları"}
              </h2>
              <RichText value={campaign.body} />
            </div>

            {/* Terms and Conditions (Katılım Koşulları) */}
            {campaign.terms && campaign.terms.length > 0 && (
              <div className="border-t border-neutral-200 pt-8 mt-4">
                <h3 className="text-xs md:text-sm font-sans font-bold tracking-widest text-neutral-400 uppercase mb-4">
                  {isEn ? "Terms & Conditions" : "Kampanya Katılım Koşulları"}
                </h3>
                <div className="text-xs md:text-sm text-neutral-500 leading-relaxed max-w-3xl">
                  <RichText value={campaign.terms} />
                </div>
              </div>
            )}
          </div>

          {/* Right Column: Related Brands (1/3 width) */}
          <div className="lg:col-span-1 lg:sticky lg:top-24">
            {campaign.relatedStores && campaign.relatedStores.length > 0 && (
              <div className="border border-neutral-200 bg-white p-6 md:p-8 flex flex-col gap-6">
                <h3 className="text-xs md:text-sm font-sans font-bold tracking-widest text-neutral-400 uppercase border-b border-neutral-100 pb-3 flex items-center gap-2">
                  <RiStore2Line size={16} />
                  {isEn ? "Participating Brands" : "İlişkili Markalar"}
                </h3>

                <div className="flex flex-col gap-5">
                  {campaign.relatedStores.map((store) => {
                    const storeUrl = `${getPublicPath("magazalar", locale as Locale)}/${store.slug.current}`;
                    return (
                      <div key={store._id} className="flex items-center justify-between gap-4 border-b border-neutral-50 pb-4 last:border-b-0 last:pb-0">
                        <div className="flex items-center gap-3">
                          {store.logo && (
                            <div className="relative w-20 h-12 flex items-center bg-neutral-50 shrink-0 border border-neutral-100">
                              <SanityImage
                                image={store.logo}
                                fill
                                fit="max"
                                className="object-contain p-1"
                              />
                            </div>
                          )}
                          <span className="font-sans font-bold text-xs md:text-sm uppercase tracking-wider text-neutral-900">
                            {store.title}
                          </span>
                        </div>

                        <Link
                          href={storeUrl}
                          className="flex items-center gap-1 text-xs md:text-sm font-sans font-bold uppercase tracking-wider text-neutral-700 hover:text-black border-b border-transparent hover:border-black pb-0.5 transition-all duration-300"
                        >
                          {isEn ? "Store Profile" : "Mağazayı Gör"}
                          <RiArrowRightLine size={12} />
                        </Link>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Campaign Period Card */}
            <div className="border border-neutral-200 bg-neutral-50 p-6 md:p-8 mt-6 flex flex-col gap-3">
              <h4 className="text-xs md:text-sm font-sans font-bold tracking-widest text-neutral-400 uppercase">
                {isEn ? "Campaign Period" : "Kampanya Dönemi"}
              </h4>
              <div className="flex items-start gap-2.5 text-neutral-700">
                <RiCalendarEventLine size={16} className="mt-0.5 shrink-0 text-neutral-400" />
                <span className="text-xs md:text-sm font-sans font-semibold tracking-wide leading-relaxed">
                  {campaignDuration}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
