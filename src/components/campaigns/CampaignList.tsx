"use client";

import React, { useState, useMemo } from "react";
import Link from "next/link";
import { SanityImage } from "@/components/ui/SanityImage";
import { getPublicPath } from "@/lib/i18n/routes";
import { Locale } from "@/lib/i18n/config";
import { Campaign } from "@/types";
import { RiSearchLine, RiArrowDownSLine } from "react-icons/ri";

interface CampaignListProps {
  activeCampaigns: Campaign[];
  pastCampaigns: Campaign[];
  locale: Locale;
}

export function CampaignList({ activeCampaigns, pastCampaigns, locale }: CampaignListProps) {
  const isEn = locale === "en";

  // State
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [sortBy, setSortBy] = useState("newest");
  const [activeLimit, setActiveLimit] = useState(9);
  const [pastLimit, setPastLimit] = useState(9);

  // Dynamic category extraction from related stores
  const categories = useMemo(() => {
    const allCamps = [...activeCampaigns, ...pastCampaigns];
    const catsMap = new Map<string, { id: string; title: string; slug: string }>();

    allCamps.forEach((camp) => {
      camp.relatedStores?.forEach((store) => {
        const cat = store.storeCategory;
        if (cat && cat.slug?.current) {
          catsMap.set(cat.slug.current, {
            id: cat._id,
            title: cat.title,
            slug: cat.slug.current,
          });
        }
      });
    });

    return Array.from(catsMap.values()).sort((a, b) =>
      a.title.localeCompare(b.title, isEn ? "en" : "tr")
    );
  }, [activeCampaigns, pastCampaigns, isEn]);

  // Dynamic search, filter, and sort logic
  const filterAndSort = (camps: Campaign[]) => {
    let result = [...camps];

    // 1. Filter by category
    if (selectedCategory) {
      result = result.filter((camp) =>
        camp.relatedStores?.some(
          (store) => store.storeCategory?.slug?.current === selectedCategory
        )
      );
    }

    // 2. Filter by search query
    if (searchQuery.trim() !== "") {
      const q = searchQuery.toLowerCase();
      result = result.filter((camp) => {
        const matchTitle = camp.title.toLowerCase().includes(q);
        const matchDesc = camp.shortDescription?.toLowerCase().includes(q) || false;
        const matchStore =
          camp.relatedStores?.some((store) => store.title.toLowerCase().includes(q)) || false;
        return matchTitle || matchDesc || matchStore;
      });
    }

    // 3. Sort
    result.sort((a, b) => {
      if (sortBy === "newest") {
        return new Date(b.startsAt).getTime() - new Date(a.startsAt).getTime();
      }
      if (sortBy === "ending-soon") {
        return new Date(a.endsAt).getTime() - new Date(b.endsAt).getTime();
      }
      if (sortBy === "a-z") {
        const aName = a.relatedStores?.[0]?.title || a.title;
        const bName = b.relatedStores?.[0]?.title || b.title;
        return aName.localeCompare(bName, isEn ? "en" : "tr", { sensitivity: "base" });
      }
      if (sortBy === "z-a") {
        const aName = a.relatedStores?.[0]?.title || a.title;
        const bName = b.relatedStores?.[0]?.title || b.title;
        return bName.localeCompare(aName, isEn ? "en" : "tr", { sensitivity: "base" });
      }
      return 0;
    });

    return result;
  };

  const filteredActive = useMemo(() => filterAndSort(activeCampaigns), [activeCampaigns, selectedCategory, searchQuery, sortBy]);
  const filteredPast = useMemo(() => filterAndSort(pastCampaigns), [pastCampaigns, selectedCategory, searchQuery, sortBy]);

  const visibleActive = useMemo(() => filteredActive.slice(0, activeLimit), [filteredActive, activeLimit]);
  const visiblePast = useMemo(() => filteredPast.slice(0, pastLimit), [filteredPast, pastLimit]);

  const hasMoreActive = filteredActive.length > activeLimit;
  const hasMorePast = filteredPast.length > pastLimit;

  // Format date range helper
  const formatDateRange = (startStr: string, endStr: string) => {
    const options: Intl.DateTimeFormatOptions = { day: "numeric", month: "short", year: "numeric" };
    const start = new Date(startStr).toLocaleDateString(isEn ? "en-US" : "tr-TR", options);
    const end = new Date(endStr).toLocaleDateString(isEn ? "en-US" : "tr-TR", options);
    return `${start} - ${end}`;
  };

  return (
    <div className="container mx-auto px-4 py-8 bg-white select-text">
      {/* Filters Bar */}
      <div className="flex flex-col md:flex-row justify-between items-stretch md:items-center gap-4 pb-8 mb-8 border-b border-neutral-100">
        {/* Search */}
        <div className="relative flex-1 max-w-md">
          <input
            type="text"
            placeholder={isEn ? "Search campaigns or brands..." : "Kampanya veya marka ara..."}
            value={searchQuery}
            onChange={(e) => {
              setSearchQuery(e.target.value);
              setActiveLimit(9);
              setPastLimit(9);
            }}
            className="w-full h-10 pl-10 pr-4 border border-neutral-200 rounded-none bg-neutral-50 text-xs font-sans tracking-wide text-neutral-800 placeholder-neutral-400 focus:border-black focus:bg-white focus:outline-none transition-colors duration-300"
          />
          <RiSearchLine size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400 pointer-events-none" />
        </div>

        {/* Filters and Sorting Dropdowns */}
        <div className="flex items-center gap-3">
          {/* Category Filter */}
          <div className="relative w-44">
            <select
              value={selectedCategory}
              onChange={(e) => {
                setSelectedCategory(e.target.value);
                setActiveLimit(9);
                setPastLimit(9);
              }}
              className="w-full h-10 px-4 pr-10 border border-neutral-200 rounded-none bg-white text-xs font-sans font-semibold tracking-wider uppercase appearance-none focus:border-black focus:outline-none cursor-pointer"
            >
              <option value="">{isEn ? "All Categories" : "Tüm Kategoriler"}</option>
              {categories.map((cat) => (
                <option key={cat.slug} value={cat.slug}>
                  {cat.title}
                </option>
              ))}
            </select>
            <RiArrowDownSLine size={16} className="absolute right-3 top-1/2 -translate-y-1/2 text-neutral-400 pointer-events-none" />
          </div>

          {/* Sort Selector */}
          <div className="relative w-44">
            <select
              value={sortBy}
              onChange={(e) => {
                setSortBy(e.target.value);
                setActiveLimit(9);
                setPastLimit(9);
              }}
              className="w-full h-10 px-4 pr-10 border border-neutral-200 rounded-none bg-white text-xs font-sans font-semibold tracking-wider uppercase appearance-none focus:border-black focus:outline-none cursor-pointer"
            >
              <option value="newest">{isEn ? "Newest First" : "En Yeni"}</option>
              <option value="ending-soon">{isEn ? "Ending Soon" : "Süresi Yaklaşanlar"}</option>
              <option value="a-z">{isEn ? "Alphabetical A-Z" : "Alfabetik A-Z"}</option>
              <option value="z-a">{isEn ? "Alphabetical Z-A" : "Alfabetik Z-A"}</option>
            </select>
            <RiArrowDownSLine size={16} className="absolute right-3 top-1/2 -translate-y-1/2 text-neutral-400 pointer-events-none" />
          </div>
        </div>
      </div>

      {/* Active Campaigns Section */}
      <div className="mb-16">
        <div className="border-b border-neutral-200 pb-3 mb-8">
          <h2 className="text-xs font-sans font-bold tracking-[0.2em] uppercase text-black">
            {isEn ? "ALL OFFERS" : "AKTİF KAMPANYALAR"}
          </h2>
        </div>

        {visibleActive.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 lg:gap-12">
            {visibleActive.map((camp) => {
              const campUrl = `${getPublicPath("kampanyalar", locale)}/${camp.slug.current}`;
              const brand = camp.relatedStores?.[0];

              return (
                <Link
                  key={camp._id}
                  href={campUrl}
                  className="group flex flex-col justify-between rounded-none overflow-hidden select-text"
                >
                  <div className="flex flex-col">
                    {/* Cover Image */}
                    <div className="relative aspect-[16/10] overflow-hidden bg-neutral-50 w-full rounded-none">
                      {camp.image && (
                        <SanityImage
                          image={camp.image}
                          fill
                          sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
                          className="object-cover transition-transform duration-500 group-hover:scale-[1.03]"
                        />
                      )}
                    </div>

                    {/* Date */}
                    <span className="text-neutral-500 font-sans text-xs tracking-wider mt-3.5 block">
                      {formatDateRange(camp.startsAt, camp.endsAt)}
                    </span>

                    {/* Brand Name & Logo */}
                    <div className="flex items-center gap-2 mt-2 select-none">
                      {brand?.logo && (
                        <div className="relative w-7 h-5 flex items-center shrink-0">
                          <SanityImage
                            image={brand.logo}
                            fill
                            fit="max"
                            className="object-contain"
                          />
                        </div>
                      )}
                      <span className="text-black font-sans font-bold text-xs tracking-widest uppercase">
                        {brand?.title || "AVLU34"}
                      </span>
                    </div>

                    {/* Title */}
                    <h3 className="font-serif font-medium text-base text-neutral-900 mt-2 line-clamp-1 leading-snug">
                      {camp.title}
                    </h3>

                    {/* Short Description */}
                    {camp.shortDescription && (
                      <p className="font-sans text-neutral-600 text-xs line-clamp-2 mt-1 leading-relaxed">
                        {camp.shortDescription}
                      </p>
                    )}
                  </div>

                  {/* Find Out More Link */}
                  <span className="text-xs uppercase tracking-wider font-semibold text-neutral-800 hover:text-black mt-3 block group-hover:underline underline-offset-4 select-none">
                    {isEn ? "Find out more" : "Detayları Gör"}
                  </span>
                </Link>
              );
            })}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-16 border border-dashed border-neutral-200">
            <p className="text-sm font-sans tracking-wide text-neutral-400">
              {isEn ? "No active campaigns match your criteria." : "Kriterlere uygun aktif kampanya bulunamadı."}
            </p>
          </div>
        )}

        {/* Load More Button */}
        {hasMoreActive && (
          <div className="flex justify-center mt-12 select-none">
            <button
              onClick={() => setActiveLimit((prev) => prev + 9)}
              className="text-xs font-sans font-bold tracking-widest uppercase border border-black text-black bg-white px-8 py-3.5 hover:bg-black hover:text-white transition-colors duration-300 cursor-pointer rounded-none"
            >
              {isEn ? "Load More" : "Daha Fazla Göster"}
            </button>
          </div>
        )}
      </div>

      {/* Past Campaigns Section */}
      {filteredPast.length > 0 && (
        <div className="mt-16 border-t border-neutral-100 pt-16">
          <div className="border-b border-neutral-200 pb-3 mb-8">
            <h2 className="text-xs font-sans font-bold tracking-[0.2em] uppercase text-neutral-400">
              {isEn ? "PAST OFFERS" : "GEÇMİŞ KAMPANYALAR"}
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 lg:gap-12">
            {visiblePast.map((camp) => {
              const campUrl = `${getPublicPath("kampanyalar", locale)}/${camp.slug.current}`;
              const brand = camp.relatedStores?.[0];

              return (
                <Link
                  key={camp._id}
                  href={campUrl}
                  className="group flex flex-col justify-between rounded-none overflow-hidden grayscale opacity-60 hover:grayscale-0 hover:opacity-100 transition-all duration-300 select-text"
                >
                  <div className="flex flex-col">
                    {/* Cover Image */}
                    <div className="relative aspect-[16/10] overflow-hidden bg-neutral-50 w-full rounded-none">
                      {camp.image && (
                        <SanityImage
                          image={camp.image}
                          fill
                          sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
                          className="object-cover"
                        />
                      )}
                      {/* Expired Ribbon/Badge */}
                      <div className="absolute top-3 right-3 bg-black text-white text-[9px] font-sans font-bold uppercase tracking-widest px-2.5 py-1 select-none">
                        {isEn ? "Expired" : "Süresi Doldu"}
                      </div>
                    </div>

                    {/* Date */}
                    <span className="text-neutral-500 font-sans text-xs tracking-wider mt-3.5 block">
                      {formatDateRange(camp.startsAt, camp.endsAt)}
                    </span>

                    {/* Brand Name & Logo */}
                    <div className="flex items-center gap-2 mt-2 select-none">
                      {brand?.logo && (
                        <div className="relative w-7 h-5 flex items-center shrink-0">
                          <SanityImage
                            image={brand.logo}
                            fill
                            fit="max"
                            className="object-contain"
                          />
                        </div>
                      )}
                      <span className="text-neutral-500 font-sans font-bold text-xs tracking-widest uppercase">
                        {brand?.title || "AVLU34"}
                      </span>
                    </div>

                    {/* Title */}
                    <h3 className="font-serif font-medium text-base text-neutral-400 mt-2 line-clamp-1 leading-snug">
                      {camp.title}
                    </h3>

                    {/* Short Description */}
                    {camp.shortDescription && (
                      <p className="font-sans text-neutral-400 text-xs line-clamp-2 mt-1 leading-relaxed">
                        {camp.shortDescription}
                      </p>
                    )}
                  </div>

                  {/* Find Out More Link */}
                  <span className="text-xs uppercase tracking-wider font-semibold text-neutral-500 group-hover:text-black mt-3 block group-hover:underline underline-offset-4 select-none">
                    {isEn ? "Find out more" : "Detayları Gör"}
                  </span>
                </Link>
              );
            })}
          </div>

          {/* Load More Button */}
          {hasMorePast && (
            <div className="flex justify-center mt-12 select-none">
              <button
                onClick={() => setPastLimit((prev) => prev + 9)}
                className="text-xs font-sans font-bold tracking-widest uppercase border border-neutral-300 text-neutral-500 bg-white px-8 py-3.5 hover:border-black hover:text-black transition-colors duration-300 cursor-pointer rounded-none"
              >
                {isEn ? "Load More" : "Daha Fazla Göster"}
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
