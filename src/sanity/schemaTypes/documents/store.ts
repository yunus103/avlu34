import { defineField, defineType } from "sanity";
import { turkishSlugify } from "../../lib/slugify";

export const storeType = defineType({
  name: "store",
  title: "Mağaza ve Lezzet Noktaları",
  type: "document",
  fields: [
    defineField({
      name: "title",
      title: "Mağaza / Marka Adı",
      type: "string",
      description: "Marka adı (Örn: Nike, Starbucks, LC Waikiki)",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "slug",
      title: "Slug",
      type: "slug",
      description: "Mağaza detay sayfasının URL'sini belirler (Örn: /magazalar/lc-waikiki). Başlığa göre otomatik üretilebilir.",
      options: {
        source: "title",
        slugify: turkishSlugify,
        maxLength: 96,
      },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "logo",
      title: "Logo / Görsel",
      type: "image",
      description: "Mağaza logosu veya vitrin görseli. Şeffaf arka planlı PNG logolar veya yüksek kaliteli kare görseller önerilir.",
      options: { hotspot: true },
      fields: [
        {
          name: "alt",
          type: "string",
          title: "Alt Açıklama",
          description: "Görselin ne olduğunu açıklayan kısa metin (Ekran okuyucular ve SEO için zorunludur).",
          validation: (Rule) => Rule.required(),
        },
      ],
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "shopType",
      title: "Nokta Türü",
      type: "string",
      description: "Bu noktanın bir mağaza mı (Alışveriş) yoksa lezzet noktası mı (Yeme-İçme) olduğunu belirler.",
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
      description: "Mağazanın ait olduğu ana alışveriş kategorisi.",
      to: [{ type: "storeCategory" }],
      hidden: ({ parent }) => parent?.shopType === "dining",
    }),
    defineField({
      name: "foodCategory",
      title: "Yeme-İçme Kategorisi",
      type: "reference",
      description: "Lezzet noktasının ait olduğu ana yeme-içme kategorisi.",
      to: [{ type: "foodCategory" }],
      hidden: ({ parent }) => parent?.shopType === "store",
    }),
    defineField({
      name: "floor",
      title: "Bulunduğu Kat",
      type: "string",
      description: "Mağazanın AVM içerisinde bulunduğu kat konumu.",
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
      description: "Mağaza hakkında kısa bilgi, sattığı ürün grupları vb. detaylı açıklama.",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "workingHours",
      title: "Çalışma Saatleri",
      type: "localizedString",
      description: "Mağazanın açık olduğu saat aralığı.",
      initialValue: {
        tr: "10:00 - 22:00",
        en: "10:00 AM - 10:00 PM",
      },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "phone",
      title: "Telefon Numarası",
      type: "string",
      description: "Ziyaretçilerin doğrudan mağazaya ulaşabileceği telefon (Örn: 0212 XXX XX XX).",
    }),
    defineField({
      name: "website",
      title: "Web Sitesi",
      type: "url",
      description: "Varsa markanın resmi web sitesi bağlantısı.",
    }),
    defineField({
      name: "socialLinks",
      title: "Sosyal Medya Hesapları",
      type: "array",
      description: "Markanın Instagram, Facebook vb. sosyal medya bağlantıları.",
      of: [{ type: "socialLink" }],
    }),
    defineField({
      name: "seo",
      title: "SEO Ayarları",
      type: "seo",
      description: "Bu mağazanın detay sayfası için özel SEO başlık, açıklama ve görsel ayarları.",
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
