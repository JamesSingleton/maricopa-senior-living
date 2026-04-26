import { sanityFetch } from "@maricopa-senior-living/sanity/live";
import { pageBySlug } from "@maricopa-senior-living/sanity/query";
import { notFound } from "next/navigation";

import { CustomPortableText } from "@/components/CustomPortableText";

async function fetchPageBySlug(slug: string) {
  return await sanityFetch({
    query: pageBySlug,
    params: { slug },
  });
}

export default async function Page({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const { data: pageData } = await fetchPageBySlug(slug);

  if (!pageData) {
    notFound();
  }

  return (
    <>
      <h1 className="inline-block align-middle text-4xl font-semibold capitalize sm:text-5xl md:text-6xl">
        {pageData.title}
      </h1>
      <section className="prose prose-lg prose-indigo pt-4 text-sm font-medium text-zinc-500 sm:text-base md:text-lg lg:max-w-none">
        <CustomPortableText value={pageData.body} />
      </section>
    </>
  );
}
