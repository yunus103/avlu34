import { defineField, defineType } from "sanity";

export const aboutPageType = defineType({
  name: "aboutPage",
  title: "Hakkımızda",
  type: "document",
  groups: [
    { name: "hero", title: "Page Hero Bölümü" },
    { name: "content", title: "Sayfa İçeriği" },
    { name: "cta", title: "CTA Yönlendirme Bölümü" },
    { name: "seo", title: "SEO Ayarları" },
  ],
  fields: [
    // Page Hero Group
    defineField({
      name: "heroTitle",
      title: "Hero Başlık",
      type: "localizedString",
      group: "hero",
      description: "Sayfa üst kısmında duracak ana başlık. Boş bırakılırsa Sayfa Başlığı kullanılır.",
    }),
    defineField({
      name: "heroSubtitle",
      title: "Hero Alt Başlık / Kısa Açıklama",
      type: "localizedText",
      group: "hero",
      description: "Sayfa üst kısmında duracak kısa açıklama yazısı.",
    }),
    defineField({
      name: "heroImage",
      title: "Hero Arka Plan Görseli",
      type: "image",
      group: "hero",
      options: { hotspot: true },
      fields: [
        {
          name: "alt",
          type: "string",
          title: "Alt Metni",
          validation: (Rule) => Rule.required(),
        },
      ],
      description: "Hero arka plan resmi. Yüklenmezse şık bir degrade renk arka planı kullanılır.",
    }),
    // Content Group
    defineField({
      name: "pageTitle",
      title: "Sayfa Başlığı",
      type: "localizedString",
      group: "content",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "pageSubtitle",
      title: "Giriş Alt Başlığı",
      type: "localizedText",
      group: "content",
    }),
    defineField({
      name: "body",
      title: "Detaylı İçerik",
      type: "localizedBlock",
      group: "content",
    }),
    defineField({
      name: "mainImage",
      title: "Ana Görsel (Yandaki Resim)",
      type: "image",
      group: "content",
      options: { hotspot: true },
      fields: [
        {
          name: "alt",
          type: "string",
          title: "Alt Metni",
          validation: (Rule) => Rule.required(),
        },
      ],
    }),
    defineField({
      name: "stats",
      title: "İstatistikler",
      type: "array",
      group: "content",
      description: "AVLU34'te neler var? kutucuklarında listelenecek sayılar ve açıklamalar.",
      of: [
        {
          type: "object",
          name: "statItem",
          title: "İstatistik Öğesi",
          fields: [
            defineField({
              name: "value",
              title: "Değer (Sayı)",
              type: "string",
              description: "Örn: 74, 5, 414, 365",
              validation: (Rule) => Rule.required(),
            }),
            defineField({
              name: "label",
              title: "Etiket / Açıklama",
              type: "localizedString",
              description: "Örn: Mağaza, Sinema Salonu",
              validation: (Rule) => Rule.required(),
            }),
            defineField({
              name: "icon",
              title: "İkon",
              type: "string",
              description: "Kutuda gösterilecek simge",
              options: {
                list: [
                  { title: "Mağaza (Alışveriş Çantası)", value: "bag" },
                  { title: "Sinema (Film Şeridi)", value: "film" },
                  { title: "Otopark (Araba)", value: "car" },
                  { title: "Kültür Merkezi (Bina/Tiyatro)", value: "culture" },
                  { title: "Semt Pazarı (Sepet)", value: "basket" },
                  { title: "Eğlence (Kalp)", value: "heart" },
                  { title: "Zaman / Gün (Takvim)", value: "calendar" },
                  { title: "Öne Çıkan (Yıldız)", value: "star" },
                ],
              },
            }),
          ],
          preview: {
            select: {
              title: "value",
              subtitle: "label.tr",
            },
            prepare(selection) {
              const { title, subtitle } = selection;
              return {
                title: title || "",
                subtitle: subtitle || "",
              };
            },
          },
        },
      ],
    }),
    // CTA Group
    defineField({
      name: "ctaTitle",
      title: "CTA Başlık",
      type: "localizedString",
      group: "cta",
      description: "Bölümün ana başlığı (Örn: Alışveriş Keyfini Yaşayın)",
    }),
    defineField({
      name: "ctaDescription",
      title: "CTA Açıklama",
      type: "localizedText",
      group: "cta",
      description: "Butonun üstünde yer alacak kısa açıklama yazısı.",
    }),
    defineField({
      name: "ctaButtonText",
      title: "CTA Buton Metni",
      type: "localizedString",
      group: "cta",
      description: "Butonun üzerinde yazacak yazı (Örn: MAĞAZALARI KEŞFET)",
    }),
    defineField({
      name: "ctaButtonLink",
      title: "CTA Buton Linki",
      type: "string",
      group: "cta",
      description: "Yönlendirilecek sayfa yolu (Örn: /magazalar, /yeme-icme, veya /sinema)",
    }),
    defineField({
      name: "ctaButton2Text",
      title: "CTA İkinci Buton Metni (Opsiyonel)",
      type: "localizedString",
      group: "cta",
      description: "İkinci butonun üzerinde yazacak yazı (Örn: YEME İÇME ALANLARI)",
    }),
    defineField({
      name: "ctaButton2Link",
      title: "CTA İkinci Buton Linki (Opsiyonel)",
      type: "string",
      group: "cta",
      description: "İkinci butonun yönlendirileceği sayfa yolu (Örn: /yeme-icme)",
    }),
    // SEO Group
    defineField({
      name: "seo",
      title: "SEO",
      type: "seo",
      group: "seo",
    }),
  ],
});
