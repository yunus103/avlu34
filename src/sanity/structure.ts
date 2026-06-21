import { StructureResolver } from "sanity/structure";

const API_VERSION = "2024-01-01";

export const structure: StructureResolver = (S) =>
  S.list()
    .title("AVLU34 AVM Yönetim Paneli")
    .items([
      // 1. Global Ayarlar
      S.listItem()
        .title("⚙️ Global Ayarlar")
        .child(
          S.list()
            .title("Global Ayarlar")
            .items([
              S.listItem()
                .title("Site Ayarları")
                .id("siteSettings")
                .schemaType("siteSettings")
                .child(S.document().schemaType("siteSettings").documentId("siteSettings")),
              S.listItem()
                .title("Navigasyon Menüsü")
                .id("navigation")
                .schemaType("navigation")
                .child(S.document().schemaType("navigation").documentId("navigation")),
            ])
        ),
      S.divider(),

      // 2. Sabit Sayfalar
      S.listItem()
        .title("📄 Sabit Sayfalar")
        .child(
          S.list()
            .title("Sabit Sayfalar")
            .items([
              S.listItem()
                .title("🏠 Ana Sayfa")
                .id("homePage")
                .schemaType("homePage")
                .child(S.document().schemaType("homePage").documentId("homePage")),
              S.listItem()
                .title("ℹ️ Hakkımızda Sayfası")
                .id("aboutPage")
                .schemaType("aboutPage")
                .child(S.document().schemaType("aboutPage").documentId("aboutPage")),
              S.listItem()
                .title("📬 İletişim Sayfası")
                .id("contactPage")
                .schemaType("contactPage")
                .child(S.document().schemaType("contactPage").documentId("contactPage")),
              S.listItem()
                .title("🎬 Sinema Sayfası")
                .id("cinemaPage")
                .schemaType("cinemaPage")
                .child(S.document().schemaType("cinemaPage").documentId("cinemaPage")),
              S.listItem()
                .title("🗺️ Kat Planı Sayfası")
                .id("mallMapPage")
                .schemaType("mallMapPage")
                .child(S.document().schemaType("mallMapPage").documentId("mallMapPage")),
              S.listItem()
                .title("📍 Ziyaret Planı Sayfası")
                .id("visitPlanPage")
                .schemaType("visitPlanPage")
                .child(S.document().schemaType("visitPlanPage").documentId("visitPlanPage")),
              S.listItem()
                .title("⚖️ KVKK Sayfası")
                .id("kvkkPage")
                .schemaType("kvkkPage")
                .child(S.document().schemaType("kvkkPage").documentId("kvkkPage")),
            ])
        ),
      S.divider(),

      // 3. Ana Sayfa Vitrini
      S.listItem()
        .title("✨ Ana Sayfa Vitrini (Slaytlar)")
        .child(
          S.list()
            .title("Vitrindeki Slaytlar")
            .items([
              S.listItem()
                .title("🟢 Aktif Slaytlar")
                .child(
                  S.documentList()
                    .title("Aktif Slaytlar")
                    .schemaType("heroSlide")
                    .filter('_type == "heroSlide" && isPublished == true && (isDefault == true || (startsAt <= now() && endsAt >= now()))')
                    .apiVersion(API_VERSION)
                ),
              S.listItem()
                .title("🟡 Planlanan Slaytlar")
                .child(
                  S.documentList()
                    .title("Planlanan Slaytlar")
                    .schemaType("heroSlide")
                    .filter('_type == "heroSlide" && isPublished == true && isDefault != true && startsAt > now()')
                    .apiVersion(API_VERSION)
                ),
              S.listItem()
                .title("🔴 Süresi Geçen Slaytlar")
                .child(
                  S.documentList()
                    .title("Süresi Geçen Slaytlar")
                    .schemaType("heroSlide")
                    .filter('_type == "heroSlide" && isPublished == true && isDefault != true && endsAt < now()')
                    .apiVersion(API_VERSION)
                ),
              S.listItem()
                .title("⚪ Varsayılan (Fallback) Slaytlar")
                .child(
                  S.documentList()
                    .title("Varsayılan Slaytlar")
                    .schemaType("heroSlide")
                    .filter('_type == "heroSlide" && isDefault == true')
                    .apiVersion(API_VERSION)
                ),
              S.listItem()
                .title("🔵 Tüm Slaytlar (Düzenleme/Ekleme)")
                .child(
                  S.documentList()
                    .title("Tüm Slaytlar")
                    .schemaType("heroSlide")
                    .filter('_type == "heroSlide"')
                    .apiVersion(API_VERSION)
                ),
            ])
        ),
      S.divider(),

      // 4. Mağazalar
      S.listItem()
        .title("🛍️ Mağazalar (Alışveriş)")
        .child(
          S.list()
            .title("Mağaza Yönetimi")
            .items([
              S.documentTypeListItem("storeCategory").title("🏷️ Mağaza Kategorileri"),
              S.listItem()
                .title("🏬 Tüm Mağazalar")
                .child(
                  S.documentList()
                    .title("Tüm Mağazalar")
                    .schemaType("store")
                    .filter('_type == "store" && (shopType == "store" || shopType == "both")')
                    .apiVersion(API_VERSION)
                ),
            ])
        ),

      // 5. Yeme-İçme
      S.listItem()
        .title("🍽️ Yeme-İçme (Dine)")
        .child(
          S.list()
            .title("Yeme-İçme Yönetimi")
            .items([
              S.documentTypeListItem("foodCategory").title("🏷️ Yeme-İçme Kategorileri"),
              S.listItem()
                .title("🍕 Tüm Lezzet Noktaları")
                .child(
                  S.documentList()
                    .title("Tüm Lezzet Noktaları")
                    .schemaType("store")
                    .filter('_type == "store" && (shopType == "dining" || shopType == "both")')
                    .apiVersion(API_VERSION)
                ),
            ])
        ),
      S.divider(),

      // 6. Kampanyalar
      S.listItem()
        .title("🎁 Kampanyalar")
        .child(
          S.list()
            .title("Kampanya Yönetimi")
            .items([
              S.listItem()
                .title("🟢 Aktif Kampanyalar")
                .child(
                  S.documentList()
                    .title("Aktif Kampanyalar")
                    .schemaType("campaign")
                    .filter('_type == "campaign" && isPublished == true && startsAt <= now() && endsAt >= now()')
                    .apiVersion(API_VERSION)
                ),
              S.listItem()
                .title("🟡 Planlanan Kampanyalar")
                .child(
                  S.documentList()
                    .title("Planlanan Kampanyalar")
                    .schemaType("campaign")
                    .filter('_type == "campaign" && isPublished == true && startsAt > now()')
                    .apiVersion(API_VERSION)
                ),
              S.listItem()
                .title("🔴 Geçmiş Kampanyalar")
                .child(
                  S.documentList()
                    .title("Geçmiş Kampanyalar")
                    .schemaType("campaign")
                    .filter('_type == "campaign" && isPublished == true && endsAt < now()')
                    .apiVersion(API_VERSION)
                ),
              S.listItem()
                .title("🔵 Tüm Kampanyalar (Düzenleme/Ekleme)")
                .child(
                  S.documentList()
                    .title("Tüm Kampanyalar")
                    .schemaType("campaign")
                    .filter('_type == "campaign"')
                    .apiVersion(API_VERSION)
                ),
            ])
        ),

      // 7. Etkinlikler
      S.listItem()
        .title("🎉 Etkinlikler")
        .child(
          S.list()
            .title("Etkinlik Yönetimi")
            .items([
              S.listItem()
                .title("🟢 Yaklaşan / Aktif Etkinlikler")
                .child(
                  S.documentList()
                    .title("Yaklaşan / Aktif Etkinlikler")
                    .schemaType("event")
                    .filter('_type == "event" && isPublished == true && endsAt >= now()')
                    .apiVersion(API_VERSION)
                ),
              S.listItem()
                .title("🔴 Geçmiş Etkinlikler")
                .child(
                  S.documentList()
                    .title("Geçmiş Etkinlikler")
                    .schemaType("event")
                    .filter('_type == "event" && isPublished == true && endsAt < now()')
                    .apiVersion(API_VERSION)
                ),
              S.listItem()
                .title("🔵 Tüm Etkinlikler (Düzenleme/Ekleme)")
                .child(
                  S.documentList()
                    .title("Tüm Etkinlikler")
                    .schemaType("event")
                    .filter('_type == "event"')
                    .apiVersion(API_VERSION)
                ),
            ])
        ),
      S.divider(),

    ]);
