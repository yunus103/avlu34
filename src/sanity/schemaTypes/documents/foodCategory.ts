import { defineField, defineType } from "sanity";
import { turkishSlugify } from "../../lib/slugify";

export const foodCategoryType = defineType({
  name: "foodCategory",
  title: "Yeme-İçme Kategorisi",
  type: "document",
  fields: [
    defineField({
      name: "title",
      title: "Kategori Başlığı",
      type: "localizedString",
      description: "Restoran/kafe kategorisinin Türkçe ve İngilizce adı (Örn: Restoran / Restaurant)",
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
