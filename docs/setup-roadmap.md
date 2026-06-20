# AVLU34 Kurulum Roadmap

Bu doküman, AVLU34 projesinde tasarım ve final UI geliştirmesine geçmeden önce yapılacak teknik kurulum adımlarını tanımlar. Amaç; route yapısını, Sanity panelini, i18n altyapısını, cache/revalidation mantığını ve placeholder sayfaları kontrollü şekilde oturtmaktır.

Her adım ayrı ele alınmalı, mümkün olduğunca küçük tutulmalı ve adım tamamlandığında commit alınmalıdır. Bir adım bitmeden sonraki adıma geçilmemelidir.

## Genel İlkeler

- Her public içerik Sanity'den yönetilebilir olmalıdır.
- /.agents klasorundeki kurallar gecerlidir.
- reusable componentler /components klasoru icinde olmalidir, hazirda zaten bircok component tanimli, oradaki componentler de kontrol edilip gerekirse projeye entegre edilmeli, gereksiz yere yeni component yaratilmamali.
- Hardcoded içerik sadece fallback, empty state veya teknik label olarak kullanılabilir.
- Yeni sayfa ekleniyorsa Sanity karşılığı, query, type, SEO ve revalidation düşünülmelidir.
- Eski kurumsal boilerplate refleksiyle `hizmetler`, `projeler`, `blog` ana akışları genişletilmemelidir.
- İngilizce altyapısı baştan kurulacak ama İngilizce public dil switcher ilk yayında aktif olmak zorunda değildir.
- Middleware sadece locale rewrite için ultra-hafif kullanılacaktır; içerik/veri işi middleware'e taşınmayacaktır.
- Her adım sonunda `npm run build` şart değildir, ama schema/route/type gibi kırılma riski yüksek adımlardan sonra build alınmalıdır.

## 0. Başlangıç Audit'i

Amaç: Mevcut boilerplate'in hangi parçalarının AVLU34 yapısıyla çakışacağını görmek.

Yapılacaklar:

- Mevcut `src/app/(site)` route yapısını çıkar.
- Mevcut Sanity schema tiplerini listele.
- `homePage`, `servicesPage`, `projectsPage`, `blogPage` gibi eski singleton'ların nerelerde kullanıldığını tespit et.
- `service`, `project`, `blogPost` collection'larının query, sitemap, JSON-LD ve route bağlantılarını belirle.
- Root `[slug]` blog route'unun yeni AVM route'larıyla çakışma riskini kontrol et.
- `src/app/sitemap.ts`, `src/sanity/lib/queries.ts`, `src/app/api/revalidate/route.ts`, `src/sanity/structure.ts` dosyalarındaki eski bağımlılıkları not et.

Beklenen çıktı:

- Değiştirilecek/kaldırılacak route ve schema listesi.
- Riskli çakışmaların kısa notu.

Commit:

```txt
chore: audit avlu34 setup scope
```

## 1. Doküman ve Rules Düzeni

Amaç: Proje karar dokümanlarını repo içinde düzenli ve agentlar tarafından erişilebilir hale getirmek.

Yapılacaklar:

- `docs/` klasörünü kullan.
- Site planı `docs/site-plan.md` altında tutulur.
- Kurulum roadmap'i `docs/setup-roadmap.md` altında tutulur.
- `.agents/rules/boilerplate-rules.md` içindeki referanslar `docs/site-plan.md` yolunu göstermelidir.
- Dokümanlar gitignore'a eklenmemelidir; repo ile birlikte takip edilmelidir.

Commit:

```txt
docs: organize avlu34 planning documents
```

## 2. i18n Foundation Kurulumu

Amaç: Tek locale tabanlı route altyapısını tasarım başlamadan önce kurmak.

Karar:

- Tek internal route ağacı kullanılacak: `src/app/(site)/[locale]/...`
- Desteklenen locale'ler: `tr`, `en`
- Türkçe default locale olacak.
- Public Türkçe URL'lerde `/tr` görünmeyecek.
- İngilizce public URL'ler `/en/...` şeklinde olacak.
- Middleware sadece ultra-hafif rewrite için kullanılacak.
- Redirect kullanılmayacak; `NextResponse.rewrite()` kullanılacak.
- Automatic language detection yapılmayacak.
- Cookie/localStorage tabanlı redirect yapılmayacak.

Yapılacaklar:

- `src/lib/i18n/config.ts` oluştur:
  - `locales`
  - `defaultLocale`
  - `type Locale`
  - `isLocale`
  - `assertLocale` veya `getValidLocale`
- `src/lib/i18n/dictionary.ts` oluştur:
  - Sabit UI metinleri için `tr` ve `en` dictionary.
  - Örn: `search`, `filter`, `viewDetails`, `expired`, `noResults`, `allStores`.
- `src/lib/i18n/routes.ts` oluştur:
  - Public route map.
  - Internal route map.
  - Dil switcher link helper'ları.
  - Canonical URL helper'ları.
- `src/lib/i18n/localize.ts` oluştur:
  - Sanity field-level alanları okumak için helper.
  - Fallback davranışı için kontrollü fonksiyonlar.
- `middleware.ts` oluştur veya güncelle:
  - Sadece string/path rewrite yap.
  - API, `_next`, image/static, favicon, robots, sitemap, uzantılı dosyalar ve Studio path'leri dışarıda kalsın.
  - `/en/...` isteklerini route map'e göre internal `/en/...` rotasına rewrite et.
  - Prefixsiz istekleri internal `/tr/...` rotasına rewrite et.
  - Middleware içinde fetch, Sanity client, ağır paket, cookie kararı veya Accept-Language parsing kullanma.

Örnek davranış:

```txt
/                -> internal /tr
/magazalar       -> internal /tr/magazalar
/kampanyalar     -> internal /tr/kampanyalar
/en              -> internal /en
/en/stores       -> internal /en/magazalar
/en/offers       -> internal /en/kampanyalar
```

Not:

- Internal dosya segmentleri Türkçe kalabilir.
- Public İngilizce segmentleri route map üzerinden internal Türkçe segmentlere rewrite edilebilir.
- Bu yapı component tekrarını engeller.

Commit:

```txt
feat: add lightweight locale routing foundation
```

## 3. Route Ağacını Tek `[locale]` Altına Taşıma

Amaç: Public sayfaları locale parametresi ile çalışacak ortak yapıya geçirmek.

Kurulacak internal route iskeleti:

```txt
src/app/(site)/[locale]/page.tsx
src/app/(site)/[locale]/magazalar/page.tsx
src/app/(site)/[locale]/magazalar/[slug]/page.tsx
src/app/(site)/[locale]/yeme-icme/page.tsx
src/app/(site)/[locale]/yeme-icme/[kategori]/page.tsx
src/app/(site)/[locale]/sinema/page.tsx
src/app/(site)/[locale]/kampanyalar/page.tsx
src/app/(site)/[locale]/kampanyalar/[slug]/page.tsx
src/app/(site)/[locale]/etkinlikler/page.tsx
src/app/(site)/[locale]/etkinlikler/[slug]/page.tsx
src/app/(site)/[locale]/kat-plani/page.tsx
src/app/(site)/[locale]/ziyaret-plani/page.tsx
src/app/(site)/[locale]/hakkimizda/page.tsx
src/app/(site)/[locale]/iletisim/page.tsx
src/app/(site)/[locale]/kvkk/page.tsx
```

Yapılacaklar:

- Mevcut public layout'un locale parametresi ile çalışmasını sağla.
- Header/footer query'leri locale'e göre içerik döndürecek şekilde hazırlanmalı.
- Sayfalar ilk etapta sade placeholder render edebilir, ancak başlık/içerik Sanity'den yönetilebilir olmalıdır.
- Locale geçersizse `notFound()` döndür.
- İngilizce içerik hazır değilse language switcher gizli kalabilir.

Commit:

```txt
feat: scaffold locale based avlu34 routes
```

## 4. Eski Public Boilerplate Akışlarını Pasifleştirme

Amaç: Eski kurumsal route'ların yeni AVM yapısıyla çakışmasını engellemek.

Yapılacaklar:

- Eski `/hizmetler` public route'unu kaldır ve sanity baglantilarini/querylerini temizle.
- Eski `/projeler` public route'unu kaldır ve sanity baglantilarini/querylerini temizle.
- Eski root `[slug]` blog detay route'unu kaldır ve sanity baglantilarini/querylerini temizle.
- Blog kalkacak.
- Eski service/project/blog query'leri yeni sayfalarda kullanılmamalıdır.
- Eski JSON-LD türleri yeni AVM sayfalarına yanlış basılmamalıdır.

Commit:

```txt
refactor: remove legacy corporate public flows
```

## 5. Sanity Schema Temelini Kurma

Amaç: AVLU34 içerik modelini panelde yönetilebilir hale getirmek.

Eklenecek/güncellenecek document type'lar:

```txt
store
storeCategory
foodCategory
campaign
event
heroSlide
```

Eklenecek/güncellenecek singleton'lar:

```txt
homePage
cinemaPage
mallMapPage
visitPlanPage
aboutPage
contactPage
kvkkPage
```

Yapılacaklar:

- Tüm müşteri-editable text alanlarında field-level i18n yapısı planla.
- Türkçe alanlar zorunlu, İngilizce alanlar opsiyonel olsun.
- Görseller SanityImage componentini kullanacak.
- Kampanya, etkinlik ve hero içeriklerinde `startsAt`, `endsAt`, `isPublished`, `priority` gibi planlama alanları olsun.
- Mağaza zorunlu alanları: ad, slug, logo/görsel, kategori, kat, kısa açıklama, çalışma saatleri.
- Mağaza opsiyonel alanları: telefon, web sitesi, sosyal medya, aktif kampanya ilişkileri.
- `endsAt`, `startsAt` tarihinden önce olamaz validation'ı eklenmelidir.

Commit:

```txt
feat: add avlu34 sanity schemas
```

## 6. Sanity Studio Sidebar ve Filtreli Listeler

Amaç: Paneli müşteri için anlaşılır hale getirmek.

Panel ana grupları:

```txt
Global Ayarlar
Sabit Sayfalar
Ana Sayfa Vitrini
Mağazalar
Yeme İçme
Kampanyalar
Etkinlikler
Sinema
Kat Planı
Ziyaret Planı
```

Filtreli listeler:

```txt
Kampanyalar
  Aktif Kampanyalar
  Planlanan Kampanyalar
  Geçmiş Kampanyalar
  Tüm Kampanyalar

Etkinlikler
  Yaklaşan / Aktif Etkinlikler
  Geçmiş Etkinlikler
  Tüm Etkinlikler

Ana Sayfa Vitrini
  Aktif Slaytlar
  Planlanan Slaytlar
  Süresi Geçen Slaytlar
  Varsayılan Slaytlar
  Tüm Slaytlar
```

Yapılacaklar:

- `src/sanity/structure.ts` AVLU34 yapısına göre düzenlenir.
- Eski service/project/blog listeleri ana panelde öne çıkarılmaz.
- Singleton sayfalar `Sabit Sayfalar` altında yer alır.
- Alan title/description'ları Türkçe ve anlaşılır olur.

Commit:

```txt
feat: organize sanity studio for avlu34
```

## 7. GROQ Query ve TypeScript Type Katmanı

Amaç: Yeni schema'ların typed ve cache-aware query katmanını kurmak.

Yapılacaklar:

- `src/sanity/lib/queries.ts` içinde AVLU34 query'leri oluştur.
- GROQ projection ile mümkün olduğunda sadece aktif locale'in alanları çekilir:

```groq
"title": coalesce(title[$locale], title.tr)
```

- Query'ler sadece ihtiyaç duyulan alanları çeker.
- `src/types/index.ts` AVLU34 modelleriyle güncellenir.
- Localized field type'ları merkezi tanımlanır.
- Dynamic slug query'lerinde locale'e göre slug aranır.

Commit:

```txt
feat: add avlu34 queries and types
```

## 8. Revalidation ve Cache Yapılandırması

Amaç: İçerik güncellemeleri ve tarih bazlı görünürlük güvenilir çalışsın.

Yapılacaklar:

- `src/app/api/revalidate/route.ts` içindeki `tagMap` yeni schema'larla güncellenir.
- Query'lerde doğru `next.tags` kullanılır.
- Zaman bazlı sayfalarda `revalidate = 3600` kullanılır:
  - Ana sayfa
  - Kampanyalar
  - Etkinlikler
  - Hero section ana sayfada
- Daha statik sayfalar webhook/tag revalidation ağırlıklı çalışır.
- Cron eklenmez.
- Middleware içinde cache veya fetch işi yapılmaz.

Commit:

```txt
feat: configure avlu34 revalidation and cache tags
```

## 9. Sitemap, Canonical ve Metadata

Amaç: Yeni route yapısı SEO açısından tutarlı olsun.

Yapılacaklar:

- `src/app/sitemap.ts` yeni AVLU34 route yapısına göre güncellenir.
- Eski service/project/blog sitemap kayıtları kaldırılır.
- Kategori ve detay sayfaları sitemap'e eklenir.
- Public canonical URL'lerde default dil için `/tr` bulunmaz.
- İngilizce aktif olduğunda `/en/...` URL'leri sitemap'e eklenir.
- `generateMetadata` fonksiyonlarında `buildMetadata` kullanılmaya devam eder.
- `alternates.languages` / hreflang altyapısı route map ve localized slug'larla uyumlu hazırlanır.

Örnek canonical/hreflang:

```txt
tr canonical: https://avlu34.com/magazalar/giyim
en alternate: https://avlu34.com/en/stores/fashion
```

Commit:

```txt
feat: update avlu34 sitemap and metadata
```

## 10. Placeholder Sayfalar ve Empty State Standardı

Amaç: Tasarım başlamadan route'lar çalışır ve panelden içerik yönetilebilir olsun.

Yapılacaklar:

- Her public sayfa sade placeholder layout ile çalışır. PageHero compoenti zaten tanimli, her sayfa kullanmali, ana sayfa haric.
- Placeholder içerikler mümkün olduğunca Sanity'den gelir.
- Sanity içeriği boşsa düzgün empty state gösterilir.
- Opsiyonel alanlar boşsa ilgili UI parçaları gizlenir.
- `SanityImage`, `RichText`, `buildMetadata` ve merkezi type kuralları korunur.

Commit:

```txt
feat: add avlu34 placeholder page views
```

## 11. Global Arama Temeli

Amaç: Arama altyapısını tasarımdan önce veri tarafında hazır etmek.

Yapılacaklar:

- Sanity/GROQ tabanlı global search query oluştur.
- Başlangıç kapsamı:
  - Mağazalar
  - Kampanyalar
  - Etkinlikler
  - Yeme içme
  - hakkimizda
  - ziyaret-plani
  - kat-plani
- Draft/unpublished içeriklerin public arama sonucuna sızmadığından emin ol.
- Header/search UI tasarım aşamasına kalabilir, ancak query ve type altyapısı hazır olmalı.

Commit:

```txt
feat: scaffold global search
```

## 12. Build, Lint ve Temizlik

Amaç: Kurulum aşamasının sonunda temel yapı kırılmadan çalışsın.

Yapılacaklar:

- `npm run build` çalıştır.
- TypeScript hatalarını gider.
- Kullanılmayan import/query/schema parçalarını temizle.
- Eski service/project/blog referanslarının public akışta kalmadığını kontrol et.
- Middleware matcher'ın gereksiz dosyalara çalışmadığını kontrol et.
- `/`, `/magazalar`, `/kampanyalar`, `/etkinlikler`, `/en`, `/en/stores` gibi temel URL'leri manuel ben test ederim.

Commit:

```txt
chore: verify avlu34 setup build
```

## Kurulum Sonrası Tasarıma Geçiş Kriterleri

Tasarım ve final UI geliştirmesine geçmeden önce:

- Route ağacı oturmuş olmalı.
- Sanity schema ve Studio sidebar AVLU34 yapısına göre düzenlenmiş olmalı.
- i18n locale altyapısı çalışıyor olmalı.
- Türkçe public URL'lerde `/tr` görünmemeli.
- İngilizce route'lar `/en/...` altında çalışabilecek durumda olmalı.
- Ana sayfa, mağazalar, kampanyalar, etkinlikler, sinema, kat planı ve ziyaret planı placeholder olarak açılmalı.
- Sitemap, metadata ve revalidation temel olarak yeni modele uyarlanmış olmalı.
- Build başarılı olmalı.
