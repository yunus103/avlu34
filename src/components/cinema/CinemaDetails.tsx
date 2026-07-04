"use client";

import React from "react";
import Link from "next/link";
import dynamic from "next/dynamic";
import { CinemaPage } from "@/types";
import { Locale } from "@/lib/i18n/config";
import { RichText } from "@/components/ui/RichText";
import { SanityImage } from "@/components/ui/SanityImage";
import { getPublicPath } from "@/lib/i18n/routes";
import { Phone } from "lucide-react";

const LightboxGallery = dynamic(
  () => import("@/components/ui/Lightbox").then((mod) => mod.LightboxGallery),
  { ssr: false }
);

interface CinemaDetailsProps {
  data: CinemaPage;
  locale: Locale;
}

export function CinemaDetails({ data, locale }: CinemaDetailsProps) {
  const isEn = locale === "en";

  // Formats dates for campaign cards
  const formatDateRange = (startStr: string, endStr: string) => {
    const options: Intl.DateTimeFormatOptions = { day: "numeric", month: "short", year: "numeric" };
    const start = new Date(startStr).toLocaleDateString(isEn ? "en-US" : "tr-TR", options);
    const end = new Date(endStr).toLocaleDateString(isEn ? "en-US" : "tr-TR", options);
    return `${start} - ${end}`;
  };

  return (
    <div className="container mx-auto px-4 py-8 bg-white">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-start">
        
        {/* LEFT COLUMN: Main Description & Photo Gallery (60% Width) */}
        <div className="lg:col-span-7 flex flex-col gap-10">
          
          {/* Main Title & RichText description */}
          <div className="flex flex-col gap-6">
            <h2 className="text-3xl md:text-4xl font-serif font-normal tracking-wide text-neutral-900 uppercase">
              {data.pageTitle || (isEn ? "AVLU34 CINEMA" : "AVLU34 SİNEMA")}
            </h2>
            
            {data.body && (
              <div className="font-sans font-light text-neutral-700 leading-relaxed text-base animate-fade-in">
                <RichText value={data.body} />
              </div>
            )}
          </div>

          {/* Photo Gallery with Captions support */}
          {data.gallery && data.gallery.length > 0 && (
            <div className="flex flex-col gap-6 border-t border-neutral-100 pt-10">
              <h3 className="text-xs font-sans font-bold tracking-[0.2em] uppercase text-neutral-800">
                {isEn ? "PHOTO GALLERY" : "FOTOĞRAF GALERİSİ"}
              </h3>
              
              <LightboxGallery images={data.gallery} />
            </div>
          )}

        </div>

        {/* RIGHT COLUMN: Sticky Info Card (40% Width) */}
        <div className="lg:col-span-5 lg:sticky lg:top-24">
          <div className="border border-neutral-200 p-8 bg-neutral-50/50 rounded-none flex flex-col gap-8">
            
            {/* Quick Stats Grid */}
            <div className="grid grid-cols-2 border-b border-neutral-200 pb-6">
              
              {/* Salon Count */}
              {data.salonCount && (
                <div className="flex flex-col items-center justify-center text-center border-r border-neutral-200 px-4">
                  <span className="text-4xl font-serif font-light text-black tracking-tight">
                    {data.salonCount}
                  </span>
                  <span className="text-[10px] font-sans font-bold tracking-[0.25em] text-neutral-500 uppercase mt-2">
                    {isEn ? "HALLS" : "SALON"}
                  </span>
                </div>
              )}

              {/* Seat Capacity */}
              {data.seatCount && (
                <div className="flex flex-col items-center justify-center text-center px-4">
                  <span className="text-4xl font-serif font-light text-black tracking-tight">
                    {data.seatCount}
                  </span>
                  <span className="text-[10px] font-sans font-bold tracking-[0.25em] text-neutral-500 uppercase mt-2">
                    {isEn ? "SEATS" : "KOLTUK"}
                  </span>
                </div>
              )}

            </div>

            {/* Ayrıcalıklı Salonlar (Privileged Halls with SVGs) */}
            {data.privilegedHalls && data.privilegedHalls.length > 0 && (
              <div className="flex flex-col gap-4 border-b border-neutral-200 pb-6">
                <h4 className="text-[10px] font-sans font-bold tracking-[0.25em] text-neutral-500 uppercase">
                  {isEn ? "PRIVILEGED HALLS" : "AYRICALIKLI SALONLAR"}
                </h4>
                <div className="flex flex-row flex-wrap items-center gap-6 mt-1">
                  {data.privilegedHalls.map((hall, idx) => (
                    <React.Fragment key={idx}>
                      {hall.asset?.url && (
                        <div className="h-10 md:h-12 flex items-center justify-center shrink-0">
                          <img
                            src={hall.asset.url}
                            alt={hall.alt || hall.title}
                            className="h-full w-auto object-contain"
                          />
                        </div>
                      )}
                    </React.Fragment>
                  ))}
                </div>
              </div>
            )}

            {/* Cinema Phone Number */}
            {data.phone && (
              <div className="flex items-center gap-3 text-neutral-800">
                <Phone size={18} className="text-neutral-400 shrink-0" />
                <div className="flex flex-col">
                  <span className="text-[10px] font-sans font-bold tracking-[0.1em] text-neutral-400 uppercase">
                    {isEn ? "PHONE NUMBER" : "TELEFON NUMARASI"}
                  </span>
                  <a 
                    href={`tel:${data.phone.replace(/\s+/g, "")}`}
                    className="font-sans font-medium text-sm hover:underline text-black"
                  >
                    {data.phone}
                  </a>
                </div>
              </div>
            )}

            {/* CTA Button linking to Paribu Cineverse page */}
            {data.ticketUrl && (
              <a
                href={data.ticketUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full text-center border border-black text-black bg-white hover:bg-black hover:text-white py-3.5 px-6 text-xs font-sans font-bold tracking-widest uppercase transition-all duration-300 rounded-none cursor-pointer"
              >
                {isEn ? "VIEW SEANCES & BUY TICKETS" : "VİZYONDAKİ FİLMLER & BİLET AL"}
              </a>
            )}

          </div>
        </div>

      </div>

      {/* BOTTOM SECTION: Active Cinema-specific Campaigns */}
      {data.activeCampaigns && data.activeCampaigns.length > 0 && (
        <div className="mt-20 border-t border-neutral-200 pt-16">
          <div className="border-b border-neutral-200 pb-3 mb-10">
            <h2 className="text-sm font-sans font-bold tracking-[0.2em] uppercase text-black">
              {isEn ? "CINEMA OFFERS & CAMPAIGNS" : "SİNEMA FIRSATLARI & KAMPANYALAR"}
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 lg:gap-12">
            {data.activeCampaigns.map((camp) => {
              const campUrl = `${getPublicPath("kampanyalar", locale)}/${camp.slug.current}`;

              return (
                <Link
                  key={camp._id}
                  href={campUrl}
                  className="group flex flex-col justify-between rounded-none overflow-hidden"
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
                    <span className="text-neutral-500 font-sans text-xs md:text-sm tracking-wider mt-4 block">
                      {formatDateRange(camp.startsAt, camp.endsAt)}
                    </span>

                    {/* Category Stamp */}
                    <span className="text-black font-sans font-bold text-xs tracking-widest uppercase mt-2">
                      {isEn ? "CINEMA / ENTERTAINMENT" : "SİNEMA / EĞLENCE"}
                    </span>

                    {/* Title */}
                    <h3 className="font-serif font-semibold text-lg md:text-xl text-neutral-900 mt-2 line-clamp-1 leading-snug">
                      {camp.title}
                    </h3>

                    {/* Short Description */}
                    {camp.shortDescription && (
                      <p className="font-sans text-neutral-600 text-sm line-clamp-2 mt-1 leading-relaxed">
                        {camp.shortDescription}
                      </p>
                    )}
                  </div>

                  {/* Find Out More Link */}
                  <span className="text-xs md:text-sm uppercase tracking-wider font-bold text-neutral-800 hover:text-black mt-4 block group-hover:underline underline-offset-4">
                    {isEn ? "Find out more" : "Detayları Gör"}
                  </span>
                </Link>
              );
            })}
          </div>
        </div>
      )}

    </div>
  );
}
