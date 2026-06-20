import { defineField, defineType } from "sanity";

export const heroSlideType = defineType({
  name: "heroSlide",
  title: "Ana Sayfa Slaytı (Hero)",
  type: "document",
  fields: [
    defineField({
      name: "title",
      title: "Slayt Başlığı",
      type: "localizedString",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "subtitle",
      title: "Slayt Alt Başlığı / Açıklaması",
      type: "localizedString",
    }),
    defineField({
      name: "desktopImage",
      title: "Masaüstü Görseli",
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
      name: "mobileImage",
      title: "Mobil Görsel (Opsiyonel)",
      type: "image",
      options: { hotspot: true },
      fields: [
        {
          name: "alt",
          type: "string",
          title: "Alt Açıklama",
        },
      ],
    }),
    defineField({
      name: "ctaLabel",
      title: "Buton Yazısı (CTA)",
      type: "localizedString",
    }),
    defineField({
      name: "ctaLink",
      title: "Buton Linki (CTA Link)",
      type: "string",
      description: "Örn: /magazalar, /kampanyalar/babalar-gunu veya https://...",
    }),
    defineField({
      name: "startsAt",
      title: "Başlangıç Tarihi",
      type: "datetime",
      description: "Varsayılan slayt değilse zorunludur.",
      validation: (Rule) =>
        Rule.custom((startsAt, context) => {
          const parent = context.parent as { isDefault?: boolean };
          if (parent?.isDefault !== true && !startsAt) {
            return "Varsayılan olmayan slaytlar için başlangıç tarihi zorunludur.";
          }
          return true;
        }),
    }),
    defineField({
      name: "endsAt",
      title: "Bitiş Tarihi",
      type: "datetime",
      description: "Varsayılan slayt değilse zorunludur.",
      validation: (Rule) =>
        Rule.custom((endsAt, context) => {
          const parent = context.parent as { isDefault?: boolean; startsAt?: string };
          if (parent?.isDefault !== true && !endsAt) {
            return "Varsayılan olmayan slaytlar için bitiş tarihi zorunludur.";
          }
          if (endsAt && parent?.startsAt && new Date(endsAt) < new Date(parent.startsAt)) {
            return "Bitiş tarihi, başlangıç tarihinden önce olamaz.";
          }
          return true;
        }),
    }),
    defineField({
      name: "isDefault",
      title: "Varsayılan (Fallback) Slayt mı?",
      type: "boolean",
      description: "Herhangi bir aktif kampanya/etkinlik slaytı yoksa bu slaytlar gösterilir. Tarih sınırlaması yoktur.",
      initialValue: false,
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "isPublished",
      title: "Yayında mı?",
      type: "boolean",
      initialValue: true,
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "priority",
      title: "Öncelik Sırası",
      type: "number",
      description: "Yüksek sayılar ilk önce gösterilir.",
      initialValue: 0,
      validation: (Rule) => Rule.required(),
    }),
  ],
  preview: {
    select: {
      title: "title.tr",
      isDefault: "isDefault",
      startsAt: "startsAt",
      endsAt: "endsAt",
      media: "desktopImage",
    },
    prepare({ title, isDefault, startsAt, endsAt, media }) {
      const typeLabel = isDefault ? "Varsayılan Slayt" : "Süreli Slayt";
      const duration = isDefault 
        ? "Her Zaman Açık" 
        : `${startsAt ? new Date(startsAt).toLocaleDateString("tr-TR") : ""} - ${endsAt ? new Date(endsAt).toLocaleDateString("tr-TR") : ""}`;
      return {
        title,
        subtitle: `${typeLabel} | ${duration}`,
        media,
      };
    },
  },
});
