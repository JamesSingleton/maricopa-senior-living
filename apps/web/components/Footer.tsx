import { CmsLink, type CmsLinkData } from "@/components/CmsLink";

export interface FooterColumn {
  _key: string;
  heading?: string | null;
  links?: CmsLinkData[] | null;
}

export default function Footer({
  columns = [],
  tagline,
  copyright,
  siteTitle = "Maricopa Senior Resource Hub",
}: {
  columns?: FooterColumn[];
  tagline?: string | null;
  copyright?: string | null;
  siteTitle?: string;
}) {
  return (
    <footer className="border-t border-border bg-muted/30">
      <div className="container py-12">
        <div className="mb-8 max-w-md">
          <p className="font-serif text-lg font-semibold text-foreground">
            {siteTitle}
          </p>
          {tagline ? (
            <p className="mt-2 text-sm text-muted-foreground">{tagline}</p>
          ) : null}
        </div>
        {columns.length > 0 ? (
          <nav
            className="grid gap-8 sm:grid-cols-2 md:grid-cols-3"
            aria-label="Footer"
          >
            {columns.map((column) => (
              <div key={column._key}>
                {column.heading ? (
                  <h2 className="text-sm font-semibold uppercase tracking-wide text-foreground">
                    {column.heading}
                  </h2>
                ) : null}
                <ul className="mt-3 space-y-2">
                  {column.links?.map((link, i) =>
                    link?.href ? (
                      <li key={`${column._key}-${i}`}>
                        <CmsLink
                          link={link}
                          className="text-sm text-muted-foreground transition-colors hover:text-foreground"
                        />
                      </li>
                    ) : null,
                  )}
                </ul>
              </div>
            ))}
          </nav>
        ) : null}
        <p className="mt-10 border-t border-border pt-6 text-center text-sm text-muted-foreground">
          {copyright ??
            `© ${new Date().getFullYear()} ${siteTitle}. All rights reserved.`}
        </p>
      </div>
    </footer>
  );
}
