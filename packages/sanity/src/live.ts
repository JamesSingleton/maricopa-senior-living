import { env } from "@maricopa-senior-living/env/server";
import { cookies, draftMode } from "next/headers";
import type { QueryParams } from "next-sanity";
import {
  defineLive,
  type LivePerspective,
  resolvePerspectiveFromCookies,
  type StrictDefinedFetchType,
} from "next-sanity/live";

import { client } from "./client";

export const { sanityFetch, SanityLive } = defineLive({
  client,
  serverToken: env.SANITY_API_READ_TOKEN,
  browserToken: env.SANITY_API_READ_TOKEN,
  strict: true,
});

/**
 * The app's one shared `'use cache'` boundary. `sanityFetch` calls
 * `cacheTag`/`cacheLife` internally but doesn't create the boundary —
 * this wrapper provides it once so callers don't add their own.
 *
 * Identical query/params/perspective/stega calls dedupe into one entry,
 * which is what keeps ISR/tag-revalidation writes under control.
 */
export const cachedSanity: StrictDefinedFetchType = async (options) => {
  "use cache";
  return sanityFetch(options);
};

export interface DynamicFetchOptions {
  perspective: LivePerspective;
  stega: boolean;
}

export async function getDynamicFetchOptions(): Promise<DynamicFetchOptions> {
  const { isEnabled: isDraftMode } = await draftMode();
  if (!isDraftMode) {
    return { perspective: "published", stega: false };
  }

  const jar = await cookies();
  const perspective = await resolvePerspectiveFromCookies({ cookies: jar });
  return { perspective: perspective ?? "drafts", stega: true };
}

/** For usage within `generateStaticParams` only. */
export async function cachedSanityStaticParams<
  const QueryString extends string,
>({ query, params = {} }: { query: QueryString; params?: QueryParams }) {
  const { data } = await cachedSanity({
    query,
    params,
    perspective: "published",
    stega: false,
  });
  return { data };
}

/**
 * For `generateMetadata`, `sitemap.ts`, and other metadata routes.
 * Pins `stega: false` so Stega never leaks into `<head>`.
 */
export async function cachedSanityMetadata<const QueryString extends string>({
  query,
  params = {},
  perspective,
}: {
  query: QueryString;
  params?: QueryParams;
  perspective: LivePerspective;
}) {
  const { data } = await cachedSanity({
    query,
    params,
    perspective,
    stega: false,
  });
  return { data };
}

/** @deprecated Use `cachedSanityStaticParams` */
export const sanityFetchStaticParams = cachedSanityStaticParams;

/** @deprecated Use `cachedSanityMetadata` */
export const sanityFetchMetadata = cachedSanityMetadata;
