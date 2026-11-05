import { cachedSanity } from "@maricopa-senior-living/sanity/live";
import {
  queryAboutPages,
  querySettings,
} from "@maricopa-senior-living/sanity/queries";
import type { Metadata } from "next";
import Link from "next/link";

import { PageHeader } from "@/components/page-header";
import { draftAware } from "@/lib/draft";

export const metadata: Metadata = {
  title: "About Maricopa Senior Living",
  description:
    "Who we are, what we do, and how to support Maricopa Senior Living, an Arizona nonprofit.",
};

export default async function AboutIndex() {
  return draftAware(async ({ perspective, stega }) => {
    const [{ data: pages }, { data: settings }] = await Promise.all([
      cachedSanity({ query: queryAboutPages, perspective, stega }),
      cachedSanity({ query: querySettings, perspective, stega }),
    ]);
    return (
      <>
        <PageHeader
          title="About Maricopa Senior Living"
          intro={settings?.nonprofitStatement}
          crumbs={[{ label: "About us", href: "/about" }]}
        >
          {settings?.donateUrl ? (
            <p className="mt-5">
              <a
                href={settings.donateUrl}
                className="btn"
                rel="noopener noreferrer"
                target="_blank"
              >
                Donate
                <span className="sr-only"> (opens PayPal in a new tab)</span>
              </a>
            </p>
          ) : null}
        </PageHeader>
        <div className="container-page py-8">
          <ul className="grid gap-4 md:grid-cols-2">
            {(pages ?? []).map((page) => (
              <li key={page._id}>
                <Link
                  href={`/about/${page.slug}`}
                  className="card card-link block h-full"
                >
                  <span className="card-title block">{page.title}</span>
                  {page.description ? (
                    <span className="mt-2 block">{page.description}</span>
                  ) : null}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </>
    );
  });
}
