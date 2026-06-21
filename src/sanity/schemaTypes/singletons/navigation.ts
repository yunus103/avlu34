import { defineField, defineType } from "sanity";

const navItemFields = [
  defineField({ 
    name: "label", 
    title: "Etiket", 
    type: "localizedString", 
    description: "Menüde görünecek başlık. Türkçe ve İngilizce alanları doldurun (Örn: Mağazalar / Stores).",
    validation: (Rule) => Rule.required() 
  }),
  defineField({
    name: "href",
    title: "Link / Sayfa Yolu",
    type: "localizedString",
    description: "Yönlendirilecek sayfa adresi. Başına /tr veya /en KOYMAYIN. İç sayfalar için sade bir yol (Örn: Türkçe için '/magazalar', İngilizce için '/stores') girin. İngilizce boş bırakılırsa otomatik Türkçe yoldan çevrilir. Dış siteler için tam URL yazabilirsiniz (Örn: 'https://whatsapp.com').",
    validation: (Rule) => Rule.required(),
  }),
  defineField({ 
    name: "openInNewTab", 
    title: "Yeni Sekmede Aç", 
    type: "boolean", 
    description: "Aktif edilirse, bağlantı tıklandığında yeni bir tarayıcı sekmesinde açılır (Dış linkler veya haritalar için önerilir).",
    initialValue: false 
  }),
  defineField({ 
    name: "isMegaMenu", 
    title: "Mega Menü Olarak Göster", 
    type: "boolean", 
    description: "Sadece Header menüsü için geçerlidir. Aktif edilirse alt linkler 4 sütunlu büyük, şık bir açılır panel yerleşimi şeklinde gösterilir.",
    initialValue: false 
  }),
  defineField({
    name: "subLinks",
    title: "Alt Linkler",
    type: "array",
    description: "Bu menü ögesinin altında listelenecek alt bağlantılar. Örneğin 'Mağazalar' ögesinin altına mağaza kategorilerini (Giyim, Teknoloji vb.) ekleyebilirsiniz.",
    of: [{
      type: "object",
      fields: [
        defineField({ 
          name: "label", 
          title: "Etiket", 
          type: "localizedString", 
          description: "Alt menüde görünecek başlık (Örn: Giyim / Fashion).",
          validation: (Rule) => Rule.required() 
        }),
        defineField({ 
          name: "href", 
          title: "Link / Sayfa Yolu", 
          type: "localizedString", 
          description: "Alt menü elemanının adresi. Başına /en, /tr KOYMAYIN. Örn: Türkçe için '/magazalar/giyim', İngilizce için '/stores/fashion'. İngilizce boş bırakılırsa otomatik çevrilir.",
          validation: (Rule) => Rule.required(),
        }),
        defineField({ 
          name: "openInNewTab", 
          title: "Yeni Sekmede Aç", 
          type: "boolean", 
          description: "Alt linkin tıklandığında yeni tarayıcı sekmesinde açılmasını sağlar.",
          initialValue: false 
        }),
      ],
      preview: {
        select: {
          title: "label.tr",
          subtitle: "href.tr",
        },
      },
    }],
  }),
];

export const navigationType = defineType({
  name: "navigation",
  title: "Navigasyon",
  type: "document",
  fields: [
    defineField({
      name: "headerLinks",
      title: "Header Menü Linkleri",
      type: "array",
      description: "Web sitesinin en üstündeki ana navigasyon çubuğunda gösterilecek ana linkler ve alt mega menüler.",
      of: [{ type: "object", fields: navItemFields, preview: { select: { title: "label.tr", subtitle: "href.tr" } } }],
    }),
    defineField({
      name: "footerLinks",
      title: "Footer Menü Linkleri",
      type: "array",
      description: "Web sitesinin en altındaki footer alanında listelenecek site haritası link grupları.",
      of: [{ type: "object", fields: navItemFields, preview: { select: { title: "label.tr", subtitle: "href.tr" } } }],
    }),
  ],
});
