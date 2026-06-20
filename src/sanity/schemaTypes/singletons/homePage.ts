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

    // Stores Section
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

    // Dining Section
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

    // Cinema Section
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
