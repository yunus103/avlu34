"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { SanityImage } from "@/components/ui/SanityImage";
import { Button } from "@/components/ui/button";
import { RiMenu3Line, RiCloseLine, RiArrowDownSLine } from "react-icons/ri";
import { cn } from "@/lib/utils";

import { SiteSettings, Navigation, NavItem } from "@/types";
import { Locale } from "@/lib/i18n/config";
import { localize } from "@/lib/i18n/localize";
import { getPublicPath } from "@/lib/i18n/routes";

export function Header({ 
  settings, 
  navigation, 
  locale 
}: { 
  settings: SiteSettings; 
  navigation: Navigation; 
  locale: Locale 
}) {
  const pathname = usePathname();
  const [menuOpen, setMenuOpen] = useState(false);
  const links: NavItem[] = navigation?.headerLinks || [];

  // Close menu on pathname change
  useEffect(() => {
    if (menuOpen) {
      setMenuOpen(false);
    }
  }, [pathname, menuOpen]);

  const isActive = (item: NavItem) => {
    const resolvedPath = getPublicPath(item.href, locale);
    if (resolvedPath === "/" || resolvedPath === "/en") {
      return pathname === resolvedPath;
    }
    return pathname.startsWith(resolvedPath);
  };

  return (
    <header className="sticky top-0 z-40 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto flex h-20 items-center justify-between px-4">
        <Link href={getPublicPath("/", locale)} className="flex items-center group h-full">
          <div className="relative flex items-center justify-start transition-all duration-200 group-hover:scale-[1.02] active:scale-95 h-full py-4 max-w-[250px] md:max-w-[450px]">
            {settings?.logo ? (
              <SanityImage
                image={settings.logo}
                width={800}
                height={200}
                fit="max"
                className="h-full w-auto object-contain object-left"
                priority
              />
            ) : (
              <span className="font-bold text-xl tracking-tight leading-none">{settings?.siteName}</span>
            )}
          </div>
        </Link>

        {/* Desktop Nav */}
        <nav className="hidden md:flex items-center gap-6">
          {links.map((item, i) => (
            <DesktopNavItem key={i} item={item} active={isActive(item)} locale={locale} />
          ))}
          {/* Simple Language switcher */}
          <Link 
            href={locale === "tr" ? getPublicPath(pathname, "en") : getPublicPath(pathname, "tr")}
            className="text-xs font-semibold px-2 py-1 border rounded hover:bg-muted transition-colors uppercase"
          >
            {locale === "tr" ? "EN" : "TR"}
          </Link>
        </nav>

        {/* Mobile Controls */}
        <div className="flex items-center gap-2 md:hidden">
          <Link 
            href={locale === "tr" ? getPublicPath(pathname, "en") : getPublicPath(pathname, "tr")}
            className="text-xs font-semibold px-2 py-1 border rounded hover:bg-muted transition-colors uppercase mr-2"
          >
            {locale === "tr" ? "EN" : "TR"}
          </Link>
          <Button variant="ghost" size="icon" onClick={() => setMenuOpen(!menuOpen)} aria-label="Menüyü aç/kapat">
            {menuOpen ? <RiCloseLine size={20} /> : <RiMenu3Line size={20} />}
          </Button>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {menuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="border-t md:hidden overflow-hidden"
          >
            <nav className="container mx-auto flex flex-col gap-2 px-4 py-6">
              {links.map((item, i) => (
                <div key={i} className="flex flex-col gap-1">
                  <div className="flex items-center justify-between">
                    <Link
                      href={getPublicPath(item.href, locale)}
                      target={item.openInNewTab ? "_blank" : undefined}
                      rel={item.openInNewTab ? "noopener noreferrer" : undefined}
                      className={cn(
                        "text-base font-medium py-2 transition-colors hover:text-primary",
                        isActive(item) ? "text-primary" : "text-foreground"
                      )}
                    >
                      {localize(item.label, locale)}
                    </Link>
                  </div>
                  {item.subLinks && (
                    <div className="flex flex-col gap-1 pl-4 border-l ml-1 mt-1">
                      {item.subLinks.map((sub, j) => (
                        <Link
                          key={j}
                          href={getPublicPath(sub.href, locale)}
                          target={sub.openInNewTab ? "_blank" : undefined}
                          rel={sub.openInNewTab ? "noopener noreferrer" : undefined}
                          className={cn(
                            "text-sm font-medium py-2 transition-colors hover:text-primary",
                            isActive(sub) ? "text-primary" : "text-muted-foreground"
                          )}
                        >
                          {localize(sub.label, locale)}
                        </Link>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}

function DesktopNavItem({ 
  item, 
  active, 
  locale 
}: { 
  item: NavItem; 
  active: boolean; 
  locale: Locale 
}) {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);

  const isSubActive = item.subLinks?.some(sub => pathname === getPublicPath(sub.href, locale));
  const reallyActive = active || isSubActive;

  if (!item.subLinks || item.subLinks.length === 0) {
    return (
      <Link
        href={getPublicPath(item.href, locale)}
        target={item.openInNewTab ? "_blank" : undefined}
        rel={item.openInNewTab ? "noopener noreferrer" : undefined}
        className={cn(
          "text-sm font-medium transition-colors hover:text-primary",
          reallyActive ? "text-primary font-semibold" : "text-foreground/70"
        )}
      >
        {localize(item.label, locale)}
      </Link>
    );
  }

  return (
    <div 
      className="relative group"
      onMouseEnter={() => setIsOpen(true)}
      onMouseLeave={() => setIsOpen(false)}
    >
      <Link
        href={getPublicPath(item.href, locale)}
        className={cn(
          "flex items-center gap-1 text-sm font-medium transition-colors hover:text-primary",
          reallyActive ? "text-primary font-semibold" : "text-foreground/70"
        )}
      >
        {localize(item.label, locale)}
        <motion.span animate={{ rotate: isOpen ? 180 : 0 }} transition={{ duration: 0.2 }}>
          <RiArrowDownSLine size={16} />
        </motion.span>
      </Link>
      
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.95 }}
            transition={{ duration: 0.2 }}
            className="absolute left-0 top-full pt-4 min-w-[200px]"
          >
            <div className="bg-popover border rounded-xl shadow-xl p-2 overflow-hidden">
              {item.subLinks.map((sub, j) => {
                const subActive = pathname === getPublicPath(sub.href, locale);
                return (
                  <Link
                    key={j}
                    href={getPublicPath(sub.href, locale)}
                    target={sub.openInNewTab ? "_blank" : undefined}
                    rel={sub.openInNewTab ? "noopener noreferrer" : undefined}
                    className={cn(
                      "flex items-center px-4 py-2.5 text-sm font-medium rounded-lg hover:bg-muted transition-colors",
                      subActive ? "text-primary bg-primary/5" : "text-foreground/70"
                    )}
                  >
                    {localize(sub.label, locale)}
                  </Link>
                );
              })}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
