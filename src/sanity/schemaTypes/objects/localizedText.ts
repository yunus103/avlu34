import { defineField, defineType } from "sanity";

export const localizedTextType = defineType({
  name: "localizedText",
  title: "Localized Text",
  type: "object",
  fields: [
    defineField({
      name: "tr",
      title: "Türkçe",
      type: "text",
      rows: 4,
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "en",
      title: "İngilizce",
      type: "text",
      rows: 4,
    }),
  ],
});
