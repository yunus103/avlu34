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
      description: "Slayt üzerinde kalın ve büyük harflerle gösterilecek ana başlıktır. (Örn: BABALAR GÜNÜNE ÖZEL FIRSATLAR)",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "subtitle",
      title: "Slayt Açıklaması (Alt Başlık)",
      type: "localizedString",
      description: "Ana başlığın hemen altında yer alacak, kampanyayı veya etkinliği açıklayan kısa yazıdır.",
    }),
    defineField({
      name: "tag",
      title: "Slayt Etiketi / Kategorisi (Opsiyonel)",
      type: "localizedString",
      description: "Başlığın hemen üstünde küçük harflerle görünen kategori veya etiket yazısıdır. (Örn: ETKİNLİK, KAMPANYA, KAFELER vb. Boş bırakılırsa bu alan gizlenir.)",
    }),
    defineField({
      name: "desktopImage",
      title: "Masaüstü Görseli",
      type: "image",
      description: "Bilgisayar ekranlarında arka plan olarak gösterilecek yatay, yüksek kaliteli görseldir.",
      options: { hotspot: true },
      fields: [
        {
          name: "alt",
          type: "string",
          title: "Alternatif Açıklama",
          description: "Görselin ne olduğunu açıklayan kısa kelime (Örn: Babalar Günü Alışveriş Yapan İnsanlar). SEO ve erişilebilirlik açısından zorunludur.",
          validation: (Rule) => Rule.required(),
        },
      ],
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "mobileImage",
      title: "Mobil Görsel (Opsiyonel)",
      type: "image",
      description: "Telefon ve tablet ekranlarında daha iyi durması için dikey veya kare formatta yükleyebileceğiniz görseldir. Boş bırakılırsa masaüstü görseli kırpılarak kullanılır.",
      options: { hotspot: true },
      fields: [
        {
          name: "alt",
          type: "string",
          title: "Alternatif Açıklama",
          description: "Görselin ne olduğunu açıklayan kısa kelime (SEO için).",
        },
      ],
    }),
    defineField({
      name: "ctaLabel",
      title: "Buton Yazısı (CTA)",
      type: "localizedString",
      description: "Slayt üzerindeki butonda yazacak yönlendirme yazısıdır. (Örn: DETAYLARI GÖR, MAĞAZALARI KEŞFET)",
    }),
    defineField({
      name: "ctaLink",
      title: "Buton Linki (CTA Link)",
      type: "string",
      description: "Butona tıklandığında açılacak sayfa yoludur. AVM içi sayfalar için '/magazalar' veya '/kampanyalar/kampanya-adi', dış bağlantılar için 'https://...' şeklinde tam adres girilmelidir.",
    }),
    defineField({
      name: "startsAt",
      title: "Yayın Başlangıç Tarihi",
      type: "datetime",
      description: "Slaytın sitede otomatik olarak gösterilmeye başlanacağı tarih ve saattir. Süreli slaytlar (kampanya/etkinlik) için girilmesi zorunludur.",
      validation: (Rule) =>
        Rule.custom((startsAt, context) => {
          const parent = context.parent as { isDefault?: boolean };
          if (parent?.isDefault !== true && !startsAt) {
            return "Varsayılan olmayan (süreli) slaytlar için başlangıç tarihi zorunludur.";
          }
          return true;
        }),
    }),
    defineField({
      name: "endsAt",
      title: "Yayın Bitiş Tarihi",
      type: "datetime",
      description: "Slaytın siteden otomatik olarak kaldırılacağı tarih ve saattir. Süreli slaytlar (kampanya/etkinlik) için girilmesi zorunludur.",
      validation: (Rule) =>
        Rule.custom((endsAt, context) => {
          const parent = context.parent as { isDefault?: boolean; startsAt?: string };
          if (parent?.isDefault !== true && !endsAt) {
            return "Varsayılan olmayan (süreli) slaytlar için bitiş tarihi zorunludur.";
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
      description: "Herhangi bir süreli kampanya veya etkinlik slaytı bulunmadığında ana sayfanın boş kalmaması için arka planda sürekli dönecek olan genel AVM tanıtım slaytlarıdır. Tarih sınırlaması yoktur.",
      initialValue: false,
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "isPublished",
      title: "Yayında mı?",
      type: "boolean",
      description: "Slaytın sitede aktif olarak kullanılıp kullanılmayacağını belirler. Pasife alırsanız hiçbir şekilde sitede görünmez.",
      initialValue: true,
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "priority",
      title: "Öncelik Sırası",
      type: "number",
      description: "Slaytların gösterim önceliğidir. Yüksek sayıya sahip olanlar (örn: 10) ilk önce gösterilir. Eşitlik durumunda son oluşturulan ilk gösterilir.",
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
