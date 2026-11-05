import { env } from "@maricopa-senior-living/env/client";
import type { SanityImageSource } from "@sanity/asset-utils";
import { createImageUrlBuilder } from "@sanity/image-url";
import { createClient } from "next-sanity";

/**
 * Fields the website uses as data (choices, dates, numbers, addresses), not
 * as display text. Stega's hidden edit markers would break comparisons like
 * `series === "joans-corner"` while previewing, so they're never encoded.
 */
const NEVER_ENCODE = new Set([
  "kind",
  "section",
  "mode",
  "tone",
  "icon",
  "series",
  "month",
  "serviceArea",
  "frequency",
  "until",
  "skipDates",
  "url",
  "website",
  "phone",
  "number",
  "email",
  "start",
  "end",
  "publishedAt",
  "day",
  "opens",
  "closes",
  "slug",
  "source",
  // Address parts and event settings feed structured data and map links.
  "street",
  "city",
  "state",
  "zip",
  "status",
  "attendance",
  "onlineUrl",
]);

export const client = createClient({
  projectId: env.NEXT_PUBLIC_SANITY_PROJECT_ID,
  dataset: env.NEXT_PUBLIC_SANITY_DATASET,
  apiVersion: env.NEXT_PUBLIC_SANITY_API_VERSION,
  useCdn: env.NODE_ENV === "production",
  perspective: "published",
  stega: {
    studioUrl: env.NEXT_PUBLIC_SANITY_STUDIO_URL,
    filter: (props) => {
      const key = props.sourcePath.at(-1);
      if (typeof key === "string" && NEVER_ENCODE.has(key)) return false;
      return props.filterDefault(props);
    },
  },
});

const imageBuilder = createImageUrlBuilder({
  projectId: env.NEXT_PUBLIC_SANITY_PROJECT_ID,
  dataset: env.NEXT_PUBLIC_SANITY_DATASET,
});

export const urlFor = (source: SanityImageSource) =>
  imageBuilder.image(source).auto("format").quality(80).format("webp");
