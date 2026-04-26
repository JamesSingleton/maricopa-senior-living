"use client";
import {
  processImageData,
  SANITY_BASE_URL,
  type SanityImageProps,
} from "@maricopa-senior-living/sanity/image";
import { type ElementType, memo } from "react";
import {
  SanityImage as BaseSanityImage,
  type WrapperProps,
} from "sanity-image";

const ImageWrapper = <T extends ElementType = "img">(
  props: WrapperProps<T>,
) => <BaseSanityImage baseUrl={SANITY_BASE_URL} {...props} />;

// Main component
function SanityImageUnmemorized({ image, ...props }: SanityImageProps) {
  const processedImageData = processImageData(image);

  // Early return for invalid image data
  if (!processedImageData) {
    return null;
  }

  return <ImageWrapper {...props} {...processedImageData} />;
}

export const SanityImage = memo(SanityImageUnmemorized);
