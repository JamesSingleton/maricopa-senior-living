import {
  PortableText,
  type PortableTextComponents,
  type PortableTextMarkComponentProps,
} from "@portabletext/react";
import { DownloadIcon } from "lucide-react";
import type { ReactNode } from "react";
import type { PortableTextBlock } from "sanity";

import { SanityImage, type SanityImageProps } from "./sanity-image";

/** Links back to this site, including the old www/apex domains. */
function isOwnSite(href: string) {
  try {
    return /(^|\.)maricopaseniorliving\.org$/i.test(new URL(href).hostname);
  } catch {
    return false;
  }
}

function PortableTextImage({
  value,
}: {
  value: NonNullable<SanityImageProps["image"]>;
}) {
  // High width/quality for retina srcSet. Use max-w-full (not w-full) so
  // small source assets are not stretched beyond their intrinsic size.
  return (
    <SanityImage
      image={value}
      width={1920}
      className="h-auto max-w-full rounded-md"
      sizes="(min-width: 1024px) 66vw, 100vw"
      queryParams={{ q: 85 }}
    />
  );
}

export function CustomPortableText({
  paragraphClasses,
  value,
}: {
  paragraphClasses?: string;
  value: PortableTextBlock[];
}) {
  const components: PortableTextComponents = {
    block: {
      // Avoid annotating with sanity's PortableTextBlock — its `_key` is
      // optional and is not assignable to @portabletext/react's block props.
      normal: ({ children }: { children?: ReactNode }) => {
        return <p className={paragraphClasses}>{children}</p>;
      },
    },
    marks: {
      link: ({ value, children }: PortableTextMarkComponentProps) => {
        const href: string | undefined = value?.href?.trim();
        if (!href) return <>{children}</>;
        // Only other websites open a new tab; phone, email and on-site links
        // stay in the same tab so the back button keeps working.
        const isOtherSite = /^https?:\/\//i.test(href) && !isOwnSite(href);
        return isOtherSite ? (
          <a href={href} rel="noreferrer noopener" target="_blank">
            {children}
            <span className="sr-only"> (opens in a new tab)</span>
          </a>
        ) : (
          <a href={href}>{children}</a>
        );
      },
      highlight: ({ children }: PortableTextMarkComponentProps) => {
        return <mark>{children}</mark>;
      },
      sup: ({ children }: PortableTextMarkComponentProps) => {
        return <sup>{children}</sup>;
      },
      sub: ({ children }: PortableTextMarkComponentProps) => {
        return <sub>{children}</sub>;
      },
    },
    types: {
      image: PortableTextImage,
      attachment: ({ value }: { value: any }) => {
        const url: string | undefined = value?.asset?.url;
        // A block saved without a file would otherwise crash the page.
        if (!url) return null;
        const label: string =
          value.description || value.asset?.originalFilename || "Attachment";
        return (
          <p className="flex flex-col items-center justify-between space-y-4 md:flex-row">
            {value.asset.extension === "pdf" ? (
              <a href={url} target="_blank" rel="noopener noreferrer">
                {label}
                <span className="sr-only"> (PDF, opens in a new tab)</span>
              </a>
            ) : (
              <span className="font-medium">{label}</span>
            )}
            <a
              className="inline-flex items-center gap-x-2 rounded-md bg-indigo-600 px-3.5 py-2.5 text-sm font-semibold text-white no-underline shadow-xs hover:bg-indigo-500 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 focus-visible:outline-solid"
              href={`${url}?dl=${encodeURIComponent(value.asset?.originalFilename || label)}`}
            >
              <DownloadIcon className="-ml-0.5 h-5 w-5" aria-hidden="true" />
              Download
              <span className="sr-only"> {label}</span>
            </a>
          </p>
        );
      },
    },
  };

  return <PortableText components={components} value={value} />;
}
