import { defineField, defineType } from "sanity";

export const storeCategoryType = defineType({
  name: "storeCategory",
  title: "Mağaza Kategorisi",
  type: "document",
  fields: [
    defineField({
      name: "title",
      title: "Kategori Başlığı",
      type: "localizedString",
      description: "Mağaza kategorisinin Türkçe ve İngilizce adı (Örn: Giyim / Fashion)",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "slug",
      title: "Slug",
      type: "slug",
      description: "Sayfa URL'sini belirler (Örn: /magazalar/giyim). Türkçe başlığa göre otomatik üretilebilir.",
      options: {
        source: "title.tr",
        maxLength: 96,
      },
      validation: (Rule) => Rule.required(),
    }),
  ],
  preview: {
    select: {
      title: "title.tr",
      subtitle: "slug.current",
    },
  },
});
