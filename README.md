<div align="right">
  <img src="https://img.shields.io/badge/English_EN-2563EB?style=for-the-badge" alt="English" />
  <a href="./README.tr.md">
    <img src="https://img.shields.io/badge/Türkçe_TR-374151?style=for-the-badge" alt="Türkçe" />
  </a>
</div>

# AVLU34 Shopping & Life Center — Official Web Platform

A modern, high-performance, and headless CMS-powered corporate web platform developed to elevate the visitor and discovery experience for AVLU34 Shopping & Life Center.

---

## 🚀 Architecture & Tech Stack

The platform is engineered with modern web standards, strict type safety, first-class SEO automation, edge-level caching, and frictionless content management.

| Layer | Technology | Description |
| :--- | :--- | :--- |
| **Framework & Core** | **Next.js 15+ (App Router)** | React 19, React Server Components (RSC), SSR and ISR architecture |
| **Content Management (CMS)** | **Sanity CMS v3** | Real-time Headless CMS, Field-level i18n, custom Studio structure |
| **Type Safety** | **TypeScript 5 & Zod** | Strict static types, runtime environment validation via `@t3-oss/env-nextjs` |
| **Design & Styling** | **Tailwind CSS v4** | `@plugin` configuration, utility-first architecture, `@base-ui/react` primitives |
| **Motion & Interaction** | **Framer Motion** | Fluid page transitions, micro-interactions, and accessible layout animations |
| **Caching & Performance** | **Edge ISR & Webhooks** | Sanity Webhook on-demand tag revalidation and time-based fallback |
| **Email & Communication** | **Nodemailer** | SMTP-backed secure contact form submission |

---

## 🏛️ Core Modules & Functional Capabilities

### 1. 🏬 Stores & Dining Directory (Shop & Dine)
- **Category-Driven Discovery:** Filterable directories for fashion, electronics, children, dining (restaurants, cafes, fast food, desserts), and services.
- **Rich Store Profile Pages:** Floor locations, opening hours, contact details, official web/social links, and active store-specific offers.

### 2. 🎁 Campaign & Event Engine (Smart Scheduling)
- **Time-Aware Availability:** Campaigns and events are evaluated at the database level (GROQ) using `startsAt` and `endsAt` date boundaries.
- **Automatic Lifecycle Transitions:** Expired campaigns and past events automatically transition out of featured sections and into historical archives, maintaining URL integrity and SEO ranking power.

### 3. 🎬 Cinema & Entertainment
- **Venue & Screen Experience:** AVLU34 cinema hall features, photos, seating configurations, and direct ticketing portal links.

### 4. 🗺️ Floor Plan & Visit Planning
- **Layout & Amenities:** Mall floor layouts, parking guide, accessibility features, baby care rooms, prayer rooms, and on-site customer services.
- **Directions & Concierge:** Navigation instructions, operating hours, and customer service contact points.

### 5. 🔍 Multilingual Global Search
- **GROQ-Powered Instant Search:** Real-time query execution across stores, dining spots, active promotions, events, and editorial pages with categorized results.

---

## 🌐 Internationalization (i18n) Architecture

The platform provides a dual-language (Turkish - English) infrastructure:

- **Field-Level Localization:** Content is stored within single document models (`title.tr`, `title.en`), avoiding document duplication in the CMS.
- **Database-Level Projection:** GROQ queries resolve localized strings at the query boundary using `coalesce(field[$locale], field.tr)`, delivering flat, clean data directly to React components.
- **Ultra-Lightweight Proxy Rewrite:** Handled via `src/proxy.ts`, seamlessly rewriting localized public URLs (`/magazalar` and `/en/stores`) into a unified internal route hierarchy (`[locale]`) with minimal CPU overhead.

---

## ⚡ Caching, Revalidation & SEO Engineering

### 1. On-Demand ISR (Cache Invalidation)
When content is published, updated, or removed in Sanity Studio, `src/app/api/revalidate` verifies the cryptographic webhook signature and purges specific cache tags instantly:
- `siteSettings` / `navigation` ➔ `layout`
- `store` / `campaign` / `event` ➔ respective entity tags and `sitemap`

### 2. Structured Data (JSON-LD) & Technical SEO
- **Automated Schema Generation:** `Organization`, `BreadcrumbList`, `FAQPage`, `Event`, and `Store` structured data injected dynamically per route.
- **Indexable FAQ Architecture:** FAQ accordions maintain answer content within the DOM (managed via height animations), ensuring 100% crawlability by search engines.
- **Dynamic Multilingual Sitemap:** `sitemap.ts` dynamically generates indexable URLs with bidirectional `hreflang` alternate references.
- **Clean Canonical URLs:** Canonical tags automatically omit default locale prefixes (`/tr`) to prevent duplicate indexing.

---

## 📂 Project Directory Structure

```txt
src/
├── app/
│   ├── (site)/
│   │   └── [locale]/                 # Unified internal route tree (tr, en)
│   │       ├── layout.tsx            # Global site shell (Header, Footer, Metadata)
│   │       ├── page.tsx              # Homepage showcase
│   │       ├── magazalar/            # Store directory and slug pages
│   │       ├── yeme-icme/            # Dining directory and category pages
│   │       ├── kampanyalar/          # Campaigns and detail pages
│   │       ├── etkinlikler/          # Events and detail pages
│   │       ├── sinema/               # Cinema venue page
│   │       ├── kat-plani/            # Floor plan and services
│   │       ├── ziyaret-plani/        # Visit planning, hours, transportation
│   │       ├── arama/                # Global search results
│   │       └── ...                   # Legal and corporate pages (About, KVKK, Contact)
│   ├── api/
│   │   ├── revalidate/               # Sanity webhook ISR handler
│   │   ├── search/                   # GROQ-based search endpoint
│   │   └── contact/                  # Contact form mailer endpoint
│   ├── proxy.ts                      # Ultra-lightweight route rewrite proxy
│   ├── sitemap.ts                    # Dynamic multilingual XML sitemap generator
│   └── robots.ts                     # Dynamic robots.txt configuration
├── components/
│   ├── forms/                        # Form components (ContactForm)
│   ├── home/                         # Homepage showcase sections
│   ├── layout/                       # Header, Footer, DirectoryTemplate, Navigation
│   ├── ui/                           # SanityImage, RichText, FAQ, Breadcrumbs, Dialog, etc.
│   └── seo/                          # JsonLd component
├── lib/
│   ├── i18n/                         # Locale routes, translation maps, and path helpers
│   ├── seo.ts                        # buildMetadata helper and SEO utilities
│   └── utils.ts                      # Shared utility functions
├── sanity/
│   ├── lib/                          # Sanity client, GROQ queries, Image URL builder
│   ├── schemaTypes/                  # Document, singleton, and object schema definitions
│   └── structure.ts                  # Sanity Studio sidebar with status filtering
└── types/
    └── index.ts                      # Centralized TypeScript interfaces
```

---

## 🛡️ Security & Engineering Standards

- **Zero `any` Policy:** Strict TypeScript definitions enforced across all models, props, and API layers.
- **Type-Safe Environment Variables:** Validated at build and runtime with `@t3-oss/env-nextjs` and Zod.
- **Image Performance:** Fully responsive image delivery through Sanity Image Pipeline and `<SanityImage>`, guaranteeing optimal LCP and zero Cumulative Layout Shift (CLS).
