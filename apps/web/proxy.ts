import { type NextRequest, NextResponse } from "next/server";

/**
 * Redirect documents from the Studio (old /category, /tag and /articles
 * URLs from the previous site, plus the ones the auto-redirect Function adds
 * when a slug changes), applied before routing as real 307/308s.
 *
 * They're read at request time rather than built into next.config, so a
 * change in the Studio takes effect within a minute without redeploying the
 * site. Each server instance keeps the whole list in memory and refreshes it
 * at most once a minute, so most requests are a Map lookup.
 */

type Redirect = { destination: string; permanent: boolean };

const REFRESH_MS = 60_000;
const QUERY = encodeURIComponent(
  '*[_type == "redirect" && defined(source) && defined(destination)]{source, destination, permanent}',
);

let cache: { map: Map<string, Redirect>; loadedAt: number } | null = null;
let pending: Promise<Map<string, Redirect>> | null = null;

/** "/Old/Path/" and "/old/path" are the same address. */
const normalize = (path: string) =>
  (path.length > 1 ? path.replace(/\/+$/, "") : path).toLowerCase();

async function loadRedirects(): Promise<Map<string, Redirect>> {
  const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID;
  const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET;
  const token = process.env.SANITY_API_READ_TOKEN;
  if (!projectId || !dataset) return new Map();

  const response = await fetch(
    `https://${projectId}.apicdn.sanity.io/v2025-02-19/data/query/${dataset}?query=${QUERY}&perspective=published`,
    {
      headers: token ? { Authorization: `Bearer ${token}` } : {},
      cache: "no-store",
      signal: AbortSignal.timeout(3_000),
    },
  );
  if (!response.ok) throw new Error(`Sanity responded ${response.status}`);
  const { result } = (await response.json()) as {
    result?: { source: string; destination: string; permanent?: boolean }[];
  };

  const map = new Map<string, Redirect>();
  for (const { source, destination, permanent } of result ?? []) {
    if (!source.startsWith("/")) continue;
    if (normalize(source) === normalize(destination)) continue;
    map.set(normalize(source), {
      destination,
      permanent: permanent !== false,
    });
  }
  return map;
}

async function getRedirects(): Promise<Map<string, Redirect>> {
  if (cache && Date.now() - cache.loadedAt < REFRESH_MS) return cache.map;
  pending ??= loadRedirects()
    .then((map) => {
      cache = { map, loadedAt: Date.now() };
      return map;
    })
    .catch((error) => {
      console.warn("Could not load redirects from Sanity", error);
      // Keep serving the last good list; retry on the next refresh.
      if (cache) cache.loadedAt = Date.now();
      return cache?.map ?? new Map<string, Redirect>();
    })
    .finally(() => {
      pending = null;
    });
  return pending;
}

export async function proxy(request: NextRequest) {
  const match = (await getRedirects()).get(normalize(request.nextUrl.pathname));
  if (!match) return NextResponse.next();
  return NextResponse.redirect(
    new URL(match.destination, request.url),
    match.permanent ? 308 : 307,
  );
}

export const config = {
  // Pages only: skip Next's own files, the API and anything with a file
  // extension (images, icons, robots.txt, sitemap.xml).
  matcher: ["/((?!_next/|api/|.*\\.[a-z0-9]+$).*)"],
};
