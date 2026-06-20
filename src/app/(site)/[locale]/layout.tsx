import { notFound } from "next/navigation";
import { isLocale, Locale } from "@/lib/i18n/config";
import { getLayoutData } from "@/lib/seo";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { WhatsAppButton } from "@/components/layout/WhatsAppButton";

type Props = {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
};

export default async function SiteLayout({ children, params }: Props) {
  const { locale } = await params;

  if (!isLocale(locale)) {
    notFound();
  }

  const data = await getLayoutData(locale);

  return (
    <>
      <Header settings={data?.settings} navigation={data?.navigation} locale={locale as Locale} />
      <main>{children}</main>
      <Footer settings={data?.settings} navigation={data?.navigation} locale={locale as Locale} />
      {data?.settings?.contactInfo?.whatsappNumber && (
        <WhatsAppButton number={data.settings.contactInfo.whatsappNumber} />
      )}
    </>
  );
}
