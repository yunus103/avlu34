# AVLU34 Site Yenileme Karar Dokümanı

Bu doküman, AVLU34 web sitesinin Next.js + Sanity altyapısı ile yeniden geliştirilmesi için alınan ürün, içerik mimarisi, CMS, SEO, cache ve çoklu dil kararlarını özetler. Amaç, geliştirmeye başlandığında "bunu nasıl düşünmüştük?" sorusuna tekrar dönmeden net bir referans sağlamaktır.

## 1. Genel Hedef

AVLU34 sitesi Next.js + Sanity boilerplate üzerinden yeniden geliştirilecek.

Hedef Dubai Mall ölçeğinde dev, lüks ve karmaşık bir deneyim yapmak değildir. Hedef; AVLU34'ün konumuna, kitlesine ve işletme gerçekliğine uygun, çalışan, uzun ömürlü, hızlı, modern, güzel görünen ve kolay yönetilebilir bir AVM sitesi oluşturmaktır.

Dubai Mall referansı birebir klonlanmayacak. Referanstan alınacak taraflar:

- Büyük görsel kullanımı
- Temiz ve güçlü hero alanı
- Keşif odaklı ana sayfa akışı
- Sade ama zengin navigasyon
- Mega menü mantığı
- Mağaza, yeme içme, kampanya ve etkinlikleri öne çıkaran AVM dili
- Premium his veren ama AVLU34 ölçeğini aşmayan tasarım yaklaşımı

AVLU34, Arnavutköy'de önemli ve ilçedeki ana AVM konumunda görülecek; ancak aşırı lüks destinasyon gibi gösterilmeyecek. Tasarım dili modern, temiz, erişilebilir, yerel ve kaliteli olacak.

## 2. Teknik Temel

Proje mevcut Next.js + Sanity boilerplate üzerinden geliştirilecek.

Mevcut boilerplate klasik kurumsal site yapısına sahip olduğu için `hizmetler`, `projeler`, `blog` gibi yapılar AVM projesinin gerçek ihtiyaçlarına göre dönüştürülecek veya pasif bırakılacak.

Temel teknoloji kararları:

- Next.js App Router
- Sanity CMS
- Sanity webhook ile içerik değişimlerinde revalidation
- ISR/time-based revalidation ile tarih bazlı görünürlük güncellemeleri
- Server-rendered içerik
- Field-level çoklu dil altyapısına hazır CMS modeli

## 3. Public Route Yapısı

İlk hedef public route yapısı aşağıdaki gibi olacak:

```txt
/

/magazalar
/magazalar/[kategori]
/magazalar/[slug]

/yeme-icme
/yeme-icme/[kategori]

/sinema

/kampanyalar
/kampanyalar/[slug]

/etkinlikler
/etkinlikler/[slug]

/kat-plani
/ziyaret-plani
/hakkimizda
/iletisim
/kvkk
```

### 3.1 Mağaza Route Kararı

Mağaza kategori sayfaları indekslenebilir olacak:

```txt
/magazalar/giyim
/magazalar/teknoloji
/magazalar/cocuk
```

Bu sayfalar SEO açısından değerli kabul edildi. Örneğin "Avlu 34 giyim mağazaları" gibi aramalara karşılık verebilir.

Mağaza detay sayfası:

```txt
/magazalar/[slug]
```

Mağaza detayında kategori path'i kullanılmayacak. Yani aşağıdaki gibi bir yapı tercih edilmeyecek:

```txt
/magazalar/giyim/lc-waikiki
```

Bunun yerine:

```txt
/magazalar/lc-waikiki
```

Bu yapı daha kısa, daha temiz ve mağazanın kategori değiştirmesi durumunda daha dayanıklı.

### 3.2 Yeme İçme Route Kararı

Yeme içme teknik olarak mağaza türü gibi yönetilebilse de kullanıcı niyeti farklı olduğu için ayrı route ailesi olacak:

```txt
/yeme-icme
/yeme-icme/restoran
/yeme-icme/fast-food
/yeme-icme/kahve
/yeme-icme/tatli
```

Bu karar Dubai Mall'daki `Shop` / `Dine` ayrımına benzer bir kullanıcı deneyimi sağlar.

### 3.3 Sinema Route Kararı

Sinema ayrı bir route olacak:

```txt
/sinema
```

Bu sayfa sadece dış link veren boş bir geçiş sayfası olmayacak. AVLU34 içindeki sinema/salon deneyimi, fotoğraflar, koltuklar, salon özellikleri ve genel bilgiler yer alacak. Vizyondaki filmler ve seanslar için dış link verilecek.

### 3.4 Blog, Hizmetler, Projeler

Blog, hizmetler ve projeler hem frontend tarafinda routedan, hem de baglantili oldugu sanity panel tarafindaki dokumanlari vs kaldirilacak. Yeni projede blog, hizmetler ve proje sayfasi yok.

## 4. Ana Sayfa Yapısı

Ana sayfa AVM vitrini gibi çalışacak. Kullanıcı siteye girdiğinde kampanya, etkinlik, mağaza, yeme içme, sinema ve ziyaret bilgilerine hızlı erişebilmeli.

Planlanan ana sayfa bölümleri:

1. Hero carousel
2. Hızlı erişim alanı
3. Öne çıkan kampanyalar
4. Etkinlikler
5. Mağaza keşfi / mağaza kategorileri
6. Yeme içme alanı
7. Sinema alanı
8. Kat planı / mağazanı bul alanı
9. Ziyaret bilgileri
10. Sosyal medya / Instagram alanı, sadece hesap aktif ve kaliteli içerik varsa

### 4.1 Hızlı Erişim

Hızlı erişimde şu linkler bulunabilir:

- Mağazalar
- Yeme İçme
- Sinema
- Kampanyalar (daha sonra eklenebilir)
- Etkinlikler (daha sonra eklenebilir)
- Kat Planı
- Yol Tarifi

Bu bölüm özellikle mobil kullanıcılar için önemli olacak.

### 4.2 Ana Sayfa Kampanya Bölümü

Ana sayfa kampanya bölümü ilk versiyonda sadece "Kampanyalar" sayfasina yonlendiren bir section olacak. Tam ekran yari yariya, bir tarafta şık bir resim diger tarafta kampanyalar sayfasina yonlendiren bir buton olacak.

### 4.3 Ana Sayfa Etkinlik Bölümü

Kampanyalarda oldugu gibi, ilk versiyonda etkinlikler sayfasina yonlendiren bir section olacak. Tam ekran yari yariya, bir tarafta şık bir resim diger tarafta etkinlikler sayfasina yonlendiren bir buton olacak.

## 5. Header ve Navigasyon

Header sade ama AVM keşfine uygun olacak.

Önerilen ana menü:

```txt
Mağazalar
Yeme İçme
Sinema
Kampanyalar
Etkinlikler
Kat Planı
Ziyaret Planı
Arama
Yol Tarifi / WhatsApp
```

Mega menü kullanılabilir ancak abartılmayacak.

Mega menü yaklaşımı:

- `Mağazalar` altında mağaza kategorileri gösterilebilir.
- `Yeme İçme` altında yeme içme kategorileri gösterilebilir.
- `Ziyaret Planı` altında ulaşım, otopark, çalışma saatleri ve AVM hizmetleri bulunabilir.

Mobilde arama ve yol tarifi daha görünür aksiyonlar olacak.

## 6. Sanity İçerik Modeli

Ana karar: HomePage içine büyük array'ler doldurulmayacak. Kampanya, etkinlik, hero, mağaza gibi içerikler ayrı document type olarak yönetilecek.

Bu sayede:

- Panel şişmez.
- Eski içerikler ana sayfa içinde kalabalık yapmaz.
- Tarih bazlı filtreleme daha temiz olur.
- İçerikler farklı sayfalarda yeniden kullanılabilir.
- Editör deneyimi daha sade kalır.

Planlanan ana document type'lar:

- `store`
- `storeCategory`
- `foodCategory`
- `campaign`
- `event`
- `heroSlide`
- `cinemaPage` veya sinema sayfası singleton'ı
- `homePage` singleton
- `siteSettings`
- `navigation`

## 7. Mağaza Modeli

Mağazalar Sanity'de ayrı `store` document type olarak yönetilecek.

Zorunlu alanlar:

```txt
ad
slug
logo/görsel
kategori
kat
kısa açıklama
çalışma saatleri
```

Opsiyonel alanlar:

```txt
telefon
web sitesi
sosyal medya
aktif kampanya ilişkileri
```

Opsiyonel alanlar girilirse frontend'de görünür, girilmezse gizlenir.

### 7.1 İlk Mağaza Kategorileri

İlk kategori listesi:

```txt
giyim
teknoloji
cocuk
saglik-guzellik
hizmet
eglence
```

Bu liste gerçek mağaza envanteri incelendikten sonra düzenlenebilir.

### 7.2 Mağaza Detay Sayfası

Mağaza detay sayfasında en az şu bilgiler yer alacak:

- Mağaza adı
- Logo veya ana görsel
- Kategori
- Kat bilgisi
- Kısa açıklama
- Çalışma saatleri
- Varsa telefon
- Varsa web sitesi
- Varsa sosyal medya
- Varsa ilgili aktif kampanyalar

## 8. Yeme İçme Modeli

Yeme içme yerleri teknik olarak `store` document içinde yönetilebilir; ancak frontend route ve kullanıcı deneyimi ayrı olacak.

İlk yeme içme kategorileri:

```txt
restoran
fast-food
kahve
tatli
```

Bu kategoriler sonradan gerçek mağaza listesine göre revize edilebilir.

## 9. Sinema Modeli

Sinema sayfasında bulunabilecek içerikler:

- Sinema tanıtımı
- Salon fotoğrafları
- Koltuk ve salon özellikleri
- AVLU34 içindeki sinema deneyimi
- Paribu Cineverse veya ilgili sağlayıcı bilgisi
- Vizyondaki filmler/seanslar için dış link CTA'sı

Seans/veri güncelliği dış sağlayıcıya bırakılacak.

## 10. Kampanya Modeli

Kampanyalar ayrı `campaign` document type olacak.

Kampanya alanları:

```txt
title
slug
image
startsAt
endsAt
isPublished
showOnHome
priority
relatedStores[]
body
terms
seo
```

`featuredUntil` gibi ek bir alan gerekirse ileride değerlendirilebilir. İlk aşamada `startsAt`, `endsAt`, `showOnHome` ve `priority` yeterli kabul edildi.

### 10.1 Kampanya Görünürlük Mantığı

Kampanya süresi bitince silinmeyecek.

Süresi biten kampanyalar:

- Ana sayfadan otomatik düşer.
- Aktif kampanyalar listesinden çıkar.
- Geçmiş/süresi dolmuş kampanyalar altında gösterilebilir.
- Detay sayfası açık kalır.
- Kartta `Süresi doldu` etiketi kullanılabilir.
- Gerekirse kart tasarımında grayscale veya daha pasif görsel dil kullanılabilir.

## 11. Etkinlik Modeli

Etkinlikler ayrı `event` document type olacak.

Etkinlik alanları:

```txt
title
slug
poster/image
startsAt
endsAt
time
location
body
gallery
isPublished
showOnHome
priority
seo
```

Etkinlik süresi geçince silinmeyecek.

Süresi geçen etkinlikler:

- Ana sayfadan otomatik düşer.
- Etkinlik hub sayfasında aktif/yaklaşan etkinliklerden sonra gösterilebilir.
- Detay sayfası açık kalır.
- Kartta `Geçmiş etkinlik` veya benzeri bir etiket kullanılabilir.
- Filtreleme ile aktif/geçmiş ayrımı yapılabilir.

## 12. Hero Slide Modeli

Hero, ayrı `heroSlide` document type olarak yönetilecek.

HomePage içinde hero slide seçici array tutulmayacak. Frontend aktif hero slide'ları otomatik çekecek.

Hero slide alanları:

```txt
title
subtitle
desktopImage
mobileImage, opsiyonel
ctaLabel
ctaLink
startsAt
endsAt
priority
isPublished
isDefault
```

Video hero opsiyonel olarak ileride değerlendirilebilir.

### 12.1 Hero Gösterim Akışı

Frontend önce aktif, default olmayan slide'ları arar:

```txt
isPublished = true
isDefault != true
startsAt <= now
endsAt >= now
```

Bu slide'lar `priority` sırasına göre maksimum 3-5 adet gösterilir.

Eğer hiç aktif normal slide yoksa default slide'lara düşülür:

```txt
isPublished = true
isDefault = true
```

Default slide'lar genel AVLU34 görselleri olur:

- AVLU34 genel tanıtım
- Mağazalar
- Yeme içme
- Sinema / eğlence

Default slide'larda tarih zorunlu olmayacak. Default slide'lar ana sayfanın boş kalmaması için güvenli fallback olarak çalışacak.

### 12.2 Hero Senaryo Örneği

Panelde şu slide'lar olsun:

```txt
AVLU34 Genel Tanıtım
isDefault = true

AVLU34 Yeme İçme
isDefault = true

Babalar Günü Kampanyası
isDefault = false
startsAt = 10 Haziran
endsAt = 20 Haziran
priority = 100

Yaz Etkinliği
isDefault = false
startsAt = 25 Haziran
endsAt = 30 Haziran
priority = 80
```

18 Haziran'da frontend `Babalar Günü Kampanyası` slide'ını gösterir.

22 Haziran'da aktif normal slide yoksa default slide'lara döner.

26 Haziran'da `Yaz Etkinliği` aktif hale gelir.

Süresi geçen hero slide frontend'de görünmez ama panelde `Süresi Geçen Slaytlar` altında kalır. Tarihleri güncellenirse tekrar kullanılabilir.

## 13. Kat Planı

İlk sürümde interaktif SVG kat planı yapılmayacak.

MVP karar:

- PDF veya görsel kat planı kullanılacak.
- Kullanıcı kat planını açıp inceleyebilecek.
- Mağaza detayında kat bilgisi bulunacak.

İleride interaktif SVG kat planı yapılabilir. Suan yapilmayacak.

## 14. Global Arama

Global arama olacak.

Arama HTML scrape ederek çalışmayacak. Sanity içerikleri üzerinden çalışacak.

İlk aşamada Sanity/GROQ tabanlı basit arama yeterli kabul edildi.

Arama kapsamı:

```txt
mağazalar
kampanyalar
etkinlikler
yeme içme
hakkimizda
ziyaret-plani
kat-plani
gerekirse sinema sayfası
```

SEO için ayrı karar:

- Ana içerikler server-rendered HTML içinde bulunmalı.
- Kritik içerikler sadece client-side render edilmemeli.
- Filtreleme ve arama progressive enhancement olabilir; ancak indekslenmesi gereken liste ve detay sayfaları server tarafında üretilecek.

## 15. Panelde Aktif / Planlanan / Geçmiş Mantığı

Kampanya, etkinlik ve hero içerikleri aynı document type içinde kalacak. Panelde fiziksel olarak taşınmayacak.

Sanity Studio sol menüsünde filtreli görünümler oluşturulacak.

### 15.1 Kampanya Panel Görünümü

```txt
Kampanyalar
  Aktif Kampanyalar
  Planlanan Kampanyalar
  Geçmiş Kampanyalar
  Tüm Kampanyalar
```

Filtre mantığı:

```txt
Aktif:
startsAt <= now <= endsAt

Planlanan:
startsAt > now

Geçmiş:
endsAt < now

Tüm:
hepsi
```

### 15.2 Etkinlik Panel Görünümü

```txt
Etkinlikler
  Yaklaşan / Aktif Etkinlikler
  Geçmiş Etkinlikler
  Tüm Etkinlikler
```

### 15.3 Hero Panel Görünümü

```txt
Ana Sayfa Vitrini
  Aktif Slaytlar
  Planlanan Slaytlar
  Süresi Geçen Slaytlar
  Varsayılan Slaytlar
  Tüm Slaytlar
```

Bu görünümler Sanity Structure Builder ile yapılacak.

Editör açısından sonuç:

- İçerik silinmez.
- İçerik tarihi geldiğinde aktif görünür.
- Süresi geçince geçmiş listesine düşer.
- Frontend de aynı tarih mantığıyla gösterir/gizler.
- Editörün manuel taşıma yapmasına gerek kalmaz.

İlk aşamada `archive` boolean alanı eklenmeyecek. Filtreli listeler yeterli kabul edildi.

## 16. Expiration ve Frontend Filtreleme

Tarih bazlı görünürlük frontend client tarafında büyük listeleri çekip filtreleyerek yapılmayacak.

Doğru yaklaşım:

- Sanity GROQ query tarafında tarih filtresi yapılır.
- Server-rendered sayfa sadece gereken içerikleri alır.
- Client'a 100 kampanya gönderilip tarayıcıda filtrelenmez.

Örnek aktif kampanya mantığı:

```groq
*[
  _type == "campaign" &&
  isPublished == true &&
  dateTime(startsAt) <= dateTime(now()) &&
  dateTime(endsAt) >= dateTime(now())
] | order(priority desc, startsAt desc)
```

Geçmiş kampanya mantığı:

```groq
*[
  _type == "campaign" &&
  isPublished == true &&
  dateTime(endsAt) < dateTime(now())
] | order(endsAt desc)
```

## 17. Cache, ISR ve Revalidation

Mevcut projede `src/app/api/revalidate/` altında Sanity webhook endpoint'i var. Bu endpoint içerik değiştiğinde ilgili cache tag'lerini temizlemek için kullanılacak.

Webhook şu durumlarda devreye girer:

- İçerik oluşturuldu
- İçerik güncellendi
- İçerik silindi
- Sanity webhook ilgili route'a POST attı

Ancak expiration farklıdır:

```txt
Kampanya endsAt = 18:00
Saat 18:00 oldu
Sanity'de içerik değişmedi
Webhook tetiklenmedi
```

Bu nedenle tarih bazlı görünürlük için ISR/time-based revalidation kullanılacak.

### 17.1 Revalidate Kararı

Zaman bazlı sayfalarda:

```ts
export const revalidate = 3600;
```

Yani 1 saat revalidate kabul edildi.

Zaman bazlı sayfalar:

- Ana sayfa
- Kampanyalar
- Etkinlikler
- Hero içeren alanlar

Diğer daha statik sayfalar:

- Mağazalar
- Mağaza detayları
- Sabit sayfalar
- Kat planı
- Ziyaret planı

Bu sayfalar daha uzun cache + webhook ağırlıklı çalışabilir.

## 18. Çoklu Dil / İngilizce Altyapısı

İngilizce desteği baştan planlanacak ama ilk yayında aktif olmayabilir.

Amaç, sonradan İngilizce istendiğinde route, schema, sitemap ve SEO tarafında büyük refactor yapmak zorunda kalmamaktır.

### 18.1 Localization Yaklaşımı

Field-level localization tercih edildi.

Yani tek document içinde Türkçe ve İngilizce alanlar olacak.

Örnek:

```txt
title.tr
title.en

description.tr
description.en
```

Türkçe zorunlu, İngilizce opsiyonel olacak.

Document-level localization tercih edilmedi.

### 18.2 Dil Route Kararı

Tek locale tabanlı route ağacı kullanılacak:

```txt
src/app/(site)/[locale]/...
```

Desteklenen locale'ler:

```txt
tr
en
```

Türkçe ana dil olacak ve public URL'de `/tr` görünmeyecek:

```txt
/
/magazalar
/kampanyalar
/etkinlikler
/yeme-icme
```

İngilizce public URL'lerde `/en` prefix kullanılacak:

```txt
/en
/en/stores
/en/offers
/en/events
/en/dining
```

Internal olarak Türkçe istekler `[locale]` ağacındaki `tr` rotalarına rewrite edilir. Örneğin:

```txt
Public:   /magazalar
Internal: /tr/magazalar
```

İngilizce URL'ler de aynı tek route ağacına bağlanır. Gerekirse İngilizce public segmentler internal Türkçe segmentlere rewrite edilir:

```txt
Public:   /en/stores
Internal: /en/magazalar
```

Bu sayede component ve page logic tekrar etmez. Locale parametresi hangi dil alanının okunacağını belirler.

### 18.3 Ultra-Hafif Middleware Rewrite Kararı

Vercel Active CPU tüketimini düşük tutmak için middleware sadece URL rewrite için kullanılacak.

Middleware içinde yapılmayacaklar:

- Sanity fetch
- API isteği
- Google Translate veya başka harici servis çağrısı
- Ağır i18n paketi import'u
- Accept-Language parsing
- Cookie/localStorage tabanlı redirect
- Kullanıcıya görünen redirect

Middleware davranışı:

- İstek `/en` prefix'iyle geliyorsa devam eder veya route map'e göre internal locale rotasına rewrite edilir.
- İstek dil prefix'i olmadan geliyorsa kullanıcıya çaktırmadan internal `/tr/...` rotasına rewrite edilir.
- `NextResponse.redirect()` kullanılmaz; `NextResponse.rewrite()` kullanılır.
- `api`, `_next/static`, `_next/image`, `favicon.ico`, `robots.txt`, `sitemap.xml`, Sanity Studio ve uzantılı statik dosyalar matcher dışında tutulur.

Kullanıcı hangi dile basarsa o dilin public URL'sine gider. Dil değiştirici normal link üretecek:

```txt
/magazalar/giyim -> /en/stores/fashion
/en/stores/fashion -> /magazalar/giyim
```

### 18.4 Slug ve Kategori Eşleşmesi

Kategori slug'ları iki dilli olacak:

```txt
TR: /magazalar/giyim
EN: /en/stores/fashion
```

Dinamik sayfalar iki slug alabilecek.

Mağaza slug'ları marka adına göre ortak kalabilir:

```txt
/magazalar/lc-waikiki
/en/stores/lc-waikiki
```

Ancak schema ileride localized slug'a hazır olabilir.

### 18.5 Sitemap ve Hreflang

İngilizce aktif olduğunda sitemap iki dili de üretecek.

Sayfalarda `alternates.languages` / hreflang mantığı kurulacak:

```txt
tr -> https://avlu34.com/magazalar/giyim
en -> https://avlu34.com/en/stores/fashion
```

İngilizce içerik hazır olmadan dil switcher gizli olabilir.

Canonical URL'lerde default Türkçe dil için `/tr` bulunmayacak. Örneğin internal route `/tr/magazalar` olsa bile canonical URL `/magazalar` olacaktır.

## 19. Çeviri Yardımcısı

Panelde tek tuş çeviri yardımcısı hedefleniyor.

Google Translate veya benzeri servis sonradan entegre edilebilir.

## 20. SEO Kararları

SEO için temel kararlar:

- Kategori sayfaları indekslenebilir olacak.
- Türkçe URL'ler Türkçe olacak.
- İngilizce açıldığında İngilizce URL'ler `/en/...` altında İngilizce olacak.
- Ana içerikler server-rendered HTML içinde bulunacak.
- Client-only kritik içerikten kaçınılacak.
- Eski URL redirectleri yayına almadan önce planlanacak.

İndekslenebilir kategori örnekleri:

```txt
/magazalar/giyim
/magazalar/teknoloji
/yeme-icme/kahve
```

## 21. Tasarım Dili

Dubai Mall'dan alınacak yaklaşım:

- Büyük hero
- Görsel ağırlıklı alanlar
- Sade üst menü
- Keşif hissi
- Mega menü
- Mağaza/yeme içme/kampanya/etkinlik odaklı akış
- Temiz tipografi
- Full-width section hissi

Kaçınılacak yaklaşım:

- Birebir klonlama
- Aşırı lüks altın/siyah dil
- AVLU34 ölçeğini aşan destinasyon dili
- Sadece gösterişli ama kullanışsız animasyonlar
- Gereksiz karmaşık etkileşimler

AVLU34 için hedef:

- Modern
- Temiz
- Yerel
- Erişilebilir
- Kaliteli
- Kolay gezilebilir
- Mobilde hızlı bilgi veren

## 22. Panel Kullanım Prensipleri

Panel hiç bilmeyen birinin kullanabileceği kadar sade olmalı.

Prensipler:

- Her ana içerik türü ayrı collection olacak.
- Ana sayfaya dev array'ler doldurulmayacak.
- Aktif/planlanan/geçmiş ayrımı panelde otomatik filtreli listelerle yapılacak.
- Opsiyonel alanlar boşsa frontend'de gizlenecek.
- Editör tarihleri girerek görünürlüğü yönetebilecek.
- İçerik silinmeden geçmişe düşebilecek.
- Eski içerikler gerektiğinde tekrar kullanılabilecek.

## 23. Eski URL Yönlendirmeleri

Eski redirectleri şu an öncelikli değil.

Yayına almadan önce:

- Eski sitemap incelenecek.
- Önemli eski URL'ler tespit edilecek.
- Karşılıkları yeni route yapısında belirlenecek.
- 301 redirect planı yapılacak.

Bu SEO kaybını azaltmak için canlıya geçmeden önce yapılacak son işlerden biri olacak.

## 24. Faz-2 / Sonradan Değerlendirilecek Konular

İlk sürümde zorunlu olmayan ama ileride değerlendirilebilecek konular:

- İnteraktif SVG kat planı
- Video hero
- Gelişmiş search provider, örneğin Algolia veya Meilisearch
- Blog yerine duyurular sistemi
- Hero veya kampanya için daha gelişmiş planlama kuralları
- Çok eski içerikler için `archive` boolean
- Sinema verisi için güvenilir API bulunursa otomatik entegrasyon
- İngilizce dil switcher'ın aktif edilmesi
- Panel içi otomatik çeviri entegrasyonu

## 25. Henüz Tasarım/Uygulama Sırasında Netleşecek İnce Ayarlar

Aşağıdaki konular ana mimariyi bozmaz; tasarım ve gerçek içerik geldikçe netleşebilir:

- Ana sayfada kaç kampanya kartı gösterileceği: 3 veya 6
- Ana sayfada kaç etkinlik kartı gösterileceği
- Gerçek mağaza listesine göre kategori isimlerinin revizyonu
- Gerçek yeme içme listesine göre kategori isimlerinin revizyonu
- Hero slide görsel oranları
- Mobil hero görsel ihtiyacı
- Kat planı PDF/görsel formatı
- Sinema dış linkinin kesin URL'si

## 26. Net Mimari Özeti

Bu proje için nihai yön şu şekilde kabul edildi:

```txt
AVLU34 sitesi Next.js + Sanity ile yeniden yapılacak.
Dubai Mall tasarım dili referans alınacak, birebir klonlanmayacak.
AVM odaklı route mimarisi kurulacak.
Mağaza, kampanya, etkinlik ve hero ayrı Sanity document type olacak.
Ana sayfa dev array mantığıyla değil, ayrı içerik kaynaklarından beslenecek.
Kampanya ve etkinliklerde aktif/geçmiş ayrımı tarih bazlı otomatik olacak.
Hero slide'lar ayrı document olarak yönetilecek ve default fallback slide'lar olacak.
Kategori sayfaları SEO için indekslenebilir olacak.
Global arama Sanity içerikleri üzerinden çalışacak.
İlk kat planı PDF/görsel olacak.
Sinema seansları için dış link verilecek.
İngilizce altyapısı baştan planlanacak ama ilk yayında aktif olmayabilir.
Middleware sadece ultra-hafif locale rewrite için kullanılacak; automatic language detection yapılmayacak.
Zaman bazlı sayfalarda revalidate = 3600 kullanılacak.
Webhook içerik değişimlerinde anlık cache temizliği için kullanılmaya devam edecek.
```
