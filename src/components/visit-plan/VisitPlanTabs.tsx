"use client";

import { useState, useRef, useEffect } from "react";
import {
  Plane,
  Bus,
  Shield,
  Baby,
  ChevronsUpDown,
  CreditCard,
  Accessibility,
  Users,
  Moon,
  Utensils,
  Info,
  Car,
  Wifi,
  Zap,
  Clock,
  ExternalLink,
  MapPin,
} from "lucide-react";
import { RichText } from "@/components/ui/RichText";
import { SanityImage } from "@/components/ui/SanityImage";
import { FadeIn } from "@/components/ui/FadeIn";
import { VisitPlanPage } from "@/types";

interface Props {
  data: VisitPlanPage;
  locale: string;
  googleMapsUrl?: string;
  mapIframe?: string;
}

interface ServiceItem {
  id: string;
  iconName: string;
  titleTr: string;
  titleEn: string;
}

const SERVICES: ServiceItem[] = [
  { id: "havaist", iconName: "Plane", titleTr: "HAVA İST", titleEn: "AIRPORT SHUTTLE" },
  { id: "servis", iconName: "Bus", titleTr: "MÜŞTERİ SERVİSİ", titleEn: "SHUTTLE BUS" },
  { id: "guvenlik", iconName: "Shield", titleTr: "GÜVENLİK", titleEn: "SECURITY" },
  { id: "bebek", iconName: "Baby", titleTr: "BEBEK BAKIM ODASI", titleEn: "BABY CARE" },
  { id: "asansor", iconName: "ChevronsUpDown", titleTr: "ASANSÖR", titleEn: "ELEVATOR" },
  { id: "atm", iconName: "CreditCard", titleTr: "ATM NOKTALARI", titleEn: "ATM" },
  { id: "engelli_wc", iconName: "Accessibility", titleTr: "ENGELLİ WC", titleEn: "ACCESSIBLE WC" },
  { id: "aile_wc", iconName: "Users", titleTr: "AİLE WC", titleEn: "FAMILY WC" },
  { id: "mescid", iconName: "Moon", titleTr: "MESCİD", titleEn: "PRAYER ROOM" },
  { id: "restoran", iconName: "Utensils", titleTr: "KAFE & RESTORAN", titleEn: "DINING" },
  { id: "danisma", iconName: "Info", titleTr: "DANIŞMA", titleEn: "INFO DESK" },
  { id: "otopark", iconName: "Car", titleTr: "KAPALI OTOPARK", titleEn: "INDOOR PARKING" },
  { id: "wifi", iconName: "Wifi", titleTr: "ÜCRETSİZ WIFI", titleEn: "FREE WIFI" },
  { id: "sarj", iconName: "Zap", titleTr: "ŞARJ İSTASYONU", titleEn: "EV CHARGING" },
];

export function VisitPlanTabs({ data, locale, googleMapsUrl, mapIframe }: Props) {
  const isEn = locale === "en";
  const [activeTab, setActiveTab] = useState<"hours" | "culture" | "services" | "transit">("hours");
  const tabContainerRef = useRef<HTMLDivElement>(null);
  const [currentDayIndex, setCurrentDayIndex] = useState<number>(-1);

  // Determine current day (0: Monday, ..., 6: Sunday) to highlight the row
  useEffect(() => {
    // getDay() returns: 0 for Sunday, 1 for Monday, ..., 6 for Saturday
    // Map it so Monday is 0, Tuesday is 1, ..., Sunday is 6
    const day = (new Date().getDay() + 6) % 7;
    const timer = setTimeout(() => {
      setCurrentDayIndex(day);
    }, 0);
    return () => clearTimeout(timer);
  }, []);

  const tabs = [
    { id: "hours" as const, label: isEn ? "Opening Hours" : "Çalışma Saatleri" },
    { id: "culture" as const, label: isEn ? "Culture Center" : "Kültür Merkezi" },
    { id: "services" as const, label: data.servicesTabTitle || (isEn ? "Services" : "Hizmetlerimiz") },
    { id: "transit" as const, label: data.transportTabTitle || (isEn ? "Transit & Parking" : "Ulaşım & Otopark") },
  ];

  // Center active tab inside horizontal scroll container on mobile
  useEffect(() => {
    if (tabContainerRef.current) {
      const activeElement = tabContainerRef.current.querySelector('[data-active="true"]');
      if (activeElement) {
        const container = tabContainerRef.current;
        const scrollLeft =
          (activeElement as HTMLElement).offsetLeft -
          container.offsetWidth / 2 +
          (activeElement as HTMLElement).offsetWidth / 2;
        container.scrollTo({ left: scrollLeft, behavior: "smooth" });
      }
    }
  }, [activeTab]);

  const renderIcon = (iconName: string) => {
    const props = { className: "w-8 h-8 stroke-[1.5] text-neutral-900" };
    switch (iconName) {
      case "Plane": return <Plane {...props} />;
      case "Bus": return <Bus {...props} />;
      case "Shield": return <Shield {...props} />;
      case "Baby": return <Baby {...props} />;
      case "ChevronsUpDown": return <ChevronsUpDown {...props} />;
      case "CreditCard": return <CreditCard {...props} />;
      case "Accessibility": return <Accessibility {...props} />;
      case "Users": return <Users {...props} />;
      case "Moon": return <Moon {...props} />;
      case "Utensils": return <Utensils {...props} />;
      case "Info": return <Info {...props} />;
      case "Car": return <Car {...props} />;
      case "Wifi": return <Wifi {...props} />;
      case "Zap": return <Zap {...props} />;
      default: return <Info {...props} />;
    }
  };

  return (
    <div className="w-full">
      {/* Tab Navigation */}
      <div className="border-b border-neutral-200 mb-8 md:mb-12">
        <div className="container mx-auto px-4">
          <div
            ref={tabContainerRef}
            className="flex gap-4 md:gap-8 overflow-x-auto whitespace-nowrap scrollbar-none snap-x -mx-4 px-4 md:mx-0 md:px-0"
          >
            {tabs.map((tab) => {
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  data-active={isActive}
                  className={`snap-center pb-4 text-xs md:text-sm uppercase tracking-widest font-semibold border-b-[2px] transition-all duration-300 cursor-pointer ${
                    isActive
                      ? "border-black text-black font-bold"
                      : "border-transparent text-neutral-400 hover:text-black"
                  }`}
                >
                  {tab.label}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Tab Contents - DOM is preserved for SEO */}
      <div className="container mx-auto px-4 pb-16">
        
        {/* TAB 1: WORKING HOURS */}
        <div style={{ display: activeTab === "hours" ? "block" : "none" }}>
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 md:gap-12 items-start">
            {/* Daily Hours List */}
            <div className="lg:col-span-7">
              <FadeIn direction="up">
                <h3 className="font-serif text-2xl md:text-3xl text-neutral-900 mb-6 tracking-wide uppercase font-medium">
                  {isEn ? "Opening Hours" : "Çalışma Saatleri"}
                </h3>
                
                {data.dailyWorkingHours && data.dailyWorkingHours.length > 0 ? (
                  <div className="border border-neutral-200 rounded-sm divide-y divide-neutral-200 overflow-hidden bg-white">
                    {data.dailyWorkingHours.map((item, idx) => {
                      const isToday = idx === currentDayIndex;
                      return (
                        <div
                          key={idx}
                          className={`flex justify-between items-center px-6 py-4 transition-colors ${
                            isToday ? "bg-neutral-50 font-semibold" : ""
                          }`}
                        >
                          <span className="flex items-center gap-2 text-sm text-neutral-900 uppercase tracking-wider">
                            {isToday && <span className="w-1.5 h-1.5 bg-black rounded-full" />}
                            {item.day}
                          </span>
                          <span className="text-sm font-mono text-neutral-700">
                            {item.hours}
                          </span>
                        </div>
                      );
                    })}
                  </div>
                ) : (
                  <p className="text-neutral-500 font-sans font-light">
                    {isEn ? "Working hours details not configured." : "Çalışma saatleri bilgisi eklenmemiş."}
                  </p>
                )}
              </FadeIn>
            </div>

            {/* General Hours Info Card */}
            <div className="lg:col-span-5">
              <FadeIn direction="left" delay={0.2}>
                <div className="p-8 bg-neutral-50 border border-neutral-200 rounded-sm flex flex-col gap-6">
                  <div className="flex items-center gap-4 text-neutral-900">
                    <Clock className="w-8 h-8 stroke-[1.5]" />
                    <div>
                      <h4 className="text-xs uppercase tracking-widest text-neutral-400 font-semibold mb-0.5">
                        {isEn ? "GENERAL WORKING HOURS" : "GENEL ÇALIŞMA SAATLERİ"}
                      </h4>
                      <p className="text-lg font-semibold tracking-wide font-sans">
                        {isEn ? "Every Day: 10:00 - 22:00" : "Her Gün: 10:00 - 22:00"}
                      </p>
                    </div>
                  </div>

                  {data.workingHoursNote && (
                    <p className="text-xs md:text-sm text-neutral-500 font-sans font-light leading-relaxed border-t border-neutral-200 pt-6">
                      {data.workingHoursNote}
                    </p>
                  )}
                </div>
              </FadeIn>
            </div>
          </div>
        </div>

        {/* TAB 2: CULTURE CENTER */}
        <div style={{ display: activeTab === "culture" ? "block" : "none" }}>
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 md:gap-12 items-start">
            {/* Left Content */}
            <div className="lg:col-span-7 flex flex-col gap-6">
              {data.cultureCenterTitle && (
                <FadeIn direction="up">
                  <h3 className="font-serif text-2xl md:text-3xl text-neutral-900 tracking-wide uppercase font-medium">
                    {data.cultureCenterTitle}
                  </h3>
                </FadeIn>
              )}

              {data.cultureCenterContent && (
                <FadeIn direction="up" delay={0.1}>
                  <div className="text-neutral-600 leading-relaxed font-light mt-2">
                    <RichText value={data.cultureCenterContent} />
                  </div>
                </FadeIn>
              )}

              <FadeIn direction="up" delay={0.2}>
                <div className="flex flex-wrap gap-4 items-center bg-neutral-50 border border-neutral-150 p-6 rounded-sm my-2">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center border border-neutral-200 text-neutral-800">
                      <Users className="w-5 h-5 stroke-[1.5]" />
                    </div>
                    <div>
                      <span className="block text-xs tracking-widest text-neutral-400 font-bold uppercase">
                        {isEn ? "CAPACITY" : "KAPASİTE"}
                      </span>
                      <span className="text-base font-semibold text-neutral-900 font-sans">
                        {isEn ? "424 Seats" : "424 Kişilik Salon"}
                      </span>
                    </div>
                  </div>
                  <div className="h-8 w-px bg-neutral-200 hidden sm:block mx-4" />
                  <div className="text-sm text-neutral-500 font-light font-sans max-w-sm">
                    {isEn
                      ? "Arnavutköy Municipality Culture Center inside AVLU34 features modern theatrical lighting and seating systems."
                      : "AVLU34 bünyesinde yer alan kültür merkezimiz tiyatro, söyleşi ve konferans gibi etkinliklere modern sahne altyapısı ile ev sahipliği yapar."}
                  </div>
                </div>
              </FadeIn>

              {data.cultureCenterCtaLabel && (
                <FadeIn direction="up" delay={0.3}>
                  <a
                    href={`/${locale}/etkinlikler`}
                    className="inline-block border border-black text-black hover:bg-black hover:text-white px-8 py-3.5 text-xs font-semibold uppercase tracking-widest transition-colors duration-300"
                  >
                    {data.cultureCenterCtaLabel}
                  </a>
                </FadeIn>
              )}
            </div>

            {/* Right Media */}
            {data.cultureCenterImage && (
              <div className="lg:col-span-5">
                <FadeIn direction="left" delay={0.2}>
                  <div className="relative aspect-[4/3] w-full rounded-lg overflow-hidden shadow-sm border border-neutral-100">
                    <SanityImage
                      image={data.cultureCenterImage}
                      fill
                      sizes="(max-width: 1024px) 100vw, 40vw"
                      className="object-cover"
                      priority
                    />
                  </div>
                </FadeIn>
              </div>
            )}
          </div>
        </div>

        {/* TAB 3: AVM SERVICES */}
        <div style={{ display: activeTab === "services" ? "block" : "none" }}>
          <FadeIn direction="up">
            <div className="max-w-2xl mb-8 md:mb-12">
              <h3 className="font-serif text-2xl md:text-3xl text-neutral-900 mb-2 tracking-wide uppercase font-medium">
                {data.servicesTabTitle || (isEn ? "Mall Services" : "Hizmetlerimiz")}
              </h3>
              <p className="text-neutral-500 font-sans font-light leading-relaxed">
                {data.servicesTabSubtitle ||
                  (isEn
                    ? "All facilities to make your visit comfortable and easy."
                    : "Ziyaretinizi konforlu ve kolay hale getirmek için tüm olanaklarımız.")}
              </p>
            </div>
          </FadeIn>

          <FadeIn delay={0.1}>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
              {SERVICES.map((service) => (
                <div
                  key={service.id}
                  className="flex flex-col items-center justify-center p-6 bg-white border border-neutral-200 rounded-sm hover:border-black hover:shadow-sm transition-all duration-300 text-center group"
                >
                  <div className="mb-4 transform group-hover:scale-105 transition-transform duration-300">
                    {renderIcon(service.iconName)}
                  </div>
                  <span className="text-xs md:text-sm font-semibold tracking-wider text-neutral-900 uppercase font-sans">
                    {isEn ? service.titleEn : service.titleTr}
                  </span>
                </div>
              ))}
            </div>
          </FadeIn>
        </div>

        {/* TAB 4: TRANSIT & PARKING */}
        <div style={{ display: activeTab === "transit" ? "block" : "none" }}>
          <div className="flex flex-col gap-10 md:gap-14">
            
            {/* Highlighted Feature Cards (Otopark, EV Charging, Proximity) */}
            <FadeIn direction="up">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* Parking capacity card */}
                <div className="p-8 border border-neutral-200 rounded-sm bg-white hover:border-black transition-colors flex flex-col gap-4">
                  <div className="w-12 h-12 bg-neutral-50 border border-neutral-100 flex items-center justify-center text-neutral-900 rounded-sm">
                    <Car className="w-6 h-6 stroke-[1.5]" />
                  </div>
                  <div>
                    <h4 className="font-serif text-lg text-neutral-900 uppercase tracking-wide font-medium mb-1">
                      {data.parkingTitle || (isEn ? "Indoor Parking" : "Kapalı Otopark")}
                    </h4>
                    <p className="text-sm md:text-base text-neutral-500 font-sans font-light leading-relaxed">
                      {data.parkingContent ||
                        (isEn
                          ? "Our 414-capacity secure indoor parking is at your service."
                          : "Ziyaretçilerimiz için konforlu ve güvenli 414 araçlık kapalı otoparkımız hizmet vermektedir.")}
                    </p>
                  </div>
                </div>

                {/* EV Charging card */}
                <div className="p-8 border border-neutral-200 rounded-sm bg-white hover:border-black transition-colors flex flex-col gap-4">
                  <div className="w-12 h-12 bg-neutral-50 border border-neutral-100 flex items-center justify-center text-neutral-900 rounded-sm">
                    <Zap className="w-6 h-6 stroke-[1.5]" />
                  </div>
                  <div>
                    <h4 className="font-serif text-lg text-neutral-900 uppercase tracking-wide font-medium mb-1">
                      {data.evChargingTitle || (isEn ? "Fast EV Charge" : "Hızlı Şarj (EV Charge)")}
                    </h4>
                    <p className="text-sm md:text-base text-neutral-500 font-sans font-light leading-relaxed">
                      {data.evChargingContent ||
                        (isEn
                          ? "Quick charge stations are located on the ground floor parking area."
                          : "Zemin kat otopark alanımızda yer alan hızlı şarj istasyonlarımız ile aracınızı şarj edebilirsiniz.")}
                    </p>
                  </div>
                </div>

                {/* Airport Proximity card */}
                <div className="p-8 border border-neutral-200 rounded-sm bg-white hover:border-black transition-colors flex flex-col gap-4">
                  <div className="w-12 h-12 bg-neutral-50 border border-neutral-100 flex items-center justify-center text-neutral-900 rounded-sm">
                    <Plane className="w-6 h-6 stroke-[1.5]" />
                  </div>
                  <div>
                    <h4 className="font-serif text-lg text-neutral-900 uppercase tracking-wide font-medium mb-1">
                      {data.airportTitle || (isEn ? "Airport Proximity" : "Havalimanı Yakınlığı")}
                    </h4>
                    <p className="text-sm md:text-base text-neutral-500 font-sans font-light leading-relaxed">
                      {data.airportContent ||
                        (isEn
                          ? "AVLU34 Mall is only 15 minutes away from Istanbul Airport by driving."
                          : "AVLU34 AVM, İstanbul Havalimanı'na sadece 15 dakika sürüş mesafesindedir.")}
                    </p>
                  </div>
                </div>
              </div>
            </FadeIn>

            {/* Shuttle schedules & Public Bus Tables */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 md:gap-12 items-start border-t border-neutral-200 pt-10 md:pt-14">
              
              {/* Shuttle Ring Schedule */}
              <div className="lg:col-span-6 flex flex-col gap-6">
                <FadeIn direction="up">
                  <div className="flex items-center gap-3 mb-2">
                    <Bus className="w-6 h-6 text-neutral-900 stroke-[1.5]" />
                    <h3 className="font-serif text-xl md:text-2xl text-neutral-900 uppercase tracking-wide font-medium">
                      {data.shuttleTitle || (isEn ? "AVLU34 Shuttle Hours" : "AVLU34 Ring Servis Saatleri")}
                    </h3>
                  </div>
                  {data.shuttleContent && (
                    <p className="text-sm text-neutral-500 font-sans font-light leading-relaxed mb-6">
                      {data.shuttleContent}
                    </p>
                  )}

                  {data.shuttleSchedule && data.shuttleSchedule.length > 0 ? (
                    <div className="border border-neutral-200 rounded-sm overflow-hidden bg-white">
                      <table className="w-full text-left font-sans text-sm divide-y divide-neutral-200">
                        <thead className="bg-neutral-50 font-semibold text-xs tracking-wider uppercase text-neutral-900">
                          <tr>
                            <th className="px-6 py-4">{isEn ? "BOLLUCA Departure" : "BOLLUCA Kalkış"}</th>
                            <th className="px-6 py-4">{isEn ? "AVLU34 Departure" : "AVLU34 Kalkış"}</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-neutral-200 text-neutral-700">
                          {data.shuttleSchedule.map((row, idx) => (
                            <tr key={idx} className="hover:bg-neutral-50/50 transition-colors">
                              <td className="px-6 py-3 font-mono">{row.fromBolluca}</td>
                              <td className="px-6 py-3 font-mono">{row.fromAvlu34}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  ) : (
                    <p className="text-neutral-500 font-sans font-light">
                      {isEn ? "Shuttle schedule details not configured." : "Müşteri servisi sefer saatleri eklenmemiş."}
                    </p>
                  )}
                </FadeIn>
              </div>

              {/* IETT Bus Lines & Havaist link */}
              <div className="lg:col-span-6 flex flex-col gap-10">
                
                {/* IETT Lines Table */}
                <div className="flex flex-col gap-6">
                  <FadeIn direction="up">
                    <div className="flex items-center gap-3 mb-2">
                      <MapPin className="w-6 h-6 text-neutral-900 stroke-[1.5]" />
                      <h3 className="font-serif text-xl md:text-2xl text-neutral-900 uppercase tracking-wide font-medium">
                        {data.iettTitle || (isEn ? "IETT Public Bus Lines" : "İETT Otobüs Hatları")}
                      </h3>
                    </div>
                    {data.iettContent && (
                      <p className="text-sm text-neutral-500 font-sans font-light leading-relaxed mb-6">
                        {data.iettContent}
                      </p>
                    )}

                    {data.iettLines && data.iettLines.length > 0 ? (
                      <div className="border border-neutral-200 rounded-sm overflow-hidden bg-white">
                        <table className="w-full text-left font-sans text-sm divide-y divide-neutral-200">
                          <thead className="bg-neutral-50 font-semibold text-xs tracking-wider uppercase text-neutral-900">
                            <tr>
                              <th className="px-6 py-4 w-1/4">{isEn ? "Line No" : "Hat Kodu"}</th>
                              <th className="px-6 py-4 w-3/4">{isEn ? "Route Name" : "Güzergah Adı"}</th>
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-neutral-200 text-neutral-700">
                            {data.iettLines.map((line, idx) => (
                              <tr key={idx} className="hover:bg-neutral-50/50 transition-colors">
                                <td className="px-6 py-3.5 font-semibold text-neutral-900">{line.lineNo}</td>
                                <td className="px-6 py-3.5 font-light">{line.routeName}</td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    ) : (
                      <p className="text-neutral-500 font-sans font-light">
                        {isEn ? "Bus lines details not configured." : "Otobüs hat listesi eklenmemiş."}
                      </p>
                    )}
                  </FadeIn>
                </div>

                {/* Havaist Airport Shuttle Link */}
                <FadeIn direction="up" delay={0.1}>
                  <div className="p-6 bg-neutral-50 border border-neutral-200 rounded-sm flex flex-col gap-4">
                    <div className="flex items-center gap-3">
                      <Plane className="w-6 h-6 text-neutral-900 stroke-[1.5]" />
                      <h4 className="font-serif text-lg text-neutral-900 uppercase tracking-wide font-medium">
                        {isEn ? "Havaist Airport Shuttles" : "Havaist Havalimanı Seferleri"}
                      </h4>
                    </div>
                    <p className="text-sm text-neutral-500 font-sans font-light leading-relaxed">
                      {isEn
                        ? "Havaist shuttles run directly between Istanbul Airport and Arnavutköy. You can check the live times on the official Havaist portal."
                        : "İstanbul Havalimanı ile Arnavutköy arasında ring seferi yapan Havaist durakları ve canlı saat bilgileri için resmi portalı inceleyebilirsiniz."}
                    </p>
                    <div>
                      <a
                        href={data.havaistUrl || "https://hava.ist/"}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-2 border border-black hover:bg-black hover:text-white text-black px-5 py-2.5 text-xs font-semibold uppercase tracking-widest transition-colors duration-300"
                      >
                        {isEn ? "HAVAIST PORTAL" : "HAVAIST SEFER SAATLERİ"}
                        <ExternalLink className="w-3.5 h-3.5" />
                      </a>
                    </div>
                  </div>
                </FadeIn>

              </div>
            </div>

            {/* Custom RichText / Driving Directions */}
            {data.transportContent && (
              <FadeIn direction="up" delay={0.1}>
                <div className="border-t border-neutral-200 pt-10 md:pt-14 text-neutral-600 leading-relaxed font-light max-w-none">
                  <RichText value={data.transportContent} />
                </div>
              </FadeIn>
            )}

            {/* Map Frame & Map Directions CTA Button */}
            {mapIframe && (
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 md:gap-12 items-center border-t border-neutral-200 pt-10 md:pt-14">
                <div className="lg:col-span-4 flex flex-col gap-4">
                  <h4 className="font-serif text-xl text-neutral-900 uppercase tracking-wide font-medium">
                    {isEn ? "Interactive Map" : "İnteraktif Harita"}
                  </h4>
                  <p className="text-sm text-neutral-500 font-sans font-light leading-relaxed">
                    {isEn
                      ? "View AVLU34 AVM location on Google Maps, plan your route and get navigation directions."
                      : "AVLU34 AVM konumunu harita üzerinde görün, yol tariflerini inceleyin ve navigasyon ile kolayca ulaşın."}
                  </p>
                  {googleMapsUrl && (
                    <div>
                      <a
                        href={googleMapsUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-block border border-black bg-black text-white hover:bg-neutral-900 px-8 py-3.5 text-xs font-semibold uppercase tracking-widest transition-colors duration-300"
                      >
                        {isEn ? "GET DIRECTIONS" : "YOL TARİFİ AL"}
                      </a>
                    </div>
                  )}
                </div>
                <div className="lg:col-span-8 w-full">
                  <div className="w-full aspect-[16/9] rounded-lg overflow-hidden shadow-sm border border-neutral-100 min-h-[300px]">
                    <div
                      className="w-full h-full [&_iframe]:w-full [&_iframe]:h-full [&_iframe]:border-0"
                      dangerouslySetInnerHTML={{ __html: mapIframe }}
                    />
                  </div>
                </div>
              </div>
            )}

          </div>
        </div>

      </div>
    </div>
  );
}
