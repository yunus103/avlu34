import { defineField, defineType } from "sanity";
import { turkishSlugify } from "../../lib/slugify";

export const eventType = defineType({
  name: "event",
  title: "Etkinlik",
  type: "document",
  fields: [
    defineField({
      name: "title",
      title: "Etkinlik Başlığı",
      type: "localizedString",
      description: "Etkinliğin Türkçe ve İngilizce dikkat çekici adı.",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "slug",
      title: "Slug",
      type: "slug",
      description: "Etkinlik detay sayfası URL'sini belirler (Örn: /etkinlikler/acilis-konseri). Türkçe başlığa göre otomatik üretilebilir.",
      options: {
        source: "title.tr",
        slugify: turkishSlugify,
        maxLength: 96,
      },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "image",
      title: "Etkinlik Görseli / Afişi",
      type: "image",
      description: "Etkinlik afişi veya listelerde görünecek kapak görseli. Önerilen: Dikdörtgen afiş formatı veya geniş ekran kapak.",
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
      name: "startsAt",
      title: "Başlangıç Tarihi",
      type: "datetime",
      description: "Etkinliğin başlayacağı ve sitede gösterileceği tarih-saat.",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "endsAt",
      title: "Bitiş Tarihi",
      type: "datetime",
      description: "Etkinliğin biteceği ve sitedeki aktif listelerden otomatik kalkacağı tarih-saat.",
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
      description: "Ziyaretçilere gösterilecek saat bilgisi (Örn: 14:00 - 18:00 veya Her Gün 15:00).",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "location",
      title: "Etkinlik Yeri",
      type: "localizedString",
      description: "Etkinliğin AVM içinde nerede yapılacağı (Örn: Zemin Kat Etkinlik Alanı / Ground Floor Event Area).",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "isPublished",
      title: "Yayında mı?",
      type: "boolean",
      description: "İşaretlenmezse etkinlik sitede taslak olarak kalır ve hiçbir yerde görünmez.",
      initialValue: true,
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "showOnHome",
      title: "Ana Sayfada Göster",
      type: "boolean",
      description: "İşaretlenirse etkinlik ana sayfadaki öne çıkanlar vitrininde gösterilir.",
      initialValue: true,
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "priority",
      title: "Gösterim Önceliği",
      type: "number",
      description: "Yüksek sayılar (Örn: 100) listede ve vitrinde en önce gösterilir.",
      initialValue: 0,
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "body",
      title: "Etkinlik Detay Metni",
      type: "localizedBlock",
      description: "Etkinlik programı, katılım detayları ve zengin içerikli açıklama metni.",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "gallery",
      title: "Etkinlik Fotoğraf Galerisi",
      type: "array",
      description: "Geçmiş etkinlik fotoğrafları veya etkinlik alanından kareler (Opsiyonel).",
      of: [
        {
          type: "image",
          options: { hotspot: true },
          fields: [
            {
              name: "alt",
              type: "string",
              title: "Alt Açıklama",
              description: "Görselin ne olduğunu açıklayan kısa metin.",
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
      description: "Bu etkinliğin detay sayfası için özel SEO başlık, açıklama ve sosyal ağ paylaşım ayarları.",
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
