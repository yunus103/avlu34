import { Metadata } from "next";
import { client } from "@/sanity/lib/client";
import { globalSearchQuery } from "@/sanity/lib/queries";
import { buildMetadata } from "@/lib/seo";
import { PageHero } from "@/components/layout/PageHero";
import { getPublicPath } from "@/lib/i18n/routes";
import { Locale } from "@/lib/i18n/config";
import { SanityImage } from "@/components/ui/SanityImage";
import Link from "next/link";

type Props = {
  params: Promise<{ locale: string }>;
  searchParams: Promise<{ q?: string }>;
};

export async function generateMetadata({ params, searchParams }: Props): Promise<Metadata> {
  const { locale } = await params;
  const { q } = await searchParams;
  const query = q || "";
  const isEn = locale === "en";

  return buildMetadata({
    title: isEn ? `Search results for "${query}"` : `"${query}" için arama sonuçları`,
    canonicalPath: `${getPublicPath("arama", locale as Locale)}?q=${encodeURIComponent(query)}`,
    locale,
  });
}

export default async function SearchResultsPage({ params, searchParams }: Props) {
  const { locale } = await params;
  const { q } = await searchParams;
  const queryTerm = (q || "").trim();
  const isEn = locale === "en";

  let results: any = {
    stores: [],
    dining: [],
    campaigns: [],
    events: [],
    pages: {},
  };

  if (queryTerm) {
    // Format query term for GROQ match operator
    const searchQuery = `*${queryTerm}*`;
    try {
      results = await client.fetch(
        globalSearchQuery,
        { searchQuery, locale },
        { next: { revalidate: 60 } }
      );
    } catch (err) {
      console.error("Search page fetch error:", err);
    }
  }

  const hasStores = results.stores && results.stores.length > 0;
  const hasDining = results.dining && results.dining.length > 0;
  const hasCampaigns = results.campaigns && results.campaigns.length > 0;
  const hasEvents = results.events && results.events.length > 0;
  const hasStoreCategories = results.storeCategories && results.storeCategories.length > 0;
  const hasFoodCategories = results.foodCategories && results.foodCategories.length > 0;

  // Check if there are any static info pages matched
  const matchedPages = results.pages
    ? Object.entries(results.pages).filter(([_, page]: [string, any]) => page !== null)
    : [];
  const hasPages = matchedPages.length > 0;

  const totalResults =
    (results.stores?.length || 0) +
    (results.dining?.length || 0) +
    (results.campaigns?.length || 0) +
    (results.events?.length || 0) +
    (results.storeCategories?.length || 0) +
    (results.foodCategories?.length || 0) +
    matchedPages.length;

  const title = isEn ? "SEARCH RESULTS" : "ARAMA SONUÇLARI";
  const subtitle = queryTerm 
    ? (isEn ? `FOUND ${totalResults} MATCHES FOR "${queryTerm.toUpperCase()}"` : `"${queryTerm.toUpperCase()}" İÇİN ${totalResults} SONUÇ BULUNDU`)
    : (isEn ? "TYPE A KEYWORD TO SEARCH" : "ARAMAK İÇİN BİR KELİME YAZIN");

  return (
    <div className="flex flex-col gap-12 pb-24 bg-white min-h-screen">
      <PageHero title={title} subtitle={subtitle} />

      <div className="container mx-auto px-4 max-w-6xl">
        {!queryTerm ? (
          <div className="text-center py-20 border border-dashed border-neutral-200">
            <p className="text-neutral-500 font-sans tracking-wide text-sm">
              {isEn ? "Please enter a search query in the search bar above." : "Lütfen yukarıdaki arama kutusuna bir kelime yazıp arayın."}
            </p>
          </div>
        ) : totalResults === 0 ? (
          <div className="text-center py-20 border border-dashed border-neutral-200">
            <p className="text-neutral-500 font-sans tracking-wide text-sm mb-4">
              {isEn ? `No results match your search for "${queryTerm}"` : `"${queryTerm}" araması için sonuç bulunamadı.`}
            </p>
            <p className="text-neutral-400 font-sans text-xs">
              {isEn ? "Try checking spelling or using more general terms." : "Lütfen yazım hatası yapıp yapmadığınızı kontrol edin veya daha genel aramalar deneyin."}
            </p>
          </div>
        ) : (
          <div className="flex flex-col gap-16">
            
            {/* ─── Mağazalar (Stores) ─── */}
            {hasStores && (
              <div className="flex flex-col gap-6">
                <h3 className="text-sm font-sans font-bold tracking-widest uppercase text-black border-b pb-2">
                  {isEn ? "STORES" : "MAĞAZALAR"}
                </h3>
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-6">
                  {results.stores.map((item: any) => (
                    <Link
                      key={item._id}
                      href={getPublicPath(`/magazalar/${item.slug}`, locale as Locale)}
                      className="group border border-neutral-200 bg-white p-6 flex flex-col justify-between aspect-[4/3] hover:border-black transition-colors duration-300 rounded-none relative"
                    >
                      <div className="h-16 w-full flex items-center justify-center mb-4">
                        {item.logo ? (
                          <SanityImage
                            image={item.logo}
                            width={160}
                            height={60}
                            fit="max"
                            className="max-h-full w-auto object-contain transition-all duration-300 group-hover:scale-105"
                          />
                        ) : (
                          <span className="font-sans font-bold text-sm tracking-wide text-black uppercase">
                            {item.title}
                          </span>
                        )}
                      </div>
                      <div className="text-center border-t border-neutral-100 pt-3">
                        <h4 className="text-xs font-sans font-bold tracking-wide uppercase text-black group-hover:text-neutral-600 transition-colors">
                          {item.title}
                        </h4>
                        <div className="flex items-center justify-center gap-1.5 text-[9px] font-sans font-semibold tracking-wider text-neutral-400 uppercase mt-1">
                          <span>{item.storeCategory?.title || (isEn ? "Store" : "Mağaza")}</span>
                          {item.floor && (
                            <>
                              <span>•</span>
                              <span>{isEn ? `Floor ${item.floor}` : `Kat ${item.floor}`}</span>
                            </>
                          )}
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            )}

            {/* ─── Yeme-İçme (Dining) ─── */}
            {hasDining && (
              <div className="flex flex-col gap-6">
                <h3 className="text-sm font-sans font-bold tracking-widest uppercase text-black border-b pb-2">
                  {isEn ? "DINING" : "YEME-İÇME"}
                </h3>
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-6">
                  {results.dining.map((item: any) => (
                    <Link
                      key={item._id}
                      href={getPublicPath(`/yeme-icme/${item.slug}`, locale as Locale)}
                      className="group border border-neutral-200 bg-white p-6 flex flex-col justify-between aspect-[4/3] hover:border-black transition-colors duration-300 rounded-none relative"
                    >
                      <div className="h-16 w-full flex items-center justify-center mb-4">
                        {item.logo ? (
                          <SanityImage
                            image={item.logo}
                            width={160}
                            height={60}
                            fit="max"
                            className="max-h-full w-auto object-contain transition-all duration-300 group-hover:scale-105"
                          />
                        ) : (
                          <span className="font-sans font-bold text-sm tracking-wide text-black uppercase">
                            {item.title}
                          </span>
                        )}
                      </div>
                      <div className="text-center border-t border-neutral-100 pt-3">
                        <h4 className="text-xs font-sans font-bold tracking-wide uppercase text-black group-hover:text-neutral-600 transition-colors">
                          {item.title}
                        </h4>
                        <div className="flex items-center justify-center gap-1.5 text-[9px] font-sans font-semibold tracking-wider text-neutral-400 uppercase mt-1">
                          <span>{item.foodCategory?.title || (isEn ? "Dining" : "Yeme-İçme")}</span>
                          {item.floor && (
                            <>
                              <span>•</span>
                              <span>{isEn ? `Floor ${item.floor}` : `Kat ${item.floor}`}</span>
                            </>
                          )}
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            )}

            {/* ─── Kampanyalar & Etkinlikler (Offers & Events) ─── */}
            {(hasCampaigns || hasEvents) && (
              <div className="flex flex-col gap-6">
                <h3 className="text-sm font-sans font-bold tracking-widest uppercase text-black border-b pb-2">
                  {isEn ? "OFFERS & EVENTS" : "KAMPANYALAR & ETKİNLİKLER"}
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  {/* Campaigns */}
                  {results.campaigns.map((item: any) => (
                    <Link
                      key={item._id}
                      href={getPublicPath(`/kampanyalar/${item.slug}`, locale as Locale)}
                      className="group flex flex-col sm:flex-row border border-neutral-200 hover:border-black transition-colors duration-300 rounded-none bg-white overflow-hidden"
                    >
                      <div className="relative aspect-[16/9] sm:aspect-[4/3] sm:w-48 bg-neutral-50 overflow-hidden shrink-0">
                        {item.image && (
                          <SanityImage
                            image={item.image}
                            fill
                            sizes="(max-width: 768px) 100vw, 12rem"
                            className="object-cover transition-all duration-500 group-hover:scale-105"
                          />
                        )}
                      </div>
                      <div className="p-6 flex flex-col justify-between flex-grow">
                        <div className="flex flex-col gap-2">
                          <span className="text-[9px] font-sans font-bold tracking-widest uppercase text-neutral-400">
                            {isEn ? "CAMPAIGN" : "KAMPANYA"}
                          </span>
                          <h4 className="text-sm font-serif font-bold tracking-wide uppercase text-black group-hover:text-neutral-600 transition-colors">
                            {item.title}
                          </h4>
                          {item.description && (
                            <p className="text-[11px] font-sans text-neutral-500 line-clamp-2 leading-relaxed">
                              {typeof item.description === "string" ? item.description : ""}
                            </p>
                          )}
                        </div>
                        <div className="text-[10px] font-sans font-semibold tracking-wider text-neutral-400 mt-4 border-t border-neutral-100 pt-2.5">
                          {item.startsAt && item.endsAt ? (
                            <span>
                              {new Date(item.startsAt).toLocaleDateString(locale) === new Date(item.endsAt).toLocaleDateString(locale)
                                ? new Date(item.startsAt).toLocaleDateString(locale)
                                : `${new Date(item.startsAt).toLocaleDateString(locale)} - ${new Date(item.endsAt).toLocaleDateString(locale)}`}
                            </span>
                          ) : (
                            <span>{isEn ? "Active Offer" : "Aktif Kampanya"}</span>
                          )}
                        </div>
                      </div>
                    </Link>
                  ))}

                  {/* Events */}
                  {results.events.map((item: any) => (
                    <Link
                      key={item._id}
                      href={getPublicPath(`/etkinlikler/${item.slug}`, locale as Locale)}
                      className="group flex flex-col sm:flex-row border border-neutral-200 hover:border-black transition-colors duration-300 rounded-none bg-white overflow-hidden"
                    >
                      <div className="relative aspect-[16/9] sm:aspect-[4/3] sm:w-48 bg-neutral-50 overflow-hidden shrink-0">
                        {item.image && (
                          <SanityImage
                            image={item.image}
                            fill
                            sizes="(max-width: 768px) 100vw, 12rem"
                            className="object-cover transition-all duration-500 group-hover:scale-105"
                          />
                        )}
                      </div>
                      <div className="p-6 flex flex-col justify-between flex-grow">
                        <div className="flex flex-col gap-2">
                          <span className="text-[9px] font-sans font-bold tracking-widest uppercase text-neutral-400">
                            {isEn ? "EVENT" : "ETKİNLİK"}
                          </span>
                          <h4 className="text-sm font-serif font-bold tracking-wide uppercase text-black group-hover:text-neutral-600 transition-colors">
                            {item.title}
                          </h4>
                          {item.description && (
                            <p className="text-[11px] font-sans text-neutral-500 line-clamp-2 leading-relaxed">
                              {typeof item.description === "string" ? item.description : ""}
                            </p>
                          )}
                        </div>
                        <div className="text-[10px] font-sans font-semibold tracking-wider text-neutral-400 mt-4 border-t border-neutral-100 pt-2.5 flex justify-between items-center">
                          {item.startsAt && item.endsAt ? (
                            <span>
                              {new Date(item.startsAt).toLocaleDateString(locale) === new Date(item.endsAt).toLocaleDateString(locale)
                                ? new Date(item.startsAt).toLocaleDateString(locale)
                                : `${new Date(item.startsAt).toLocaleDateString(locale)} - ${new Date(item.endsAt).toLocaleDateString(locale)}`}
                            </span>
                          ) : (
                            <span>{isEn ? "Upcoming Event" : "Yaklaşan Etkinlik"}</span>
                          )}
                          {item.location && (
                            <span className="text-black/60 font-semibold">{item.location}</span>
                          )}
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            )}

            {/* ─── Kategoriler (Categories) ─── */}
            {(hasStoreCategories || hasFoodCategories) && (
              <div className="flex flex-col gap-6">
                <h3 className="text-sm font-sans font-bold tracking-widest uppercase text-black border-b pb-2">
                  {isEn ? "CATEGORIES" : "KATEGORİLER"}
                </h3>
                <div className="flex flex-wrap gap-4">
                  {results.storeCategories?.map((item: any) => (
                    <Link
                      key={item._id}
                      href={getPublicPath(`/magazalar/${item.slug}`, locale as Locale)}
                      className="border border-neutral-200 px-5 py-3 text-xs font-sans font-bold tracking-widest uppercase text-black hover:border-black transition-colors rounded-none bg-white"
                    >
                      {item.title} <span className="text-[10px] text-neutral-400 font-semibold ml-2">({isEn ? "Store Category" : "Mağaza Kategorisi"})</span>
                    </Link>
                  ))}
                  {results.foodCategories?.map((item: any) => (
                    <Link
                      key={item._id}
                      href={getPublicPath(`/yeme-icme/${item.slug}`, locale as Locale)}
                      className="border border-neutral-200 px-5 py-3 text-xs font-sans font-bold tracking-widest uppercase text-black hover:border-black transition-colors rounded-none bg-white"
                    >
                      {item.title} <span className="text-[10px] text-neutral-400 font-semibold ml-2">({isEn ? "Dining Category" : "Yeme-İçme Kategorisi"})</span>
                    </Link>
                  ))}
                </div>
              </div>
            )}

            {/* ─── Bilgi Sayfaları (Pages) ─── */}
            {hasPages && (
              <div className="flex flex-col gap-6">
                <h3 className="text-sm font-sans font-bold tracking-widest uppercase text-black border-b pb-2">
                  {isEn ? "INFORMATION & PAGES" : "KURUMSAL & YARDIMCI SAYFALAR"}
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
                  {matchedPages.map(([key, page]: [string, any]) => {
                    const pagePathMap: Record<string, string> = {
                      about: "/hakkimizda",
                      visitPlan: "/ziyaret-plani",
                      mallMap: "/kat-plani",
                    };
                    const path = pagePathMap[key] || "/";
                    return (
                      <Link
                        key={key}
                        href={getPublicPath(path, locale as Locale)}
                        className="group border border-neutral-200 bg-neutral-50/50 p-6 flex flex-col justify-between hover:border-black hover:bg-white transition-all duration-300 rounded-none h-48"
                      >
                        <div className="flex flex-col gap-2">
                          <span className="text-[9px] font-sans font-bold tracking-widest uppercase text-neutral-400">
                            {isEn ? "INFORMATION" : "BİLGİ"}
                          </span>
                          <h4 className="text-sm font-sans font-bold tracking-wide uppercase text-black group-hover:text-neutral-600 transition-colors">
                            {page.title}
                          </h4>
                          {page.description && (
                            <p className="text-[11px] font-sans text-neutral-400 line-clamp-3 leading-relaxed mt-1">
                              {typeof page.description === "string" ? page.description : ""}
                            </p>
                          )}
                        </div>
                        <div className="text-[10px] font-sans font-bold tracking-widest uppercase text-black border-b border-black w-fit mt-4">
                          {isEn ? "GO TO PAGE" : "SAYFAYA GİT"}
                        </div>
                      </Link>
                    );
                  })}
                </div>
              </div>
            )}

          </div>
        )}
      </div>
    </div>
  );
}
