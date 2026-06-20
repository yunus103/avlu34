import { defineField, defineType } from "sanity";

export const visitPlanPageType = defineType({
  name: "visitPlanPage",
  title: "Ziyaret Planı Sayfası",
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
      title: "Ulaşım ve Detaylı İçerik",
      type: "localizedBlock",
      group: "content",
    }),
    defineField({
      name: "services",
      title: "AVM Hizmetleri / Olanaklar",
      type: "array",
      group: "content",
      of: [
        {
          type: "object",
          fields: [
            defineField({ name: "title", title: "Hizmet Adı", type: "localizedString", validation: (Rule) => Rule.required() }),
            defineField({ name: "description", title: "Hizmet Açıklaması", type: "localizedText" }),
            defineField({ name: "icon", title: "İkon (Görsel)", type: "image" }),
          ],
          preview: {
            select: {
              title: "title.tr",
              subtitle: "description.tr",
              media: "icon",
            },
          },
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
