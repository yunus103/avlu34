import { defineField, defineType } from "sanity";

export const cinemaPageType = defineType({
  name: "cinemaPage",
  title: "Sinema Sayfası",
  type: "document",
  groups: [
    { name: "hero", title: "Page Hero Bölümü" },
    { name: "content", title: "Sayfa İçeriği" },
    { name: "seo", title: "SEO Ayarları" },
  ],
  fields: [
    defineField({
      name: "heroTitle",
      title: "Hero Başlık",
      type: "localizedString",
      group: "hero",
    }),
    defineField({
      name: "heroSubtitle",
      title: "Hero Alt Başlık",
      type: "localizedText",
      group: "hero",
    }),
    defineField({
      name: "heroImage",
      title: "Hero Arka Plan Görseli",
      type: "image",
      group: "hero",
      options: { hotspot: true },
      fields: [
        {
          name: "alt",
          type: "string",
          title: "Alt Metni",
          validation: (Rule) => Rule.required(),
        },
      ],
    }),
    defineField({
      name: "pageTitle",
      title: "Sayfa Başlığı",
      type: "localizedString",
      group: "content",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "body",
      title: "Sinema Tanıtım Metni",
      type: "localizedBlock",
      group: "content",
    }),
    defineField({
      name: "mainImage",
      title: "Sinema Salonu Görseli",
      type: "image",
      group: "content",
      options: { hotspot: true },
      fields: [
        {
          name: "alt",
          type: "string",
          title: "Alt Metni",
          validation: (Rule) => Rule.required(),
        },
      ],
    }),
    defineField({
      name: "ticketUrl",
      title: "Bilet Satış / Seans Linki (Dış Link)",
      type: "url",
      description: "Paribu Cineverse vb. bilet alma dış bağlantısı.",
      group: "content",
    }),
    defineField({
      name: "seo",
      title: "SEO Ayarları",
      type: "seo",
      group: "seo",
    }),
  ],
});
