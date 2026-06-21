/* eslint-disable @typescript-eslint/no-explicit-any */
/**
 * Global TypeScript interfaces for AVLU34 Sanity documents and models.
 * Ensures strict typing, autocomplete, and zero warnings in IDE.
 */

export interface SanityImage {
  asset: {
    _ref?: string;
    _id?: string;
    url?: string;
    metadata?: {
      lqip?: string;
      dimensions?: {
        width: number;
        height: number;
        aspectRatio: number;
      };
    };
  };
  alt?: string;
  hotspot?: { x: number; y: number };
  crop?: { top: number; bottom: number; left: number; right: number };
}

export interface SanitySlug {
  current: string;
  _type?: "slug";
}

/**
 * Localized field structure at field-level
 */
export type LocalizedField<T> = {
  tr: T;
  en?: T;
} & Record<string, T | undefined>;

export interface SocialLink {
  platform: string;
  url: string;
}

export interface ContactInfo {
  phone?: string;
  email?: string;
  address?: string;
  whatsappNumber?: string;
  mapIframe?: string;
}

export interface SiteSettings {
  siteName: string;
  siteTagline?: string;
  workingHours?: string;
  logo?: SanityImage;
  logoHeight?: number;
  favicon?: { asset: { url: string } };
  contactInfo?: ContactInfo;
  socialLinks?: SocialLink[];
  gaId?: string;
  gtmId?: string;
  googleSearchConsoleId?: string;
  defaultSeo?: {
    metaTitle?: string;
    metaDescription?: string;
  };
  defaultOgImage?: SanityImage;
}

export interface NavItem {
  label: string | LocalizedField<string>;
  href: string;
  openInNewTab?: boolean;
  isMegaMenu?: boolean;
  subLinks?: NavItem[];
}

export interface Navigation {
  headerLinks?: NavItem[];
  footerLinks?: NavItem[];
}

export interface CtaLink {
  linkType: "internal" | "manual";
  manual?: string;
  internal?: {
    _type: string;
    slug?: string;
  };
}

export interface SeoSettings {
  metaTitle?: string;
  metaDescription?: string;
  metaKeywords?: string[];
  shareTitle?: string;
  shareDescription?: string;
  shareGraphic?: SanityImage;
}

export interface BasePage {
  heroTitle?: string;
  heroSubtitle?: string;
  heroImage?: SanityImage;
  seo?: SeoSettings;
}

/**
 * Dynamic AVM Document Types (Projected / Flat versions after query)
 */

export interface StoreCategory {
  _id: string;
  title: string; // Projected dynamically by query
  slug: SanitySlug;
}

export interface FoodCategory {
  _id: string;
  title: string; // Projected dynamically by query
  slug: SanitySlug;
}

export interface Store {
  _id: string;
  _createdAt?: string;
  _updatedAt?: string;
  title: string; // Brand names are unlocalized
  slug: SanitySlug;
  logo: SanityImage;
  shopType: "store" | "dining" | "both";
  storeCategory?: StoreCategory;
  foodCategory?: FoodCategory;
  floor: "zemin" | "kat1" | "kat2" | "kat3";
  description: string; // Projected dynamically
  workingHours: string; // Projected dynamically
  phone?: string;
  website?: string;
  socialLinks?: SocialLink[];
  seo?: SeoSettings;
}

export interface Campaign {
  _id: string;
  _createdAt?: string;
  _updatedAt?: string;
  title: string; // Projected
  slug: SanitySlug;
  image: SanityImage;
  startsAt: string;
  endsAt: string;
  isPublished: boolean;
  showOnHome: boolean;
  priority: number;
  relatedStores?: Store[];
  body: any[]; // Projected or handled client-side
  terms?: any[];
  seo?: SeoSettings;
}

export interface Event {
  _id: string;
  _createdAt?: string;
  _updatedAt?: string;
  title: string; // Projected
  slug: SanitySlug;
  image: SanityImage;
  startsAt: string;
  endsAt: string;
  time: string; // Projected
  location: string; // Projected
  isPublished: boolean;
  showOnHome: boolean;
  priority: number;
  body: any[];
  gallery?: SanityImage[];
  seo?: SeoSettings;
}

export interface HeroSlide {
  _id: string;
  title: string; // Projected
  subtitle?: string; // Projected
  tag?: string; // Projected
  desktopImage: SanityImage;
  mobileImage?: SanityImage;
  ctaLabel?: string; // Projected
  ctaLink?: string;
  startsAt?: string;
  endsAt?: string;
  isDefault: boolean;
  isPublished: boolean;
  priority: number;
}

/**
 * Singleton Page Types
 */
export interface AboutPage extends BasePage {
  pageTitle: string;
  pageSubtitle?: string;
  body?: any[];
  mainImage?: SanityImage;
}

export interface ContactPage extends BasePage {
  pageTitle: string;
  pageSubtitle?: string;
  formTitle?: string;
  successMessage?: string;
}

export interface CinemaPage extends BasePage {
  pageTitle: string;
  body?: any[];
  mainImage?: SanityImage;
  ticketUrl?: string;
}

export interface MallMapPage extends BasePage {
  pageTitle: string;
  description?: string;
  pdfFile?: { asset: { url: string } };
  mapImage?: SanityImage;
}

export interface VisitService {
  title: string; // Projected
  description?: string; // Projected
  icon?: SanityImage;
}

export interface VisitPlanPage extends BasePage {
  pageTitle: string;
  body?: any[];
  services?: VisitService[];
}

export interface KvkkPage extends BasePage {
  pageTitle: string;
  body?: any[];
}

export interface HomePage {
  aboutTitle?: string;
  aboutSubtitle?: string;
  aboutText?: any[];
  aboutImage?: SanityImage;
  aboutCtaLabel?: string;
  
  campaignsTitle?: string;
  campaignsSubtitle?: string;
  campaignsImage?: SanityImage;
  
  eventsTitle?: string;
  eventsSubtitle?: string;
  eventsImage?: SanityImage;
  
  storesTitle?: string;
  storesSubtitle?: string;
  
  diningTitle?: string;
  diningSubtitle?: string;
  
  cinemaTitle?: string;
  cinemaSubtitle?: string;
  
  mapTitle?: string;
  mapSubtitle?: string;
  
  visitTitle?: string;
  visitSubtitle?: string;
  seo?: SeoSettings;
}

export interface SearchItem {
  _id: string;
  _type: string;
  title: string;
  slug?: string;
  description?: string;
}

export interface SearchResults {
  stores: SearchItem[];
  dining: SearchItem[];
  campaigns: SearchItem[];
  events: SearchItem[];
  pages: {
    about?: SearchItem;
    visitPlan?: SearchItem;
    mallMap?: SearchItem;
  };
}
