"use client";

import Link from "next/link";
import { useState, useEffect, useRef } from "react";
import { usePathname, useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { SanityImage } from "@/components/ui/SanityImage";
import { Button } from "@/components/ui/button";
import { RiMenu3Line, RiCloseLine, RiArrowDownSLine, RiSearchLine } from "react-icons/ri";
import { cn } from "@/lib/utils";

import { SiteSettings, Navigation, NavItem } from "@/types";
import { Locale } from "@/lib/i18n/config";
import { localize } from "@/lib/i18n/localize";
import { getPublicPath } from "@/lib/i18n/routes";

// Utility function to split subLinks array into columns
function chunkArray<T>(arr: T[], size: number): T[][] {
  const chunks: T[][] = [];
  for (let i = 0; i < arr.length; i += size) {
    chunks.push(arr.slice(i, i + size));
  }
  return chunks;
}

export function Header({ 
  settings, 
  navigation, 
  locale 
}: { 
  settings: SiteSettings; 
  navigation: Navigation; 
  locale: Locale 
}) {
  const pathname = usePathname();
  const router = useRouter();
  const [menuOpen, setMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<any>(null);
  const [searchLoading, setSearchLoading] = useState(false);
  const [activeMegaMenu, setActiveMegaMenu] = useState<string | null>(null);
  const [expandedMobileMenu, setExpandedMobileMenu] = useState<string | null>(null);

  const searchInputRef = useRef<HTMLInputElement>(null);
  const searchContainerRef = useRef<HTMLDivElement>(null);
  const searchButtonRef = useRef<HTMLButtonElement>(null);
  const links: NavItem[] = navigation?.headerLinks || [];

  // Handle click outside to close search
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        searchOpen &&
        searchContainerRef.current &&
        !searchContainerRef.current.contains(event.target as Node) &&
        searchButtonRef.current &&
        !searchButtonRef.current.contains(event.target as Node)
      ) {
        setSearchOpen(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [searchOpen]);

  // Close menus on pathname change
  useEffect(() => {
    setMenuOpen(false);
    setSearchOpen(false);
    setActiveMegaMenu(null);
    setExpandedMobileMenu(null);
    setSearchQuery("");
  }, [pathname]);

  // Prevent background scroll when mobile menu is open
  useEffect(() => {
    if (menuOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [menuOpen]);

  // Focus input when search is opened
  useEffect(() => {
    if (searchOpen) {
      setTimeout(() => {
        searchInputRef.current?.focus();
      }, 100);
    }
  }, [searchOpen]);

  // Debounced search fetching
  useEffect(() => {
    if (!searchQuery.trim()) {
      setSearchResults(null);
      return;
    }
    const delayDebounce = setTimeout(async () => {
      setSearchLoading(true);
      try {
        const res = await fetch(`/api/search?q=${encodeURIComponent(searchQuery)}&locale=${locale}`);
        const data = await res.json();
        setSearchResults(data);
      } catch (e) {
        console.error("Search fetch error:", e);
      } finally {
        setSearchLoading(false);
      }
    }, 300);

    return () => clearTimeout(delayDebounce);
  }, [searchQuery, locale]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;
    setSearchOpen(false);
    router.push(getPublicPath(`/arama?q=${encodeURIComponent(searchQuery)}`, locale));
  };

  const isActive = (item: NavItem) => {
    const resolvedPath = getPublicPath(item.href, locale);
    if (resolvedPath === "/" || resolvedPath === "/en") {
      return pathname === resolvedPath;
    }
    return pathname.startsWith(resolvedPath);
  };

  return (
    <header className="sticky top-0 z-40 w-full bg-white border-b border-neutral-200 shadow-sm">
      {/* ─── Katman 1: Üst Bar (Top Bar) ─── */}
      <div className="border-b border-neutral-100 bg-white relative">
        <div className="container mx-auto flex h-20 items-center justify-between px-4 relative">
          
          {/* Sol: Dil Switcher */}
          <div className="flex items-center">
            <Link 
              href={locale === "tr" ? getPublicPath(pathname, "en") : getPublicPath(pathname, "tr")}
              className="text-xs md:text-sm font-sans font-bold tracking-widest text-neutral-500 hover:text-black transition-colors uppercase"
            >
              {locale === "tr" ? "EN" : "TR"}
            </Link>
          </div>

          {/* Orta: Logo (Esnek, kesilmeyen düzen) */}
          <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 flex items-center justify-center h-full">
            <Link href={getPublicPath("/", locale)} className="flex items-center group h-full py-1">
              {settings?.logo ? (
                <SanityImage
                  image={settings.logo}
                  width={1200}
                  height={551}
                  fit="max"
                  className="h-full w-auto object-contain transition-all duration-200 group-hover:scale-[1.02]"
                  priority
                />
              ) : (
                <span className="font-serif font-bold text-xl md:text-2xl tracking-[0.2em] uppercase leading-none text-black">
                  {settings?.siteName}
                </span>
              )}
            </Link>
          </div>

          {/* Sağ: Arama & Yol Tarifi */}
          <div className="flex items-center gap-4">
            {/* Arama Butonu */}
            <button 
              ref={searchButtonRef}
              onClick={() => {
                setSearchOpen(!searchOpen);
                setMenuOpen(false);
              }}
              className="flex items-center gap-1.5 text-xs md:text-sm font-sans font-semibold tracking-widest uppercase text-neutral-500 hover:text-black transition-colors cursor-pointer"
              aria-label="Aramayı aç/kapat"
            >
              <RiSearchLine size={16} />
              <span className="hidden sm:inline">{locale === "en" ? "Search" : "Arama"}</span>
            </button>

            {/* Yol Tarifi / WhatsApp Butonu */}
            <Link 
              href={getPublicPath("/ziyaret-plani", locale)} 
              className="hidden sm:inline-block border border-black px-4 py-2 text-[10px] md:text-xs font-sans font-semibold tracking-widest uppercase text-black hover:bg-black hover:text-white transition-colors duration-300 rounded-none"
            >
              {locale === "en" ? "Visit Plan" : "Ziyaret Planı"}
            </Link>

            {/* Mobil Hamburger Butonu */}
            <Button 
              variant="ghost" 
              size="icon" 
              onClick={() => {
                setMenuOpen(true);
                setSearchOpen(false);
              }} 
              className="md:hidden text-black hover:bg-neutral-50"
              aria-label="Menüyü aç"
            >
              <RiMenu3Line size={22} />
            </Button>
          </div>
        </div>
      </div>

      {/* ─── Katman 2: Ana Menü (Main Navigation) ─── */}
      <div className="hidden md:block border-b border-neutral-200 bg-white">
        <div className="container mx-auto px-4">
          <nav className="flex items-center justify-center h-12 gap-8">
            {links.map((item, i) => {
              const active = isActive(item);
              const hasSub = item.subLinks && item.subLinks.length > 0;
              const isMega = item.isMegaMenu || hasSub;

              return (
                <div 
                  key={i} 
                  className="h-full flex items-center"
                  onMouseEnter={() => isMega && setActiveMegaMenu(item.label as string)}
                  onMouseLeave={() => isMega && setActiveMegaMenu(null)}
                >
                  <Link
                    href={getPublicPath(item.href, locale)}
                    target={item.openInNewTab ? "_blank" : undefined}
                    rel={item.openInNewTab ? "noopener noreferrer" : undefined}
                    className={cn(
                      "text-[11px] font-sans font-bold tracking-widest uppercase transition-colors py-3 border-b-2",
                      active 
                        ? "border-black text-black" 
                        : "border-transparent text-neutral-600 hover:text-black hover:border-neutral-300"
                    )}
                  >
                    {localize(item.label, locale)}
                  </Link>

                  {/* ─── Mega Menü Paneli ─── */}
                  {isMega && item.subLinks && (
                    <AnimatePresence>
                      {activeMegaMenu === item.label && (
                        <motion.div
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: 10 }}
                          transition={{ duration: 0.15, ease: "easeOut" }}
                          className="absolute left-0 top-full w-full bg-white border-b border-neutral-200 py-10 shadow-lg z-30"
                        >
                          <div className="container mx-auto px-4 max-w-5xl">
                            {/* SubLinks chunked into columns */}
                            <div className="grid grid-cols-4 gap-8">
                              {chunkArray(item.subLinks, Math.ceil(item.subLinks.length / 4)).map((chunk, colIdx) => (
                                <div key={colIdx} className="flex flex-col gap-4">
                                  {chunk.map((sub, subIdx) => (
                                    <Link
                                      key={subIdx}
                                      href={getPublicPath(sub.href, locale)}
                                      target={sub.openInNewTab ? "_blank" : undefined}
                                      rel={sub.openInNewTab ? "noopener noreferrer" : undefined}
                                      className="text-[11px] font-sans font-semibold uppercase tracking-wider text-neutral-500 hover:text-black transition-colors"
                                    >
                                      {localize(sub.label, locale)}
                                    </Link>
                                  ))}
                                </div>
                              ))}
                            </div>
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  )}
                </div>
              );
            })}
          </nav>
        </div>
      </div>

      {/* ─── Arama Overlay Barı ─── */}
      <AnimatePresence>
        {searchOpen && (
          <motion.div
            ref={searchContainerRef}
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.25, ease: "easeInOut" }}
            className="absolute left-0 top-full w-full bg-white border-b border-neutral-200 shadow-md overflow-hidden z-25"
          >
            <div className="container mx-auto px-4 py-6 max-w-3xl">
              <form onSubmit={handleSearchSubmit} className="flex gap-2">
                <input
                  ref={searchInputRef}
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder={locale === "en" ? "TYPE TO SEARCH..." : "ARAMAK İÇİN YAZIN..."}
                  className="flex-1 bg-neutral-50 border border-neutral-300 px-4 py-3 text-xs font-sans tracking-widest uppercase focus:border-black focus:outline-none rounded-none text-black"
                />
                <button
                  type="submit"
                  className="bg-black text-white px-6 text-xs font-sans font-bold tracking-widest uppercase hover:bg-neutral-800 transition-colors rounded-none cursor-pointer"
                >
                  {locale === "en" ? "SEARCH" : "ARA"}
                </button>
              </form>

              {/* Instant Search Results */}
              <AnimatePresence>
                {(searchLoading || searchResults) && (
                  <motion.div 
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="mt-6 border-t border-neutral-100 pt-4"
                  >
                    {searchLoading && (
                      <p className="text-xs text-neutral-500 font-sans tracking-wider text-center py-4">
                        {locale === "en" ? "Searching..." : "Aranıyor..."}
                      </p>
                    )}

                    {!searchLoading && searchResults && (() => {
                      const hasAnyResults = 
                        (searchResults.stores?.length || 0) > 0 ||
                        (searchResults.dining?.length || 0) > 0 ||
                        (searchResults.campaigns?.length || 0) > 0 ||
                        (searchResults.events?.length || 0) > 0 ||
                        (searchResults.storeCategories?.length || 0) > 0 ||
                        (searchResults.foodCategories?.length || 0) > 0 ||
                        (searchResults.pages && Object.values(searchResults.pages).some((p) => p !== null));

                      return (
                        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6 text-left max-h-[350px] overflow-y-auto pr-2">
                          {/* Stores & Dining */}
                          {((searchResults.stores?.length || 0) > 0 || (searchResults.dining?.length || 0) > 0) && (
                            <div className="flex flex-col gap-2">
                              <h4 className="text-[10px] font-sans font-bold tracking-widest text-neutral-400 uppercase border-b pb-1">
                                {locale === "en" ? "Brands & Dining" : "Markalar & Restoranlar"}
                              </h4>
                              <div className="flex flex-col gap-1.5">
                                {[...(searchResults.stores || []), ...(searchResults.dining || [])].slice(0, 5).map((item: any, idx: number) => (
                                  <Link 
                                    key={idx}
                                    href={getPublicPath(item._type === "store" ? `/magazalar/${item.slug}` : `/yeme-icme/${item.slug}`, locale)}
                                    className="text-xs font-sans font-semibold uppercase text-neutral-700 hover:text-black transition-colors"
                                  >
                                    {item.title}
                                  </Link>
                                ))}
                              </div>
                            </div>
                          )}

                          {/* Campaigns & Events */}
                          {((searchResults.campaigns?.length || 0) > 0 || (searchResults.events?.length || 0) > 0) && (
                            <div className="flex flex-col gap-2">
                              <h4 className="text-[10px] font-sans font-bold tracking-widest text-neutral-400 uppercase border-b pb-1">
                                {locale === "en" ? "Offers & Events" : "Kampanyalar & Etkinlikler"}
                              </h4>
                              <div className="flex flex-col gap-1.5">
                                {[...(searchResults.campaigns || []), ...(searchResults.events || [])].slice(0, 5).map((item: any, idx: number) => (
                                  <Link 
                                    key={idx}
                                    href={getPublicPath(item._type === "campaign" ? `/kampanyalar/${item.slug}` : `/etkinlikler/${item.slug}`, locale)}
                                    className="text-xs font-sans font-semibold uppercase text-neutral-700 hover:text-black transition-colors"
                                  >
                                    {item.title}
                                  </Link>
                                ))}
                              </div>
                            </div>
                          )}

                          {/* Categories */}
                          {((searchResults.storeCategories?.length || 0) > 0 || (searchResults.foodCategories?.length || 0) > 0) && (
                            <div className="flex flex-col gap-2">
                              <h4 className="text-[10px] font-sans font-bold tracking-widest text-neutral-400 uppercase border-b pb-1">
                                {locale === "en" ? "Categories" : "Kategoriler"}
                              </h4>
                              <div className="flex flex-col gap-1.5">
                                {searchResults.storeCategories?.slice(0, 3).map((item: any, idx: number) => (
                                  <Link 
                                    key={`sc-${idx}`}
                                    href={getPublicPath(`/magazalar/${item.slug}`, locale)}
                                    className="text-xs font-sans font-semibold uppercase text-neutral-700 hover:text-black transition-colors"
                                  >
                                    {item.title}
                                  </Link>
                                ))}
                                {searchResults.foodCategories?.slice(0, 3).map((item: any, idx: number) => (
                                  <Link 
                                    key={`fc-${idx}`}
                                    href={getPublicPath(`/yeme-icme/${item.slug}`, locale)}
                                    className="text-xs font-sans font-semibold uppercase text-neutral-700 hover:text-black transition-colors"
                                  >
                                    {item.title}
                                  </Link>
                                ))}
                              </div>
                            </div>
                          )}

                          {/* Static Pages */}
                          {searchResults.pages && Object.keys(searchResults.pages).length > 0 && (
                            <div className="flex flex-col gap-2">
                              <h4 className="text-[10px] font-sans font-bold tracking-widest text-neutral-400 uppercase border-b pb-1">
                                {locale === "en" ? "Information" : "Bilgi"}
                              </h4>
                              <div className="flex flex-col gap-1.5">
                                {Object.entries(searchResults.pages).map(([key, page]: [string, any], idx: number) => {
                                  if (!page) return null;
                                  const pagePathMap: Record<string, string> = {
                                    about: "/hakkimizda",
                                    visitPlan: "/ziyaret-plani",
                                    mallMap: "/kat-plani",
                                  };
                                  return (
                                    <Link 
                                      key={idx}
                                      href={getPublicPath(pagePathMap[key] || "/", locale)}
                                      className="text-xs font-sans font-semibold uppercase text-neutral-700 hover:text-black transition-colors"
                                    >
                                      {page.title}
                                    </Link>
                                  );
                                })}
                              </div>
                            </div>
                          )}

                          {/* No results placeholder */}
                          {!hasAnyResults && (
                            <p className="col-span-full text-xs text-neutral-500 font-sans tracking-wider text-center py-4">
                              {locale === "en" ? "No results match your query." : "Aramanızla eşleşen sonuç bulunamadı."}
                            </p>
                          )}
                        </div>
                      );
                    })()}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ─── Mobil Menü: Tam Ekran (Full-screen Overlay) ─── */}
      <AnimatePresence>
        {menuOpen && (
          <motion.div
            initial={{ opacity: 0, x: "100%" }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: "100%" }}
            transition={{ type: "tween", duration: 0.3 }}
            className="fixed inset-0 z-50 h-screen w-screen bg-white flex flex-col overflow-hidden"
          >
            {/* Mobil Header: Kapat Butonu & Dil */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-neutral-100 shrink-0 bg-white">
              <Link 
                href={locale === "tr" ? getPublicPath(pathname, "en") : getPublicPath(pathname, "tr")}
                onClick={() => setMenuOpen(false)}
                className="text-xs font-sans font-bold tracking-widest text-neutral-500 hover:text-black transition-colors uppercase"
              >
                {locale === "tr" ? "English (EN)" : "Türkçe (TR)"}
              </Link>
              <Button 
                variant="ghost" 
                size="icon" 
                onClick={() => setMenuOpen(false)} 
                className="text-black hover:bg-neutral-50 rounded-none"
                aria-label="Menüyü kapat"
              >
                <RiCloseLine size={26} />
              </Button>
            </div>

            {/* Mobil Linkler (Scrollable Area) */}
            <div className="flex-1 overflow-y-auto px-6 py-4 pb-32 scrollbar-none">
              <nav className="flex flex-col mt-4 divide-y divide-neutral-100">
                {links.map((item, i) => {
                  const active = isActive(item);
                  const hasSub = item.subLinks && item.subLinks.length > 0;
                  const isExpanded = expandedMobileMenu === item.label;

                  return (
                    <div key={i} className="py-3.5 flex flex-col">
                      <div className="flex items-center justify-between">
                        <Link
                          href={getPublicPath(item.href, locale)}
                          target={item.openInNewTab ? "_blank" : undefined}
                          rel={item.openInNewTab ? "noopener noreferrer" : undefined}
                          onClick={() => setMenuOpen(false)}
                          className={cn(
                            "text-base font-serif tracking-widest uppercase font-bold py-1",
                            active ? "text-black" : "text-neutral-700"
                          )}
                        >
                          {localize(item.label, locale)}
                        </Link>

                        {hasSub && (
                          <button
                            onClick={() => {
                              setExpandedMobileMenu(isExpanded ? null : (item.label as string));
                            }}
                            className="p-2 -mr-2 text-neutral-500 hover:text-black transition-colors cursor-pointer"
                            aria-label={isExpanded ? "Collapse section" : "Expand section"}
                          >
                            <RiArrowDownSLine 
                              size={20} 
                              className={cn(
                                "transition-transform duration-300",
                                isExpanded ? "rotate-180 text-black" : ""
                              )}
                            />
                          </button>
                        )}
                      </div>

                      {/* Sub Links under Mobile Accordion style */}
                      {hasSub && (
                        <motion.div
                          initial={false}
                          animate={{ height: isExpanded ? "auto" : 0, opacity: isExpanded ? 1 : 0 }}
                          className="overflow-hidden"
                          transition={{ duration: 0.25, ease: "easeInOut" }}
                        >
                          <div className="flex flex-col gap-3 pl-4 mt-2.5 mb-1 border-l border-neutral-200">
                            {/* View All Option */}
                            <Link
                              href={getPublicPath(item.href, locale)}
                              onClick={() => setMenuOpen(false)}
                              className="text-[10px] font-sans font-bold uppercase tracking-wider text-black hover:underline"
                            >
                              {locale === "en" ? "View All" : "Tümünü Gör"}
                            </Link>

                            {item.subLinks!.map((sub, j) => (
                              <Link
                                key={j}
                                href={getPublicPath(sub.href, locale)}
                                target={sub.openInNewTab ? "_blank" : undefined}
                                rel={sub.openInNewTab ? "noopener noreferrer" : undefined}
                                onClick={() => setMenuOpen(false)}
                                className="text-[10px] font-sans font-semibold uppercase tracking-wider text-neutral-500 hover:text-black transition-colors"
                              >
                                {localize(sub.label, locale)}
                              </Link>
                            ))}
                          </div>
                        </motion.div>
                      )}
                    </div>
                  );
                })}
              </nav>
            </div>

            {/* Mobil Hızlı Bilgiler / Footer (Fixed at the bottom) */}
            <div className="absolute bottom-0 left-0 right-0 p-6 bg-white/90 backdrop-blur-md border-t border-neutral-100 z-10 shrink-0">
              <Link 
                href={getPublicPath("/ziyaret-plani", locale)} 
                onClick={() => setMenuOpen(false)}
                className="block w-full text-center border border-black py-3 text-xs font-sans font-semibold tracking-widest uppercase text-black hover:bg-black hover:text-white transition-colors duration-300"
              >
                {locale === "en" ? "Visit Plan" : "Ziyaret Planı"}
              </Link>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
