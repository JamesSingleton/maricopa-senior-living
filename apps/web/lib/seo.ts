import type { Metadata } from "next";

import { imageUrl } from "./structured-data";

export type SeoFields = {
  title?: string | null;
  description?: string | null;
  imageId?: string | null;
  noIndex?: boolean | null;
} | null;

/**
 * Metadata with the Studio's optional "Search & sharing" overrides first,
 * then the document's own title, summary and picture.
 */
export function seoMetadata({
  seo,
  title,
  description,
  imageId,
  path,
  type = "website",
  publishedTime,
  modifiedTime,
}: {
  seo?: SeoFields;
  title?: string | null;
  description?: string | null;
  imageId?: string | null;
  path: string;
  type?: "website" | "article";
  publishedTime?: string | null;
  modifiedTime?: string | null;
}): Metadata {
  const finalTitle = seo?.title || title || undefined;
  const finalDescription = seo?.description || description || undefined;
  const image = imageUrl(seo?.imageId || imageId, 1200);
  return {
    title: finalTitle,
    description: finalDescription,
    alternates: { canonical: path },
    robots: seo?.noIndex ? { index: false, follow: true } : undefined,
    openGraph: {
      type,
      url: path,
      title: finalTitle,
      description: finalDescription,
      ...(image ? { images: [{ url: image, width: 1200 }] } : {}),
      ...(type === "article"
        ? {
            publishedTime: publishedTime ?? undefined,
            modifiedTime: modifiedTime ?? undefined,
          }
        : {}),
    },
  };
}
