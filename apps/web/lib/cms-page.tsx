import {
  cachedSanity,
  cachedSanityMetadata,
} from "@maricopa-senior-living/sanity/live";
import { queryPage } from "@maricopa-senior-living/sanity/queries";
import type { Metadata } from "next";

import { PageBuilder } from "@/components/page-builder";
import { PageHeader } from "@/components/page-header";
import { draftAware } from "./draft";
import { redirectOrNotFound } from "./redirects";

export async function pageMetadata(
  slug: string,
  section: "general" | "about",
): Promise<Metadata> {
  const { data } = await cachedSanityMetadata({
    query: queryPage,
    params: { slug, section },
    perspective: "published",
  });
  return data
    ? {
        title: data.title ?? undefined,
        description: data.description ?? undefined,
        alternates: {
          canonical: section === "about" ? `/about/${slug}` : `/${slug}`,
        },
      }
    : {};
}

/** A page built from sections in the Studio. Unknown paths try redirects. */
export function renderCmsPage(slug: string, section: "general" | "about") {
  return draftAware(async ({ perspective, stega }) => {
    const { data: page } = await cachedSanity({
      query: queryPage,
      params: { slug, section },
      perspective,
      stega,
    });
    if (!page)
      return redirectOrNotFound(
        section === "about" ? `/about/${slug}` : `/${slug}`,
      );
    const firstIsHero = page.sections?.[0]?._type === "heroBlock";
    return (
      <>
        {firstIsHero ? null : (
          <PageHeader
            title={page.title ?? "Page"}
            intro={page.description}
            crumbs={
              section === "about" ? [{ label: "About us", href: "/about" }] : []
            }
          />
        )}
        <div className="[&>section:first-child]:pt-6">
          <PageBuilder
            blocks={page.sections}
            perspective={perspective}
            stega={stega}
          />
        </div>
      </>
    );
  });
}
