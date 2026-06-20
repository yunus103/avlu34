import { defineField, defineType } from "sanity";

export const storeType = defineType({
  name: "store",
  title: "Mağaza ve Lezzet Noktaları",
  type: "document",
  fields: [
    defineField({
      name: "title",
      title: "Mağaza Adı",
      type: "string",
      description: "Marka adı (Örn: Nike, Starbucks)",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "slug",
      title: "Slug",
      type: "slug",
      options: {
        source: "title",
        maxLength: 96,
      },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "logo",
      title: "Logo / Görsel",
      type: "image",
      options: { hotspot: true },
      fields: [
        {
          name: "alt",
          type: "string",
          title: "Alt Açıklama",
          validation: (Rule) => Rule.required(),
        },
      ],
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "shopType",
      title: "Mağaza Türü",
      type: "string",
      options: {
        list: [
          { title: "Sadece Mağaza (Alışveriş)", value: "store" },
          { title: "Sadece Yeme-İçme (Dine)", value: "dining" },
          { title: "Her İkisi (Örn: Kahve satan kitapçı)", value: "both" },
        ],
        layout: "radio",
      },
      initialValue: "store",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "storeCategory",
      title: "Alışveriş Kategorisi",
      type: "reference",
      to: [{ type: "storeCategory" }],
      hidden: ({ parent }) => parent?.shopType === "dining",
    }),
    defineField({
      name: "foodCategory",
      title: "Yeme-İçme Kategorisi",
      type: "reference",
      to: [{ type: "foodCategory" }],
      hidden: ({ parent }) => parent?.shopType === "store",
    }),
    defineField({
      name: "floor",
      title: "Bulunduğu Kat",
      type: "string",
      options: {
        list: [
          { title: "Zemin Kat", value: "zemin" },
          { title: "1. Kat", value: "kat1" },
          { title: "2. Kat", value: "kat2" },
          { title: "3. Kat", value: "kat3" },
        ],
      },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "description",
      title: "Mağaza Açıklaması",
      type: "localizedText",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "workingHours",
      title: "Çalışma Saatleri",
      type: "localizedString",
      initialValue: {
        tr: "10:00 - 22:00",
        en: "10:00 AM - 10:00 PM",
      },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "phone",
      title: "Telefon",
      type: "string",
    }),
    defineField({
      name: "website",
      title: "Web Sitesi",
      type: "url",
    }),
    defineField({
      name: "socialLinks",
      title: "Sosyal Medya Hesapları",
      type: "array",
      of: [{ type: "socialLink" }],
    }),
    defineField({
      name: "seo",
      title: "SEO Ayarları",
      type: "seo",
    }),
  ],
  preview: {
    select: {
      title: "title",
      floor: "floor",
      type: "shopType",
      logo: "logo",
    },
    prepare({ title, floor, type, logo }) {
      const typeLabel = type === "store" ? "Alışveriş" : type === "dining" ? "Yeme-İçme" : "Hibrit";
      const floorLabel = floor ? `${floor.toUpperCase()} Kat` : "";
      return {
        title,
        subtitle: `${typeLabel} | ${floorLabel}`,
        media: logo,
      };
    },
  },
});
