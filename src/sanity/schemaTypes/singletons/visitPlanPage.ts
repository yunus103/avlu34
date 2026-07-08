import { defineField, defineType } from "sanity";

export const visitPlanPageType = defineType({
  name: "visitPlanPage",
  title: "Ziyaret Planı Sayfası",
  type: "document",
  groups: [
    { name: "hero", title: "Page Hero Bölümü" },
    { name: "tabHours", title: "Sekme 1: Çalışma Saatleri" },
    { name: "tabCulture", title: "Sekme 2: Kültür Merkezi" },
    { name: "tabServices", title: "Sekme 3: AVM Hizmetleri" },
    { name: "tabTransport", title: "Sekme 4: Ulaşım & Otopark" },
    { name: "seo", title: "SEO Ayarları" },
  ],
  fields: [
    defineField({
      name: "heroTitle",
      title: "Hero Başlık",
      type: "localizedString",
      group: "hero",
      description: "Sayfanın en üstünde yer alan büyük başlık.",
    }),
    defineField({
      name: "heroSubtitle",
      title: "Hero Alt Başlık",
      type: "localizedText",
      group: "hero",
      description: "Hero başlığının altında yer alan kısa açıklama metni.",
    }),
    defineField({
      name: "heroImage",
      title: "Hero Arka Plan Görseli",
      type: "image",
      group: "hero",
      description: "Hero alanı arka planında görüntülenecek büyük görsel.",
      options: { hotspot: true },
      fields: [
        {
          name: "alt",
          type: "string",
          title: "Alt Metni",
          validation: (Rule) => Rule.required(),
          description: "Görselin alternatif açıklaması (SEO için önemlidir).",
        },
      ],
    }),
    defineField({
      name: "pageTitle",
      title: "Sayfa Başlığı",
      type: "localizedString",
      group: "hero",
      validation: (Rule) => Rule.required(),
      description: "Tarayıcı sekmesinde ve breadcrumb alanında görünecek sayfa adı.",
    }),

    // ─── SEKME 1: ÇALIŞMA SAATLERİ ─────────────────────────────────────────
    defineField({
      name: "workingHoursTitle",
      title: "Çalışma Saatleri Sekme Başlığı",
      type: "localizedString",
      group: "tabHours",
      description: "Çalışma saatleri sekmesinin üzerindeki buton metnidir.",
      initialValue: {
        tr: "Çalışma Saatleri",
        en: "Opening Hours",
      },
    }),
    defineField({
      name: "dailyWorkingHours",
      title: "Günlük Çalışma Saatleri Listesi",
      type: "array",
      group: "tabHours",
      description: "Haftanın günlerine göre çalışma saatlerini listelemek için kullanılır.",
      of: [
        {
          type: "object",
          fields: [
            defineField({
              name: "day",
              title: "Gün Adı",
              type: "localizedString",
              validation: (Rule) => Rule.required(),
            }),
            defineField({
              name: "hours",
              title: "Çalışma Saatleri",
              type: "string",
              validation: (Rule) => Rule.required(),
            }),
          ],
          preview: {
            select: {
              title: "day.tr",
              subtitle: "hours",
            },
          },
        },
      ],
      initialValue: [
        { day: { tr: "Pazartesi", en: "Monday" }, hours: "10:00 - 22:00" },
        { day: { tr: "Salı", en: "Tuesday" }, hours: "10:00 - 22:00" },
        { day: { tr: "Çarşamba", en: "Wednesday" }, hours: "10:00 - 22:00" },
        { day: { tr: "Perşembe", en: "Thursday" }, hours: "10:00 - 22:00" },
        { day: { tr: "Cuma", en: "Friday" }, hours: "10:00 - 22:00" },
        { day: { tr: "Cumartesi", en: "Saturday" }, hours: "10:00 - 22:00" },
        { day: { tr: "Pazar", en: "Sunday" }, hours: "10:00 - 22:00" },
      ],
    }),
    defineField({
      name: "workingHoursNote",
      title: "Çalışma Saatleri Açıklama Notu",
      type: "localizedText",
      group: "tabHours",
      description: "Çalışma saatleri tablosunun altında yer alacak bayram/tatil uyarısı.",
      initialValue: {
        tr: "Dini bayramlar ve resmi tatillerde çalışma saatlerimiz değişiklik gösterebilir.",
        en: "Opening hours may vary during national and religious holidays.",
      },
    }),

    // ─── SEKME 2: KÜLTÜR MERKEZİ ───────────────────────────────────────────
    defineField({
      name: "cultureCenterTitle",
      title: "Kültür Merkezi Başlığı",
      type: "localizedString",
      group: "tabCulture",
      description: "Kültür merkezi bölümünün ana başlığı.",
      initialValue: {
        tr: "Arnavutköy Belediyesi Avlu 34 Kültür ve Sanat Merkezi",
        en: "Arnavutköy Municipality Avlu 34 Culture and Art Center",
      },
    }),
    defineField({
      name: "cultureCenterContent",
      title: "Kültür Merkezi Tanıtım Metni",
      type: "localizedBlock",
      group: "tabCulture",
      description: "Kültür merkezi imkanlarını, salon kapasitesini açıklayan detaylı metin.",
    }),
    defineField({
      name: "cultureCenterImage",
      title: "Kültür Merkezi Görseli",
      type: "image",
      group: "tabCulture",
      description: "Kültür merkezini gösteren tanıtım fotoğrafı.",
      options: { hotspot: true },
      fields: [
        {
          name: "alt",
          type: "string",
          title: "Alt Metni",
          validation: (Rule) => Rule.required(),
          description: "Görselin alternatif metni (SEO için).",
        },
      ],
    }),
    defineField({
      name: "cultureCenterCtaLabel",
      title: "Kültür Merkezi Yönlendirme Buton Metni",
      type: "localizedString",
      group: "tabCulture",
      description: "Kültür merkezine ait etkinliklere yönlendirecek butonun yazısı.",
      initialValue: {
        tr: "Etkinlikleri Keşfet",
        en: "Explore Events",
      },
    }),

    // ─── SEKME 3: AVM HİZMETLERİ ───────────────────────────────────────────
    defineField({
      name: "servicesTabTitle",
      title: "Hizmetler Sekme Başlığı",
      type: "localizedString",
      group: "tabServices",
      description: "Hizmetler sekmesinin üzerindeki buton metnidir.",
      initialValue: {
        tr: "Hizmetlerimiz",
        en: "Services",
      },
    }),
    defineField({
      name: "servicesTabSubtitle",
      title: "Hizmetler Sekme Açıklaması",
      type: "localizedText",
      group: "tabServices",
      description: "Hizmetler ızgarasının üzerinde yer alan açıklama metni.",
      initialValue: {
        tr: "Ziyaretinizi kolaylaştıracak ve konforlu hale getirecek tüm olanaklarımız.",
        en: "All our facilities to make your visit easy and comfortable.",
      },
    }),

    // ─── SEKME 4: ULAŞIM & OTOPARK ─────────────────────────────────────────
    defineField({
      name: "transportTabTitle",
      title: "Ulaşım Sekme Başlığı",
      type: "localizedString",
      group: "tabTransport",
      description: "Ulaşım sekmesinin üzerindeki buton metnidir.",
      initialValue: {
        tr: "Ulaşım & Otopark",
        en: "Transit & Parking",
      },
    }),
    defineField({
      name: "airportTitle",
      title: "Havalimanı Kart Başlığı",
      type: "localizedString",
      group: "tabTransport",
      description: "Havalimanı yakınlığı kartının başlığı.",
      initialValue: {
        tr: "Havalimanı Yakınlığı",
        en: "Airport Proximity",
      },
    }),
    defineField({
      name: "airportContent",
      title: "Havalimanı Kart Açıklaması",
      type: "localizedText",
      group: "tabTransport",
      description: "Havalimanı yakınlığı kartının açıklaması.",
      initialValue: {
        tr: "AVLU34 AVM, İstanbul Havalimanı'na sadece 15 dakika sürüş mesafesindedir.",
        en: "AVLU34 Mall is only a 15-minute drive from Istanbul Airport.",
      },
    }),
    defineField({
      name: "parkingTitle",
      title: "Otopark Kart Başlığı",
      type: "localizedString",
      group: "tabTransport",
      description: "Otopark kapasitesi kartının başlığı.",
      initialValue: {
        tr: "414 Araçlık Kapalı Otopark",
        en: "414-Vehicle Indoor Parking",
      },
    }),
    defineField({
      name: "parkingContent",
      title: "Otopark Kart Açıklaması",
      type: "localizedText",
      group: "tabTransport",
      description: "Otopark kapasitesi kartının açıklaması.",
      initialValue: {
        tr: "Ziyaretçilerimiz için konforlu ve güvenli 414 araçlık kapalı otoparkımız hizmet vermektedir.",
        en: "Our comfortable and secure 414-vehicle indoor parking is at our visitors' service.",
      },
    }),
    defineField({
      name: "evChargingTitle",
      title: "Şarj İstasyonu Kart Başlığı",
      type: "localizedString",
      group: "tabTransport",
      description: "Elektrikli araç şarj istasyonu kartının başlığı.",
      initialValue: {
        tr: "Hızlı Şarj (EV Charge)",
        en: "EV Charging Station",
      },
    }),
    defineField({
      name: "evChargingContent",
      title: "Şarj İstasyonu Kart Açıklaması",
      type: "localizedText",
      group: "tabTransport",
      description: "Elektrikli araç şarj istasyonu kartının açıklaması.",
      initialValue: {
        tr: "Zemin kat otopark alanımızda yer alan hızlı şarj istasyonlarımız ile aracınızı şarj edebilirsiniz.",
        en: "You can charge your vehicle with our fast charging stations located in the ground floor parking area.",
      },
    }),
    defineField({
      name: "shuttleTitle",
      title: "AVLU34 Ring Servis Başlığı",
      type: "localizedString",
      group: "tabTransport",
      description: "Müşteri servisi tablosunun üzerindeki başlık.",
      initialValue: {
        tr: "AVLU34 Ring Servis Saatleri",
        en: "AVLU34 Ring Shuttle Hours",
      },
    }),
    defineField({
      name: "shuttleContent",
      title: "AVLU34 Ring Servis Açıklaması",
      type: "localizedText",
      group: "tabTransport",
      description: "Müşteri servisi tablosunun üzerindeki açıklama metni.",
      initialValue: {
        tr: "Arnavutköy Merkez ile AVLU34 arasında ring yapan servislerimizin kalkış saatleri aşağıdadır.",
        en: "Departure hours of our shuttles between Arnavutköy Center and AVLU34 are listed below.",
      },
    }),
    defineField({
      name: "shuttleSchedule",
      title: "Müşteri Servisi Kalkış Saatleri",
      type: "array",
      group: "tabTransport",
      description: "Müşteri servisinin karşılıklı kalkış saatleri tablosudur.",
      of: [
        {
          type: "object",
          fields: [
            defineField({ name: "fromBolluca", title: "Bolluca Kalkış Saatleri", type: "string" }),
            defineField({ name: "fromAvlu34", title: "Avlu34 Kalkış Saatleri", type: "string" }),
          ],
          preview: {
            select: {
              title: "fromBolluca",
              subtitle: "fromAvlu34",
            },
            prepare({ title, subtitle }) {
              return {
                title: `Bolluca: ${title || "--:--"} ➔ Avlu34: ${subtitle || "--:--"}`,
              };
            },
          },
        },
      ],
      initialValue: [
        { fromBolluca: "11:00", fromAvlu34: "11:30" },
        { fromBolluca: "12:00", fromAvlu34: "12:30" },
        { fromBolluca: "13:00", fromAvlu34: "13:30" },
        { fromBolluca: "14:00", fromAvlu34: "14:30" },
        { fromBolluca: "15:00", fromAvlu34: "15:30" },
        { fromBolluca: "16:00", fromAvlu34: "16:30" },
        { fromBolluca: "17:00", fromAvlu34: "17:30" },
        { fromBolluca: "19:00", fromAvlu34: "19:30" },
        { fromBolluca: "20:00", fromAvlu34: "20:30" },
        { fromBolluca: "21:00", fromAvlu34: "21:30" },
      ],
    }),
    defineField({
      name: "iettTitle",
      title: "İETT Otobüs Başlığı",
      type: "localizedString",
      group: "tabTransport",
      description: "İETT otobüs hatları tablosunun başlığı.",
      initialValue: {
        tr: "İETT Otobüs Hatları",
        en: "IETT Public Bus Lines",
      },
    }),
    defineField({
      name: "iettContent",
      title: "İETT Otobüs Açıklaması",
      type: "localizedText",
      group: "tabTransport",
      description: "İETT otobüs hatları tablosunun açıklaması.",
      initialValue: {
        tr: "AVM yakınında bulunan Cemal Reşit Rey Okul Durağı'ndan geçen otobüs hatları aşağıdadır.",
        en: "Public bus lines passing through the Cemal Reşit Rey School stop near the mall are listed below.",
      },
    }),
    defineField({
      name: "iettLines",
      title: "İETT Otobüs Hat Listesi",
      type: "array",
      group: "tabTransport",
      description: "AVM'ye ulaşım sağlayan İETT otobüs numaraları ve hat güzergahları listesidir.",
      of: [
        {
          type: "object",
          fields: [
            defineField({ name: "lineNo", title: "Hat Kodu (Örn: 336)", type: "string" }),
            defineField({ name: "routeName", title: "Güzergah Adı (Örn: Arnavutköy - Eminönü)", type: "string" }),
          ],
          preview: {
            select: {
              title: "lineNo",
              subtitle: "routeName",
            },
          },
        },
      ],
      initialValue: [
        { lineNo: "336", routeName: "Arnavutköy - Eminönü" },
        { lineNo: "336M", routeName: "Arnavutköy - Mecidiyeköy" },
        { lineNo: "36AY", routeName: "Yenibosna Metro - Arnavutköy" },
        { lineNo: "36D", routeName: "Arnavutköy - Deliklikaya" },
        { lineNo: "36YS", routeName: "Yassıören - Arnavutköy" },
      ],
    }),
    defineField({
      name: "havaistUrl",
      title: "Havaist Web Sitesi Bağlantısı",
      type: "string",
      group: "tabTransport",
      description: "Havaist Sefer Saatleri yönlendirme butonu bağlantısı.",
      initialValue: "https://hava.ist/",
    }),
    defineField({
      name: "transportContent",
      title: "Diğer Ulaşım Detayları (Sürüş vb.)",
      type: "localizedBlock",
      group: "tabTransport",
      description: "Harita üzerinde gösterilecek diğer yol tarifleri ve özel sürüş/taksi detayları.",
    }),
    defineField({
      name: "seo",
      title: "SEO Ayarları",
      type: "seo",
      group: "seo",
    }),
  ],
});
