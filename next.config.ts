import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "cdn.sanity.io",
      },
    ],
  },
  async rewrites() {
    return [
      // 1. Root path (Default Turkish)
      { source: "/", destination: "/tr" },

      // 2. Turkish public routes -> internal /tr routes
      { source: "/magazalar", destination: "/tr/magazalar" },
      { source: "/magazalar/:slug*", destination: "/tr/magazalar/:slug*" },
      { source: "/yeme-icme", destination: "/tr/yeme-icme" },
      { source: "/yeme-icme/:kategori*", destination: "/tr/yeme-icme/:kategori*" },
      { source: "/sinema", destination: "/tr/sinema" },
      { source: "/kampanyalar", destination: "/tr/kampanyalar" },
      { source: "/kampanyalar/:slug*", destination: "/tr/kampanyalar/:slug*" },
      { source: "/etkinlikler", destination: "/tr/etkinlikler" },
      { source: "/etkinlikler/:slug*", destination: "/tr/etkinlikler/:slug*" },
      { source: "/ziyaret-plani", destination: "/tr/ziyaret-plani" },
      { source: "/hakkimizda", destination: "/tr/hakkimizda" },
      { source: "/iletisim", destination: "/tr/iletisim" },
      { source: "/kvkk", destination: "/tr/kvkk" },
      { source: "/arama", destination: "/tr/arama" },

      // 3. English public routes -> internal /en routes
      { source: "/en/stores", destination: "/en/magazalar" },
      { source: "/en/stores/:slug*", destination: "/en/magazalar/:slug*" },
      { source: "/en/dining", destination: "/en/yeme-icme" },
      { source: "/en/dining/:kategori*", destination: "/en/yeme-icme/:kategori*" },
      { source: "/en/cinema", destination: "/en/sinema" },
      { source: "/en/offers", destination: "/en/kampanyalar" },
      { source: "/en/offers/:slug*", destination: "/en/kampanyalar/:slug*" },
      { source: "/en/events", destination: "/en/etkinlikler" },
      { source: "/en/events/:slug*", destination: "/en/etkinlikler/:slug*" },
      { source: "/en/visit-plan", destination: "/en/ziyaret-plani" },
      { source: "/en/about-us", destination: "/en/hakkimizda" },
      { source: "/en/contact", destination: "/en/iletisim" },
      { source: "/en/privacy", destination: "/en/kvkk" },
      { source: "/en/search", destination: "/en/arama" },
    ];
  },
};

export default nextConfig;

