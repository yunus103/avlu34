import { defineField, defineType } from "sanity";
import { turkishSlugify } from "../../lib/slugify";

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
      title: "Slug (TR / EN)",
      type: "object",
      fields: [
        defineField({
          name: "tr",
          title: "Türkçe Slug",
          type: "slug",
          options: {
            source: "title.tr",
            slugify: turkishSlugify,
            maxLength: 96,
          },
          validation: (Rule) => Rule.required(),
        }),
        defineField({
          name: "en",
          title: "İngilizce Slug",
          type: "slug",
          options: {
            source: "title.en",
            slugify: turkishSlugify,
            maxLength: 96,
          },
          validation: (Rule) => Rule.required(),
        }),
      ],
    }),
  ],
  preview: {
    select: {
      title: "title.tr",
      subtitle: "slug.tr.current",
    },
  },
});
