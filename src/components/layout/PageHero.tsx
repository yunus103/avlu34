import { SanityImage } from "@/components/ui/SanityImage";
import { FadeIn } from "@/components/ui/FadeIn";
import { Breadcrumbs } from "@/components/ui/Breadcrumbs";
import { SanityImage as SanityImageType } from "@/types";

type BreadcrumbItem = {
  label: string;
  href: string;
  active?: boolean;
};

interface PageHeroProps {
  title: string;
  subtitle?: string;
  backgroundImage?: SanityImageType;
  className?: string;
  breadcrumbs?: BreadcrumbItem[];
}

export function PageHero({
  title,
  subtitle,
  backgroundImage,
  className = "",
  breadcrumbs,
}: PageHeroProps) {
  const hasBg = !!backgroundImage?.asset;

  return (
    <section 
      className={`relative overflow-hidden transition-all duration-500 ${
        hasBg 
          ? "bg-black text-white" 
          : "bg-neutral-50 border-b border-neutral-200"
      } ${className}`}
    >
      {/* Background Image / Overlay */}
      {hasBg && (
        <div className="absolute inset-0 z-0 select-none pointer-events-none">
          <SanityImage
            image={backgroundImage}
            fill
            sizes="100vw"
            quality={85}
            className="object-cover opacity-75"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-black/30" />
        </div>
      )}

      {/* Content Layout */}
      <div className="relative z-10 container mx-auto px-4 py-12 md:py-16">
        <div className="flex flex-col justify-between min-h-[180px] md:min-h-[220px]">
          {/* Top Row: Breadcrumbs */}
          <FadeIn direction="down" duration={0.5}>
            <Breadcrumbs 
              items={breadcrumbs} 
              className={hasBg ? "text-white/60 [&_a]:text-white/60 [&_a:hover]:text-white [&_span]:text-white" : ""} 
            />
          </FadeIn>

          {/* Bottom Row: Title & Subtitle */}
          <FadeIn direction="up" duration={0.6} className="mt-8">
            <div className={`border-t pt-6 max-w-4xl ${hasBg ? "border-white/10" : "border-neutral-200"}`}>
              <h1 
                className={`text-3xl sm:text-4xl md:text-5xl font-normal font-serif tracking-wide select-text ${
                  hasBg ? "text-white" : "text-neutral-900"
                }`}
              >
                {title}
              </h1>
              
              {subtitle && (
                <p 
                  className={`mt-4 text-xs md:text-sm tracking-widest font-sans uppercase leading-relaxed ${
                    hasBg 
                      ? "text-white/70 font-light" 
                      : "text-neutral-500 font-semibold"
                  }`}
                >
                  {subtitle}
                </p>
              )}
            </div>
          </FadeIn>
        </div>
      </div>
    </section>
  );
}
