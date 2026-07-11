"use client";

import {
  processImageData,
  SANITY_BASE_URL,
  type SanityImageData,
} from "@maricopa-senior-living/sanity/image";
import type { ElementType } from "react";
import {
  SanityImage as BaseSanityImage,
  type WrapperProps,
} from "sanity-image";

export type { SanityImageData };

export type SanityImageProps = {
  image: SanityImageData | null | undefined;
} & Omit<WrapperProps<"img">, "id">;

const ImageWrapper = <T extends ElementType = "img">(
  props: WrapperProps<T>,
) => <BaseSanityImage baseUrl={SANITY_BASE_URL} {...props} />;

export function SanityImage({ image, alt, ...props }: SanityImageProps) {
  if (!image) {
    return null;
  }

  const processedData = processImageData(image);
  if (!processedData) {
    return null;
  }

  return (
    <ImageWrapper
      {...props}
      {...processedData}
      alt={alt ?? processedData.alt}
    />
  );
}
