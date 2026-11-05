import { cachedSanity } from "@maricopa-senior-living/sanity/live";
import { queryHome } from "@maricopa-senior-living/sanity/queries";

import { PageBuilder } from "@/components/page-builder";
import { draftAware } from "@/lib/draft";

export default async function HomePage() {
  return draftAware(async ({ perspective, stega }) => {
    const { data } = await cachedSanity({
      query: queryHome,
      perspective,
      stega,
    });
    return (
      <PageBuilder
        blocks={data?.sections}
        perspective={perspective}
        stega={stega}
      />
    );
  });
}
