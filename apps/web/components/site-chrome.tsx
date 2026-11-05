import {
  cachedSanity,
  type DynamicFetchOptions,
} from "@maricopa-senior-living/sanity/live";
import {
  queryNavigation,
  querySettings,
} from "@maricopa-senior-living/sanity/queries";
import { ArrowUpRight, Search } from "lucide-react";
import Link from "next/link";

import { addressLines } from "@/lib/address";
import { type LinkValue, resolveLink, telHref } from "@/lib/links";
import { siteGraph } from "@/lib/structured-data";
import { JsonLd } from "./json-ld";
import { MobileMenu } from "./mobile-menu";

const FALLBACK_MENU: { label: string; href: string }[] = [
  { label: "Find Help", href: "/resources" },
  { label: "What's New", href: "/whats-new" },
  { label: "Events", href: "/events" },
  { label: "Newsletter", href: "/newsletter" },
  { label: "Articles", href: "/articles" },
  { label: "About Us", href: "/about" },
];

type MenuItem = { label: string; href: string; external: boolean };

function menuItems(
  links: (LinkValue & { _key?: string })[] | null | undefined,
  fallback = true,
): MenuItem[] {
  const resolved = (links ?? [])
    .map((link) => {
      const target = resolveLink(link);
      return target && link?.label ? { label: link.label, ...target } : null;
    })
    .filter((item): item is MenuItem => Boolean(item));
  if (resolved.length || !fallback) return resolved;
  return FALLBACK_MENU.map((item) => ({ ...item, external: false }));
}

/** Three-hill mark drawn in the brand colors. */
function BrandMark() {
  return (
    <svg
      viewBox="0 0 48 48"
      aria-hidden="true"
      className="size-10 shrink-0 sm:size-11"
    >
      <rect width="48" height="48" rx="14" fill="var(--msl-green)" />
      <circle cx="33" cy="17" r="6.5" fill="var(--msl-yellow)" />
      <path d="M0 34 Q12 23 24 31 T48 28 V48 H0Z" fill="#7fa36a" />
      <path
        d="M0 40 Q15 33 27 39 T48 37 V48 H0Z"
        fill="#fffeee"
        opacity="0.9"
      />
    </svg>
  );
}

/**
 * Header: name, search, a Donate button and all six sections as pill
 * links. No drop-downs and no hidden "hamburger" — on a phone the pills
 * wrap into a two-column grid that is always visible.
 */
export async function SiteHeader({ perspective, stega }: DynamicFetchOptions) {
  const [{ data: navigation }, { data: settings }] = await Promise.all([
    cachedSanity({ query: queryNavigation, perspective, stega }),
    cachedSanity({ query: querySettings, perspective, stega }),
  ]);
  const items = menuItems(navigation?.main);
  const title = settings?.siteTitle ?? "Maricopa Senior Living";

  return (
    <header className="site-header relative border-b border-[var(--msl-line)] bg-[var(--msl-paper)]">
      <div className="container-page flex items-center justify-between gap-4 pb-2 pt-3 md:pb-3">
        <Link
          href="/"
          className="flex items-center gap-3 text-[var(--msl-ink)] no-underline"
          aria-label={`${title} — home page`}
        >
          <BrandMark />
          <span className="text-[1.15rem] font-semibold leading-tight tracking-tight sm:text-[1.25rem]">
            {title}
          </span>
        </Link>
        <div className="flex shrink-0 items-center gap-2">
          <MobileMenu
            items={items.map(({ label, href }) => ({ label, href }))}
          />
          <Link
            href="/search"
            className="btn btn-secondary btn-sm max-md:hidden"
          >
            <Search className="size-5" aria-hidden="true" />
            Search
          </Link>
          {settings?.donateUrl ? (
            <a
              href={settings.donateUrl}
              className="btn btn-yellow btn-sm max-sm:hidden"
              rel="noopener noreferrer"
              target="_blank"
            >
              Donate
              <span className="sr-only"> (opens PayPal in a new tab)</span>
            </a>
          ) : null}
        </div>
      </div>
      {/* All six sections in one row from tablet up; phones use the
          labelled Menu button above. No drop-downs. */}
      <nav aria-label="Main" className="container-page hidden pb-3 md:block">
        <ul className="flex flex-wrap gap-1">
          {items.map((item) => (
            <li key={item.href}>
              <Link
                href={item.href}
                className="flex min-h-[2.75rem] items-center justify-center whitespace-nowrap rounded-full border border-transparent px-4 text-center font-semibold text-[var(--msl-ink)] no-underline hover:border-[var(--msl-green)] hover:bg-[var(--msl-cream-2)]"
              >
                {item.label}
              </Link>
            </li>
          ))}
        </ul>
      </nav>
    </header>
  );
}

export async function SiteFooter({ perspective, stega }: DynamicFetchOptions) {
  const [{ data: navigation }, { data: settings }] = await Promise.all([
    cachedSanity({ query: queryNavigation, perspective, stega }),
    cachedSanity({ query: querySettings, perspective, stega }),
  ]);
  const sections = menuItems(navigation?.main);
  const more = menuItems(navigation?.footer, false);
  const title = settings?.siteTitle ?? "Maricopa Senior Living";

  return (
    <footer className="site-footer band-dark mt-20">
      <JsonLd data={siteGraph(settings ?? null)} />
      <div className="container-page grid gap-10 py-14 md:grid-cols-[1.4fr_1fr_1fr_1fr]">
        <div>
          <div className="flex items-center gap-3">
            <BrandMark />
            <p className="text-xl font-semibold">{title}</p>
          </div>
          {settings?.nonprofitStatement ? (
            <p className="muted mt-4 measure">{settings.nonprofitStatement}</p>
          ) : null}
          {settings?.donateUrl ? (
            <a
              href={settings.donateUrl}
              className="btn btn-yellow mt-5"
              rel="noopener noreferrer"
              target="_blank"
            >
              Donate
              <span className="btn-arrow">
                <ArrowUpRight className="size-5" aria-hidden="true" />
              </span>
              <span className="sr-only"> (opens PayPal in a new tab)</span>
            </a>
          ) : null}
        </div>
        <nav aria-label="Sections">
          <h2 className="text-base font-semibold text-[var(--msl-yellow)]">
            Sections
          </h2>
          <ul className="mt-3 space-y-2">
            {sections.map((item) => (
              <li key={item.href}>
                <Link href={item.href}>{item.label}</Link>
              </li>
            ))}
          </ul>
        </nav>
        {more.length ? (
          <nav aria-label="More pages">
            <h2 className="text-base font-semibold text-[var(--msl-yellow)]">
              More
            </h2>
            <ul className="mt-3 space-y-2">
              {more.map((item) => (
                <li key={item.href}>
                  <Link href={item.href}>{item.label}</Link>
                </li>
              ))}
            </ul>
          </nav>
        ) : null}
        <div>
          <h2 className="text-base font-semibold text-[var(--msl-yellow)]">
            Contact us
          </h2>
          <ul className="mt-3 space-y-2">
            {settings?.contactEmail ? (
              <li>
                <a href={`mailto:${settings.contactEmail}`}>
                  {settings.contactEmail}
                </a>
              </li>
            ) : null}
            {settings?.contactPhone?.number ? (
              <li>
                <a href={telHref(settings.contactPhone.number)}>
                  {settings.contactPhone.number}
                </a>
              </li>
            ) : null}
            {addressLines(settings?.mailingAddress ?? null).length ? (
              <li className="muted">
                {addressLines(settings?.mailingAddress ?? null).map((line) => (
                  <span key={line} className="block">
                    {line}
                  </span>
                ))}
              </li>
            ) : null}
          </ul>
        </div>
      </div>
      <p className="container-page muted border-t border-[var(--msl-green-3)] py-6 text-base">
        © {title}. Information on this site is a public service — please confirm
        details with each organization.
      </p>
    </footer>
  );
}
