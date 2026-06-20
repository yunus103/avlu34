import { defineField, defineType } from "sanity";

export const foodCategoryType = defineType({
  name: "foodCategory",
  title: "Yeme-İçme Kategorisi",
  type: "document",
  fields: [
    defineField({
      name: "title",
      title: "Kategori Başlığı",
      type: "localizedString",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "slug",
      title: "Slug",
      type: "slug",
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
