import { defineField, defineType } from "sanity";

export const eventType = defineType({
  name: "event",
  title: "Etkinlik",
  type: "document",
  fields: [
    defineField({
      name: "title",
      title: "Etkinlik Başlığı",
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
    defineField({
      name: "image",
      title: "Etkinlik Görseli / Afişi",
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
      name: "startsAt",
      title: "Başlangıç Tarihi",
      type: "datetime",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "endsAt",
      title: "Bitiş Tarihi",
      type: "datetime",
      validation: (Rule) =>
        Rule.required().custom((endsAt, context) => {
          const parent = context.parent as { startsAt?: string };
          if (endsAt && parent?.startsAt && new Date(endsAt) < new Date(parent.startsAt)) {
            return "Bitiş tarihi, başlangıç tarihinden önce olamaz";
          }
          return true;
        }),
    }),
    defineField({
      name: "time",
      title: "Etkinlik Saati",
      type: "localizedString",
      description: "Örn: 14:00 veya Cumartesi 15:00",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "location",
      title: "Etkinlik Yeri",
      type: "localizedString",
      description: "Örn: Zemin Kat Etkinlik Alanı",
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
      name: "showOnHome",
      title: "Ana Sayfada Göster",
      type: "boolean",
      initialValue: true,
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "priority",
      title: "Gösterim Önceliği",
      type: "number",
      description: "Yüksek sayılar listede ve vitrinde en önce gösterilir.",
      initialValue: 0,
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "body",
      title: "Etkinlik Detay Metni",
      type: "localizedBlock",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "gallery",
      title: "Etkinlik Fotoğraf Galerisi",
      type: "array",
      of: [
        {
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
        },
      ],
    }),
    defineField({
      name: "seo",
      title: "SEO Ayarları",
      type: "seo",
    }),
  ],
  preview: {
    select: {
      title: "title.tr",
      startsAt: "startsAt",
      endsAt: "endsAt",
      media: "image",
    },
    prepare({ title, startsAt, endsAt, media }) {
      const sDate = startsAt ? new Date(startsAt).toLocaleDateString("tr-TR") : "";
      const eDate = endsAt ? new Date(endsAt).toLocaleDateString("tr-TR") : "";
      return {
        title,
        subtitle: `${sDate} - ${eDate}`,
        media,
      };
    },
  },
});
