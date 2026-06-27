"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { RiArrowRightSLine, RiHome4Line } from "react-icons/ri";
import { JsonLd, breadcrumbListJsonLd } from "@/components/seo/JsonLd";

type BreadcrumbItem = {
  label: string;
  href: string;
  active?: boolean;
};

const routeLabels: Record<string, { tr: string; en: string }> = {
  magazalar: { tr: "Mağazalar", en: "Stores" },
  stores: { tr: "Mağazalar", en: "Stores" },
  "yeme-icme": { tr: "Yeme-İçme", en: "Dining" },
  dining: { tr: "Yeme-İçme", en: "Dining" },
  sinema: { tr: "Sinema", en: "Cinema" },
  cinema: { tr: "Sinema", en: "Cinema" },
  kampanyalar: { tr: "Kampanyalar", en: "Offers" },
  offers: { tr: "Kampanyalar", en: "Offers" },
  etkinlikler: { tr: "Etkinlikler", en: "Events" },
  events: { tr: "Etkinlikler", en: "Events" },
  "kat-plani": { tr: "Kat Planı", en: "Floor Plan" },
  "floor-plan": { tr: "Kat Planı", en: "Floor Plan" },
  "ziyaret-plani": { tr: "Ziyaret Planı", en: "Visit Plan" },
  "visit-plan": { tr: "Ziyaret Planı", en: "Visit Plan" },
  hakkimizda: { tr: "Hakkımızda", en: "About Us" },
  "about-us": { tr: "Hakkımızda", en: "About Us" },
  iletisim: { tr: "İletişim", en: "Contact" },
  contact: { tr: "İletişim", en: "Contact" },
  kvkk: { tr: "KVKK", en: "Privacy" },
  privacy: { tr: "KVKK", en: "Privacy" },
  arama: { tr: "Arama", en: "Search" },
  search: { tr: "Arama", en: "Search" },

  // Categories
  giyim: { tr: "Giyim", en: "Fashion" },
  fashion: { tr: "Giyim", en: "Fashion" },
  teknoloji: { tr: "Teknoloji", en: "Technology" },
  technology: { tr: "Teknoloji", en: "Technology" },
  cocuk: { tr: "Çocuk", en: "Kids" },
  kids: { tr: "Çocuk", en: "Kids" },
  "saglik-guzellik": { tr: "Sağlık & Güzellik", en: "Health & Beauty" },
  "health-beauty": { tr: "Sağlık & Güzellik", en: "Health & Beauty" },
  hizmet: { tr: "Hizmet", en: "Service" },
  service: { tr: "Hizmet", en: "Service" },
  eglence: { tr: "Eğlence", en: "Entertainment" },
  entertainment: { tr: "Eğlence", en: "Entertainment" },
  restoran: { tr: "Restoran", en: "Restaurant" },
  restaurant: { tr: "Restoran", en: "Restaurant" },
  "fast-food": { tr: "Fast Food", en: "Fast Food" },
  kahve: { tr: "Kahve", en: "Coffee" },
  coffee: { tr: "Kahve", en: "Coffee" },
  tatli: { tr: "Tatlı", en: "Dessert" },
  dessert: { tr: "Tatlı", en: "Dessert" },
};

export function Breadcrumbs({ items, className = "" }: { items?: BreadcrumbItem[], className?: string }) {
  const pathname = usePathname();
  const isEn = pathname.startsWith("/en") || pathname === "/en";
  const homeHref = isEn ? "/en" : "/";
  
  // Eğer dışarıdan liste gelmezse current path'ten üret
  const generateBreadcrumbs = () => {
    const prefix = isEn ? "/en" : "";
    const rawPaths = pathname.split("/").filter((path) => path !== "" && path !== "tr" && path !== "en");
    
    const breadcrumbs: BreadcrumbItem[] = rawPaths.map((segment, index) => {
      const href = `${prefix}/${rawPaths.slice(0, index + 1).join("/")}`;
      
      const matched = routeLabels[segment.toLowerCase()];
      const label = matched 
        ? (isEn ? matched.en : matched.tr)
        : segment.replace(/-/g, " ").replace(/\b\w/g, (l) => l.toUpperCase());
        
      return { label, href, active: index === rawPaths.length - 1 };
    });
    return breadcrumbs;
  };

  const breadcrumbs = items || generateBreadcrumbs();

  // Filter out any home page items to prevent duplicate rendering with the static home icon
  const visibleBreadcrumbs = breadcrumbs.filter(
    (crumb) =>
      crumb.href !== "/" &&
      crumb.href !== "/en" &&
      crumb.href !== "/tr" &&
      crumb.label.toLowerCase() !== "home" &&
      crumb.label.toLowerCase() !== "ana sayfa"
  );

  // Guarantee that the home page item is at Position 1 in the SEO JSON-LD schema
  const jsonLdBreadcrumbs = (() => {
    const hasHome = breadcrumbs.some(
      (crumb) =>
        crumb.href === "/" ||
        crumb.href === "/en" ||
        crumb.href === "/tr" ||
        crumb.label.toLowerCase() === "home" ||
        crumb.label.toLowerCase() === "ana sayfa"
    );
    if (hasHome) {
      return breadcrumbs.map((crumb) => {
        const isHomeCrumb =
          crumb.href === "/" ||
          crumb.href === "/en" ||
          crumb.href === "/tr" ||
          crumb.label.toLowerCase() === "home" ||
          crumb.label.toLowerCase() === "ana sayfa";
        return isHomeCrumb
          ? { ...crumb, label: isEn ? "Home" : "Ana Sayfa", href: homeHref }
          : crumb;
      });
    }
    return [
      { label: isEn ? "Home" : "Ana Sayfa", href: homeHref },
      ...breadcrumbs,
    ];
  })();

  if (pathname === "/" || pathname === "/tr" || pathname === "/en") return null;

  return (
    <>
      <JsonLd data={breadcrumbListJsonLd(jsonLdBreadcrumbs)} />
      <nav aria-label="Breadcrumb" className={`flex items-center text-xs tracking-wider uppercase text-muted-foreground ${className}`}>
        <ol className="flex items-center gap-1.5 flex-wrap">
          <li>
            <Link 
              href={homeHref} 
              className="flex items-center hover:text-primary transition-colors gap-1 text-[11px]"
              title={isEn ? "Home" : "Ana Sayfa"}
            >
              <RiHome4Line size={14} />
              <span className="sr-only">{isEn ? "Home" : "Ana Sayfa"}</span>
            </Link>
          </li>
          
          {visibleBreadcrumbs.map((crumb, i) => (
            <li key={i} className="flex items-center gap-1.5">
              <RiArrowRightSLine size={12} className="text-muted-foreground/30 shrink-0" />
              {crumb.active ? (
                <span className="font-semibold text-foreground truncate max-w-[200px] text-[11px]">
                  {crumb.label}
                </span>
              ) : (
                <Link
                  href={crumb.href}
                  className="hover:text-primary transition-colors truncate max-w-[150px] text-[11px]"
                >
                  {crumb.label}
                </Link>
              )}
            </li>
          ))}
        </ol>
      </nav>
    </>
  );
}
