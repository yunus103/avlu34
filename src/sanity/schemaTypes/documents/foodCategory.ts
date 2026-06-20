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
      title: "Slug",
      type: "slug",
      description: "Sayfa URL'sini belirler (Örn: /yeme-icme/fast-food). Türkçe başlığa göre otomatik üretilebilir.",
      options: {
        source: "title.tr",
        slugify: turkishSlugify,
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
