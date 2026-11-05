import type { NextConfig } from "next";
import { sanity } from "next-sanity/live/cache-life";

/** The standalone Studio (apps/studio), e.g. https://studio.maricopaseniorliving.org */
const STUDIO_URL =
  process.env.NEXT_PUBLIC_SANITY_STUDIO_URL ??
  "https://studio.maricopaseniorliving.org";

/**
 * Origins allowed to frame the site: the Studio's Presentation tool shows
 * the site in an iframe for live preview.
 */
function frameAncestors() {
  const origins = ["'self'"];
  try {
    const studio = process.env.NEXT_PUBLIC_SANITY_STUDIO_URL;
    if (studio && /^https?:\/\//.test(studio)) {
      origins.push(new URL(studio).origin);
    }
  } catch {
    // Ignore a malformed value.
  }
  return origins.join(" ");
}

/**
 * Redirect documents (old /category, /tag and /articles URLs from the
 * previous site) loaded at build time, so they are real 301s handled before
 * routing. Changing redirects in the Studio takes effect on the next deploy.
 */
async function sanityRedirects() {
  const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID;
  const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET;
  const token = process.env.SANITY_API_READ_TOKEN;
  if (!projectId || !dataset) return [];
  const query = encodeURIComponent(
    '*[_type == "redirect" && defined(source) && defined(destination)]{source, destination, permanent}',
  );
  try {
    const response = await fetch(
      `https://${projectId}.api.sanity.io/v2025-02-19/data/query/${dataset}?query=${query}&perspective=published`,
      { headers: token ? { Authorization: `Bearer ${token}` } : {} },
    );
    const { result } = (await response.json()) as {
      result?: { source: string; destination: string; permanent?: boolean }[];
    };
    return (result ?? [])
      .filter((r) => r.source.startsWith("/") && r.source !== r.destination)
      .map((r) => ({
        // Escape characters path-to-regexp treats as patterns.
        source: r.source.replace(/[()?+*:]/g, (c) => `\\${c}`),
        destination: r.destination,
        permanent: r.permanent !== false,
      }));
  } catch (error) {
    console.warn("Could not load redirects from Sanity", error);
    return [];
  }
}

// https://nextjs.org/docs/advanced-features/security-headers
// The Studio is no longer embedded, so 'unsafe-eval' is only needed by the
// Next dev server. YouTube (privacy mode) is the only embed the site allows.
const evalInDev =
  process.env.NODE_ENV === "development" ? " 'unsafe-eval'" : "";
const ContentSecurityPolicy = `
    default-src 'self' vercel.live https://cdn.userway.org/;
    script-src 'self'${evalInDev} 'unsafe-inline' plausible.io;
    frame-src 'self' vercel.live https://www.youtube-nocookie.com;
    style-src 'self' 'unsafe-inline';
    img-src * blob: data:;
    media-src 'self' https://cdn.sanity.io;
    connect-src *;
    font-src 'self' https://cdn.userway.org/ https://fonts.gstatic.com/ https://fonts.googleapis.com/;
    script-src-elem 'self'${evalInDev} 'unsafe-inline' plausible.io https://cdn.userway.org/ https://core.sanity-cdn.com/ https://vercel.live;
    style-src-elem 'self' 'unsafe-inline' https://cdn.userway.org/;
    frame-ancestors ${frameAncestors()};
`;

const securityHeaders = [
  // https://developer.mozilla.org/en-US/docs/Web/HTTP/CSP
  {
    key: "Content-Security-Policy",
    value: ContentSecurityPolicy.replace(/\n/g, ""),
  },
  // https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Referrer-Policy
  {
    key: "Referrer-Policy",
    value: "origin-when-cross-origin",
  },
  // https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/X-Frame-Options
  // {
  //   key: 'X-Frame-Options',
  //   value: 'DENY',
  // },
  // https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/X-Content-Type-Options
  {
    key: "X-Content-Type-Options",
    value: "nosniff",
  },
  // https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/X-DNS-Prefetch-Control
  {
    key: "X-DNS-Prefetch-Control",
    value: "on",
  },
  // https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Strict-Transport-Security
  {
    key: "Strict-Transport-Security",
    value: "max-age=31536000; includeSubDomains; preload",
  },
  // https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Feature-Policy
  {
    key: "Permissions-Policy",
    value: "camera=(), microphone=(), geolocation=()",
  },
];

const nextConfig: NextConfig = {
  cacheComponents: true,
  cacheLife: { default: sanity },
  transpilePackages: ["@maricopa-senior-living/ui"],
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "cdn.sanity.io",
      },
    ],
  },
  async redirects() {
    return [
      // Ron's old bookmark: the Studio moved out of the website.
      { source: "/admin", destination: STUDIO_URL, permanent: false },
      { source: "/admin/:path*", destination: STUDIO_URL, permanent: false },
      { source: "/find-help", destination: "/resources", permanent: true },
      ...(await sanityRedirects()),
    ];
  },
  async headers() {
    return [
      {
        source: "/(.*)",
        headers: securityHeaders,
      },
    ];
  },
};

export default nextConfig;
