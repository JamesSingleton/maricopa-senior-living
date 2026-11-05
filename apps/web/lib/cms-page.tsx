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
import { seoMetadata } from "./seo";

export async function pageMetadata(slug: string): Promise<Metadata> {
  const { data } = await cachedSanityMetadata({
    query: queryPage,
    params: { slug },
    perspective: "published",
  });
  return data
    ? seoMetadata({
        seo: data.seo,
        title: data.title,
        description: data.description,
        path: `/${slug}`,
      })
    : {};
}

/** A page built from sections in the Studio. Unknown paths try redirects. */
export function renderCmsPage(slug: string) {
  return draftAware(async ({ perspective, stega }) => {
    const { data: page } = await cachedSanity({
      query: queryPage,
      params: { slug },
      perspective,
      stega,
    });
    if (!page) return redirectOrNotFound(`/${slug}`);
    const firstIsHero = page.sections?.[0]?._type === "heroBlock";
    return (
      <>
        {firstIsHero ? null : (
          <PageHeader
            title={page.title ?? "Page"}
            crumbs={
              slug === "about"
                ? []
                : [{ label: page.title ?? "Page", href: `/${slug}` }]
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
