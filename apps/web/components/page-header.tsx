import Link from "next/link";

export type Crumb = { label: string; href: string };

/** Page title band with a "You are here" trail. */
export function PageHeader({
  title,
  intro,
  crumbs = [],
  eyebrow,
  children,
}: {
  title: string;
  intro?: string | null;
  crumbs?: Crumb[];
  eyebrow?: string | null;
  children?: React.ReactNode;
}) {
  return (
    <div className="border-b-2 border-[var(--msl-line)] bg-[var(--msl-sky)]">
      <div className="container-page py-8">
        {crumbs.length ? (
          <nav aria-label="You are here" className="no-print mb-3 text-base">
            <ol className="flex flex-wrap gap-x-2">
              <li>
                <Link href="/">Home</Link>
              </li>
              {crumbs.map((crumb) => (
                <li
                  key={crumb.href}
                  className="before:mr-2 before:content-['›']"
                >
                  <Link href={crumb.href}>{crumb.label}</Link>
                </li>
              ))}
            </ol>
          </nav>
        ) : null}
        {eyebrow ? <p className="eyebrow">{eyebrow}</p> : null}
        <h1>{title}</h1>
        {intro ? <p className="mt-3 measure text-xl">{intro}</p> : null}
        {children}
      </div>
    </div>
  );
}

/** Previous / next page links for long lists. */
export function Pager({
  page,
  totalPages,
  hrefFor,
}: {
  page: number;
  totalPages: number;
  hrefFor: (page: number) => string;
}) {
  if (totalPages <= 1) return null;
  return (
    <nav
      aria-label="More pages"
      className="mt-8 flex flex-wrap items-center gap-4"
    >
      {page > 1 ? (
        <Link href={hrefFor(page - 1)} className="btn btn-secondary">
          ← Previous page
        </Link>
      ) : null}
      <p className="text-lg">
        Page {page} of {totalPages}
      </p>
      {page < totalPages ? (
        <Link href={hrefFor(page + 1)} className="btn btn-secondary">
          Next page →
        </Link>
      ) : null}
    </nav>
  );
}
