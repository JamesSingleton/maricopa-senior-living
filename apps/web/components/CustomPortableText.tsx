import {
  PortableText,
  type PortableTextComponents,
  type PortableTextMarkComponentProps,
} from "@portabletext/react";
import { DownloadIcon } from "lucide-react";
import type { PortableTextBlock } from "sanity";

import { SanityImage, type SanityImageProps } from "./sanity-image";

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
      normal: ({ children }) => {
        return <p className={paragraphClasses}>{children}</p>;
      },
    },
    marks: {
      link: ({ value, children }: PortableTextMarkComponentProps) => {
        return (
          <a href={value?.href} rel="noreferrer noopener" target="_blank">
            {children}
          </a>
        );
      },
      highlight: ({ children }) => {
        return <mark>{children}</mark>;
      },
      sup: ({ children }) => {
        return <sup>{children}</sup>;
      },
      sub: ({ children }) => {
        return <sub>{children}</sub>;
      },
    },
    types: {
      image: PortableTextImage,
      attachment: ({ value }: { value: any }) => {
        return (
          <p className="flex flex-col items-center justify-between space-y-4 md:flex-row">
            {value.asset.extension === "pdf" ? (
              <a
                href={value.asset.url}
                target="_blank"
                rel="noopener noreferrer"
              >
                {value.description}
              </a>
            ) : (
              <span className="font-medium">{value.description}</span>
            )}
            <a
              className="inline-flex items-center gap-x-2 rounded-md bg-indigo-600 px-3.5 py-2.5 text-sm font-semibold text-white no-underline shadow-xs hover:bg-indigo-500 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 focus-visible:outline-solid"
              href={`${value.asset.url}?dl=${value.description}`}
            >
              <DownloadIcon className="-ml-0.5 h-5 w-5" aria-hidden="true" />
              Download
            </a>
          </p>
        );
      },
    },
  };

  return <PortableText components={components} value={value} />;
}
