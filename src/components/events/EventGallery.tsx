"use client";

import dynamic from "next/dynamic";
import { SanityImage as SanityImageType } from "@/types";

const LightboxGallery = dynamic(
  () => import("@/components/ui/Lightbox").then((mod) => mod.LightboxGallery),
  { ssr: false }
);

interface EventGalleryProps {
  images: SanityImageType[];
}

export function EventGallery({ images }: EventGalleryProps) {
  return <LightboxGallery images={images} />;
}
