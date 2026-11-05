/** URL building for documents and Studio "link" objects. Must match routes. */

export type LinkTarget = {
  _type?: string | null;
  slug?: string | null;
  section?: string | null;
  month?: string | null;
} | null;

export function hrefFor(target: LinkTarget): string | null {
  if (!target?._type) return null;
  const { _type, slug, section, month } = target;
  switch (_type) {
    case "page":
      return slug
        ? section === "about"
          ? `/about/${slug}`
          : `/${slug}`
        : null;
    case "article":
      return slug ? `/articles/${slug}` : null;
    case "resource":
      return slug ? `/resources/${slug}` : null;
    case "event":
      return slug ? `/events/${slug}` : null;
    case "topic":
      return slug ? `/topics/${slug}` : null;
    case "author":
      return slug ? `/writers/${slug}` : null;
    case "monthlyUpdate":
      return month ? `/whats-new/${month}` : "/whats-new";
    case "newsletterEdition":
      return month ? `/newsletter/${month}` : "/newsletter";
    default:
      return null;
  }
}

export type LinkValue = {
  label?: string | null;
  kind?: string | null;
  section?: string | null;
  url?: string | null;
  phone?: string | null;
  email?: string | null;
  target?: LinkTarget;
} | null;

/** Resolve a Studio link to an href, and whether it leaves the site. */
export function resolveLink(
  link: LinkValue,
): { href: string; external: boolean } | null {
  if (!link) return null;
  switch (link.kind) {
    case "internal": {
      const href = hrefFor(link.target ?? null);
      return href ? { href, external: false } : null;
    }
    case "section":
      return link.section ? { href: link.section, external: false } : null;
    case "external":
      return link.url ? { href: link.url, external: true } : null;
    case "phone":
      return link.phone ? { href: telHref(link.phone), external: false } : null;
    case "email":
      return link.email
        ? { href: `mailto:${link.email}`, external: false }
        : null;
    default:
      return null;
  }
}

/** `tel:` URI for one phone number, with an optional extension. */
export function telHref(number: string) {
  const [main = "", extension] = number.split(/\s*(?:ext\.?|extension|x)\s*/i);
  let digits = main.replace(/\D/g, "");
  if (digits.length === 10) digits = `1${digits}`;
  const ext = extension?.replace(/\D/g, "");
  // 3-digit service codes (911, 988, 211) dial as-is.
  return digits.length <= 4
    ? `tel:${digits}`
    : `tel:+${digits}${ext ? `;ext=${ext}` : ""}`;
}

/** Hostname for "opens example.org" hints. */
export function hostOf(url: string) {
  try {
    return new URL(url).hostname.replace(/^www\./, "");
  } catch {
    return url;
  }
}
