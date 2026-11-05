/**
 * Canonical site origin, e.g. "https://www.maricopaseniorliving.org".
 *
 * Uses NEXT_PUBLIC_SITE_URL, then Vercel's production domain, so metadata,
 * robots.txt and the sitemap never point at localhost on a deployment. Either
 * value may be given with or without "https://".
 */
function resolveBaseUrl() {
  const raw =
    process.env.NEXT_PUBLIC_SITE_URL ||
    process.env.VERCEL_PROJECT_PRODUCTION_URL ||
    process.env.NEXT_PUBLIC_VERCEL_PROJECT_PRODUCTION_URL;
  if (!raw) return "http://localhost:3000";
  const trimmed = raw.trim().replace(/\/+$/, "");
  return /^https?:\/\//i.test(trimmed) ? trimmed : `https://${trimmed}`;
}

export const baseUrl = resolveBaseUrl();
