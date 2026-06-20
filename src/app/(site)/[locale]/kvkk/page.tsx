import { Metadata } from "next";
import { PageHero } from "@/components/layout/PageHero";
import { locales, Locale } from "@/lib/i18n/config";
import { buildMetadata } from "@/lib/seo";
import { getPublicPath } from "@/lib/i18n/routes";

type Props = {
  params: Promise<{ locale: string }>;
};

export async function generateStaticParams() {
  return locales.map((locale) => ({ locale }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const isEn = locale === "en";
  return buildMetadata({
    title: isEn ? "Privacy Policy" : "Kullanım Şartları ve KVKK",
    canonicalPath: getPublicPath("kvkk", locale as Locale),
  });
}

export default async function KvkkPage({ params }: Props) {
  const { locale } = await params;
  const isEn = locale === "en";
  const title = isEn ? "Privacy Policy" : "Kullanım Şartları ve KVKK";
  const subtitle = isEn ? "Privacy policy and terms of use information" : "Gizlilik politikası ve kullanım şartları bilgilendirmesi";

  return (
    <div className="flex flex-col gap-12 pb-16">
      <PageHero title={title} subtitle={subtitle} />
      <div className="container mx-auto px-4">
        <p className="text-muted-foreground">
          {isEn 
            ? "Privacy notice and GDPR (KVKK) documents will be listed here." 
            : "Kişisel verilerin korunması ve gizlilik metinleri burada yer alacak."}
        </p>
      </div>
    </div>
  );
}
