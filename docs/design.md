# AVLU34 Tasarım Dili ve Arayüz Kuralları

Bu doküman, AVLU34 AVM web sitesinin arayüz (UI) tasarımı, renk paleti, tipografi kuralları ve görsel bileşen standartlarını tanımlar. Tasarım, Dubai Mall web sitesinin minimal, görsel odaklı ve monokromatik estetiğini referans alarak Arnavutköy'deki yerel kitleye uygun, abartısız ve modern bir premium çizgiyle kurgulanmıştır.

---

## 1. Tasarım Felsefesi (Design Philosophy)

*   **Monokrom Temel (Monochrome Base):** Sitenin yapısal renkleri sadece siyah ve beyazdan oluşur. Renk kirliliği yaratacak canlı vurgulardan (sarı, altın, yeşil vb.) kaçınılmıştır.
*   **Görsel Odaklılık (Image-Driven Appeal):** Sayfalara canlılık ve renk katan unsur, siteye yüklenecek olan mağaza logoları, yüksek kaliteli kampanya afişleri ve etkinlik fotoğraflarıdır.
*   **Minimalist & Net Çizgiler:** Glassmorphism (buzlu cam efekti) kullanılmayacak, yerine net sınırlar, saf zeminler ve düz çizgiler tercih edilecektir.
*   **Erişilebilirlik ve Okunabilirlik:** Türkçe ve İngilizce dillerinin her ikisinde de temiz bir tipografik hiyerarşi ve yüksek kontrast ön planda tutulacaktır.

---

## 2. Renk Sistemi (Color System)

Renk paleti saf kontrast üzerine kuruludur:

| Renk Tanımı | HEX Kodu | Tailwind Sınıfı | Kullanım Alanları |
| :--- | :--- | :--- | :--- |
| **Ana Arka Plan / Kartlar** | `#FFFFFF` | `bg-white` | Sayfa gövdeleri, mağaza listeleri, beyaz kart zeminleri, header gövdesi |
| **Koyu Zeminler & Alt Barlar** | `#000000` | `bg-black` | Footer alt şeridi, header bilgi şeritleri, koyu butonlar |
| **Ana Metin (Beyaz Zemin)** | `#000000` veya `#111111` | `text-black` / `text-neutral-900` | Başlıklar, gövde metinleri, menü linkleri |
| **Muted Metin & Tarihler** | `#666666` | `text-neutral-500` | Etkinlik/kampanya tarihleri, mağaza kategorileri |
| **Ayrıcı Çizgiler & Sınırlar** | `#E5E5E5` | `border-neutral-200` | Menü sınırları, kart kenarlıkları, grid çizgileri |
| **Çok Açık Gri Alanlar** | `#F9F9F9` | `bg-neutral-50` | Form girdi alanları (inputs), hafif arka plan kırılımları |

---

## 3. Tipografi (Typography & Fonts)

Sitede iki ana yazı tipi ailesi kontrast oluşturacak şekilde eşleştirilmiştir:

### A. Başlık Yazı Tipi: `Playfair Display` (Serif)
*   **Kullanım Amacı:** Büyük vitrin başlıkları, sayfa kahraman alanları (PageHero), ana yönlendirme başlıkları ve marka vurguları.
*   **Stil Kuralları:**
    *   Genellikle tamamı büyük harf (**UPPERCASE**) veya kelime başları büyük.
    *   Harfler arası boşluk (Letter Spacing): `tracking-wide` veya `tracking-wider` ile genişletilerek zarif bir duruş sağlanır.
    *   Kalınlık (Weight): `font-bold` (700) veya `font-medium` (500).

### B. Gövde ve UI Yazı Tipi: `Plus Jakarta Sans` (Sans-serif)
*   **Kullanım Amacı:** Menü bağlantıları, mağaza isimleri, çalışma saatleri, buton metinleri, adres/iletişim bilgileri ve açıklama paragrafları.
*   **Stil Kuralları:**
    *   **Menüler & Butonlar:** Tamamı büyük harf (**UPPERCASE**), `font-medium` (500) veya `font-semibold` (600), küçük boyutlu (`text-xs` veya `text-sm`).
    *   **Açıklama Paragrafları:** Normal karakter düzeni (Normal case), `font-normal` (400) veya `font-light` (300), satır aralığı geniş (`leading-relaxed`).

---

## 4. Buton ve Form Standartları (Buttons & Forms)

Butonlar keskin, minimalist ve zemin rengine duyarlıdır:

### A. Koyu / Görsel Üzerindeki Butonlar (Light-on-Dark)
*   **Görünüm:** Şeffaf (transparent) arka plan, ince beyaz kenarlık (`border-white/80 border-[1px]`), beyaz metin (`text-white`).
*   **Boyut ve Metin:** `tracking-widest uppercase font-semibold text-xs py-3 px-6`.
*   **Hover Durumu:** Arka planın beyaz transparan dolgu alması (`hover:bg-white/10 transition-colors`).

### B. Açık Zemin Üzerindeki Butonlar (Dark-on-Light)
*   **Görünüm:** Şeffaf arka plan, ince siyah kenarlık (`border-black border-[1px]`), siyah metin (`text-black`).
*   **Boyut ve Metin:** `tracking-widest uppercase font-semibold text-xs py-3 px-6`.
*   **Hover Durumu:** Arka planın siyah transparan dolgu alması (`hover:bg-black/5 transition-colors`).

### C. Form Elemanları (Inputs & Textareas)
*   **Sınırlar:** Keskin köşeli hatlar. Yuvarlatılmış köşeler yerine en fazla `rounded-sm` (çok hafif köşe yumuşatması) tercih edilecektir.
*   **Kenarlıklar:** İnce ve açık gri (`border-neutral-300`). Odaklanıldığında (focus) siyaha döner (`focus:border-black focus:ring-0`).

---

## 5. Header (Navigasyon) Düzeni

Ekran görüntülerine uygun olarak Header 2 ana katmandan oluşur (Glassmorphism veya arka plan transparanlığı **olmayacak**, saf beyaz kalacaktır):

### Katman 1: Üst Bar (Top Bar)
*   **Sol:** Dil Switcher (TR / EN - küçük ve sade bağlantılar).
*   **Orta:** **AVLU34** Logosu (Playfair Display veya temiz bir Serif stiliyle geniş aralıklı).
*   **Sağ:** Arama İkonu (`Search` metniyle) ve Hızlı Yol Tarifi / WhatsApp butonu.
*   **Sınır:** Altında ince gri çizgi (`border-b border-neutral-100`).

### Katman 2: Ana Menü (Main Navigation)
*   **İçerik:** MAĞAZALAR, YEME-İÇME, SİNEMA, KAMPANYALAR, ETKİNLİKLER, KAT PLANI, ZİYARET PLANı.
*   **Hizalama:** Tam ortalanmış menü bağlantıları, `Plus Jakarta Sans`, büyük harf, harfler arası açık.
*   **Mega Menü Yapısı:** Belirtilen bağlantıların üzerine gelindiğinde (hover) aşağıya doğru açılan, alt kategorileri barındıran saf beyaz paneller.

---

## 6. Footer (Alt Kısım) Düzeni

*   **Arka Plan:** Saf Beyaz (`#FFFFFF`).
*   **Üst Bölüm:** "AVLU34'te Neler Yeni?" temalı, koyu görselli ve "DAHA FAZLA KEŞFET" butonlu geniş bir tanıtım şeridi.
*   **Orta Bölüm (Grid):**
    *   **Logo & Sosyal Medya:** Ortalanmış geniş aralıklı AVLU34 logosu. Altında siyah yuvarlak zeminli, sade beyaz sosyal medya ikonları.
    *   **E-Bülten:** E-posta giriş alanı ve yanında düz siyah "KAYDOL" butonu.
    *   **İletişim:** Telefon, E-posta ve WhatsApp "Bizimle Sohbet Edin" hızlı linki.
*   **Alt Bölüm:** 4 sütun halinde düzenlenmiş site haritası linkleri (Ziyaret Bilgileri, Kurumsal vb.). En altta ince siyah copyright şeridi.
