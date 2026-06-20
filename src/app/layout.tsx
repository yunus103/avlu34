import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { buildMetadata, getLayoutData } from "@/lib/seo";

import { GoogleAnalytics, GoogleTagManager } from "@next/third-parties/google";
import { JsonLd, organizationJsonLd, websiteJsonLd } from "@/components/seo/JsonLd";
import NextTopLoader from "nextjs-toploader";

const inter = Inter({ subsets: ["latin"] });

export async function generateMetadata(): Promise<Metadata> {
  return buildMetadata();
}

type RootProps = {
  children: React.ReactNode;
  params: Promise<{ locale?: string }>;
};

export default async function RootLayout({ children, params }: RootProps) {
  const { locale } = await params;
  const currentLocale = locale || "tr";
  const { settings } = await getLayoutData();

  return (
    <html lang={currentLocale} suppressHydrationWarning>
      <body className={inter.className}>
        <noscript>
          <style>{`[data-fade-in]{opacity:1!important;transform:none!important}`}</style>
        </noscript>
        {/* Sayfa geçişlerinde üstte ince ilerleme çubuğu — marka rengi kullanır */}
        <NextTopLoader
          color="var(--primary)"
          height={3}
          showSpinner={false}
          shadow={false}
          speed={200}
          crawlSpeed={200}
        />
        {settings?.gtmId && <GoogleTagManager gtmId={settings.gtmId} />}
        {settings?.gaId && <GoogleAnalytics gaId={settings.gaId} />}
        <JsonLd data={organizationJsonLd(settings)} />
        <JsonLd data={websiteJsonLd(settings)} />
        {children}
      </body>
    </html>
  );
}
