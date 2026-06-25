import { defineField, defineType } from "sanity";

export const diningPageType = defineType({
  name: "diningPage",
  title: "Yeme-İçme Sayfası",
  type: "document",
  groups: [
    { name: "hero", title: "Page Hero Bölümü" },
    { name: "seo", title: "SEO Ayarları" },
  ],
  fields: [
    defineField({
      name: "title",
      title: "Sayfa Başlığı",
      type: "localizedString",
      group: "hero",
      description: "Sayfa üst kısmında duracak ana başlık (Örn: Yeme-İçme / Dining).",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "subtitle",
      title: "Sayfa Alt Başlığı",
      type: "localizedString",
      group: "hero",
      description: "Başlığın altında duracak kısa açıklama yazısı.",
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
          title: "Alt Metni (SEO)",
          description: "Görselin ne olduğunu açıklayan kısa metin.",
          validation: (Rule) => Rule.required(),
        },
      ],
      description: "Hero arka plan resmi. Yüklenmezse şık bir monokrom açık gri arka plan kullanılır.",
    }),
    defineField({
      name: "seo",
      title: "SEO",
      type: "seo",
      group: "seo",
    }),
  ],
  preview: {
    prepare() {
      return {
        title: "Yeme-İçme Sayfası Ayarları",
      };
    },
  },
});
