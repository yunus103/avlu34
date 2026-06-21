
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
    <footer className="border-t border-neutral-200 bg-white">
      <div className="container mx-auto px-4 py-16">
        {/* ─── Ana Gövde (2 Kolonlu Grid) ─── */}
        <div className="grid grid-cols-1 gap-12 md:grid-cols-2">

          {/* Kolon 1: Marka & Sosyal Medya */}
          <div className="flex flex-col items-start gap-4">
            {settings?.logo ? (
              <div className="h-8 w-auto flex items-center mb-1">
                <SanityImage
                  image={settings.logo}
                  width={1200}
                  height={551}
                  fit="max"
                  className="h-full w-auto object-contain"
                />
              </div>
            ) : (
              <h3 className="font-serif font-bold text-lg tracking-widest uppercase text-black">
                {settings?.siteName}
              </h3>
            )}
            {settings?.siteTagline && (
              <p className="text-xs font-sans text-neutral-500 font-light leading-relaxed max-w-xs">
                {settings.siteTagline}
              </p>
            )}

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

          {/* Kolon 2: İletişim Bilgileri */}
          <div className="flex flex-col items-start gap-4">
            <h4 className="text-[11px] font-sans font-bold tracking-widest uppercase text-black">
              {locale === "en" ? "CONTACT" : "İLETİŞİM"}
            </h4>
            <div className="flex flex-col gap-3">
              {contact?.phone && (
                <a
                  href={`tel:${contact.phone}`}
                  className="flex items-center gap-2.5 text-xs text-neutral-500 hover:text-black transition-colors"
                >
                  <RiPhoneLine size={16} className="shrink-0 text-black" />
                  {contact.phone}
                </a>
              )}
              {contact?.email && (
                <a
                  href={`mailto:${contact.email}`}
                  className="flex items-center gap-2.5 text-xs text-neutral-500 hover:text-black transition-colors"
                >
                  <RiMailLine size={16} className="shrink-0 text-black" />
                  {contact.email}
                </a>
              )}
              {contact?.address && (
                <div className="flex items-start gap-2.5 text-xs text-neutral-500 leading-relaxed">
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
                  className="flex items-center gap-2.5 text-xs text-neutral-500 hover:text-black transition-colors mt-1"
                >
                  <FaWhatsapp size={16} className="shrink-0 text-black" />
                  <span>{locale === "en" ? "Chat with Us" : "Bizimle Sohbet Edin"}</span>
                </a>
              )}
            </div>
          </div>

        </div>

        {/* ─── Site Haritası (4 Kolonlu Grid - subLinks Desteğiyle) ─── */}
        {footerLinks.length > 0 && (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 pt-12 border-t border-neutral-100 mt-12">
            {footerLinks.map((item, i) => (
              <div key={i} className="flex flex-col gap-3">
                {item.href && item.href !== "#" && item.href !== "" ? (
                  <Link 
                    href={getPublicPath(item.href, locale)}
                    target={item.openInNewTab ? "_blank" : undefined}
                    rel={item.openInNewTab ? "noopener noreferrer" : undefined}
                    className="text-[11px] font-sans font-bold tracking-widest uppercase text-black hover:text-neutral-500 transition-colors"
                  >
                    {localize(item.label, locale)}
                  </Link>
                ) : (
                  <span className="text-[11px] font-sans font-bold tracking-widest uppercase text-black/40">
                    {localize(item.label, locale)}
                  </span>
                )}
                
                {item.subLinks && item.subLinks.length > 0 && (
                  <div className="flex flex-col gap-2 mt-1">
                    {item.subLinks.map((sub, j) => (
                      <Link
                        key={j}
                        href={getPublicPath(sub.href, locale)}
                        target={sub.openInNewTab ? "_blank" : undefined}
                        rel={sub.openInNewTab ? "noopener noreferrer" : undefined}
                        className="text-xs font-sans text-neutral-500 hover:text-black transition-colors"
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

        {/* ─── Alt Copyright Şeridi ─── */}
        <div className="mt-12 border-t border-neutral-100 pt-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-[10px] font-sans font-semibold tracking-wider text-neutral-400 w-full text-center sm:text-left uppercase">
            © {currentYear} {settings?.siteName}. {locale === "en" ? "All rights reserved." : "Tüm hakları saklıdır."}
          </p>
        </div>
      </div>
    </footer>
  );
}
