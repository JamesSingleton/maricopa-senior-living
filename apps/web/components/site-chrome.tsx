import {
  cachedSanity,
  type DynamicFetchOptions,
} from "@maricopa-senior-living/sanity/live";
import {
  queryNavigation,
  querySettings,
} from "@maricopa-senior-living/sanity/queries";
import { ArrowUpRight, Phone, Search } from "lucide-react";
import Link from "next/link";

import { addressLines } from "@/lib/address";
import { type LinkValue, resolveLink, telHref } from "@/lib/links";
import { siteGraph } from "@/lib/structured-data";
import { JsonLd } from "./json-ld";
import { MobileMenu } from "./mobile-menu";
import { NavLinks } from "./nav-links";

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

/** Sun on a flat desert horizon. */
function BrandMark() {
  return (
    <svg
      viewBox="0 0 48 48"
      aria-hidden="true"
      className="size-11 shrink-0 sm:size-12"
    >
      <rect width="48" height="48" rx="8" fill="var(--msl-green)" />
      <circle cx="24" cy="30" r="11" fill="var(--msl-yellow)" />
      <rect y="30" width="48" height="18" fill="var(--msl-clay)" />
      <rect y="38" width="48" height="10" fill="var(--msl-cream)" />
    </svg>
  );
}

/** Numbers every visitor should be one tap from, on every page. */
const URGENT = [
  { label: "Emergency", short: "Emergency", number: "911" },
  { label: "Crisis line", short: "Crisis", number: "988" },
  { label: "Local help line", short: "Help", number: "211" },
];

/**
 * Header: urgent numbers, the name, a search box that is always on screen
 * and all six sections as plain links. No drop-downs; on a phone the
 * sections sit behind one labelled "Menu" button.
 */
export async function SiteHeader({ perspective, stega }: DynamicFetchOptions) {
  const [{ data: navigation }, { data: settings }] = await Promise.all([
    cachedSanity({ query: queryNavigation, perspective, stega }),
    cachedSanity({ query: querySettings, perspective, stega }),
  ]);
  const items = menuItems(navigation?.main);
  const title = settings?.siteTitle ?? "Maricopa Senior Living";

  return (
    <header className="site-header relative z-30 bg-[var(--msl-paper)]">
      <div className="band-gold">
        <ul
          aria-label="Urgent phone numbers"
          className="container-page flex items-center justify-between gap-x-3 py-1 text-[0.9rem] sm:justify-start sm:gap-x-8 sm:text-base"
        >
          {URGENT.map((item) => (
            <li key={item.number}>
              <a
                href={`tel:${item.number}`}
                className="inline-flex min-h-[2.75rem] items-center gap-1.5 whitespace-nowrap no-underline hover:underline"
              >
                <Phone className="size-4 max-sm:hidden" aria-hidden="true" />
                <span>
                  <span className="sm:hidden">{item.short}</span>
                  <span className="max-sm:hidden">{item.label}:</span>{" "}
                  <strong className="text-[1.1em]">{item.number}</strong>
                </span>
              </a>
            </li>
          ))}
        </ul>
      </div>
      <div className="container-page flex items-center justify-between gap-4 py-3">
        <Link
          href="/"
          className="flex items-center gap-3 text-[var(--msl-ink)] no-underline"
          aria-label={`${title} — home page`}
        >
          <BrandMark />
          <span className="font-display text-[1.3rem] font-semibold leading-[1.05] sm:text-[1.5rem]">
            {title}
          </span>
        </Link>
        <div className="flex shrink-0 items-center gap-2">
          <MobileMenu
            items={items.map(({ label, href }) => ({ label, href }))}
          />
          <form
            action="/search"
            method="get"
            role="search"
            className="relative max-lg:hidden"
          >
            <label htmlFor="header-q" className="sr-only">
              Search the website
            </label>
            <input
              id="header-q"
              name="q"
              type="search"
              required
              className="input w-[19rem] pr-14"
              placeholder="Search, e.g. meals"
            />
            <button
              type="submit"
              className="absolute inset-y-0 right-0 grid w-[3.1rem] place-items-center rounded-r-[var(--msl-radius)] bg-[var(--msl-green)] text-white"
            >
              <Search className="size-5" aria-hidden="true" />
              <span className="sr-only">Search</span>
            </button>
          </form>
          <Link
            href="/search"
            className="btn btn-secondary btn-sm max-md:hidden lg:hidden"
          >
            <Search className="size-5" aria-hidden="true" />
            Search
          </Link>
          {settings?.donateUrl ? (
            <a
              href={settings.donateUrl}
              className="btn btn-clay btn-sm max-sm:hidden"
              rel="noopener noreferrer"
              target="_blank"
            >
              Donate
              <span className="sr-only"> (opens PayPal in a new tab)</span>
            </a>
          ) : null}
        </div>
      </div>
      <nav aria-label="Main" className="container-page hidden md:block">
        <NavLinks items={items.map(({ label, href }) => ({ label, href }))} />
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
    <footer className="site-footer mt-24">
      <JsonLd data={siteGraph(settings ?? null)} />
      <div className="band-dark">
        <div className="container-page grid gap-10 py-14 md:grid-cols-[1.4fr_1fr_1fr_1fr]">
          <div>
            <div className="flex items-center gap-3">
              <BrandMark />
              <p className="text-xl font-semibold">{title}</p>
            </div>
            {settings?.nonprofitStatement ? (
              <p className="muted mt-4 measure">
                {settings.nonprofitStatement}
                {settings.ein ? ` EIN ${settings.ein}.` : ""}
              </p>
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
                  {addressLines(settings?.mailingAddress ?? null).map(
                    (line) => (
                      <span key={line} className="block">
                        {line}
                      </span>
                    ),
                  )}
                </li>
              ) : null}
            </ul>
          </div>
        </div>
        <p className="container-page muted border-t border-[var(--msl-green-3)] py-6 text-base">
          © {title}. Information on this site is a public service — please
          confirm details with each organization.
        </p>
      </div>
    </footer>
  );
}
