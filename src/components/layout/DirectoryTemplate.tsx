"use client";

import { useState, useMemo, useEffect } from "react";
import Link from "next/link";
import { PageHero } from "@/components/layout/PageHero";
import { SanityImage } from "@/components/ui/SanityImage";
import { getPublicPath } from "@/lib/i18n/routes";
import { Locale } from "@/lib/i18n/config";
import { Store, StoreCategory, FoodCategory } from "@/types";
import { RiSearchLine, RiArrowDownSLine } from "react-icons/ri";

interface DirectoryTemplateProps {
  title: string;
  subtitle?: string;
  backgroundImage?: any;
  categories: (StoreCategory | FoodCategory)[];
  items: Store[];
  type: "store" | "dining";
  activeCategorySlug?: string;
  locale: Locale;
}

const floorLabels: Record<string, { tr: string; en: string }> = {
  zemin: { tr: "Zemin Kat", en: "Ground Floor" },
  kat1: { tr: "1. Kat", en: "1st Floor" },
  kat2: { tr: "2. Kat", en: "2nd Floor" },
  kat3: { tr: "3. Kat", en: "3rd Floor" },
};

export function DirectoryTemplate({
  title,
  subtitle,
  backgroundImage,
  categories,
  items,
  type,
  activeCategorySlug,
  locale,
}: DirectoryTemplateProps) {
  const isEn = locale === "en";
  const basePath = type === "store" ? "magazalar" : "yeme-icme";
  const allPath = getPublicPath(basePath, locale);

  // States
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedFloor, setSelectedFloor] = useState("all");
  const [selectedSort, setSelectedSort] = useState("a-z");
  const [visibleCount, setVisibleCount] = useState(16);

  // Reset pagination when filter/search/sort changes
  useEffect(() => {
    setVisibleCount(16);
  }, [searchQuery, selectedFloor, selectedSort, activeCategorySlug]);

  // Client-side filtering & sorting
  const filteredAndSorted = useMemo(() => {
    let result = [...items];

    // 1. Filter by Active Category (URL state)
    if (activeCategorySlug) {
      result = result.filter((item) => {
        const catSlug = type === "store" 
          ? item.storeCategory?.slug?.current 
          : item.foodCategory?.slug?.current;
        return catSlug === activeCategorySlug;
      });
    }

    // 2. Filter by Search Query
    if (searchQuery.trim() !== "") {
      const q = searchQuery.toLowerCase();
      result = result.filter((item) => 
        item.title.toLowerCase().includes(q) || 
        (item.description && item.description.toLowerCase().includes(q))
      );
    }

    // 3. Filter by Floor
    if (selectedFloor !== "all") {
      result = result.filter((item) => item.floor === selectedFloor);
    }

    // 4. Sort alphabetically (Turkish-character friendly localCompare)
    result.sort((a, b) => {
      const sortOrder = a.title.localeCompare(b.title, isEn ? "en" : "tr", { sensitivity: "base" });
      return selectedSort === "a-z" ? sortOrder : -sortOrder;
    });

    return result;
  }, [items, activeCategorySlug, searchQuery, selectedFloor, selectedSort, type, isEn]);

  const visibleItems = useMemo(() => {
    return filteredAndSorted.slice(0, visibleCount);
  }, [filteredAndSorted, visibleCount]);

  const hasMore = filteredAndSorted.length > visibleCount;

  // Breadcrumbs items for PageHero
  const breadcrumbs = [
    { label: isEn ? "Home" : "Ana Sayfa", href: isEn ? "/en" : "/" },
    { 
      label: isEn ? (type === "store" ? "Stores" : "Dining") : (type === "store" ? "Mağazalar" : "Yeme-İçme"), 
      href: allPath,
      active: !activeCategorySlug 
    },
    ...(activeCategorySlug ? [
      {
        label: categories.find(c => c.slug?.current === activeCategorySlug)?.title || activeCategorySlug,
        href: `${allPath}/${activeCategorySlug}`,
        active: true
      }
    ] : [])
  ];

  return (
    <div className="flex flex-col gap-10 pb-16 bg-white min-h-screen">
      {/* Dynamic Page Hero */}
      <PageHero
        title={title}
        subtitle={subtitle}
        backgroundImage={backgroundImage}
        breadcrumbs={breadcrumbs}
      />

      <div className="container mx-auto px-4">
        {/* Filter and Utility Bar */}
        <div className="flex flex-col gap-6 border-b border-neutral-100 pb-8 mb-10">
          
          {/* Top Level: Categories & Search */}
          <div className="flex flex-col lg:flex-row justify-between items-stretch lg:items-center gap-6">
            
            {/* Horizontal Scroll Categories */}
            <div className="overflow-x-auto -mx-4 px-4 lg:mx-0 lg:px-0 scrollbar-none flex items-center gap-2">
              <Link
                href={allPath}
                className={`text-xs font-sans font-semibold tracking-wider uppercase px-4 py-2 border transition-all duration-300 shrink-0 ${
                  !activeCategorySlug
                    ? "bg-black border-black text-white"
                    : "bg-white border-neutral-200 text-neutral-600 hover:border-black hover:text-black"
                }`}
              >
                {isEn ? "All" : "Tümü"}
              </Link>
              {categories.map((cat) => {
                const isActive = cat.slug?.current === activeCategorySlug;
                return (
                  <Link
                    key={cat._id}
                    href={`${allPath}/${cat.slug?.current}`}
                    className={`text-xs font-sans font-semibold tracking-wider uppercase px-4 py-2 border transition-all duration-300 shrink-0 ${
                      isActive
                        ? "bg-black border-black text-white"
                        : "bg-white border-neutral-200 text-neutral-600 hover:border-black hover:text-black"
                    }`}
                  >
                    {cat.title}
                  </Link>
                );
              })}
            </div>

            {/* Inline search input */}
            <div className="relative flex-1 lg:max-w-xs min-h-[40px]">
              <input
                type="text"
                placeholder={isEn ? "Search brands..." : "Marka ara..."}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full h-10 pl-10 pr-4 border border-neutral-200 rounded-none bg-neutral-50 text-xs font-sans tracking-wide text-neutral-800 placeholder-neutral-400 focus:border-black focus:bg-white focus:outline-none transition-colors duration-300"
              />
              <RiSearchLine size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400 pointer-events-none" />
            </div>

          </div>

          {/* Bottom Level: Filters & Sorters */}
          <div className="flex flex-wrap items-center justify-between gap-4 pt-4 border-t border-neutral-100">
            
            {/* Filter Summary */}
            <div className="text-xs font-sans text-neutral-500">
              {isEn ? "Showing" : "Toplam"} <span className="font-semibold text-black">{filteredAndSorted.length}</span> {isEn ? "results" : "sonuç bulunuyor"}
            </div>

            {/* Select Dropdowns */}
            <div className="flex items-center gap-3 w-full sm:w-auto">
              {/* Floor Filter */}
              <div className="relative flex-1 sm:flex-none sm:w-44">
                <select
                  value={selectedFloor}
                  onChange={(e) => setSelectedFloor(e.target.value)}
                  className="w-full h-10 px-4 pr-10 border border-neutral-200 rounded-none bg-white text-xs font-sans font-semibold tracking-wider uppercase appearance-none focus:border-black focus:outline-none cursor-pointer"
                >
                  <option value="all">{isEn ? "All Floors" : "Tüm Katlar"}</option>
                  <option value="zemin">{isEn ? "Ground Floor" : "Zemin Kat"}</option>
                  <option value="kat1">{isEn ? "1st Floor" : "1. Kat"}</option>
                  <option value="kat2">{isEn ? "2nd Floor" : "2. Kat"}</option>
                  <option value="kat3">{isEn ? "3rd Floor" : "3. Kat"}</option>
                </select>
                <RiArrowDownSLine size={16} className="absolute right-3 top-1/2 -translate-y-1/2 text-neutral-400 pointer-events-none" />
              </div>

              {/* Sort Order */}
              <div className="relative flex-1 sm:flex-none sm:w-44">
                <select
                  value={selectedSort}
                  onChange={(e) => setSelectedSort(e.target.value)}
                  className="w-full h-10 px-4 pr-10 border border-neutral-200 rounded-none bg-white text-xs font-sans font-semibold tracking-wider uppercase appearance-none focus:border-black focus:outline-none cursor-pointer"
                >
                  <option value="a-z">{isEn ? "Sort A-Z" : "Sırala A-Z"}</option>
                  <option value="z-a">{isEn ? "Sort Z-A" : "Sırala Z-A"}</option>
                </select>
                <RiArrowDownSLine size={16} className="absolute right-3 top-1/2 -translate-y-1/2 text-neutral-400 pointer-events-none" />
              </div>
            </div>

          </div>

        </div>

        {/* Directory Grid */}
        {visibleItems.length > 0 ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
            {visibleItems.map((item) => {
              const itemUrl = `${allPath}/${item.slug?.current}`;
              const floorText = item.floor && floorLabels[item.floor] 
                ? (isEn ? floorLabels[item.floor].en : floorLabels[item.floor].tr) 
                : item.floor;

              return (
                <Link
                  key={item._id}
                  href={itemUrl}
                  className="group border border-neutral-200 bg-white p-4 md:p-6 flex flex-col justify-between aspect-[4/3] hover:border-black hover:shadow-sm transition-all duration-300 rounded-none relative overflow-hidden"
                >
                  {/* Brand Logo */}
                  <div className="flex-1 w-full flex items-center justify-center min-h-[80px] select-none">
                    {item.logo ? (
                      <SanityImage
                        image={item.logo}
                        width={200}
                        height={100}
                        fit="max"
                        className="max-h-[50px] md:max-h-[70px] w-auto object-contain transition-transform duration-500 group-hover:scale-105"
                      />
                    ) : (
                      <span className="font-sans font-bold text-sm tracking-widest text-black uppercase">
                        {item.title}
                      </span>
                    )}
                  </div>

                  {/* Card bottom meta */}
                  <div className="border-t border-neutral-100 pt-3 flex items-center justify-between mt-4">
                    <span className="font-sans font-bold text-[10px] md:text-xs tracking-wider uppercase text-neutral-850 truncate max-w-[70%] group-hover:text-black transition-colors duration-300">
                      {item.title}
                    </span>
                    {floorText && (
                      <span className="font-sans font-medium text-[9px] md:text-[10px] tracking-wider uppercase text-neutral-400 truncate shrink-0">
                        {floorText}
                      </span>
                    )}
                  </div>
                </Link>
              );
            })}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-20 border border-dashed border-neutral-200">
            <p className="text-sm font-sans tracking-wide text-neutral-400">
              {isEn ? "No brands match your criteria." : "Arama kriterlerinize uygun sonuç bulunamadı."}
            </p>
          </div>
        )}

        {/* Load More Button */}
        {hasMore && (
          <div className="flex justify-center mt-12">
            <button
              onClick={() => setVisibleCount((prev) => prev + 16)}
              className="text-xs font-sans font-bold tracking-widest uppercase border border-black text-black bg-white px-8 py-3.5 hover:bg-black hover:text-white transition-colors duration-300 cursor-pointer rounded-none"
            >
              {isEn ? "Load More" : "Daha Fazla Göster"}
            </button>
          </div>
        )}

        {/* Dynamic bottom CTA section */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-20 border-t border-neutral-150 pt-16">
          {/* Campaigns CTA */}
          <Link 
            href={getPublicPath("kampanyalar", locale)}
            className="group relative h-48 bg-neutral-900 overflow-hidden flex flex-col justify-end p-6 border border-neutral-800"
          >
            <div className="absolute inset-0 bg-neutral-950 opacity-40 group-hover:opacity-30 transition-opacity duration-300 z-0" />
            <div className="relative z-10">
              <span className="text-[10px] font-sans font-bold tracking-widest text-neutral-400 uppercase">
                {isEn ? "Special Offers" : "Ayrıcalıklar"}
              </span>
              <h3 className="text-xl font-serif font-normal text-white mt-1 mb-3 tracking-wide">
                {isEn ? "Discover Campaigns" : "Kampanyaları Keşfet"}
              </h3>
              <span className="text-[10px] font-sans font-semibold tracking-widest text-white uppercase border-b border-white/40 pb-0.5 group-hover:border-white transition-all duration-300">
                {isEn ? "EXPLORE" : "İNCELE"}
              </span>
            </div>
          </Link>

          {/* Events CTA */}
          <Link 
            href={getPublicPath("etkinlikler", locale)}
            className="group relative h-48 bg-neutral-900 overflow-hidden flex flex-col justify-end p-6 border border-neutral-800"
          >
            <div className="absolute inset-0 bg-neutral-950 opacity-40 group-hover:opacity-30 transition-opacity duration-300 z-0" />
            <div className="relative z-10">
              <span className="text-[10px] font-sans font-bold tracking-widest text-neutral-400 uppercase">
                {isEn ? "What's On" : "Etkinlik Takvimi"}
              </span>
              <h3 className="text-xl font-serif font-normal text-white mt-1 mb-3 tracking-wide">
                {isEn ? "Discover Events" : "Etkinlikleri Keşfet"}
              </h3>
              <span className="text-[10px] font-sans font-semibold tracking-widest text-white uppercase border-b border-white/40 pb-0.5 group-hover:border-white transition-all duration-300">
                {isEn ? "EXPLORE" : "İNCELE"}
              </span>
            </div>
          </Link>
        </div>

      </div>
    </div>
  );
}
