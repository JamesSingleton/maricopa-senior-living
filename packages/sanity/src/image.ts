import { env } from "@maricopa-senior-living/env/client";
import type { ImageCrop, ImageHotspot } from "sanity";
import type { WrapperProps } from "sanity-image";

import type { QueryImageTypeResult } from "./types";

type SanityImageHotspot = Pick<ImageHotspot, "x" | "y">;
type SanityImageCrop = Pick<ImageCrop, "top" | "bottom" | "left" | "right">;

export type SanityImageData = [NonNullable<QueryImageTypeResult>] extends [never]
  ? {
      readonly id: string;
      readonly alt: string;
      readonly preview?: string | null;
      readonly hotspot?: SanityImageHotspot | null;
      readonly crop?: SanityImageCrop | null;
    }
  : NonNullable<QueryImageTypeResult>;

type ProcessedImageData = {
  readonly id: string;
  readonly alt: string;
  readonly preview?: string;
  readonly hotspot?: SanityImageHotspot;
  readonly crop?: SanityImageCrop;
};

export type SanityImageProps = {
  readonly image: SanityImageData;
} & Omit<WrapperProps<"img">, "id">;

// Base URL construction
export const SANITY_BASE_URL =
  `https://cdn.sanity.io/images/${env.NEXT_PUBLIC_SANITY_PROJECT_ID}/${env.NEXT_PUBLIC_SANITY_DATASET}/` as const;

// Type guards
function isValidNumber(value: unknown): value is number {
  return typeof value === "number" && !Number.isNaN(value);
}

function isValidHotspot(hotspot: unknown): hotspot is SanityImageHotspot {
  if (!hotspot || typeof hotspot !== "object") {
    return false;
  }
  const h = hotspot as Record<string, unknown>;
  return isValidNumber(h.x) && isValidNumber(h.y);
}

function isValidCrop(crop: unknown): crop is SanityImageCrop {
  if (!crop || typeof crop !== "object") {
    return false;
  }
  const c = crop as Record<string, unknown>;
  return (
    isValidNumber(c.top) &&
    isValidNumber(c.bottom) &&
    isValidNumber(c.left) &&
    isValidNumber(c.right)
  );
}

// Pure functions for data processing
function extractHotspot(
  image: SanityImageData,
): SanityImageHotspot | undefined {
  if (!isValidHotspot(image?.hotspot)) {
    return;
  }
  return {
    x: image.hotspot.x,
    y: image.hotspot.y,
  };
}

function extractCrop(image: SanityImageData): SanityImageCrop | undefined {
  if (!isValidCrop(image?.crop)) {
    return;
  }
  return {
    top: image.crop.top,
    bottom: image.crop.bottom,
    left: image.crop.left,
    right: image.crop.right,
  };
}

function hasPreview(preview: unknown): preview is string {
  return typeof preview === "string" && preview.length > 0;
}

// Main image processing function
export function processImageData(
  image: SanityImageData,
): ProcessedImageData | null {
  // Early return for invalid image data
  if (!image?.id || typeof image.id !== "string") {
    return null;
  }

  const hotspot = extractHotspot(image);
  const crop = extractCrop(image);
  const preview = hasPreview(image.preview) ? image.preview : undefined;

  return {
    id: image.id,
    alt: image.alt,
    ...(preview && { preview }),
    ...(hotspot && { hotspot }),
    ...(crop && { crop }),
  };
}
