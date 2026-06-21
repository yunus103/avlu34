import { defineField, defineType } from "sanity";

export const homePageType = defineType({
  name: "homePage",
  title: "Ana Sayfa",
  type: "document",
  groups: [
    { name: "about", title: "Hakkımızda Bölümü" },
    { name: "campaigns", title: "Kampanyalar Bölümü" },
    { name: "events", title: "Etkinlikler Bölümü" },
    { name: "stores", title: "Mağazalar Bölümü" },
    { name: "dining", title: "Yeme-İçme Bölümü" },
    { name: "cinema", title: "Sinema Bölümü" },
    { name: "map", title: "Kat Planı Bölümü" },
    { name: "visit", title: "Ziyaret Bilgileri" },
    { name: "seo", title: "SEO Ayarları" },
  ],
  fields: [
    // About Section
    defineField({
      name: "aboutTag",
      title: "Hakkımızda Bölüm Etiketi (Opsiyonel)",
      type: "localizedString",
      group: "about",
      description: "Başlığın hemen üstünde küçük harflerle görünen kategori veya etiket yazısıdır. (Örn: AVLU34 AVM, HAKKIMIZDA)",
    }),
    defineField({
      name: "aboutTitle",
      title: "Hakkımızda Başlık",
      type: "localizedString",
      group: "about",
      initialValue: { tr: "AVLU34'e Hoş Geldiniz", en: "Welcome to AVLU34" },
    }),
    defineField({
      name: "aboutSubtitle",
      title: "Hakkımızda Alt Başlık",
      type: "localizedText",
      group: "about",
    }),
    defineField({
      name: "aboutText",
      title: "Hakkımızda Tanıtım Yazısı",
      type: "localizedBlock",
      group: "about",
    }),
    defineField({
      name: "aboutImage",
      title: "Hakkımızda Görseli",
      type: "image",
      group: "about",
      options: { hotspot: true },
      fields: [
        {
          name: "alt",
          type: "string",
          title: "Alt Açıklama",
          validation: (Rule) => Rule.required(),
        },
      ],
    }),
    defineField({
      name: "aboutCtaLabel",
      title: "Daha Fazla Buton Metni",
      type: "localizedString",
      group: "about",
      initialValue: { tr: "Devamını Oku", en: "Read More" },
    }),

    // Campaigns Section
    defineField({
      name: "campaignsTitle",
      title: "Kampanyalar Başlık",
      type: "localizedString",
      group: "campaigns",
      initialValue: { tr: "Güncel Kampanyalar", en: "Current Offers" },
    }),
    defineField({
      name: "campaignsSubtitle",
      title: "Kampanyalar Alt Başlık",
      type: "localizedText",
      group: "campaigns",
    }),
    defineField({
      name: "campaignsImage",
      title: "Kampanya Tanıtım Görseli",
      type: "image",
      group: "campaigns",
      options: { hotspot: true },
      fields: [
        {
          name: "alt",
          type: "string",
          title: "Alt Açıklama",
          validation: (Rule) => Rule.required(),
        },
      ],
    }),
    defineField({
      name: "campaignsCtaLabel",
      title: "Kampanyalar Buton Metni",
      type: "localizedString",
      group: "campaigns",
      initialValue: { tr: "Kampanyaları Gör", en: "View Offers" },
    }),

    // Events Section
    defineField({
      name: "eventsTitle",
      title: "Etkinlikler Başlık",
      type: "localizedString",
      group: "events",
      initialValue: { tr: "Eğlenceli Etkinlikler", en: "Exciting Events" },
    }),
    defineField({
      name: "eventsSubtitle",
      title: "Etkinlikler Alt Başlık",
      type: "localizedText",
      group: "events",
    }),
    defineField({
      name: "eventsImage",
      title: "Etkinlik Tanıtım Görseli",
      type: "image",
      group: "events",
      options: { hotspot: true },
      fields: [
        {
          name: "alt",
          type: "string",
          title: "Alt Açıklama",
          validation: (Rule) => Rule.required(),
        },
      ],
    }),
    defineField({
      name: "eventsCtaLabel",
      title: "Etkinlikler Buton Metni",
      type: "localizedString",
      group: "events",
      initialValue: { tr: "Etkinlikleri Gör", en: "View Events" },
    }),

    // Stores Section (Mağazalar)
    defineField({
      name: "storesTag",
      title: "Mağazalar Bölüm Etiketi",
      type: "localizedString",
      group: "stores",
      initialValue: { tr: "ALIŞVERİŞ", en: "SHOP" },
    }),
    defineField({
      name: "storesTitle",
      title: "Mağazalar Başlık",
      type: "localizedString",
      group: "stores",
      initialValue: { tr: "Mağazalarımız", en: "Our Stores" },
    }),
    defineField({
      name: "storesSubtitle",
      title: "Mağazalar Alt Başlık",
      type: "localizedText",
      group: "stores",
    }),
    defineField({
      name: "storesImage",
      title: "Mağazalar Bölüm Görseli",
      type: "image",
      group: "stores",
      options: { hotspot: true },
      fields: [
        {
          name: "alt",
          type: "string",
          title: "Alt Açıklama",
          validation: (Rule) => Rule.required(),
        },
      ],
    }),
    defineField({
      name: "storesCtaLabel",
      title: "Mağazalar Buton Metni",
      type: "localizedString",
      group: "stores",
      initialValue: { tr: "MARKALARI GEZ", en: "EXPLORE BRANDS" },
    }),

    // Dining Section (Yeme-İçme)
    defineField({
      name: "diningTag",
      title: "Yeme-İçme Bölüm Etiketi",
      type: "localizedString",
      group: "dining",
      initialValue: { tr: "LEZZET", en: "DINE" },
    }),
    defineField({
      name: "diningTitle",
      title: "Yeme-İçme Başlık",
      type: "localizedString",
      group: "dining",
      initialValue: { tr: "Lezzet Noktaları", en: "Dining & Cafes" },
    }),
    defineField({
      name: "diningSubtitle",
      title: "Yeme-İçme Alt Başlık",
      type: "localizedText",
      group: "dining",
    }),
    defineField({
      name: "diningImage",
      title: "Yeme-İçme Bölüm Görseli",
      type: "image",
      group: "dining",
      options: { hotspot: true },
      fields: [
        {
          name: "alt",
          type: "string",
          title: "Alt Açıklama",
          validation: (Rule) => Rule.required(),
        },
      ],
    }),
    defineField({
      name: "diningCtaLabel",
      title: "Yeme-İçme Buton Metni",
      type: "localizedString",
      group: "dining",
      initialValue: { tr: "LEZZETLERİ KEŞFET", en: "EXPLORE DINING" },
    }),

    // Cinema Section (Sinema)
    defineField({
      name: "cinemaTag",
      title: "Sinema Bölüm Etiketi",
      type: "localizedString",
      group: "cinema",
      initialValue: { tr: "SİNEMA / EĞLENCE", en: "ENTERTAIN" },
    }),
    defineField({
      name: "cinemaTitle",
      title: "Sinema Başlık",
      type: "localizedString",
      group: "cinema",
      initialValue: { tr: "AVLU34 Sinema", en: "AVLU34 Cinema" },
    }),
    defineField({
      name: "cinemaSubtitle",
      title: "Sinema Alt Başlık",
      type: "localizedText",
      group: "cinema",
    }),
    defineField({
      name: "cinemaImage",
      title: "Sinema Bölüm Görseli",
      type: "image",
      group: "cinema",
      options: { hotspot: true },
      fields: [
        {
          name: "alt",
          type: "string",
          title: "Alt Açıklama",
          validation: (Rule) => Rule.required(),
        },
      ],
    }),
    defineField({
      name: "cinemaCtaLabel",
      title: "Sinema Buton Metni",
      type: "localizedString",
      group: "cinema",
      initialValue: { tr: "SALONLARI İNCELE", en: "EXPLORE CINEMA" },
    }),

    // Floor Plan Section
    defineField({
      name: "mapTitle",
      title: "Kat Planı Başlık",
      type: "localizedString",
      group: "map",
      initialValue: { tr: "AVM Kat Planı", en: "Mall Directory" },
    }),
    defineField({
      name: "mapSubtitle",
      title: "Kat Planı Alt Başlık",
      type: "localizedText",
      group: "map",
    }),

    // Visit Section
    defineField({
      name: "visitTitle",
      title: "Ziyaret Başlık",
      type: "localizedString",
      group: "visit",
      initialValue: { tr: "Ziyaretinizi Planlayın", en: "Plan Your Visit" },
    }),
    defineField({
      name: "visitSubtitle",
      title: "Ziyaret Alt Başlık",
      type: "localizedText",
      group: "visit",
    }),

    // SEO
    defineField({
      name: "seo",
      title: "SEO Ayarları",
      type: "seo",
      group: "seo",
    }),
  ],
});
