import { Metadata } from "next";
import { notFound } from "next/navigation";
import { PageHero } from "@/components/layout/PageHero";
import { SanityImage } from "@/components/ui/SanityImage";
import { RichText } from "@/components/ui/RichText";
import { EventGallery } from "@/components/events/EventGallery";
import { buildMetadata } from "@/lib/seo";
import { getPublicPath } from "@/lib/i18n/routes";
import { Locale } from "@/lib/i18n/config";
import { cachedFetch } from "@/sanity/lib/client";
import { eventBySlugQuery } from "@/sanity/lib/queries";
import { Event } from "@/types";
import { RiCalendarEventLine, RiMapPinLine, RiTimeLine, RiAlertLine, RiCameraLine } from "react-icons/ri";

type Props = {
  params: Promise<{ locale: string; slug: string }>;
};

export const dynamicParams = true;

export async function generateStaticParams() {
  return [];
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale, slug } = await params;
  const event = await cachedFetch<Event | null>(
    eventBySlugQuery,
    { slug, locale },
    { next: { tags: [`event:${slug}`, "event"] } }
  );

  if (!event) {
    return {};
  }

  const pageSeo = event.seo ? {
    metaTitle: event.seo.metaTitle,
    metaDescription: event.seo.metaDescription,
    ogImage: event.seo.shareGraphic,
  } : undefined;

  return buildMetadata({
    title: event.title,
    canonicalPath: `${getPublicPath("etkinlikler", locale as Locale)}/${slug}`,
    locale,
    pageSeo,
  });
}

export default async function EventDetailPage({ params }: Props) {
  const { locale, slug } = await params;
  const isEn = locale === "en";

  const event = await cachedFetch<Event | null>(
    eventBySlugQuery,
    { slug, locale },
    { next: { tags: [`event:${slug}`, "event"] } }
  );

  if (!event) {
    notFound();
  }

  const parentPath = getPublicPath("etkinlikler", locale as Locale);
  const parentLabel = isEn ? "Events" : "Etkinlikler";

  const breadcrumbs = [
    { label: parentLabel, href: parentPath },
    { label: event.title, href: `${parentPath}/${slug}`, active: true },
  ];

  const isExpired = new Date(event.endsAt) < new Date();

  // Date range formatting
  const formatDate = (dateStr: string) => {
    const options: Intl.DateTimeFormatOptions = { day: "numeric", month: "long", year: "numeric" };
    return new Date(dateStr).toLocaleDateString(isEn ? "en-US" : "tr-TR", options);
  };

  const eventDuration = formatDate(event.startsAt) === formatDate(event.endsAt)
    ? formatDate(event.startsAt)
    : `${formatDate(event.startsAt)} - ${formatDate(event.endsAt)}`;

  return (
    <div className="flex flex-col pb-16 bg-white min-h-screen">
      <PageHero
        title={event.title}
        subtitle={eventDuration}
        backgroundImage={event.image}
        breadcrumbs={breadcrumbs}
      />

      <div className="container mx-auto px-4 mt-12 md:mt-16">
        {/* Expired warning */}
        {isExpired && (
          <div className="mb-10 p-4 border border-neutral-200 bg-neutral-50 flex items-center gap-3 text-neutral-600 rounded-none max-w-4xl">
            <RiAlertLine className="shrink-0 text-neutral-500" size={20} />
            <span className="text-xs md:text-sm font-sans font-medium tracking-wide">
              {isEn
                ? "This event has already taken place. Browse our upcoming events for current activities."
                : "Bu etkinlik geçmiş bir tarihtedir. Güncel aktiviteler için lütfen aktif etkinliklerimizi inceleyin."}
            </span>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 md:gap-12 items-start">
          {/* Left Column: Event details & Gallery (2/3 width) */}
          <div className="lg:col-span-2 flex flex-col gap-10">
            {/* Main Poster Image displayed inside layout for visual emphasis */}
            {event.image && (
              <div className="relative aspect-[16/9] w-full border border-neutral-100 overflow-hidden">
                <SanityImage
                  image={event.image}
                  fill
                  sizes="(max-width: 1024px) 100vw, 60vw"
                  className="object-cover"
                  priority
                />
              </div>
            )}

            {/* Event Description */}
            <div className="prose max-w-none">
              <h2 className="text-xl md:text-2xl font-serif tracking-wide text-neutral-900 border-b pb-3 mb-6">
                {isEn ? "About the Event" : "Etkinlik Hakkında"}
              </h2>
              <RichText value={event.body} />
            </div>

            {/* Photo Gallery (Lightbox) */}
            {event.gallery && event.gallery.length > 0 && (
              <div className="border-t border-neutral-200 pt-8 mt-4">
                <h3 className="text-xs md:text-sm font-sans font-bold tracking-widest text-neutral-400 uppercase mb-6 flex items-center gap-2">
                  <RiCameraLine size={16} />
                  {isEn ? "Event Gallery" : "Etkinlik Fotoğrafları"}
                </h3>
                <EventGallery images={event.gallery} />
              </div>
            )}
          </div>

          {/* Right Column: Info details (1/3 width) */}
          <div className="lg:col-span-1 lg:sticky lg:top-24">
            <div className="border border-neutral-200 bg-white p-6 md:p-8 flex flex-col gap-6">
              <h3 className="text-xs md:text-sm font-sans font-bold tracking-widest text-neutral-400 uppercase border-b border-neutral-100 pb-3">
                {isEn ? "Event Information" : "Etkinlik Bilgileri"}
              </h3>

              <div className="flex flex-col gap-5">
                {/* Date */}
                <div className="flex items-start gap-3">
                  <RiCalendarEventLine className="text-neutral-400 mt-1 shrink-0" size={16} />
                  <div className="flex flex-col gap-0.5">
                    <span className="text-xs md:text-sm font-sans font-bold tracking-wider text-neutral-400 uppercase">
                      {isEn ? "Date" : "Tarih"}
                    </span>
                    <span className="text-sm md:text-base font-sans font-semibold text-neutral-800">
                      {eventDuration}
                    </span>
                  </div>
                </div>

                {/* Time */}
                {event.time && (
                  <div className="flex items-start gap-3">
                    <RiTimeLine className="text-neutral-400 mt-1 shrink-0" size={16} />
                    <div className="flex flex-col gap-0.5">
                      <span className="text-xs md:text-sm font-sans font-bold tracking-wider text-neutral-400 uppercase">
                        {isEn ? "Time" : "Saat"}
                      </span>
                      <span className="text-sm md:text-base font-sans font-semibold text-neutral-800">
                        {event.time}
                      </span>
                    </div>
                  </div>
                )}

                {/* Location */}
                {event.location && (
                  <div className="flex items-start gap-3">
                    <RiMapPinLine className="text-neutral-400 mt-1 shrink-0" size={16} />
                    <div className="flex flex-col gap-0.5">
                      <span className="text-xs md:text-sm font-sans font-bold tracking-wider text-neutral-400 uppercase">
                        {isEn ? "Location" : "Etkinlik Yeri"}
                      </span>
                      <span className="text-sm md:text-base font-sans font-semibold text-neutral-800">
                        {event.location}
                      </span>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
