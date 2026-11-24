"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

type Item = { label: string; href: string };

/** Paths that belong to a section even though they live elsewhere. */
const ALSO: Record<string, string[]> = {
  "/resources": ["/topics", "/links"],
  "/articles": ["/writers"],
};

export function isCurrent(pathname: string, href: string) {
  return [href, ...(ALSO[href] ?? [])].some(
    (base) => pathname === base || pathname.startsWith(`${base}/`),
  );
}

/** The six sections, always visible from tablet up, with "you are here". */
export function NavLinks({ items }: { items: Item[] }) {
  const pathname = usePathname();
  return (
    <ul className="flex flex-wrap gap-x-8 border-t border-[var(--msl-green)]">
      {items.map((item) => (
        <li key={item.href}>
          <Link
            href={item.href}
            aria-current={isCurrent(pathname, item.href) ? "page" : undefined}
            className="flex min-h-[3.2rem] items-center whitespace-nowrap border-b-[5px] border-transparent pt-[5px] text-[1.1rem] font-bold text-[var(--msl-ink)] no-underline hover:border-[var(--msl-yellow)] aria-[current=page]:border-[var(--msl-clay)]"
          >
            {item.label}
          </Link>
        </li>
      ))}
    </ul>
  );
}
