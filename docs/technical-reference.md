# AVLU34 Teknik Referans ve Mimari Kılavuzu

Bu doküman, AVLU34 AVM web sitesinin teknik altyapısını, çoklu dil (i18n) yönlendirme mantığını, Sanity şema modellerini, GROQ sorgu yapısını ve hangi sayfanın hangi veriyi nasıl çektiğini detaylandırır. Projeye sonradan dahil olacak yazılımcılar veya yapay zeka ajanları için ana başvuru kaynağıdır.

---

## 1. Dizin ve Dosya Yapısı

Proje, Next.js 16 (App Router) ve Sanity CMS v3 üzerine kuruludur.

```txt
src/
├── app/
│   ├── (site)/
│   │   └── [locale]/                 # Tek internal route ağacı (tr, en)
│   │       ├── layout.tsx            # Global site layout (Header, Footer vb.)
│   │       ├── page.tsx              # Ana sayfa
│   │       ├── magazalar/            # Mağaza hub ve detay sayfaları
│   │       ├── yeme-icme/            # Yeme-içme hub ve kategori sayfaları
│   │       └── ...                   # Diğer statik/dinamik rotalar
│   ├── api/
│   │   ├── revalidate/route.ts       # Sanity webhook önbellek temizleyici
│   │   └── search/route.ts           # Dil duyarlı global arama API'si
│   ├── proxy.ts                      # Next.js 16 Proxy (Eski middleware.ts)
│   └── sitemap.ts                    # Dinamik SEO sitemap üretici
├── components/
│   ├── forms/                        # Form bileşenleri (İletişim)
│   ├── layout/                       # Header, Footer, PageHero vb.
│   └── ui/                           # RichText, SanityImage, Accordion vb.
├── lib/
│   ├── i18n/                         # i18n config, routes, localize helper'ları
│   └── seo.ts                        # buildMetadata ve layout data helper'ları
├── sanity/
│   ├── lib/                          # Sanity client, queries, image-url helper'ları
│   ├── schemaTypes/                  # Doküman ve singleton şemaları
│   └── structure.ts                  # Sanity Studio sidebar & filtre yapılandırması
└── types/
    └── index.ts                      # Tüm TypeScript tip tanımlamaları (Typed)
```

---

## 2. i18n ve URL Yönlendirme (Routing) Altyapısı

Vercel CPU limitlerini korumak ve bileşen tekrarını (duplicate components) engellemek amacıyla **tek bir internal route ağacı** (`[locale]`) ve **hafif bir proxy rewrite** mantığı kurulmuştur.

### A. Rotaların Çalışma Mantığı
Kullanıcı tarayıcıda bir adrese gittiğinde arka planda aşağıdaki dönüşümler gerçekleşir:

| Public URL (Kullanıcı Tarayıcısı) | Internal Path (Next.js Tarafı) | Locale | Açıklama |
| :--- | :--- | :--- | :--- |
| `/` | `/[locale]/page` | `tr` | Default dil, dışarıda `/tr` görünmez |
| `/magazalar` | `/[locale]/magazalar` | `tr` | Türkçe Mağazalar |
| `/en` | `/[locale]/page` | `en` | İngilizce Ana Sayfa |
| `/en/stores` | `/[locale]/magazalar` | `en` | İngilizce Mağazalar (Rewrite edilir) |
| `/en/offers` | `/[locale]/kampanyalar` | `en` | İngilizce Kampanyalar (Rewrite edilir) |

### B. Proxy (`src/proxy.ts`)
Next.js 16 standardına uygun olarak `middleware.ts` yerine `src/proxy.ts` dosyası içindeki `proxy` fonksiyonu kullanılır. Görevi sadece URL eşleştirmesidir. Ağır paketler, Sanity istekleri veya cookie manipülasyonu içermez.
- İsteğin başında `/en` varsa, yolu `[locale]/...` içindeki Türkçe klasör adına (örn: `/en/stores` -> `/en/magazalar`) çevirip `NextResponse.rewrite()` yapar.
- İsteğin başında dil yoksa, doğrudan `/tr/...` karşılığına rewrite eder.

### C. URL Çevirici (`src/lib/i18n/routes.ts`)
- **`turkishToEnglishRouteMap`**: Türkçe iç klasör isimlerini İngilizce public adreslerine eşler (örn: `magazalar` -> `stores`).
- **`getPublicPath(internalPath, targetLocale)`**: Dil değiştirici (Language Switcher) ve linkler için kullanılan ana fonksiyondur. Gönderilen internal yolu ve hedef dili alıp uygun public URL'yi üretir. Hem iç yolları hem de tarayıcı `pathname` değerini bidirectional (çift yönlü) olarak dönüştürebilir.

---

## 3. Veri Tabakası ve Çoklu Dil Projeksiyonu

Sanity üzerinde veriler **Field-Level Localization** (alan bazlı çeviri) formatında saklanır:
```json
{
  "title": {
    "tr": "Kampanya Başlığı",
    "en": "Campaign Title"
  }
}
```

### A. GROQ Projeksiyon Mantığı
Sayfa bileşenlerinin temiz ve sade kalması için, dille ilgili alanlar **veritabanı (GROQ) seviyesinde** çözümlenir (`coalesce` operatörü ile):
```groq
"title": coalesce(title[$locale], title.tr)
```
Bu sayede veritabanından gelen veri her zaman düz bir string olur ve bileşene doğrudan `title` olarak basılır.

### B. TypeScript Tipleri (`src/types/index.ts`)
Tüm modeller `src/types/index.ts` dosyasında katı şekilde tiplenmiştir. `any` tipi kesinlikle yasaktır.
- **`LocalizedField<T>`**: `tr` ve opsiyonel `en` dillerini tutan ham nesne tipi.
- **Projected Tipler**: Sayfaların çektiği düzleştirilmiş (flat) tiplerdir (örn: `Store`, `Campaign`, `Event` nesnelerindeki `title` doğrudan `string` tipindedir).

---

## 4. Sayfalar ve Çekilen Veriler (Page & Query Mapping)

Her sayfa, `cachedFetch` ile `src/sanity/lib/queries.ts` dosyasındaki ilgili GROQ sorgusunu tetikler. Tüm sorgular `{ locale }` parametresini almak zorundadır.

### 1. Ana Sayfa (`/[locale]/page.tsx`)
- **Kullanılan Sorgular**:
  - `homePageQuery`: Sayfa ayarları, başlıklar ve SEO ayarları.
  - `activeHeroSlidesQuery`: Ana sayfada gösterilecek aktif/default slaytlar.
- **Veri Dağılımı**:
  - Vitrin slaytları (`activeHeroSlidesQuery`): Tarih kontrolü yapılmış aktif slaytlar gösterilir.
  - Bölüm Başlıkları: Hakkımızda, Kampanyalar, Mağazalar vb. bölümlerin başlık ve alt yazıları Sanity'den çekilir.

### 2. Hakkımızda (`/[locale]/hakkimizda/page.tsx`)
- **Kullanılan Sorgu**: `aboutPageQuery`
- **İçerik**: Sayfa kahraman alanı (hero), ana başlık, zengin metin gövdesi (`body`) ve yan görsel.

### 3. İletişim (`/[locale]/iletisim/page.tsx`)
- **Kullanılan Sorgu**: `contactPageQuery`
- **İçerik**: İletişim bilgileri, hero alanları ve `ContactForm` bileşenine aktarılan `formTitle` ile `successMessage` verileri.

### 4. Mağazalar (`/[locale]/magazalar/page.tsx`)
- **Kullanılan Sorgular**:
  - `storeCategoriesQuery`: Filtreleme için kullanılacak mağaza kategorileri.
  - `storeListQuery`: `shopType` değeri `store` veya `both` olan tüm mağazaların listesi.

### 5. Mağaza Detay (`/[locale]/magazalar/[slug]/page.tsx`)
- **Kullanılan Sorgu**: `storeBySlugQuery`
- **İçerik**: Marka adı, logo, kat bilgisi, çalışma saatleri, telefon, web sitesi, sosyal medya linkleri ve o mağazaya bağlı aktif kampanyalar.

### 6. Yeme-İçme (`/[locale]/yeme-icme/page.tsx` & `[kategori]/page.tsx`)
- **Kullanılan Sorgular**:
  - `foodCategoriesQuery`: Yeme-içme alt kategorileri (Restoran, Kafe vb.).
  - `diningListQuery`: `shopType` değeri `dining` or `both` olan yerlerin listesi.

### 7. Kampanyalar (`/[locale]/kampanyalar/page.tsx` & `[slug]/page.tsx`)
- **Kullanılan Sorgular**:
  - `activeCampaignsQuery`: Tarihi güncel aktif kampanyalar.
  - `pastCampaignsQuery`: Süresi bitmiş kampanyalar.
  - `campaignBySlugQuery`: Kampanya detay metni, şartlar, görsel ve ilgili mağaza bağlantıları.

### 8. Etkinlikler (`/[locale]/etkinlikler/page.tsx` & `[slug]/page.tsx`)
- **Kullanılan Sorgular**:
  - `activeEventsQuery`: Gelecek/aktif etkinlikler.
  - `pastEventsQuery`: Süresi geçmiş etkinlikler.
  - `eventBySlugQuery`: Etkinlik detayları, saat, konum, gövde metni ve fotoğraf galerisi.

### 9. Sabit Sayfalar (`sinema`, `kat-plani`, `ziyaret-plani`, `kvkk`)
- **Kullanılan Sorgular**: Sırasıyla `cinemaPageQuery`, `mallMapPageQuery`, `visitPlanPageQuery`, `kvkkPageQuery`.
- **Özellikler**: Kat planı indirme dosyası (PDF), AVM hizmetleri listesi, sinema dış bilet alma bağlantısı (`ticketUrl`) bu singleton şemalardan beslenir.

---

## 5. API ve webhook Mekanizmaları

### A. Önbellek Temizleme (Revalidation API)
- **Dosya**: `src/app/api/revalidate/route.ts`
- **Çalışma Şekli**: Sanity Studio üzerinden bir içerik yayınlandığında (Publish) veya silindiğinde Sanity webhook buraya imza doğrulamalı (signature) bir POST isteği atar.
- **Tag Eşleştirmesi (`tagMap`)**:
  - `siteSettings` / `navigation` -> `layout` tag'ini temizler.
  - `homePage` -> `home` tag'ini temizler.
  - `store` -> `store` ve `sitemap` tag'lerini temizler.
  - `campaign` -> `campaign` ve `sitemap` tag'lerini temizler.
  - `event` -> `event` ve `sitemap` tag'lerini temizler.

### B. Global Arama API (Search API)
- **Dosya**: `src/app/api/search/route.ts`
- **Çalışma Şekli**: İstemci tarafındaki arama çubuğu bu apiye istek atar.
- **Sorgu Parametreleri**: `?q=giyim&locale=tr`
- **Arama Kapsamı**: `store` (mağazalar & yeme-içme), `campaign`, `event` ve sabit sayfaların içeriklerini (`title` ve `description`) GROQ match operatörüyle (`*giyim*`) tarar ve kategorize edilmiş JSON çıktısı döner.

---

## 6. SEO, Sitemap ve Alternates

- **Canonical URL'ler**: `src/lib/seo.ts` altındaki `buildMetadata` canonical link üretirken varsayılan dil Türkçe ise `/tr` prefix'ini URL'den temizler (Örn: `https://avlu34.com/magazalar`).
- **Hreflang (Alternates)**: İngilizce versiyonlarda sayfa meta etiketlerinde alternatif dil linki otomatik olarak basılır (Örn: `https://avlu34.com/en/stores`).
- **Sitemap (`src/app/sitemap.ts`)**: Sanity API'den gelen verileri okuyarak her 24 saatte bir güncellenen dinamik XML sitemap üretir. Türkçe ve İngilizce rotaların tamamını (dinamik slug'lar dahil) doğru sitemap standartlarında birleştirir.

---

## 7. SSS (Soru & Cevap) Yapısı ve inline `faqItem` Kullanımı

AVLU34 projesinde bağımsız bir SSS sayfası bulunmadığı için, Soru-Cevap verileri global bir doküman koleksiyonu yerine **ilgili sayfanın kendi doküman şeması içinde** inline bir dizi (array of objects) olarak tutulur.

- **Şema Tipi**: `faqItem` (Nesne Tipi)
- **Dosya**: `src/sanity/schemaTypes/objects/faqItem.ts`
- **Gövde Alanları**: Dil duyarlı `question` (`localizedString`) ve `answer` (`localizedText`).
- **Kullanım Yöntemi**: SSS listesi eklenmek istenen her singleton veya doküman şemasında `type: "array", of: [{ type: "faqItem" }]` alan tanımı kullanılır.
- **Arayüz Entegrasyonu**: Bu inline veriler, doğrudan `<FAQ>` arayüz bileşenine (`src/components/ui/FAQ.tsx`) aktarılır. Bileşen, arama motorlarının tarayabilmesi için gerekli olan `FAQPage` yapılandırılmış JSON-LD verisini sayfaya otomatik olarak enjekte eder ve Framer Motion animasyonları ile cevapları DOM'da koruyarak açılır/kapanır şekilde listeler.
