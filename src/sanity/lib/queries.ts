import { groq } from "next-sanity";

// ─── Layout Query ─────────────────────────────────────────────────────────────
// Fetches header, footer, and site settings for the layout
export const layoutQuery = groq`{
  "settings": *[_type == "siteSettings"][0] {
    siteName, siteTagline,
    "workingHours": coalesce(workingHours[$locale], workingHours.tr),
    logo { asset->{ _id, url, metadata { lqip, dimensions } }, hotspot, crop },
    logoHeight,
    favicon { asset->{ _id, url } },
    contactInfo { phone, email, address, whatsappNumber, mapIframe },
    socialLinks[] { platform, url },
    gaId, gtmId, googleSearchConsoleId,
    defaultSeo { metaTitle, metaDescription },
    defaultOgImage { asset->{ _id, url, metadata { lqip, dimensions } } }
  },
  "navigation": *[_type == "navigation"][0] {
    headerLinks[] { 
      "label": coalesce(label[$locale], label.tr), 
      "href": coalesce(href[$locale], href.tr, href), 
      openInNewTab, 
      isMegaMenu,
      subLinks[] { 
        "label": coalesce(label[$locale], label.tr), 
        "href": coalesce(href[$locale], href.tr, href), 
        openInNewTab 
      } 
    },
    footerLinks[] { 
      "label": coalesce(label[$locale], label.tr), 
      "href": coalesce(href[$locale], href.tr, href), 
      openInNewTab, 
      subLinks[] { 
        "label": coalesce(label[$locale], label.tr), 
        "href": coalesce(href[$locale], href.tr, href), 
        openInNewTab 
      } 
    }
  }
}`;

// ─── Home Page Query ──────────────────────────────────────────────────────────
export const homePageQuery = groq`*[_type == "homePage"][0] {
  "aboutTag": coalesce(aboutTag[$locale], aboutTag.tr),
  "aboutTitle": coalesce(aboutTitle[$locale], aboutTitle.tr),
  "aboutText": coalesce(aboutText[$locale], aboutText.tr),
  aboutImage { asset->{ _id, url, metadata { lqip, dimensions } }, alt, hotspot, crop },
  "aboutCtaLabel": coalesce(aboutCtaLabel[$locale], aboutCtaLabel.tr),

  "campaignsTitle": coalesce(campaignsTitle[$locale], campaignsTitle.tr),
  "campaignsSubtitle": coalesce(campaignsSubtitle[$locale], campaignsSubtitle.tr),
  campaignsImage { asset->{ _id, url, metadata { lqip, dimensions } }, alt, hotspot, crop },
  "campaignsCtaLabel": coalesce(campaignsCtaLabel[$locale], campaignsCtaLabel.tr),

  "eventsTitle": coalesce(eventsTitle[$locale], eventsTitle.tr),
  "eventsSubtitle": coalesce(eventsSubtitle[$locale], eventsSubtitle.tr),
  eventsImage { asset->{ _id, url, metadata { lqip, dimensions } }, alt, hotspot, crop },
  "eventsCtaLabel": coalesce(eventsCtaLabel[$locale], eventsCtaLabel.tr),

  "storesTag": coalesce(storesTag[$locale], storesTag.tr),
  "storesTitle": coalesce(storesTitle[$locale], storesTitle.tr),
  storesImage { asset->{ _id, url, metadata { lqip, dimensions } }, alt, hotspot, crop },
  "storesCtaLabel": coalesce(storesCtaLabel[$locale], storesCtaLabel.tr),

  "diningTag": coalesce(diningTag[$locale], diningTag.tr),
  "diningTitle": coalesce(diningTitle[$locale], diningTitle.tr),
  diningImage { asset->{ _id, url, metadata { lqip, dimensions } }, alt, hotspot, crop },
  "diningCtaLabel": coalesce(diningCtaLabel[$locale], diningCtaLabel.tr),

  "cinemaTag": coalesce(cinemaTag[$locale], cinemaTag.tr),
  "cinemaTitle": coalesce(cinemaTitle[$locale], cinemaTitle.tr),
  "cinemaSubtitle": coalesce(cinemaSubtitle[$locale], cinemaSubtitle.tr),
  cinemaImage { asset->{ _id, url, metadata { lqip, dimensions } }, alt, hotspot, crop },
  "cinemaCtaLabel": coalesce(cinemaCtaLabel[$locale], cinemaCtaLabel.tr),

  "mapTitle": coalesce(mapTitle[$locale], mapTitle.tr),
  "mapSubtitle": coalesce(mapSubtitle[$locale], mapSubtitle.tr),

  "visitTag": coalesce(visitTag[$locale], visitTag.tr),
  "visitTitle": coalesce(visitTitle[$locale], visitTitle.tr),
  "visitSubtitle": coalesce(visitSubtitle[$locale], visitSubtitle.tr),
  "visitParking": coalesce(visitParking[$locale], visitParking.tr),
  visitImage { asset->{ _id, url, metadata { lqip, dimensions } }, alt, hotspot, crop },
  "visitCtaLabel": coalesce(visitCtaLabel[$locale], visitCtaLabel.tr),

  seo
}`;

// ─── Hero Slides Query ────────────────────────────────────────────────────────
export const activeHeroSlidesQuery = groq`*[_type == "heroSlide" && isPublished == true && (isDefault == true || (dateTime(startsAt) <= dateTime(now()) && dateTime(endsAt) >= dateTime(now())))] | order(isDefault asc, priority desc, _createdAt desc) {
  _id,
  "title": coalesce(title[$locale], title.tr),
  "subtitle": coalesce(subtitle[$locale], subtitle.tr),
  "tag": coalesce(tag[$locale], tag.tr),
  desktopImage { asset->{ _id, url, metadata { lqip, dimensions } }, alt, hotspot, crop },
  mobileImage { asset->{ _id, url, metadata { lqip, dimensions } }, alt, hotspot, crop },
  "ctaLabel": coalesce(ctaLabel[$locale], ctaLabel.tr),
  ctaLink,
  isDefault
}`;

// ─── About Page Query ─────────────────────────────────────────────────────────
export const aboutPageQuery = groq`*[_type == "aboutPage"][0] {
  "heroTitle": coalesce(heroTitle[$locale], heroTitle.tr),
  "heroSubtitle": coalesce(heroSubtitle[$locale], heroSubtitle.tr),
  heroImage { asset->{ _id, url, metadata { lqip, dimensions } }, alt, hotspot, crop },
  "pageTitle": coalesce(pageTitle[$locale], pageTitle.tr),
  "pageSubtitle": coalesce(pageSubtitle[$locale], pageSubtitle.tr),
  "body": coalesce(body[$locale], body.tr),
  mainImage { asset->{ _id, url, metadata { lqip, dimensions } }, alt, hotspot, crop },
  seo
}`;

// ─── Contact Page Query ───────────────────────────────────────────────────────
export const contactPageQuery = groq`*[_type == "contactPage"][0] {
  "heroTitle": coalesce(heroTitle[$locale], heroTitle.tr),
  "heroSubtitle": coalesce(heroSubtitle[$locale], heroSubtitle.tr),
  heroImage { asset->{ _id, url, metadata { lqip, dimensions } }, alt, hotspot, crop },
  "pageTitle": coalesce(pageTitle[$locale], pageTitle.tr),
  "pageSubtitle": coalesce(pageSubtitle[$locale], pageSubtitle.tr),
  "formTitle": coalesce(formTitle[$locale], formTitle.tr),
  "successMessage": coalesce(successMessage[$locale], successMessage.tr),
  seo
}`;

// ─── Cinema Page Query ────────────────────────────────────────────────────────
export const cinemaPageQuery = groq`*[_type == "cinemaPage"][0] {
  "heroTitle": coalesce(heroTitle[$locale], heroTitle.tr),
  "heroSubtitle": coalesce(heroSubtitle[$locale], heroSubtitle.tr),
  heroImage { asset->{ _id, url, metadata { lqip, dimensions } }, alt, hotspot, crop },
  "pageTitle": coalesce(pageTitle[$locale], pageTitle.tr),
  "body": coalesce(body[$locale], body.tr),
  mainImage { asset->{ _id, url, metadata { lqip, dimensions } }, alt, hotspot, crop },
  ticketUrl,
  seo
}`;

// ─── Mall Map Page Query ──────────────────────────────────────────────────────
export const mallMapPageQuery = groq`*[_type == "mallMapPage"][0] {
  "heroTitle": coalesce(heroTitle[$locale], heroTitle.tr),
  "heroSubtitle": coalesce(heroSubtitle[$locale], heroSubtitle.tr),
  heroImage { asset->{ _id, url, metadata { lqip, dimensions } }, alt, hotspot, crop },
  "pageTitle": coalesce(pageTitle[$locale], pageTitle.tr),
  "description": coalesce(description[$locale], description.tr),
  pdfFile { asset->{ url } },
  mapImage { asset->{ _id, url, metadata { lqip, dimensions } }, alt, hotspot, crop },
  seo
}`;

// ─── Visit Plan Page Query ────────────────────────────────────────────────────
export const visitPlanPageQuery = groq`*[_type == "visitPlanPage"][0] {
  "heroTitle": coalesce(heroTitle[$locale], heroTitle.tr),
  "heroSubtitle": coalesce(heroSubtitle[$locale], heroSubtitle.tr),
  heroImage { asset->{ _id, url, metadata { lqip, dimensions } }, alt, hotspot, crop },
  "pageTitle": coalesce(pageTitle[$locale], pageTitle.tr),
  "body": coalesce(body[$locale], body.tr),
  services[] {
    "title": coalesce(title[$locale], title.tr),
    "description": coalesce(description[$locale], description.tr),
    icon { asset->{ _id, url, metadata { lqip, dimensions } }, alt }
  },
  seo
}`;

// ─── KVKK Page Query ──────────────────────────────────────────────────────────
export const kvkkPageQuery = groq`*[_type == "kvkkPage"][0] {
  "heroTitle": coalesce(heroTitle[$locale], heroTitle.tr),
  "heroSubtitle": coalesce(heroSubtitle[$locale], heroSubtitle.tr),
  heroImage { asset->{ _id, url, metadata { lqip, dimensions } }, alt, hotspot, crop },
  "pageTitle": coalesce(pageTitle[$locale], pageTitle.tr),
  "body": coalesce(body[$locale], body.tr),
  seo
}`;

// ─── Store / Dining Categories Query ──────────────────────────────────────────
export const storeCategoriesQuery = groq`*[_type == "storeCategory"] | order(title.tr asc) {
  _id,
  "title": coalesce(title[$locale], title.tr),
  "slug": coalesce(slug[$locale].current, slug.tr.current)
}`;

export const foodCategoriesQuery = groq`*[_type == "foodCategory"] | order(title.tr asc) {
  _id,
  "title": coalesce(title[$locale], title.tr),
  "slug": coalesce(slug[$locale].current, slug.tr.current)
}`;

// ─── Store Queries ────────────────────────────────────────────────────────────
export const storeListQuery = groq`*[_type == "store" && shopType in ["store", "both"]] | order(title asc) {
  _id,
  title,
  slug,
  logo { asset->{ _id, url, metadata { lqip, dimensions } }, alt },
  floor,
  storeCategory-> {
    _id,
    "title": coalesce(title[$locale], title.tr),
    "slug": coalesce(slug[$locale].current, slug.tr.current)
  }
}`;

export const storeBySlugQuery = groq`*[_type == "store" && slug.current == $slug && shopType in ["store", "both"]][0] {
  _id,
  title,
  slug,
  logo { asset->{ _id, url, metadata { lqip, dimensions } }, alt, hotspot, crop },
  floor,
  "description": coalesce(description[$locale], description.tr),
  "workingHours": coalesce(workingHours[$locale], workingHours.tr),
  phone,
  website,
  socialLinks[] { platform, url },
  storeCategory-> {
    _id,
    "title": coalesce(title[$locale], title.tr),
    "slug": coalesce(slug[$locale].current, slug.tr.current)
  },
  seo
}`;

// ─── Dining Queries ───────────────────────────────────────────────────────────
export const diningListQuery = groq`*[_type == "store" && shopType in ["dining", "both"]] | order(title asc) {
  _id,
  title,
  slug,
  logo { asset->{ _id, url, metadata { lqip, dimensions } }, alt },
  floor,
  foodCategory-> {
    _id,
    "title": coalesce(title[$locale], title.tr),
    "slug": coalesce(slug[$locale].current, slug.tr.current)
  }
}`;

export const diningBySlugQuery = groq`*[_type == "store" && slug.current == $slug && shopType in ["dining", "both"]][0] {
  _id,
  title,
  slug,
  logo { asset->{ _id, url, metadata { lqip, dimensions } }, alt, hotspot, crop },
  floor,
  "description": coalesce(description[$locale], description.tr),
  "workingHours": coalesce(workingHours[$locale], workingHours.tr),
  phone,
  website,
  socialLinks[] { platform, url },
  foodCategory-> {
    _id,
    "title": coalesce(title[$locale], title.tr),
    "slug": coalesce(slug[$locale].current, slug.tr.current)
  },
  seo
}`;

// ─── Campaign Queries ─────────────────────────────────────────────────────────
export const activeCampaignsQuery = groq`*[_type == "campaign" && isPublished == true && (dateTime(startsAt) <= dateTime(now()) && dateTime(endsAt) >= dateTime(now()))] | order(priority desc, startsAt desc) {
  _id,
  "title": coalesce(title[$locale], title.tr),
  slug,
  image { asset->{ _id, url, metadata { lqip, dimensions } }, alt, hotspot, crop },
  startsAt,
  endsAt
}`;

export const pastCampaignsQuery = groq`*[_type == "campaign" && isPublished == true && dateTime(endsAt) < dateTime(now())] | order(endsAt desc) {
  _id,
  "title": coalesce(title[$locale], title.tr),
  slug,
  image { asset->{ _id, url, metadata { lqip, dimensions } }, alt, hotspot, crop },
  startsAt,
  endsAt
}`;

export const campaignBySlugQuery = groq`*[_type == "campaign" && slug.current == $slug][0] {
  _id,
  "title": coalesce(title[$locale], title.tr),
  slug,
  image { asset->{ _id, url, metadata { lqip, dimensions } }, alt, hotspot, crop },
  startsAt,
  endsAt,
  relatedStores[]-> {
    title,
    slug,
    logo { asset->{ _id, url } }
  },
  "body": coalesce(body[$locale], body.tr),
  "terms": coalesce(terms[$locale], terms.tr),
  seo
}`;

// ─── Event Queries ────────────────────────────────────────────────────────────
export const activeEventsQuery = groq`*[_type == "event" && isPublished == true && dateTime(endsAt) >= dateTime(now())] | order(priority desc, startsAt asc) {
  _id,
  "title": coalesce(title[$locale], title.tr),
  slug,
  image { asset->{ _id, url, metadata { lqip, dimensions } }, alt, hotspot, crop },
  startsAt,
  endsAt,
  "time": coalesce(time[$locale], time.tr),
  "location": coalesce(location[$locale], location.tr)
}`;

export const pastEventsQuery = groq`*[_type == "event" && isPublished == true && dateTime(endsAt) < dateTime(now())] | order(endsAt desc) {
  _id,
  "title": coalesce(title[$locale], title.tr),
  slug,
  image { asset->{ _id, url, metadata { lqip, dimensions } }, alt, hotspot, crop },
  startsAt,
  endsAt,
  "time": coalesce(time[$locale], time.tr),
  "location": coalesce(location[$locale], location.tr)
}`;

export const eventBySlugQuery = groq`*[_type == "event" && slug.current == $slug][0] {
  _id,
  "title": coalesce(title[$locale], title.tr),
  slug,
  image { asset->{ _id, url, metadata { lqip, dimensions } }, alt, hotspot, crop },
  startsAt,
  endsAt,
  "time": coalesce(time[$locale], time.tr),
  "location": coalesce(location[$locale], location.tr),
  "body": coalesce(body[$locale], body.tr),
  gallery[] { asset->{ _id, url, metadata { lqip, dimensions } }, alt },
  seo
}`;

// ─── Sitemap Query ────────────────────────────────────────────────────────────
export const allSlugsForSitemapQuery = groq`{
  "pages": {
    "home": *[_type == "homePage"][0] { _updatedAt, "noIndex": seo.noIndex },
    "about": *[_type == "aboutPage"][0] { _updatedAt, "noIndex": seo.noIndex },
    "contact": *[_type == "contactPage"][0] { _updatedAt, "noIndex": seo.noIndex },
    "cinema": *[_type == "cinemaPage"][0] { _updatedAt, "noIndex": seo.noIndex },
    "mallMap": *[_type == "mallMapPage"][0] { _updatedAt, "noIndex": seo.noIndex },
    "visitPlan": *[_type == "visitPlanPage"][0] { _updatedAt, "noIndex": seo.noIndex },
    "kvkk": *[_type == "kvkkPage"][0] { _updatedAt, "noIndex": seo.noIndex }
  },
  "stores": *[_type == "store" && defined(slug.current) && !(seo.noIndex == true)] { "slug": slug.current, _updatedAt },
  "campaigns": *[_type == "campaign" && defined(slug.current) && !(seo.noIndex == true)] { "slug": slug.current, _updatedAt },
  "events": *[_type == "event" && defined(slug.current) && !(seo.noIndex == true)] { "slug": slug.current, _updatedAt }
}`;

// ─── Static Parameters Queries (for Pre-rendering) ───────────────────────────
export const storeSlugsQuery = groq`*[_type == "store" && defined(slug.current)] { "slug": slug.current }`;
export const campaignSlugsQuery = groq`*[_type == "campaign" && defined(slug.current)] { "slug": slug.current }`;
export const eventSlugsQuery = groq`*[_type == "event" && defined(slug.current)] { "slug": slug.current }`;
export const storeCategorySlugsQuery = groq`*[_type == "storeCategory"] { "slugs": [slug.tr.current, slug.en.current] }`;
export const foodCategorySlugsQuery = groq`*[_type == "foodCategory"] { "slugs": [slug.tr.current, slug.en.current] }`;

// ─── Global Search Query ──────────────────────────────────────────────────────
export const globalSearchQuery = groq`{
  "stores": *[_type == "store" && shopType in ["store", "both"] && (title match $searchQuery || coalesce(description[$locale], description.tr) match $searchQuery)] | order(title asc) {
    _id,
    _type,
    title,
    "slug": slug.current,
    logo { asset->{ _id, url, metadata { lqip, dimensions } }, alt },
    floor,
    storeCategory-> {
      "title": coalesce(title[$locale], title.tr)
    },
    "description": coalesce(description[$locale], description.tr)
  },
  "dining": *[_type == "store" && shopType in ["dining", "both"] && (title match $searchQuery || coalesce(description[$locale], description.tr) match $searchQuery)] | order(title asc) {
    _id,
    _type,
    title,
    "slug": slug.current,
    logo { asset->{ _id, url, metadata { lqip, dimensions } }, alt },
    floor,
    foodCategory-> {
      "title": coalesce(title[$locale], title.tr)
    },
    "description": coalesce(description[$locale], description.tr)
  },
  "campaigns": *[_type == "campaign" && isPublished == true && (coalesce(title[$locale], title.tr) match $searchQuery || coalesce(body[$locale], body.tr) match $searchQuery)] | order(startsAt desc) {
    _id,
    _type,
    "title": coalesce(title[$locale], title.tr),
    "slug": slug.current,
    image { asset->{ _id, url, metadata { lqip, dimensions } }, alt },
    startsAt,
    endsAt,
    "description": coalesce(body[$locale], body.tr)
  },
  "events": *[_type == "event" && isPublished == true && (coalesce(title[$locale], title.tr) match $searchQuery || coalesce(body[$locale], body.tr) match $searchQuery)] | order(startsAt desc) {
    _id,
    _type,
    "title": coalesce(title[$locale], title.tr),
    "slug": slug.current,
    image { asset->{ _id, url, metadata { lqip, dimensions } }, alt },
    startsAt,
    endsAt,
    "time": coalesce(time[$locale], time.tr),
    "location": coalesce(location[$locale], location.tr),
    "description": coalesce(body[$locale], body.tr)
  },
  "storeCategories": *[_type == "storeCategory" && (coalesce(title[$locale], title.tr) match $searchQuery)] | order(coalesce(title[$locale], title.tr) asc) {
    _id,
    _type,
    "title": coalesce(title[$locale], title.tr),
    "slug": slug.tr.current
  },
  "foodCategories": *[_type == "foodCategory" && (coalesce(title[$locale], title.tr) match $searchQuery)] | order(coalesce(title[$locale], title.tr) asc) {
    _id,
    _type,
    "title": coalesce(title[$locale], title.tr),
    "slug": slug.tr.current
  },
  "pages": {
    "about": *[_type == "aboutPage" && (coalesce(pageTitle[$locale], pageTitle.tr) match $searchQuery || coalesce(body[$locale], body.tr) match $searchQuery)][0] {
      _type,
      "title": coalesce(pageTitle[$locale], pageTitle.tr),
      "description": coalesce(body[$locale], body.tr)
    },
    "visitPlan": *[_type == "visitPlanPage" && (coalesce(pageTitle[$locale], pageTitle.tr) match $searchQuery || coalesce(body[$locale], body.tr) match $searchQuery)][0] {
      _type,
      "title": coalesce(pageTitle[$locale], pageTitle.tr),
      "description": coalesce(body[$locale], body.tr)
    },
    "mallMap": *[_type == "mallMapPage" && (coalesce(pageTitle[$locale], pageTitle.tr) match $searchQuery || coalesce(description[$locale], description.tr) match $searchQuery)][0] {
      _type,
      "title": coalesce(pageTitle[$locale], pageTitle.tr),
      "description": coalesce(description[$locale], description.tr)
    }
  }
}`;
