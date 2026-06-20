import { defineField, defineType } from "sanity";

export const campaignType = defineType({
  name: "campaign",
  title: "Kampanya",
  type: "document",
  fields: [
    defineField({
      name: "title",
      title: "Kampanya Başlığı",
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
      title: "Kampanya Görseli / Afişi",
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
      name: "relatedStores",
      title: "İlişkili Mağazalar",
      type: "array",
      of: [{ type: "reference", to: [{ type: "store" }] }],
    }),
    defineField({
      name: "body",
      title: "Kampanya Detay Metni",
      type: "localizedBlock",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "terms",
      title: "Kampanya Katılım Koşulları",
      type: "localizedBlock",
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
