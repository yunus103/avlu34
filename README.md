# AVLU34 Alışveriş ve Yaşam Merkezi — Dijital Platformu

AVLU34 Alışveriş ve Yaşam Merkezi'nin ziyaretçi deneyimini en üst seviyeye taşımak amacıyla geliştirilmiş modern, yüksek performanslı ve headless içerik yönetimli kurumsal web platformu.

---

## 🚀 Mimari ve Teknoloji Yığını

Platform; modern web standartları, üstün arama motoru optimizasyonu (SEO), yüksek erişilebilirlik ve içerik yönetim kolaylığı hedeflenerek tasarlanmıştır.

| Katman | Teknoloji | Açıklama |
| :--- | :--- | :--- |
| **Framework & Core** | **Next.js 15+ (App Router)** | React 19, Server Components (RSC), SSR ve ISR mimarisi |
| **İçerik Yönetimi (CMS)** | **Sanity CMS v3** | Gerçek zamanlı Headless CMS, Field-level i18n, Özelleştirilmiş Studio |
| **Tip Güvenliği** | **TypeScript 5 & Zod** | Katı tip kontrolü, `@t3-oss/env-nextjs` ile runtime ortam değişkeni doğrulaması |
| **Tasarım & UI** | **Tailwind CSS v4** | `@plugin` mimarisi, modern utility-first stil sistemi, `@base-ui/react` tabanlı UI bileşenleri |
| **Etkileşim & Animasyon** | **Framer Motion** | Akıcı sayfa geçişleri, mikro etkileşimler ve animasyonlar |
| **Önbellek & Performans** | **Edge ISR & Webhooks** | Sanity Webhook tabanlı anında tag revalidation ve zaman ayarlı sayfa yenileme |
| **İletişim & Servisler** | **Nodemailer** | SMTP tabanlı güvenli iletişim formu entegrasyonu |

---

## 🏛️ Temel Modüller ve Fonksiyonel Özellikler

### 1. 🏬 Mağazalar ve Yeme-İçme Rehberi
- **Kategori Bazlı Keşif:** Giyim, teknoloji, çocuk, yeme-içme (restoran, kafe, fast food) vb. kategorilere göre filtrelenebilir dizin.
- **Detaylı Mağaza Sayfaları:** Kat konumu, çalışma saatleri, doğrudan iletişim bilgileri, web/sosyal medya bağlantıları ve mağazaya özel aktif kampanyalar.

### 2. 🎁 Kampanya ve Etkinlik Yönetimi (Akıllı Zamanlama)
- **Tarih Duyarlı Görünürlük:** Kampanyalar ve etkinlikler Sanity üzerinden tanımlanan başlangıç/bitiş tarihleri (`startsAt`, `endsAt`) ile GROQ seviyesinde filtrelenir.
- **Otomatik Statü Geçişi:** Süresi geçen içerikler ana sayfadan ve aktif vitrinlerden otomatik olarak ayrıştırılarak geçmiş arşivine aktarılır, URL bütünlüğü ve SEO değeri korunur.

### 3. 🎬 Sinema & Eğlence Modülü
- **Deneyim ve Salon Rehberi:** AVLU34 sinema salonu olanakları, fotoğraflar, koltuk konfigürasyonları ve güncel vizyon/bilet yönlendirmeleri.

### 4. 🗺️ Kat ve Ziyaret Planı
- **Kroki ve Ulaşım Bilgileri:** AVM kat krokileri, otopark, engelli erişimi, bebek bakım odaları, mescit ve AVM hizmetleri.
- **Yol Tarifi & İletişim:** Konum, çalışma saatleri ve müşteri hizmetleri erişim noktaları.

### 5. 🔍 Dil Duyarlı Global Arama Motoru
- **GROQ Tabanlı Hızlı Arama:** Mağazalar, yeme-içme noktaları, kampanyalar, etkinlikler ve kurumsal sayfalar arasında anlık eşleşme ve kategorize sonuç listeleme.

---

## 🌐 Çoklu Dil (i18n) Mimarisi

Platform, yerel ve yabancı ziyaretçiler için çoklu dil (Türkçe - İngilizce) desteğine tam uyumlu olarak inşa edilmiştir:

- **Field-Level Localization:** İçerikler Sanity üzerinde tek doküman altında `title.tr` ve `title.en` şeklinde yönetilir.
- **Veritabanı Seviyesinde Dil Çözümleme:** GROQ sorguları `coalesce(field[$locale], field.tr)` mantığı ile dili doğrudan veritabanı aşamasında projekte eder, istemciye yalın veri sunar.
- **Ultra-Hafif URL Rewrite (Proxy):** `src/proxy.ts` üzerinden yürütülen rota eşleme mekanizmasıyla CPU yükü oluşturmadan SEO uyumlu temiz URL'ler (`/magazalar` ve `/en/stores`) tek bir internal route ağacına (`[locale]`) bağlanır.

---

## ⚡ Önbellekleme, Revalidation ve SEO Standartları

### 1. Anında İçerik Güncelleme (On-Demand ISR)
Sanity Studio üzerinde bir içerik yayımlandığında, güncellendiğinde veya silindiğinde `src/app/api/revalidate` webhook uç noktası tetiklenerek ilgili cache tag'leri anında geçersiz kılınır:
- `siteSettings` / `navigation` ➔ `layout`
- `store` / `campaign` / `event` ➔ ilgili içerik ve `sitemap` etiketleri

### 2. Yapılandırılmış Veriler (JSON-LD) ve Teknik SEO
- **Otomatik Schema Enjeksiyonu:** `Organization`, `BreadcrumbList`, `FAQPage`, `Event` ve `Store` yapılandırılmış verileri ilgili sayfalarda otomatik olarak üretilir.
- **Kusursuz İndekslenme (FAQ Kuralı):** Sıkça sorulan sorular arayüzde kapalı olsa dahi DOM üzerinde muhafaza edilerek arama motoru botlarının içeriği tam okuması sağlanır.
- **Dinamik Çok Dilli Sitemap:** `sitemap.ts` tüm dinamik rotaları, mağazaları, etkinlikleri ve alternatif dil eşleşmelerini (hreflang) otomatik derler.
- **Temiz Canonical URL'ler:** Varsayılan dilde dil prefix'i arındırılarak temiz URL yapısı oluşturulur.

---

## 📂 Proje Dizin Yapısı

```txt
src/
├── app/
│   ├── (site)/
│   │   └── [locale]/                 # Rota ağacı (tr, en)
│   │       ├── layout.tsx            # Global site layout (Header, Footer, Metadata)
│   │       ├── page.tsx              # Ana sayfa vitrini
│   │       ├── magazalar/            # Mağazalar dizini ve detay sayfaları
│   │       ├── yeme-icme/            # Yeme-içme dizini ve kategori sayfaları
│   │       ├── kampanyalar/          # Kampanyalar ve detay sayfaları
│   │       ├── etkinlikler/          # Etkinlikler ve detay sayfaları
│   │       ├── sinema/               # Sinema sayfası
│   │       ├── kat-plani/            # Kat planı ve hizmetler
│   │       ├── ziyaret-plani/        # Ulaşım, otopark, çalışma saatleri
│   │       ├── arama/                # Global arama sonuç sayfası
│   │       └── ...                   # Kurumsal ve yasal sayfalar (Hakkımızda, KVKK, İletişim)
│   ├── api/
│   │   ├── revalidate/               # Sanity webhook ISR temizleyici
│   │   ├── search/                   # GROQ tabanlı global arama endpoint'i
│   │   └── contact/                  # İletişim formu mail gönderim endpoint'i
│   ├── proxy.ts                      # Ultra-hafif URL rewrite katmanı
│   ├── sitemap.ts                    # Dinamik çok dilli XML sitemap
│   └── robots.ts                     # Dinamik robots.txt yapılandırması
├── components/
│   ├── forms/                        # Form bileşenleri
│   ├── home/                         # Ana sayfa bölüm bileşenleri
│   ├── layout/                       # Header, Footer, DirectoryTemplate, Navigasyon
│   ├── ui/                           # SanityImage, RichText, FAQ, Breadcrumbs, Dialog vb.
│   └── seo/                          # JsonLd bileşeni
├── lib/
│   ├── i18n/                         # Çoklu dil route eşleşmeleri ve yardımcılar
│   ├── seo.ts                        # buildMetadata ve SEO yardımcı fonksiyonları
│   └── utils.ts                      # Ortak yardımcı fonksiyonlar
├── sanity/
│   ├── lib/                          # Sanity Client, GROQ sorguları, Image URL builder
│   ├── schemaTypes/                  # Doküman ve singleton şemaları
│   └── structure.ts                  # Sanity Studio özel menü ve durum filtreleme yapısı
└── types/
    └── index.ts                      # Merkezi TypeScript tip tanımlamaları
```

---

## 🛡️ Güvenlik ve Kod Standartları

- Tüm veri modelleri ve bileşen propları katı TypeScript tipleri ile tanımlanmıştır (`any` kullanımı engellenmiştir).
- Hassas anahtarlar ve ortam değişkenleri `@t3-oss/env-nextjs` ile runtime/build aşamasında doğrulanır.
- Görseller, LCP optimizasyonu ve layout shift'i engellemek amacıyla Sanity Image Pipeline ve responsive `<SanityImage>` bileşeni üzerinden işlenir.

