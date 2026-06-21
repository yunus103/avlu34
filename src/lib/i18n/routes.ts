import { Locale, defaultLocale, isLocale } from "./config";

// Maps English public segments to Turkish internal segments
export const englishToTurkishRouteMap: Record<string, string> = {
  "stores": "magazalar",
  "dining": "yeme-icme",
  "cinema": "sinema",
  "offers": "kampanyalar",
  "events": "etkinlikler",
  "floor-plan": "kat-plani",
  "visit-plan": "ziyaret-plani",
  "about-us": "hakkimizda",
  "contact": "iletisim",
  "privacy": "kvkk",
  "search": "arama",
  // Categories
  "fashion": "giyim",
  "technology": "teknoloji",
  "kids": "cocuk",
  "health-beauty": "saglik-guzellik",
  "service": "hizmet",
  "entertainment": "eglence",
  "restaurant": "restoran",
  "fast-food": "fast-food",
  "coffee": "kahve",
  "dessert": "tatli",
};

// Maps Turkish internal segments to English public segments
export const turkishToEnglishRouteMap: Record<string, string> = {
  "magazalar": "stores",
  "yeme-icme": "dining",
  "sinema": "cinema",
  "kampanyalar": "offers",
  "etkinlikler": "events",
  "kat-plani": "floor-plan",
  "ziyaret-plani": "visit-plan",
  "hakkimizda": "about-us",
  "iletisim": "contact",
  "kvkk": "privacy",
  "arama": "search",
  // Categories
  "giyim": "fashion",
  "teknoloji": "technology",
  "cocuk": "kids",
  "saglik-guzellik": "health-beauty",
  "hizmet": "service",
  "eglence": "entertainment",
  "restoran": "restaurant",
  "fast-food": "fast-food",
  "kahve": "coffee",
  "tatli": "dessert",
};

/**
 * Maps a public request path to an internal Next.js App Router path.
 * Runs in Middleware. Must be fast and lightweight.
 */
export function getInternalPath(pathname: string): string {
  const segments = pathname.split("/").filter(Boolean);

  if (segments.length === 0) {
    return "/tr";
  }

  let locale: Locale = defaultLocale;
  let remainingSegments = segments;

  if (segments[0] === "en") {
    locale = "en";
    remainingSegments = segments.slice(1);
  } else if (segments[0] === "tr") {
    // Treat explicit /tr as default locale, remove tr prefix for public
    locale = "tr";
    remainingSegments = segments.slice(1);
  }

  // Rewrite remaining segments using the map
  const rewrittenSegments = remainingSegments.map((segment) => {
    if (locale === "en") {
      return englishToTurkishRouteMap[segment] || segment;
    }
    return segment;
  });

  return `/${locale}${rewrittenSegments.length > 0 ? "/" + rewrittenSegments.join("/") : ""}`;
}

/**
 * Generates a public URL for a given internal route and target locale.
 * Useful for Lang Switcher and Link components.
 */
export function getPublicPath(internalPath: string, targetLocale: Locale): string {
  if (!internalPath) {
    return "/";
  }
  // 1. Return immediately for external URLs, relative hashes, tel/mailto, etc.
  if (
    internalPath.startsWith("http://") ||
    internalPath.startsWith("https://") ||
    internalPath.startsWith("mailto:") ||
    internalPath.startsWith("tel:") ||
    internalPath.startsWith("#") ||
    internalPath.startsWith("javascript:")
  ) {
    return internalPath;
  }

  // 2. Normalize and check home page path
  const normalized = internalPath.replace(/\/+/g, "/").trim();
  if (normalized === "" || normalized === "/" || normalized === "/tr" || normalized === "/en") {
    return targetLocale === "en" ? "/en" : "/";
  }

  const segments = normalized.split("/").filter(Boolean);
  if (segments.length === 0) {
    return targetLocale === "en" ? "/en" : "/";
  }

  let remainingSegments = segments;

  if (isLocale(segments[0])) {
    remainingSegments = segments.slice(1);
  }

  if (remainingSegments.length === 0) {
    return targetLocale === "en" ? "/en" : "/";
  }

  // 3. Convert any incoming English segments to Turkish first (to standardize)
  const standardizedSegments = remainingSegments.map((segment) => {
    return englishToTurkishRouteMap[segment] || segment;
  });

  // 4. Translate internal Turkish segments to target language
  const translated = standardizedSegments.map((segment) => {
    if (targetLocale === "en") {
      return turkishToEnglishRouteMap[segment] || segment;
    }
    return segment;
  });

  const prefix = targetLocale === "en" ? "/en" : "";
  const publicPath = `${prefix}/${translated.join("/")}`;
  
  // Normalize double slashes or trailing slashes, keep single slash if empty
  return publicPath.replace(/\/+/g, "/") || "/";
}
