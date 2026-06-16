import { ArrowDownTrayIcon } from "@heroicons/react/20/solid";
import {
  PortableText,
  type PortableTextComponents,
  type PortableTextMarkComponentProps,
} from "@portabletext/react";
import { getImageDimensions } from "@sanity/asset-utils";
import Image from "next/image";
import type { PortableTextBlock } from "sanity";

import { urlFor } from "@maricopa-senior-living/sanity/client";

const ImageComponent = ({ value }: { value: any }) => {
  const { width, height } = getImageDimensions(value);
  return (
    <Image
      src={urlFor(value).fit("min").auto("format").url()}
      alt={value.alt || " "}
      width={width}
      height={height}
    />
  );
};

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
      image: ImageComponent,
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
              <ArrowDownTrayIcon
                className="-ml-0.5 h-5 w-5"
                aria-hidden="true"
              />
              Download
            </a>
          </p>
        );
      },
    },
  };

  return <PortableText components={components} value={value} />;
}
