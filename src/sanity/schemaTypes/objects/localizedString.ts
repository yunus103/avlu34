import { defineField, defineType } from "sanity";

export const localizedStringType = defineType({
  name: "localizedString",
  title: "Localized String",
  type: "object",
  fields: [
    defineField({
      name: "tr",
      title: "Türkçe",
      type: "string",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "en",
      title: "İngilizce",
      type: "string",
    }),
  ],
});
