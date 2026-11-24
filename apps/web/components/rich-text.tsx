import {
  PortableText,
  type PortableTextBlock,
  type PortableTextComponents,
} from "@portabletext/react";
import { FileText } from "lucide-react";
import Link from "next/link";

import { expandOccurrences } from "@/lib/events";
import { hostOf, hrefFor, type LinkTarget } from "@/lib/links";
import { EventRow, ResourceCard, type ResourceCardData } from "./cards";
import { SanityImage, type SanityImageData } from "./sanity-image";

function fileSize(bytes?: number | null) {
  if (!bytes) return "";
  return bytes > 1_000_000
    ? `${(bytes / 1_000_000).toFixed(1)} MB`
    : `${Math.max(1, Math.round(bytes / 1000))} KB`;
}

const components: PortableTextComponents = {
  block: {
    h2: ({ children }) => <h2>{children}</h2>,
    h3: ({ children }) => <h3>{children}</h3>,
    blockquote: ({ children }) => <blockquote>{children}</blockquote>,
  },
  marks: {
    link: ({ value, children }) => {
      const href: string | undefined = value?.href;
      if (!href) return <>{children}</>;
      const external =
        /^https?:\/\//i.test(href) &&
        !/maricopaseniorliving\.org/i.test(hostOf(href));
      return external ? (
        <a href={href} rel="noopener noreferrer" target="_blank">
          {children}
          <span className="sr-only"> (opens in a new tab)</span>
        </a>
      ) : (
        <a href={href}>{children}</a>
      );
    },
    internalLink: ({ value, children }) => {
      const href = hrefFor((value?.target as LinkTarget) ?? null);
      return href ? <Link href={href}>{children}</Link> : children;
    },
  },
  types: {
    imageWithAlt: ({
      value,
    }: {
      value: SanityImageData & { caption?: string | null };
    }) =>
      value?.id ? (
        <figure>
          <SanityImage
            image={value}
            width={1200}
            className="h-auto max-w-full"
            sizes="(min-width: 1024px) 720px, 100vw"
          />
          {value.caption ? (
            <figcaption className="mt-2 text-base muted">
              {value.caption}
            </figcaption>
          ) : null}
        </figure>
      ) : null,
    fileAttachment: ({
      value,
    }: {
      value: {
        title?: string | null;
        file?: {
          url?: string | null;
          size?: number | null;
          extension?: string | null;
        } | null;
      };
    }) =>
      value?.file?.url ? (
        <p>
          <a href={value.file.url} className="btn btn-secondary">
            <FileText className="size-5" aria-hidden="true" />
            {value.title ?? "Open the file"}
            <span className="font-normal">
              ({(value.file.extension ?? "file").toUpperCase()}
              {value.file.size ? `, ${fileSize(value.file.size)}` : ""})
            </span>
          </a>
        </p>
      ) : null,
    callout: ({
      value,
    }: {
      value: { tone?: string | null; text?: string | null };
    }) => (
      <aside
        className={`p-5 ${
          value.tone === "warning"
            ? "bg-[var(--msl-warning-bg)]"
            : "bg-[var(--msl-sage)]"
        }`}
      >
        {value.tone === "warning" ? (
          <p className="font-bold">Important</p>
        ) : null}
        <p className="whitespace-pre-line">{value.text}</p>
      </aside>
    ),
    eventCard: ({
      value,
    }: {
      value: { event?: Parameters<typeof expandOccurrences>[0][number] | null };
    }) => {
      if (!value.event) return null;
      const [occurrence] = expandOccurrences(
        [value.event],
        new Date(0),
        new Date(8.64e15),
      );
      return occurrence ? <EventRow occurrence={occurrence} /> : null;
    },
    resourceCard: ({
      value,
    }: {
      value: { resource?: ResourceCardData | null };
    }) => (value.resource ? <ResourceCard resource={value.resource} /> : null),
  },
};

export function RichText({
  value,
  className = "prose-msl",
}: {
  value?: unknown[] | null;
  className?: string;
}) {
  if (!value?.length) return null;
  return (
    <div className={className}>
      <PortableText
        value={value as PortableTextBlock[]}
        components={components}
      />
    </div>
  );
}
