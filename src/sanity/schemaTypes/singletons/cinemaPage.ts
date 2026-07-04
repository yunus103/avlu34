import { defineField, defineType } from "sanity";

export const cinemaPageType = defineType({
  name: "cinemaPage",
  title: "Sinema Sayfası",
  type: "document",
  groups: [
    { name: "hero", title: "Page Hero Bölümü" },
    { name: "content", title: "Sayfa İçeriği" },
    { name: "seo", title: "SEO Ayarları" },
  ],
  fields: [
    defineField({
      name: "heroTitle",
      title: "Hero Başlık",
      type: "localizedString",
      group: "hero",
      description: "Sayfanın en üstündeki büyük görsel alanında gösterilecek ana başlık (Örn: Sinema Keyfi).",
    }),
    defineField({
      name: "heroSubtitle",
      title: "Hero Alt Başlık",
      type: "localizedText",
      group: "hero",
      description: "Hero başlığının altında yer alacak, tamamı büyük harf (UPPERCASE) olarak render edilen kısa slogan.",
    }),
    defineField({
      name: "heroImage",
      title: "Hero Arka Plan Görseli",
      type: "image",
      group: "hero",
      options: { hotspot: true },
      description: "Hero alanının arka planını kaplayacak olan geniş açılı sinema görseli. Net kontrast için üzerine siyah degrade uygulanacaktır.",
      fields: [
        {
          name: "alt",
          type: "string",
          title: "Alt Metni (SEO)",
          description: "Görselin ne olduğunu açıklayan, ekran okuyucular ve SEO botları için zorunlu alan.",
          validation: (Rule) => Rule.required(),
        },
      ],
    }),
    defineField({
      name: "pageTitle",
      title: "Sayfa Başlığı",
      type: "localizedString",
      group: "content",
      validation: (Rule) => Rule.required(),
      description: "Sol taraftaki ana içerik alanında gösterilecek serif yazı tipindeki başlık (Örn: AVLU34 Sinema).",
    }),
    defineField({
      name: "body",
      title: "Sinema Tanıtım Metni",
      type: "localizedBlock",
      group: "content",
      description: "Sinema salonu, genel atmosfer ve konfor özellikleri hakkında detaylı tanıtım yazısı.",
    }),

    defineField({
      name: "salonCount",
      title: "Salon Sayısı",
      type: "string",
      group: "content",
      description: "Sağ taraftaki bilgi panelinde (künyede) gösterilecek toplam salon adedi (Örn: 5). Boş bırakılırsa kartta gösterilmez.",
      initialValue: "5",
    }),
    defineField({
      name: "seatCount",
      title: "Koltuk Sayısı",
      type: "string",
      group: "content",
      description: "Sağ taraftaki bilgi panelinde (künyede) gösterilecek toplam koltuk kapasitesi (Örn: 463). Boş bırakılırsa kartta gösterilmez.",
      initialValue: "463",
    }),
    defineField({
      name: "phone",
      title: "Sinema Telefon Numarası",
      type: "string",
      group: "content",
      description: "Sağ taraftaki bilgi panelinde (künyede) gösterilecek olan gişe veya danışma telefon numarası (Örn: 0212 XXX XX XX).",
    }),
    defineField({
      name: "ticketUrl",
      title: "Bilet Satış / Seans Linki (Dış Link)",
      type: "url",
      group: "content",
      description: "Kullanıcıları bilet almaya yönlendiren dış seans sağlayıcı linki (Örn: Paribu Cineverse Avlu 34 sayfası). Boş bırakılırsa buton gösterilmez.",
    }),
    defineField({
      name: "privilegedHalls",
      title: "Ayrıcalıklı Salonlar",
      type: "array",
      group: "content",
      description: "Künye panelinde 'Ayrıcalıklı Salonlar' başlığı altında gösterilecek olan salonların SVG ikonları ve başlıkları (Örn: Sky Auditorium, Premium Cinema).",
      of: [
        {
          type: "image",
          title: "Ayrıcalıklı Salon",
          options: { hotspot: true },
          description: "Salon tipi için bir SVG ikon yükleyin. Başlığı aşağıdaki alandan girin.",
          fields: [
            {
              name: "title",
              title: "Salon Tipi / Başlık",
              type: "localizedString",
              description: "Salon tipinin adı (Örn: Sky Auditorium).",
              validation: (Rule) => Rule.required(),
            },
            {
              name: "alt",
              type: "string",
              title: "Alt Metni (SEO)",
              description: "İkonun ne olduğunu açıklayan zorunlu alan (Örn: Sky Auditorium İkonu).",
              validation: (Rule) => Rule.required(),
            },
          ],
        },
      ],
    }),
    defineField({
      name: "gallery",
      title: "Fotoğraf Galerisi",
      type: "array",
      group: "content",
      description: "Sayfanın sol alt kısmında yer alacak fotoğraf galerisi. Fotoğraflara tıklandığında açılan tam ekran Lightbox modunda altyazı desteği mevcuttur.",
      of: [
        {
          type: "image",
          options: { hotspot: true },
          description: "Galeriye eklenecek fotoğraf.",
          fields: [
            {
              name: "alt",
              type: "string",
              title: "Alt Metni (SEO)",
              description: "Görselin ne olduğunu açıklayan zorunlu alan.",
              validation: (Rule) => Rule.required(),
            },
            {
              name: "caption",
              title: "Görsel Altyazısı / Açıklaması",
              type: "localizedString",
              description: "Tam ekran modunda görselin en altında gösterilecek açıklayıcı metin (Örn: Sky Auditorium Özel Tasarımlı Deri Koltuklar).",
            },
          ],
        },
      ],
    }),
    defineField({
      name: "seo",
      title: "SEO Ayarları",
      type: "seo",
      group: "seo",
    }),
  ],
});
