import type { Metadata } from "next";

export interface SeoData {
  title?: string | null;
  description?: string | null;
  image?: { id?: string | null } | null;
  noIndex?: boolean | null;
}

export interface MetadataOptions {
  seo?: SeoData | null;
  fallbackTitle: string;
  fallbackDescription?: string | null;
  path: string;
  siteTitle?: string | null;
  type?: "website" | "article";
  canonicalUrl?: string | null;
  publishedTime?: string | null;
  modifiedTime?: string | null;
}

export function buildMetadata({
  seo,
  fallbackTitle,
  fallbackDescription,
  path,
  siteTitle = "Maricopa Senior Resource Hub",
  type = "website",
  canonicalUrl,
  publishedTime,
  modifiedTime,
}: MetadataOptions): Metadata {
  const title = seo?.title || fallbackTitle;
  const description = seo?.description || fallbackDescription || undefined;
  const canonical = canonicalUrl || path;

  return {
    title,
    description,
    robots: seo?.noIndex ? { index: false, follow: false } : undefined,
    alternates: { canonical },
    openGraph: {
      title,
      description,
      type,
      url: path,
      siteName: siteTitle ?? undefined,
      ...(publishedTime ? { publishedTime: publishedTime ?? undefined } : {}),
      ...(modifiedTime ? { modifiedTime: modifiedTime ?? undefined } : {}),
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
    },
  };
}
