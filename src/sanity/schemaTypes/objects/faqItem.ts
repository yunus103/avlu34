import { defineField, defineType } from "sanity";

export const faqItem = defineType({
  name: "faqItem",
  title: "Soru & Cevap",
  type: "object",
  fields: [
    defineField({
      name: "question",
      title: "Soru",
      type: "localizedString",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "answer",
      title: "Cevap",
      type: "localizedText",
      validation: (Rule) => Rule.required(),
    }),
  ],
  preview: {
    select: {
      title: "question.tr",
      subtitle: "answer.tr",
    },
  },
});
