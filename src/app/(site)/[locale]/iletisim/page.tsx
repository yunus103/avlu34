import { Metadata } from "next";
import { cachedFetch } from "@/sanity/lib/client";
import { contactPageQuery, layoutQuery } from "@/sanity/lib/queries";
import { buildMetadata } from "@/lib/seo";
import { FadeIn } from "@/components/ui/FadeIn";
import { ContactForm } from "@/components/forms/ContactForm";
import { PageHero } from "@/components/layout/PageHero";
import { ContactPage as ContactPageType, SiteSettings, SocialLink } from "@/types";
import { getPublicPath } from "@/lib/i18n/routes";
import { locales, Locale } from "@/lib/i18n/config";
import {
  FaInstagram,
  FaFacebook,
  FaLinkedin,
  FaYoutube,
  FaTiktok,
  FaPinterest,
  FaWhatsapp,
} from "react-icons/fa";
import { FaXTwitter } from "react-icons/fa6";
import { RiMailLine, RiPhoneLine, RiMapPinLine } from "react-icons/ri";

const socialIconMap: Record<string, React.ElementType> = {
  instagram: FaInstagram,
  facebook: FaFacebook,
  twitter: FaXTwitter,
  linkedin: FaLinkedin,
  youtube: FaYoutube,
  pinterest: FaPinterest,
  whatsapp: FaWhatsapp,
  tiktok: FaTiktok,
};

type Props = {
  params: Promise<{ locale: string }>;
};

export async function generateStaticParams() {
  return locales.map((locale) => ({ locale }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const data = await cachedFetch<ContactPageType>(contactPageQuery, { locale }, { next: { tags: ["contact"] } });
  
  return buildMetadata({
    title: data?.heroTitle || data?.pageTitle || "İletişim",
    canonicalPath: getPublicPath("iletisim", locale as Locale),
    pageSeo: data?.seo,
    locale,
  });
}

export default async function ContactPage({ params }: Props) {
  const { locale } = await params;
  const targetLocale = locale as Locale;

  const data = await cachedFetch<ContactPageType>(contactPageQuery, { locale }, { next: { tags: ["contact"] } });
  const layoutData = await cachedFetch<{ settings: SiteSettings }>(layoutQuery, { locale }, { next: { tags: ["layout"] } });
  const settings = layoutData?.settings;
  const contact = settings?.contactInfo;
  const socialLinks: SocialLink[] = (settings?.socialLinks || []).filter((s: SocialLink) => s.url);

  const breadcrumbs = [
    { label: targetLocale === "en" ? "Home" : "Ana Sayfa", href: getPublicPath("/", targetLocale) },
    { label: data?.pageTitle || (targetLocale === "en" ? "Contact" : "İletişim"), href: getPublicPath("iletisim", targetLocale), active: true },
  ];

  return (
    <div className="flex flex-col gap-12 md:gap-16 pb-16">
      {/* Page Hero */}
      <PageHero
        title={data?.heroTitle || data?.pageTitle || (targetLocale === "en" ? "Contact" : "İletişim")}
        subtitle={data?.heroSubtitle || data?.pageSubtitle}
        backgroundImage={data?.heroImage}
        breadcrumbs={breadcrumbs}
      />

      <div className="container mx-auto px-4">
        {/* Main Grid: Left Column is Contact Details, Right Column is Contact Form */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-start max-w-6xl mx-auto">
          {/* Left Column: Contact Info & Social Links */}
          <div className="lg:col-span-5 space-y-10">
            <FadeIn delay={0.1}>
              <div className="space-y-6">
                <h2 className="text-xl sm:text-2xl font-serif font-medium uppercase tracking-wider text-black border-b border-neutral-200 pb-4">
                  {targetLocale === "en" ? "CONTACT DETAILS" : "İLETİŞİM BİLGİLERİ"}
                </h2>

                <div className="space-y-6">
                  {/* Address */}
                  {contact?.address && (
                    <div className="flex items-start gap-4">
                      <div className="flex h-11 w-11 shrink-0 items-center justify-center bg-neutral-100 text-black">
                        <RiMapPinLine size={20} />
                      </div>
                      <div className="space-y-1">
                        <h4 className="text-xs font-bold tracking-widest uppercase text-neutral-400 font-sans">
                          {targetLocale === "en" ? "ADDRESS" : "ADRES"}
                        </h4>
                        <p className="text-base sm:text-lg font-sans text-neutral-800 leading-relaxed font-light select-text">
                          {contact.address}
                        </p>
                      </div>
                    </div>
                  )}

                  {/* Phone */}
                  {contact?.phone && (
                    <div className="flex items-start gap-4">
                      <div className="flex h-11 w-11 shrink-0 items-center justify-center bg-neutral-100 text-black">
                        <RiPhoneLine size={20} />
                      </div>
                      <div className="space-y-1">
                        <h4 className="text-xs font-bold tracking-widest uppercase text-neutral-400 font-sans">
                          {targetLocale === "en" ? "PHONE" : "TELEFON"}
                        </h4>
                        <a
                          href={`tel:${contact.phone}`}
                          className="inline-block text-base sm:text-lg font-sans text-neutral-800 hover:text-black transition-colors font-light select-text"
                        >
                          {contact.phone}
                        </a>
                      </div>
                    </div>
                  )}

                  {/* E-mail */}
                  {contact?.email && (
                    <div className="flex items-start gap-4">
                      <div className="flex h-11 w-11 shrink-0 items-center justify-center bg-neutral-100 text-black">
                        <RiMailLine size={20} />
                      </div>
                      <div className="space-y-1">
                        <h4 className="text-xs font-bold tracking-widest uppercase text-neutral-400 font-sans">
                          {targetLocale === "en" ? "EMAIL" : "E-POSTA"}
                        </h4>
                        <a
                          href={`mailto:${contact.email}`}
                          className="inline-block text-base sm:text-lg font-sans text-neutral-800 hover:text-black transition-colors font-light select-text break-all"
                        >
                          {contact.email}
                        </a>
                      </div>
                    </div>
                  )}

                  {/* WhatsApp */}
                  {contact?.whatsappNumber && (
                    <div className="flex items-start gap-4">
                      <div className="flex h-11 w-11 shrink-0 items-center justify-center bg-neutral-100 text-black">
                        <FaWhatsapp size={20} />
                      </div>
                      <div className="space-y-1">
                        <h4 className="text-xs font-bold tracking-widest uppercase text-neutral-400 font-sans">
                          WHATSAPP
                        </h4>
                        <a
                          href={`https://wa.me/${contact.whatsappNumber.replace(/\D/g, "")}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-block text-base sm:text-lg font-sans text-neutral-800 hover:text-black transition-colors font-light"
                        >
                          {targetLocale === "en" ? "Chat with Us" : "Bizimle Sohbet Edin"}
                        </a>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </FadeIn>

            {/* Social Media Links */}
            {socialLinks.length > 0 && (
              <FadeIn delay={0.2}>
                <div className="space-y-4">
                  <h3 className="text-xs font-bold tracking-widest uppercase text-neutral-400 font-sans">
                    {targetLocale === "en" ? "FOLLOW US" : "SOSYAL MEDYA"}
                  </h3>
                  <div className="flex flex-wrap gap-3">
                    {socialLinks.map((social, i) => {
                      const Icon = socialIconMap[social.platform];
                      if (!Icon) return null;
                      return (
                        <a
                          key={i}
                          href={social.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          aria-label={social.platform}
                          className="flex h-10 w-10 items-center justify-center rounded-full bg-black text-white hover:bg-neutral-800 transition-colors"
                        >
                          <Icon size={16} />
                        </a>
                      );
                    })}
                  </div>
                </div>
              </FadeIn>
            )}

            {/* Get Directions Button */}
            {contact?.googleMapsUrl && (
              <FadeIn delay={0.25}>
                <a
                  href={contact.googleMapsUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full sm:w-auto inline-flex items-center justify-center border border-black text-black hover:bg-black hover:text-white transition-all duration-300 uppercase tracking-[0.2em] text-xs font-semibold py-4 px-8 rounded-none cursor-pointer text-center"
                >
                  {targetLocale === "en" ? "GET DIRECTIONS" : "YOL TARİFİ AL"}
                </a>
              </FadeIn>
            )}
          </div>

          {/* Right Column: Contact Form */}
          <div className="lg:col-span-7">
            <FadeIn delay={0.3}>
              <ContactForm
                formTitle={data?.formTitle}
                successMessage={data?.successMessage}
                locale={targetLocale}
              />
            </FadeIn>
          </div>
        </div>
      </div>

      {/* Full width Map Area */}
      {contact?.mapIframe && (
        <div className="w-full border-t border-b border-neutral-200 mt-8">
          <FadeIn delay={0.4}>
            <div 
              className="w-full h-[450px] border-0 grayscale contrast-125 opacity-95 hover:grayscale-0 hover:opacity-100 transition-all duration-500 rounded-none overflow-hidden [&>iframe]:w-full [&>iframe]:h-full [&>iframe]:border-0"
              dangerouslySetInnerHTML={{ __html: contact.mapIframe }}
            />
          </FadeIn>
        </div>
      )}
    </div>
  );
}
