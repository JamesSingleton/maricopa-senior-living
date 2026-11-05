import {
  cachedSanity,
  type DynamicFetchOptions,
} from "@maricopa-senior-living/sanity/live";
import {
  queryNavigation,
  querySettings,
} from "@maricopa-senior-living/sanity/queries";
import Link from "next/link";

import { type LinkValue, resolveLink, telHref } from "@/lib/links";

const FALLBACK_MENU: { label: string; href: string }[] = [
  { label: "Find Help", href: "/resources" },
  { label: "What's New", href: "/whats-new" },
  { label: "Events", href: "/events" },
  { label: "Newsletter", href: "/newsletter" },
  { label: "Articles", href: "/articles" },
  { label: "About Us", href: "/about" },
];

function menuItems(
  links: (LinkValue & { _key?: string })[] | null | undefined,
) {
  const resolved = (links ?? [])
    .map((link) => {
      const target = resolveLink(link);
      return target && link?.label ? { label: link.label, ...target } : null;
    })
    .filter(
      (item): item is { label: string; href: string; external: boolean } =>
        Boolean(item),
    );
  return resolved.length
    ? resolved
    : FALLBACK_MENU.map((item) => ({ ...item, external: false }));
}

/**
 * Header: the site name, a search box and all six sections as large,
 * always-visible buttons. No drop-downs and no hidden "hamburger" menu —
 * on a phone the buttons simply wrap onto more lines.
 */
export async function SiteHeader({ perspective, stega }: DynamicFetchOptions) {
  const [{ data: navigation }, { data: settings }] = await Promise.all([
    cachedSanity({ query: queryNavigation, perspective, stega }),
    cachedSanity({ query: querySettings, perspective, stega }),
  ]);
  const items = menuItems(navigation?.main);
  const title = settings?.siteTitle ?? "Maricopa Senior Living";

  return (
    <header className="site-header border-b-4 border-[var(--msl-sand-strong)] bg-[var(--msl-surface)]">
      <div className="container-page flex flex-wrap items-center justify-between gap-x-6 gap-y-3 py-4">
        <Link
          href="/"
          className="no-underline"
          aria-label={`${title} — home page`}
        >
          <span className="block font-heading text-[1.6rem] font-semibold leading-tight text-[var(--msl-ink)] sm:text-[1.9rem]">
            {title}
          </span>
          {settings?.tagline ? (
            <span className="block text-base text-[var(--msl-ink-soft)]">
              {settings.tagline}
            </span>
          ) : null}
        </Link>
        <form
          action="/search"
          method="get"
          role="search"
          className="flex w-full max-w-md gap-2 sm:w-auto"
        >
          <label htmlFor="header-search" className="sr-only">
            Search the website
          </label>
          <input
            id="header-search"
            name="q"
            type="search"
            required
            placeholder="Search, e.g. meals"
            className="input"
          />
          <button type="submit" className="btn shrink-0">
            Search
          </button>
        </form>
      </div>
      <nav aria-label="Main" className="bg-[var(--msl-sand)]">
        <ul className="container-page grid grid-cols-2 gap-2 py-3 sm:grid-cols-3 lg:grid-cols-6">
          {items.map((item) => (
            <li key={item.href}>
              <Link
                href={item.href}
                className="flex min-h-[3rem] items-center justify-center rounded-[var(--msl-radius)] border-2 border-[var(--msl-line)] bg-[var(--msl-surface)] px-3 text-center font-bold text-[var(--msl-ink)] no-underline hover:border-[var(--msl-primary)] hover:text-[var(--msl-primary)]"
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
  const links = navigation?.footer?.length ? menuItems(navigation.footer) : [];
  const title = settings?.siteTitle ?? "Maricopa Senior Living";

  return (
    <footer className="site-footer mt-16 bg-[var(--msl-ink)] text-white">
      <div className="container-page grid gap-10 py-12 md:grid-cols-3">
        <div>
          <p className="font-heading text-2xl font-semibold">{title}</p>
          {settings?.nonprofitStatement ? (
            <p className="mt-2 text-[#e8e2d6]">{settings.nonprofitStatement}</p>
          ) : null}
          {settings?.donateUrl ? (
            <a
              href={settings.donateUrl}
              className="btn mt-4 border-white bg-white text-[var(--msl-primary)] hover:bg-[var(--msl-sand)]"
            >
              Donate
            </a>
          ) : null}
        </div>
        <div>
          <h2 className="text-xl text-white">Contact us</h2>
          <ul className="mt-3 space-y-2">
            {settings?.contactEmail ? (
              <li>
                <a
                  className="text-white"
                  href={`mailto:${settings.contactEmail}`}
                >
                  {settings.contactEmail}
                </a>
              </li>
            ) : null}
            {settings?.contactPhone?.number ? (
              <li>
                <a
                  className="text-white"
                  href={telHref(settings.contactPhone.number)}
                >
                  {settings.contactPhone.number}
                </a>
              </li>
            ) : null}
            {settings?.mailingAddress ? (
              <li className="whitespace-pre-line text-[#e8e2d6]">
                {settings.mailingAddress}
              </li>
            ) : null}
          </ul>
        </div>
        {links.length ? (
          <nav aria-label="More pages">
            <h2 className="text-xl text-white">More</h2>
            <ul className="mt-3 space-y-2">
              {links.map((item) => (
                <li key={item.href}>
                  <Link className="text-white" href={item.href}>
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
        ) : null}
      </div>
      <p className="container-page border-t border-[#4a5257] py-5 text-base text-[#e8e2d6]">
        © {title}. Information on this site is provided as a public service —
        please check details with each organization.
      </p>
    </footer>
  );
}
