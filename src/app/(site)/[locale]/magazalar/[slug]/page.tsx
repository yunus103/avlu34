import { Metadata } from "next";
import { notFound } from "next/navigation";
import dynamic from "next/dynamic";
import Link from "next/link";
import { PageHero } from "@/components/layout/PageHero";
import { SanityImage } from "@/components/ui/SanityImage";
import { buildMetadata } from "@/lib/seo";
import { getPublicPath } from "@/lib/i18n/routes";
import { Locale } from "@/lib/i18n/config";
import { cachedFetch } from "@/sanity/lib/client";
import { 
  storeBySlugQuery, 
  storeCategoryBySlugQuery, 
  storesPageQuery, 
  storeCategoriesQuery, 
  storeListQuery,
  activeCampaignsByStoreQuery
} from "@/sanity/lib/queries";
import { Store, StoreCategory, Campaign } from "@/types";
import { DirectoryTemplate } from "@/components/layout/DirectoryTemplate";
import { LightboxGallery } from "@/components/ui/Lightbox";
import { 
  RiTimeLine, 
  RiPhoneLine, 
  RiGlobalLine, 
  RiMapPinLine, 
  RiInstagramLine, 
  RiFacebookLine, 
  RiLinkedinBoxLine,
  RiYoutubeLine,
  RiTiktokLine,
  RiPinterestLine,
  RiWhatsappLine,
  RiTwitterXLine,
  RiArrowRightUpLine 
} from "react-icons/ri";

type Props = {
  params: Promise<{ locale: string; slug: string }>;
};

const floorLabels: Record<string, { tr: string; en: string }> = {
  otopark: { tr: "Kapalı Otopark Katı", en: "Closed Parking Floor" },
  zemin: { tr: "Zemin Kat", en: "Ground Floor" },
  kat1: { tr: "1. Kat", en: "1st Floor" },
  kat2: { tr: "2. Kat", en: "2nd Floor" },
  kat3: { tr: "3. Kat", en: "3rd Floor" },
};

const socialIconMap: Record<string, React.ElementType> = {
  instagram: RiInstagramLine,
  facebook: RiFacebookLine,
  twitter: RiTwitterXLine,
  linkedin: RiLinkedinBoxLine,
  youtube: RiYoutubeLine,
  pinterest: RiPinterestLine,
  whatsapp: RiWhatsappLine,
  tiktok: RiTiktokLine,
};

export const dynamicParams = true;

export async function generateStaticParams() {
  return [];
}

// Fetch store or category dynamically with React cache deduplication
async function getStoreOrCategory(slug: string, locale: string) {
  // Try to find as a store first
  const store = await cachedFetch<Store | null>(
    storeBySlugQuery,
    { slug, locale },
    { next: { tags: [`store:${slug}`, "store"] } }
  );

  if (store) {
    return { type: "store" as const, data: store };
  }

  // If not a store, try to find as a store category
  const category = await cachedFetch<StoreCategory | null>(
    storeCategoryBySlugQuery,
    { slug, locale },
    { next: { tags: [`storeCategory:${slug}`, "storeCategory"] } }
  );

  if (category) {
    return { type: "category" as const, data: category };
  }

  return null;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale, slug } = await params;
  const result = await getStoreOrCategory(slug, locale);

  if (!result) {
    return {};
  }

  const title = result.data.title;
  const pageSeo = result.type === "store" && result.data.seo ? {
    metaTitle: result.data.seo.metaTitle,
    metaDescription: result.data.seo.metaDescription,
    ogImage: result.data.seo.shareGraphic,
  } : undefined;

  return buildMetadata({
    title,
    canonicalPath: `${getPublicPath("magazalar", locale as Locale)}/${slug}`,
    locale,
    pageSeo
  });
}

export default async function StoreDetailPage({ params }: Props) {
  const { locale, slug } = await params;
  const isEn = locale === "en";

  const result = await getStoreOrCategory(slug, locale);

  if (!result) {
    notFound();
  }

  const parentPath = getPublicPath("magazalar", locale as Locale);
  const parentLabel = isEn ? "Stores" : "Mağazalar";

  const breadcrumbs = [
    { label: parentLabel, href: parentPath },
    { label: result.data.title, href: `${parentPath}/${slug}`, active: true }
  ];

  if (result.type === "category") {
    // Run parallel fetches for category listing
    const [pageData, categories, items] = await Promise.all([
      cachedFetch<any>(
        storesPageQuery, 
        { locale }, 
        { next: { tags: ["storesPage"] } }
      ),
      cachedFetch<StoreCategory[]>(
        storeCategoriesQuery, 
        { locale }, 
        { next: { tags: ["storeCategory"] } }
      ),
      cachedFetch<Store[]>(
        storeListQuery, 
        { locale }, 
        { next: { tags: ["store"] } }
      ),
    ]);

    const title = result.data.title;
    const subtitle = isEn 
      ? `Discover our ${result.data.title.toLowerCase()} brands` 
      : `AVLU34 bünyesindeki ${result.data.title.toLowerCase()} markaları`;
    const backgroundImage = pageData?.heroImage;

    return (
      <DirectoryTemplate
        title={title}
        subtitle={subtitle}
        backgroundImage={backgroundImage}
        categories={categories}
        items={items}
        type="store"
        activeCategorySlug={slug}
        locale={locale as Locale}
      />
    );
  }

  // If result.type is "store"
  const store = result.data as Store;

  // Parallel fetch active campaigns referencing this store
  const campaigns = await cachedFetch<Campaign[]>(
    activeCampaignsByStoreQuery,
    { storeId: store._id, locale },
    { next: { tags: ["campaign", `store:${slug}`] } }
  );

  const categoryName = store.storeCategory?.title;
  const floorText = store.floor && floorLabels[store.floor]
    ? (isEn ? floorLabels[store.floor].en : floorLabels[store.floor].tr)
    : store.floor;
  const heroSubtitle = [categoryName, floorText].filter(Boolean).join(" • ");

  return (
    <div className="flex flex-col pb-16 bg-white min-h-screen">
      <PageHero 
        title={store.title} 
        subtitle={heroSubtitle} 
        backgroundImage={store.heroImage}
        breadcrumbs={breadcrumbs}
      />

      <div className="container mx-auto px-4 mt-12 md:mt-16">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 md:gap-12 items-start">
          
          {/* Left Column: Description, Gallery & Campaigns (2/3 width) */}
          <div className="lg:col-span-2 flex flex-col gap-12">
            
            {/* Description */}
            <div className="flex flex-col gap-4">
              <h2 className="text-xl md:text-2xl font-serif tracking-wide text-neutral-900 border-b pb-3">
                {isEn ? "About the Brand" : "Marka Hakkında"}
              </h2>
              <p className="text-sm md:text-base leading-relaxed text-neutral-700 font-sans whitespace-pre-line select-text">
                {store.description}
              </p>
            </div>

            {/* Gallery (using LightboxGallery if images exist) */}
            {store.gallery && store.gallery.length > 0 && (
              <div className="flex flex-col gap-6">
                <h2 className="text-xl md:text-2xl font-serif tracking-wide text-neutral-900 border-b pb-3">
                  {isEn ? "Gallery" : "Galeri"}
                </h2>
                <LightboxGallery images={store.gallery} />
              </div>
            )}

            {/* Campaigns Section */}
            {campaigns && campaigns.length > 0 && (
              <div className="flex flex-col gap-6">
                <h2 className="text-xl md:text-2xl font-serif tracking-wide text-neutral-900 border-b pb-3">
                  {isEn ? "Active Campaigns" : "Aktif Kampanyalar"}
                </h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  {campaigns.map((camp) => {
                    const campUrl = getPublicPath(`/kampanyalar/${camp.slug.current}`, locale as Locale);
                    return (
                      <Link 
                        key={camp._id}
                        href={campUrl}
                        className="group border border-neutral-200 bg-white hover:border-black transition-all duration-300 flex flex-col overflow-hidden"
                      >
                        <div className="aspect-[16/9] relative overflow-hidden bg-neutral-100 w-full">
                          {camp.image && (
                            <SanityImage 
                              image={camp.image} 
                              fill 
                              sizes="(max-width: 768px) 100vw, 50vw"
                              className="object-cover transition-transform duration-700 group-hover:scale-105"
                            />
                          )}
                        </div>
                        <div className="p-4 flex flex-col gap-1 flex-1">
                          <h3 className="text-xs font-sans font-bold uppercase tracking-wider text-neutral-900 group-hover:text-neutral-600 transition-colors">
                            {camp.title}
                          </h3>
                          <div className="flex items-center gap-1 mt-auto pt-2 text-[10px] text-neutral-400 font-sans tracking-wide">
                            <span>{isEn ? "View Details" : "Detayları Gör"}</span>
                            <RiArrowRightUpLine size={12} className="transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                          </div>
                        </div>
                      </Link>
                    );
                  })}
                </div>
              </div>
            )}

          </div>

          {/* Right Column: Info Card (1/3 width) */}
          <div className="lg:col-span-1">
            <div className="border border-neutral-200 bg-white p-6 md:p-8 flex flex-col gap-6 select-text">
              
              {/* Brand Logo in the Info Area */}
              {store.logo && (
                <div className="flex justify-center border-b border-neutral-100 pb-6 select-none">
                  <div className="relative w-40 h-20">
                    <SanityImage 
                      image={store.logo} 
                      fill 
                      fit="max"
                      className="object-contain"
                    />
                  </div>
                </div>
              )}

              {/* Info Rows */}
              <div className="flex flex-col gap-4">
                {/* Floor Info */}
                <div className="flex items-start gap-3">
                  <RiMapPinLine className="text-neutral-400 mt-1 shrink-0" size={16} />
                  <div className="flex flex-col gap-0.5">
                    <span className="text-xs font-sans font-bold tracking-wider text-neutral-400 uppercase">
                      {isEn ? "Location" : "Bulunduğu Kat"}
                    </span>
                    <span className="text-base font-sans font-semibold text-neutral-800">
                      {floorText}
                    </span>
                  </div>
                </div>

                {/* Working Hours */}
                <div className="flex items-start gap-3">
                  <RiTimeLine className="text-neutral-400 mt-1 shrink-0" size={16} />
                  <div className="flex flex-col gap-0.5">
                    <span className="text-xs font-sans font-bold tracking-wider text-neutral-400 uppercase">
                      {isEn ? "Opening Hours" : "Çalışma Saatleri"}
                    </span>
                    <span className="text-base font-sans font-semibold text-neutral-800">
                      {store.workingHours}
                    </span>
                  </div>
                </div>

                {/* Phone */}
                {store.phone && (
                  <div className="flex items-start gap-3">
                    <RiPhoneLine className="text-neutral-400 mt-1 shrink-0" size={16} />
                    <div className="flex flex-col gap-0.5">
                      <span className="text-xs font-sans font-bold tracking-wider text-neutral-400 uppercase">
                        {isEn ? "Phone" : "Telefon"}
                      </span>
                      <a 
                        href={`tel:${store.phone}`} 
                        className="text-base font-sans font-semibold text-neutral-800 hover:text-black hover:underline transition-colors"
                      >
                        {store.phone}
                      </a>
                    </div>
                  </div>
                )}

                {/* Website */}
                {store.website && (
                  <div className="flex items-start gap-3">
                    <RiGlobalLine className="text-neutral-400 mt-1 shrink-0" size={16} />
                    <div className="flex flex-col gap-0.5">
                      <span className="text-xs font-sans font-bold tracking-wider text-neutral-400 uppercase">
                        {isEn ? "Website" : "Web Sitesi"}
                      </span>
                      <a 
                        href={store.website} 
                        target="_blank" 
                        rel="noopener noreferrer" 
                        className="text-base font-sans font-semibold text-neutral-800 hover:text-black hover:underline transition-colors break-all flex items-center gap-1.5"
                      >
                        {store.website.replace(/^https?:\/\/(www\.)?/, "")}
                        <RiArrowRightUpLine size={16} className="shrink-0" />
                      </a>
                    </div>
                  </div>
                )}
              </div>

              {/* Social Media Links */}
              {store.socialLinks && store.socialLinks.length > 0 && (
                <div className="flex flex-col gap-2 pt-4 border-t border-neutral-100 select-none">
                  <span className="text-xs font-sans font-bold tracking-wider text-neutral-400 uppercase">
                    {isEn ? "Follow Us" : "Bizi Takip Edin"}
                  </span>
                  <div className="flex flex-wrap items-center gap-4">
                    {store.socialLinks.map((social, idx) => {
                      const Icon = socialIconMap[social.platform.toLowerCase()];
                      if (!Icon) return null;
                      return (
                        <a 
                          key={idx}
                          href={social.url}
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="text-neutral-500 hover:text-black transition-colors"
                          aria-label={social.platform}
                        >
                          <Icon size={36} />
                        </a>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* Map Routing Button */}
              <div className="pt-4 border-t border-neutral-100 select-none">
                <Link 
                  href={getPublicPath("/kat-plani", locale as Locale)}
                  className="block w-full text-center bg-black border border-black py-3 text-xs font-sans font-semibold tracking-widest uppercase text-white hover:bg-neutral-900 transition-colors duration-300"
                >
                  {isEn ? "View on Map" : "Kat Planında Gör"}
                </Link>
              </div>

            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
