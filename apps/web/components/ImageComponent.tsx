"use client";

import { SanityImage } from "sanity-image";

import { dataset, projectId } from "@/lib/sanity.api";

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
      key={image.id ?? image.asset._id}
      id={image.id ?? image.asset._id}
      alt={image.alt}
      width={width}
      height={height}
      mode={mode}
      className={className}
      dataset={dataset}
      projectId={projectId}
      hotspot={image.hotspot}
      title={alt}
      loading={loading}
    />
  );
};

export default ImageComponent;
