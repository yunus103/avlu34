import { defineField, defineType } from "sanity";
import { turkishSlugify } from "../../lib/slugify";

export const campaignType = defineType({
  name: "campaign",
  title: "Kampanya",
  type: "document",
  fields: [
    defineField({
      name: "title",
      title: "Kampanya Başlığı",
      type: "localizedString",
      description: "Kampanyanın Türkçe ve İngilizce dikkat çekici başlığı.",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "slug",
      title: "Slug",
      type: "slug",
      description: "Kampanya detay sayfası URL'sini belirler (Örn: /kampanyalar/babalar-gunu-indirimi). Türkçe başlığa göre otomatik üretilebilir.",
      options: {
        source: "title.tr",
        slugify: turkishSlugify,
        maxLength: 96,
      },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "shortDescription",
      title: "Kısa Açıklama",
      type: "localizedString",
      description: "Kampanya kartında gösterilecek 1-2 cümlelik kısa tanıtım metni (Maksimum 120 karakter önerilir. Türkçe ve İngilizce alanları içerir).",
    }),
    defineField({
      name: "image",
      title: "Kampanya Görseli / Afişi",
      type: "image",
      description: "Kampanya afişi veya listelerde görünecek kapak görseli. Önerilen: Yatay/Geniş oranlı görseller.",
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
      description: "Kampanyanın başlayacağı ve sitede gösterileceği tarih-saat.",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "endsAt",
      title: "Bitiş Tarihi",
      type: "datetime",
      description: "Kampanyanın sona ereceği ve sitedeki listelerden otomatik kalkacağı tarih-saat.",
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
      description: "İşaretlenmezse kampanya sitede taslak olarak kalır ve hiçbir yerde görünmez.",
      initialValue: true,
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "showOnHome",
      title: "Ana Sayfada Göster",
      type: "boolean",
      description: "İşaretlenirse kampanya ana sayfadaki öne çıkanlar vitrininde gösterilir.",
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
      name: "relatedStores",
      title: "İlişkili Mağazalar",
      type: "array",
      description: "Bu kampanyayı düzenleyen veya kampanyanın geçerli olduğu mağaza(lar).",
      of: [{ type: "reference", to: [{ type: "store" }] }],
    }),
    defineField({
      name: "body",
      title: "Kampanya Detay Metni",
      type: "localizedBlock",
      description: "Kampanya içeriği, indirim oranları veya katılım koşullarına dair detaylı zengin metin.",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "terms",
      title: "Kampanya Katılım Koşulları",
      type: "localizedBlock",
      description: "Varsa yasal katılım koşulları, küçük yazılar veya uyarı metinleri.",
    }),
    defineField({
      name: "seo",
      title: "SEO Ayarları",
      type: "seo",
      description: "Bu kampanyanın detay sayfası için özel SEO başlık, açıklama ve sosyal medya paylaşım ayarları.",
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
