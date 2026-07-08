# Ziyaret Planı Sayfası Revizyon Planı (Grup Bazlı Sanity Yönetimi & 4 Sekmeli Yapı)

Kullanıcı geri bildirimleri doğrultusunda, Ziyaret Planı (`/ziyaret-plani`) sayfasındaki servis saatleri, İETT hatları, otopark kapasitesi ve şarj istasyonu gibi tüm bilgilerin Sanity Studio üzerinden kolayca yönetilebilmesini sağlayan, sekmelere göre gruplandırılmış ve detaylı açıklamalara sahip tam dinamik geliştirme planı.

## Planın Özeti

1. **Sanity Studio'da Grup Bazlı Yönetim:**
   - Panelde alanları karıştırmamak için sekmelere karşılık gelen 6 ana grup tanımlanacaktır:
     - `hero`: Sayfa Üst Görseli (Hero)
     - `tabHours`: Sekme 1: Çalışma Saatleri
     - `tabCulture`: Sekme 2: Kültür Merkezi
     - `tabServices`: Sekme 3: AVM Hizmetleri
     - `tabTransport`: Sekme 4: Ulaşım & Otopark
     - `seo`: Arama Motoru Optimizasyonu (SEO)
2. **Tab Butonlarının Stil Güncellemesi:**
   - Tab butonlarına `cursor-pointer` sınıfının eklenmesi.
3. **Tamamen Dinamik Sanity Şema Güncellemeleri:**
   - `visitPlanPage.ts` şemasını yeni sekmelere göre gruplama.
   - Günlük Çalışma Saatleri, Ring Servisi kalkış saatleri tablosu, İETT Hat listesi, Otopark ve EV Şarj bilgileri için Sanity Studio'da yeni alanlar açılması.
   - Her alan için anlaşılır ve Türkçe açıklamalar (`description`) eklenmesi.
   - Şema düzeyinde varsayılan başlangıç değerlerinin (`initialValue`) girilmesi.
4. **Sorgu ve Tip Güncellemeleri:**
   - `queries.ts` dosyasındaki `visitPlanPageQuery`'nin yeni eklenen alanları çekecek şekilde güncellenmesi.
   - `src/types/index.ts` altındaki `VisitPlanPage` ve alt arabirimlerinin güncellenmesi.
5. **Arayüz Geliştirmeleri:**
   - 4 sekme yapısının kurulması ve verilerin Sanity'den çekilerek şık responsive kartlar ve tablolar halinde render edilmesi.

---

## Proposed Changes

### [Sanity CMS & Schema Layer]

#### [MODIFY] [visitPlanPage.ts](file:///c:/PROJECTS/WebProject/avlu34/src/sanity/schemaTypes/singletons/visitPlanPage.ts)
Şemayı aşağıdaki gruplar ve alanlar ile yeniden yapılandıracağız:
- **`tabHours` (Sekme 1: Çalışma Saatleri) Alanları:**
  - `workingHoursTitle` (localizedString): Sekme başlığı.
  - `dailyWorkingHours` (array of object: `day` (localizedString), `hours` (string)): Her gün için çalışma saatleri tablosu.
  - `workingHoursNote` (localizedText): Özel bayram/tatil uyarı notu.
- **`tabCulture` (Sekme 2: Kültür Merkezi) Alanları:**
  - `cultureCenterTitle` (localizedString): Kültür Merkezi ana başlığı.
  - `cultureCenterContent` (localizedBlock): Kültür Merkezi tanıtım metni (zengin içerik).
  - `cultureCenterImage` (image): Tanıtım görseli (alt metinli).
  - `cultureCenterCtaLabel` (localizedString): Buton metni.
- **`tabServices` (Sekme 3: AVM Hizmetleri) Alanları:**
  - `servicesTabTitle` (localizedString): Sekme başlığı.
  - `servicesTabSubtitle` (localizedText): Açıklama alt başlığı.
- **`tabTransport` (Sekme 4: Ulaşım & Otopark) Alanları:**
  - `transportTabTitle` (localizedString): Sekme başlığı.
  - `airportTitle` (localizedString): Havalimanı Kart Başlığı.
  - `airportContent` (localizedText): Havalimanı Açıklama Yazısı.
  - `parkingTitle` (localizedString): Otopark Kart Başlığı (Örn: "414 Araçlık Otopark").
  - `parkingContent` (localizedText): Otopark Açıklama Yazısı.
  - `evChargingTitle` (localizedString): Şarj İstasyonu Kart Başlığı.
  - `evChargingContent` (localizedText): Şarj İstasyonu Açıklama Yazısı.
  - `shuttleTitle` (localizedString): Ring Servis Bölüm Başlığı.
  - `shuttleContent` (localizedText): Ring Servis Açıklama Yazısı.
  - `shuttleSchedule` (array of object: `fromBolluca` (string), `fromAvlu34` (string)): Bolluca ve AVLU34 kalkış saatleri tablosu.
  - `iettTitle` (localizedString): İETT Hatları Bölüm Başlığı.
  - `iettContent` (localizedText): İETT Hatları Açıklama Yazısı.
  - `iettLines` (array of object: `lineNo` (string), `routeName` (string)): Otobüs hat kodları ve güzergahları listesi.
  - `transportContent` (localizedBlock): Genel sürüş / taksi tarifleri.

---

### [Data Queries & Types]

#### [MODIFY] [queries.ts](file:///c:/PROJECTS/WebProject/avlu34/src/sanity/lib/queries.ts)
- `visitPlanPageQuery`'nin yeni eklenen tüm alanları (çalışma saatleri listesi, servis ve otobüs hat listeleri, otopark/şarj metinleri) çekecek şekilde güncellenmesi.

#### [MODIFY] [index.ts](file:///c:/PROJECTS/WebProject/avlu34/src/types/index.ts)
- `VisitPlanPage` arabiriminin güncellenmesi ve `DailyWorkingHour`, `ShuttleTime`, `IettLine` alt tiplerinin eklenmesi:
```typescript
export interface DailyWorkingHour {
  day: string; // Projected
  hours: string;
}

export interface ShuttleTime {
  fromBolluca: string;
  fromAvlu34: string;
}

export interface IettLine {
  lineNo: string;
  routeName: string;
}
```

---

### [Frontend Components & Page]

#### [MODIFY] [VisitPlanTabs.tsx](file:///c:/PROJECTS/WebProject/avlu34/src/components/visit-plan/VisitPlanTabs.tsx)
- **Tab Navigasyonu:** `cursor-pointer` eklenmesi ve sekmelerin 4'e ayrılması.
- **TAB 1 (Çalışma Saatleri):**
  - Sol Sütun: Haftanın her günü için Sanity'den gelen `dailyWorkingHours` listesini ince çizgilerle gösteren şık bir tablo.
  - Sağ Sütun: Genel saat özeti kartı ve uyarı notu.
- **TAB 2 (Kültür Merkezi):**
  - Kültür merkezinin resmi, tanıtım yazısı ve etkinlik butonu.
- **TAB 4 (Ulaşım & Otopark):**
  - **Otopark, Havalimanı & Şarj Kartları (Üst Bölüm):**
    - Havalimanı yakınlığı kartı (`Plane` ikonu ile).
    - Kapalı otopark kartı (`Car` ikonu ve Sanity'den gelen başlık/açıklama ile).
    - Elektrikli araç şarj kartı (`Zap` ikonu ve Sanity'den gelen başlık/açıklama ile).
  - **Ulaşım Seçenekleri Grid'i (Orta Bölüm):**
    - *Ring Servisi:* Bolluca ve AVLU34 kalkış saatlerini (Sanity'den gelen `shuttleSchedule` listesi) gösteren şık bir tablo.
    - *Havaist:* Havalimanı hattı ve harici yönlendirme butonu.
    - *İETT Hatları:* Sanity'den gelen `iettLines` listesini gösteren şık bir otobüs hat tablosu.
  - **Harita ve Yönlendirme (Alt Bölüm):**
    - Google Haritalar iframe'i ve "YOL TARİFİ AL" butonu.

---

## Verification Plan

### Automated Tests
- `npm run build` ile Next.js derleme ve TypeScript tip kontrolleri.
- `npm run lint` ile kod kalitesi kontrolleri.

### Manual Verification
- Arayüzde 4 sekmenin de doğru render edildiğinin ve `cursor-pointer` özelliğinin çalıştığının doğrulanması.
- Sanity Studio'da sekmelere göre ayrılmış grupların (`tabHours`, `tabCulture`, `tabTransport` vb.) kolay anlaşılır ve açıklayıcı açıklamalarla göründüğünün kontrolü.
- Sanity'den girilen yeni otobüs hattı veya servis saati güncellemelerinin sitede anında yansıdığının kontrolü.
