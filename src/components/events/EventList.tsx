"use client";

import React, { useState, useMemo } from "react";
import Link from "next/link";
import { SanityImage } from "@/components/ui/SanityImage";
import { getPublicPath } from "@/lib/i18n/routes";
import { Locale } from "@/lib/i18n/config";
import { Event } from "@/types";
import { RiSearchLine, RiArrowDownSLine, RiMapPinLine, RiTimeLine } from "react-icons/ri";

interface EventListProps {
  activeEvents: Event[];
  pastEvents: Event[];
  locale: Locale;
}

export function EventList({ activeEvents, pastEvents, locale }: EventListProps) {
  const isEn = locale === "en";

  // State
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState("newest");
  const [activeLimit, setActiveLimit] = useState(9);
  const [pastLimit, setPastLimit] = useState(9);

  // Filter and sort logic
  const filterAndSort = (events: Event[]) => {
    let result = [...events];

    // 1. Filter by search query
    if (searchQuery.trim() !== "") {
      const q = searchQuery.toLowerCase();
      result = result.filter((event) => {
        const matchTitle = event.title.toLowerCase().includes(q);
        const matchLocation = event.location?.toLowerCase().includes(q) || false;
        const matchTime = event.time?.toLowerCase().includes(q) || false;
        return matchTitle || matchLocation || matchTime;
      });
    }

    // 2. Sort
    result.sort((a, b) => {
      if (sortBy === "newest") {
        return new Date(b.startsAt).getTime() - new Date(a.startsAt).getTime();
      }
      if (sortBy === "upcoming") {
        return new Date(a.startsAt).getTime() - new Date(b.startsAt).getTime();
      }
      if (sortBy === "a-z") {
        return a.title.localeCompare(b.title, isEn ? "en" : "tr", { sensitivity: "base" });
      }
      if (sortBy === "z-a") {
        return b.title.localeCompare(a.title, isEn ? "en" : "tr", { sensitivity: "base" });
      }
      return 0;
    });

    return result;
  };

  const filteredActive = useMemo(() => filterAndSort(activeEvents), [activeEvents, searchQuery, sortBy]);
  const filteredPast = useMemo(() => filterAndSort(pastEvents), [pastEvents, searchQuery, sortBy]);

  const visibleActive = useMemo(() => filteredActive.slice(0, activeLimit), [filteredActive, activeLimit]);
  const visiblePast = useMemo(() => filteredPast.slice(0, pastLimit), [filteredPast, pastLimit]);

  const hasMoreActive = filteredActive.length > activeLimit;
  const hasMorePast = filteredPast.length > pastLimit;

  // Format date range helper
  const formatDateRange = (startStr: string, endStr: string) => {
    const options: Intl.DateTimeFormatOptions = { day: "numeric", month: "short", year: "numeric" };
    const start = new Date(startStr).toLocaleDateString(isEn ? "en-US" : "tr-TR", options);
    const end = new Date(endStr).toLocaleDateString(isEn ? "en-US" : "tr-TR", options);
    if (start === end) return start;
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
            placeholder={isEn ? "Search events..." : "Etkinlik ara..."}
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

        {/* Sort Dropdown */}
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
            <option value="upcoming">{isEn ? "Upcoming First" : "Yaklaşanlar"}</option>
            <option value="a-z">{isEn ? "Alphabetical A-Z" : "Alfabetik A-Z"}</option>
            <option value="z-a">{isEn ? "Alphabetical Z-A" : "Alfabetik Z-A"}</option>
          </select>
          <RiArrowDownSLine size={16} className="absolute right-3 top-1/2 -translate-y-1/2 text-neutral-400 pointer-events-none" />
        </div>
      </div>

      {/* Active Events Section */}
      <div className="mb-16">
        <div className="border-b border-neutral-200 pb-3 mb-8">
          <h2 className="text-xs font-sans font-bold tracking-[0.2em] uppercase text-black">
            {isEn ? "UPCOMING & ACTIVE EVENTS" : "AKTİF VE YAKLAŞAN ETKİNLİKLER"}
          </h2>
        </div>

        {visibleActive.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 lg:gap-12">
            {visibleActive.map((event) => {
              const eventUrl = `${getPublicPath("etkinlikler", locale)}/${event.slug.current}`;

              return (
                <Link
                  key={event._id}
                  href={eventUrl}
                  className="group flex flex-col justify-between rounded-none overflow-hidden select-text"
                >
                  <div className="flex flex-col">
                    {/* Vertical Flyer Cover Image aspect-[3/4] */}
                    <div className="relative aspect-[3/4] overflow-hidden bg-neutral-50 w-full rounded-none">
                      {event.image && (
                        <SanityImage
                          image={event.image}
                          fill
                          sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
                          className="object-cover transition-transform duration-500 group-hover:scale-[1.03]"
                        />
                      )}
                    </div>

                    {/* Date */}
                    <span className="text-neutral-500 font-sans text-xs tracking-wider mt-4 block">
                      {formatDateRange(event.startsAt, event.endsAt)}
                    </span>

                    {/* Title */}
                    <h3 className="font-serif font-medium text-base text-neutral-900 mt-2 line-clamp-1 leading-snug">
                      {event.title}
                    </h3>

                    {/* Venue Details */}
                    <div className="flex flex-col gap-1 mt-2.5 text-xs text-neutral-600 font-sans tracking-wide">
                      <div className="flex items-center gap-2">
                        <RiMapPinLine size={14} className="text-neutral-400 shrink-0" />
                        <span>{event.location}</span>
                      </div>
                      {event.time && (
                        <div className="flex items-center gap-2">
                          <RiTimeLine size={14} className="text-neutral-400 shrink-0" />
                          <span>{event.time}</span>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Find Out More Link */}
                  <span className="text-xs uppercase tracking-wider font-semibold text-neutral-800 hover:text-black mt-4 block group-hover:underline underline-offset-4 select-none">
                    {isEn ? "Find out more" : "Detayları Gör"}
                  </span>
                </Link>
              );
            })}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-16 border border-dashed border-neutral-200">
            <p className="text-sm font-sans tracking-wide text-neutral-400">
              {isEn ? "No active events match your criteria." : "Kriterlere uygun aktif etkinlik bulunamadı."}
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

      {/* Past Events Section */}
      {filteredPast.length > 0 && (
        <div className="mt-16 border-t border-neutral-100 pt-16">
          <div className="border-b border-neutral-200 pb-3 mb-8">
            <h2 className="text-xs font-sans font-bold tracking-[0.2em] uppercase text-neutral-400">
              {isEn ? "PAST EVENTS" : "GEÇMİŞ ETKİNLİKLER"}
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 lg:gap-12">
            {visiblePast.map((event) => {
              const eventUrl = `${getPublicPath("etkinlikler", locale)}/${event.slug.current}`;

              return (
                <Link
                  key={event._id}
                  href={eventUrl}
                  className="group flex flex-col justify-between rounded-none overflow-hidden grayscale opacity-60 hover:grayscale-0 hover:opacity-100 transition-all duration-300 select-text"
                >
                  <div className="flex flex-col">
                    {/* Cover Image */}
                    <div className="relative aspect-[3/4] overflow-hidden bg-neutral-50 w-full rounded-none">
                      {event.image && (
                        <SanityImage
                          image={event.image}
                          fill
                          sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
                          className="object-cover"
                        />
                      )}
                      {/* Expired Ribbon/Badge */}
                      <div className="absolute top-3 right-3 bg-black text-white text-[9px] font-sans font-bold uppercase tracking-widest px-2.5 py-1 select-none">
                        {isEn ? "Past" : "Geçmiş"}
                      </div>
                    </div>

                    {/* Date */}
                    <span className="text-neutral-500 font-sans text-xs tracking-wider mt-4 block">
                      {formatDateRange(event.startsAt, event.endsAt)}
                    </span>

                    {/* Title */}
                    <h3 className="font-serif font-medium text-base text-neutral-400 mt-2 line-clamp-1 leading-snug">
                      {event.title}
                    </h3>

                    {/* Venue Details */}
                    <div className="flex flex-col gap-1 mt-2.5 text-xs text-neutral-500 font-sans tracking-wide">
                      <div className="flex items-center gap-2">
                        <RiMapPinLine size={14} className="text-neutral-450 shrink-0" />
                        <span>{event.location}</span>
                      </div>
                      {event.time && (
                        <div className="flex items-center gap-2">
                          <RiTimeLine size={14} className="text-neutral-450 shrink-0" />
                          <span>{event.time}</span>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Find Out More Link */}
                  <span className="text-xs uppercase tracking-wider font-semibold text-neutral-500 group-hover:text-black mt-4 block group-hover:underline underline-offset-4 select-none">
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
