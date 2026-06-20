import { defineField, defineType } from "sanity";

export const mallMapPageType = defineType({
  name: "mallMapPage",
  title: "Kat Planı Sayfası",
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
      name: "description",
      title: "Açıklama Metni",
      type: "localizedText",
      group: "content",
    }),
    defineField({
      name: "pdfFile",
      title: "Kat Planı PDF Dosyası",
      type: "file",
      description: "Ziyaretçilerin kat planını indirebileceği PDF dosyası.",
      group: "content",
    }),
    defineField({
      name: "mapImage",
      title: "Kat Planı Görseli",
      type: "image",
      description: "Sayfada önizleme olarak gösterilecek görsel.",
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
      name: "seo",
      title: "SEO Ayarları",
      type: "seo",
      group: "seo",
    }),
  ],
});
