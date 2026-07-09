import Link from "next/link";
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

import { SiteSettings, Navigation, SocialLink } from "@/types";
import { Locale } from "@/lib/i18n/config";
import { localize } from "@/lib/i18n/localize";
import { getPublicPath } from "@/lib/i18n/routes";
import { SanityImage } from "@/components/ui/SanityImage";

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

export function Footer({ 
  settings, 
  navigation, 
  locale 
}: { 
  settings: SiteSettings; 
  navigation: Navigation; 
  locale: Locale 
}) {
  const footerLinks = navigation?.footerLinks || [];
  const socialLinks: SocialLink[] = (settings?.socialLinks || []).filter((s: SocialLink) => s.url);
  const contact = settings?.contactInfo;
  const currentYear = new Date().getFullYear();

  return (
    <footer className="border-t border-neutral-200 bg-white select-none">
      <div className="container mx-auto px-4 py-16">
        {/* ─── Ana Gövde (4 Kolonlu Grid) ─── */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-12 lg:gap-8 pb-12 border-b border-neutral-100">
          
          {/* Kolon 1: Logo & Slogan */}
          <div className="flex flex-col items-start gap-4 lg:col-span-3">
            <Link href={getPublicPath("/", locale)} className="inline-block hover:opacity-90 transition-opacity">
              {settings?.logo ? (
                <div className="h-20 w-auto flex items-center mb-1">
                  <SanityImage
                    image={settings.logo}
                    width={1200}
                    height={551}
                    fit="max"
                    className="h-full w-auto object-contain"
                  />
                </div>
              ) : (
                <h3 className="font-serif font-bold text-xl tracking-widest uppercase text-black">
                  {settings?.siteName}
                </h3>
              )}
            </Link>
            {settings?.siteTagline && (
              <p className="text-xs font-sans text-neutral-500 font-light leading-relaxed max-w-xs select-text">
                {settings.siteTagline}
              </p>
            )}
          </div>

          {/* Kolon 2: Hızlı Menü (Navigation) */}
          <div className="flex flex-col gap-4 lg:col-span-3">
            <h4 className="text-[11px] font-sans font-bold tracking-[0.2em] uppercase text-black">
              {locale === "en" ? "NAVIGATION" : "NAVİGASYON"}
            </h4>
            {footerLinks.length > 0 && (
              <div className="flex flex-col gap-2.5 mt-1">
                {footerLinks.map((item, i) => (
                  <div key={i} className="flex flex-col gap-1.5">
                    {item.href && item.href !== "#" && item.href !== "" ? (
                      <Link 
                        href={getPublicPath(item.href, locale)}
                        target={item.openInNewTab ? "_blank" : undefined}
                        rel={item.openInNewTab ? "noopener noreferrer" : undefined}
                        className="text-[13px] sm:text-[14px] font-sans font-medium text-neutral-800 hover:text-black transition-colors uppercase"
                      >
                        {localize(item.label, locale)}
                      </Link>
                    ) : (
                      <span className="text-[13px] sm:text-[14px] font-sans font-semibold text-neutral-800 uppercase tracking-wider">
                        {localize(item.label, locale)}
                      </span>
                    )}
                    
                    {item.subLinks && item.subLinks.length > 0 && (
                      <div className="flex flex-col gap-1.5 pl-3 border-l border-neutral-100 mt-1">
                        {item.subLinks.map((sub, j) => (
                          <Link
                            key={j}
                            href={getPublicPath(sub.href, locale)}
                            target={sub.openInNewTab ? "_blank" : undefined}
                            rel={sub.openInNewTab ? "noopener noreferrer" : undefined}
                            className="text-xs font-sans font-light text-neutral-500 hover:text-black transition-colors"
                          >
                            {localize(sub.label, locale)}
                          </Link>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Kolon 3: İletişim & Sosyal Medya */}
          <div className="flex flex-col items-start gap-4 lg:col-span-3">
            <h4 className="text-xs font-sans font-bold tracking-widest uppercase text-black">
              {locale === "en" ? "CONTACT" : "İLETİŞİM"}
            </h4>
            <div className="flex flex-col gap-3.5">
              {contact?.phone && (
                <a
                  href={`tel:${contact.phone}`}
                  className="flex items-center gap-2.5 text-sm text-neutral-500 hover:text-black transition-colors select-text"
                >
                  <RiPhoneLine size={16} className="shrink-0 text-black" />
                  {contact.phone}
                </a>
              )}
              {contact?.email && (
                <a
                  href={`mailto:${contact.email}`}
                  className="flex items-center gap-2.5 text-sm text-neutral-500 hover:text-black transition-colors select-text break-all"
                >
                  <RiMailLine size={16} className="shrink-0 text-black" />
                  {contact.email}
                </a>
              )}
              {contact?.address && (
                <div className="flex items-start gap-2.5 text-sm text-neutral-500 leading-relaxed select-text">
                  <RiMapPinLine size={16} className="shrink-0 mt-0.5 text-black" />
                  <span>{contact.address}</span>
                </div>
              )}
              
              {/* WhatsApp Sohbet Linki */}
              {contact?.whatsappNumber && (
                <a
                  href={`https://wa.me/${contact.whatsappNumber.replace(/\D/g, "")}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2.5 text-sm text-neutral-500 hover:text-black transition-colors"
                >
                  <FaWhatsapp size={16} className="shrink-0 text-black" />
                  <span>{locale === "en" ? "Chat with Us" : "Bizimle Sohbet Edin"}</span>
                </a>
              )}
            </div>

            {/* Sosyal Medya İkonları */}
            {socialLinks.length > 0 && (
              <div className="flex flex-wrap gap-2.5 mt-3">
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
                      className="flex h-8 w-8 items-center justify-center rounded-full bg-black text-white hover:bg-neutral-800 transition-colors"
                    >
                      <Icon size={14} />
                    </a>
                  );
                })}
              </div>
            )}
          </div>

          {/* Kolon 4: Çalışma Saatleri & Ulaşım */}
          <div className="flex flex-col items-start gap-4 lg:col-span-3">
            <h4 className="text-xs font-sans font-bold tracking-widest uppercase text-black">
              {locale === "en" ? "WORKING HOURS" : "ÇALIŞMA SAATLERİ"}
            </h4>
            
            {settings?.workingHours && (
              <p className="text-sm font-sans text-neutral-500 leading-relaxed font-light select-text">
                {settings.workingHours}
              </p>
            )}

            {contact?.googleMapsUrl && (
              <div className="pt-2 w-full">
                <a
                  href={contact.googleMapsUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full inline-flex items-center justify-center border border-black text-black hover:bg-black hover:text-white transition-all duration-300 uppercase tracking-[0.2em] text-xs font-semibold py-4 px-6 rounded-none cursor-pointer text-center"
                >
                  {locale === "en" ? "GET DIRECTIONS" : "YOL TARİFİ AL"}
                </a>
              </div>
            )}
          </div>

        </div>

        {/* ─── Alt Telif & Yasal Linkler Şeridi ─── */}
        <div className="mt-12 flex flex-col md:flex-row items-center justify-between gap-4">
          {/* Sol Kısım: Copyright ve KVKK Linki */}
          <p className="text-[10px] font-sans font-semibold tracking-wider text-neutral-400 uppercase text-center md:text-left flex flex-wrap items-center justify-center md:justify-start gap-2">
            <span>
              © {currentYear} {settings?.siteName}. {locale === "en" ? "All rights reserved." : "Tüm hakları saklıdır."}
            </span>
            <span className="hidden md:inline text-neutral-300">|</span>
            <Link 
              href={getPublicPath("kvkk", locale)} 
              className="hover:underline text-neutral-500 font-bold"
            >
              {locale === "en" ? "Privacy Policy" : "KVKK ve Gizlilik Sözleşmesi"}
            </Link>
          </p>

          {/* Sağ Kısım: Tasarım & Geliştirme İmzası */}
          <p className="text-[10px] font-sans font-semibold tracking-wider text-neutral-400 uppercase text-center md:text-right">
            {locale === "en" ? "Design & Development: " : "Tasarım ve Geliştirme: "}
            <a 
              href="https://www.instagram.com/yaytechstudio/" 
              target="_blank" 
              rel="noopener noreferrer" 
              className="text-black hover:underline font-bold"
            >
              YayTech Studio
            </a>
          </p>
        </div>
      </div>
    </footer>
  );
}
