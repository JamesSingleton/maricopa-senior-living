import { ArrowLeft, ArrowRight } from "lucide-react";
import Link from "next/link";

import { breadcrumbs } from "@/lib/structured-data";
import { JsonLd } from "./json-ld";

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
    <div className="bg-gradient-to-b from-[var(--msl-cream-2)] to-[var(--msl-cream)]">
      {crumbs.length ? <JsonLd data={breadcrumbs(crumbs)} /> : null}
      <div className="container-page pb-10 pt-8 md:pb-14 md:pt-10">
        {crumbs.length ? (
          <nav aria-label="You are here" className="no-print mb-6 text-base">
            <ol className="flex flex-wrap gap-x-2 gap-y-1">
              <li>
                <Link href="/">Home</Link>
              </li>
              {crumbs.map((crumb) => (
                <li
                  key={crumb.href}
                  className="before:mr-2 before:text-[var(--msl-ink-soft)] before:content-['/']"
                >
                  <Link href={crumb.href}>{crumb.label}</Link>
                </li>
              ))}
            </ol>
          </nav>
        ) : null}
        {eyebrow ? <p className="eyebrow mb-3">{eyebrow}</p> : null}
        <h1 className="max-w-4xl">{title}</h1>
        {intro ? <p className="lead muted mt-4 measure">{intro}</p> : null}
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
      className="mt-10 flex flex-wrap items-center justify-center gap-4"
    >
      {page > 1 ? (
        <Link href={hrefFor(page - 1)} className="btn btn-secondary">
          <ArrowLeft className="size-5" aria-hidden="true" />
          Previous page
        </Link>
      ) : null}
      <p className="text-lg font-semibold">
        Page {page} of {totalPages}
      </p>
      {page < totalPages ? (
        <Link href={hrefFor(page + 1)} className="btn btn-secondary">
          Next page
          <ArrowRight className="size-5" aria-hidden="true" />
        </Link>
      ) : null}
    </nav>
  );
}
