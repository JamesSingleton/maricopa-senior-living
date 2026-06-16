"use client";

import { SanityImage } from "sanity-image";

import { env } from "@maricopa-senior-living/env/client";

const ImageComponent = ({
  image,
  alt,
  className,
  width,
  height,
  mode = "cover",
  loading = "lazy",
}: {
  image: any;
  alt?: string;
  className?: string;
  width: number;
  height: number;
  mode?: "cover" | "contain";
  loading?: "lazy" | "eager";
}) => {
  return (
    <SanityImage
      key={image.asset._ref ?? image.asset._id}
      id={image.asset._ref ?? image.asset._id}
      alt={image.alt}
      width={width}
      height={height}
      mode={mode}
      className={className}
      dataset={env.NEXT_PUBLIC_SANITY_DATASET}
      projectId={env.NEXT_PUBLIC_SANITY_PROJECT_ID}
      hotspot={image.hotspot}
      title={alt}
      loading={loading}
    />
  );
};

export default ImageComponent;
