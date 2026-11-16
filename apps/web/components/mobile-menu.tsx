"use client";

import { Menu, Search, X } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useId, useState } from "react";

import { isCurrent } from "./nav-links";

type Item = { label: string; href: string };

/**
 * Phones only: one labelled "Menu" button that opens the six sections as a
 * full-width list of large links. Closes on navigation and on Escape.
 */
export function MobileMenu({ items }: { items: Item[] }) {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();
  const id = useId();

  // biome-ignore lint/correctness/useExhaustiveDependencies: close whenever the page changes
  useEffect(() => setOpen(false), [pathname]);

  useEffect(() => {
    if (!open) return;
    const onKey = (event: KeyboardEvent) =>
      event.key === "Escape" && setOpen(false);
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  return (
    <div className="md:hidden">
      <button
        type="button"
        className="btn btn-secondary btn-sm"
        aria-expanded={open}
        aria-controls={id}
        onClick={() => setOpen((value) => !value)}
      >
        {open ? (
          <X className="size-5" aria-hidden="true" />
        ) : (
          <Menu className="size-5" aria-hidden="true" />
        )}
        {open ? "Close" : "Menu"}
      </button>
      <nav
        id={id}
        aria-label="Main"
        hidden={!open}
        className="absolute inset-x-0 top-full z-40 border-b-4 border-[var(--msl-green)] bg-[var(--msl-paper)]"
      >
        <form
          action="/search"
          method="get"
          role="search"
          className="container-page flex gap-2 pt-4"
        >
          <label htmlFor={`${id}-q`} className="sr-only">
            Search the website
          </label>
          <input
            id={`${id}-q`}
            name="q"
            type="search"
            required
            className="input"
            placeholder="Search, e.g. meals"
          />
          <button type="submit" className="btn shrink-0">
            <Search className="size-5" aria-hidden="true" />
            <span className="sr-only">Search</span>
          </button>
        </form>
        <ul className="container-page flex flex-col py-3">
          {items.map((item) => {
            const current = isCurrent(pathname, item.href);
            return (
              <li key={item.href}>
                <Link
                  href={item.href}
                  aria-current={current ? "page" : undefined}
                  className="flex min-h-[3.25rem] items-center px-4 text-lg font-semibold text-[var(--msl-ink)] no-underline hover:bg-[var(--msl-cream-2)] aria-[current=page]:bg-[var(--msl-yellow)]"
                >
                  {item.label}
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>
    </div>
  );
}
