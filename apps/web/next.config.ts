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
  // Fixed redirects. The ones Ron manages in the Studio are in proxy.ts.
  async redirects() {
    return [
      // Ron's old bookmark: the Studio moved out of the website.
      { source: "/admin", destination: STUDIO_URL, permanent: false },
      { source: "/admin/:path*", destination: STUDIO_URL, permanent: false },
      { source: "/find-help", destination: "/resources", permanent: true },
      // Nonprofit pages used to live under /about/; they're top-level now.
      { source: "/about/who-we-are", destination: "/about", permanent: true },
      { source: "/about/:slug", destination: "/:slug", permanent: true },
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
