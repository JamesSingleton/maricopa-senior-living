import { sanityFetch } from "@maricopa-senior-living/sanity/live";
import { categoryBySlug } from "@maricopa-senior-living/sanity/query";
import type { Metadata, ResolvingMetadata } from "next";
import { notFound } from "next/navigation";

import ArticleCard from "@/components/ArticleCard";
import { CustomPortableText } from "@/components/CustomPortableText";
import DirectoryCard from "@/components/DirectoryCard";
import { baseUrl } from "@/lib/constants";

async function fetchCategoryBySlug(slug: string) {
  return await sanityFetch({
    query: categoryBySlug,
    params: { slug },
  });
}

export async function generateMetadata(
  {
    params,
  }: {
    params: Promise<{ category: string }>;
  },
  parent: ResolvingMetadata,
): Promise<Metadata> {
  const { category: categoryParam } = await params;
  const { data: category } = await fetchCategoryBySlug(categoryParam);
  const previousOpenGraph = (await parent)?.openGraph;

  if (!category) {
    return {};
  }

  return {
    title: `${category.title}`,
    description: `${category.excerpt}`,
    openGraph: {
      ...previousOpenGraph,
      title: `${category.title}`,
      description: `${category.excerpt}`,
      url: `${baseUrl}/category/${category.slug}`,
    },
  };
}

export default async function CategoryPage({
  params,
}: {
  params: Promise<{ category: string }>;
}) {
  const { category: categoryParam } = await params;
  const { data: category } = await fetchCategoryBySlug(categoryParam);

  if (!category) {
    notFound();
  }

  return (
    <>
      <h1 className="inline-block align-middle text-4xl font-semibold capitalize sm:text-5xl md:text-6xl">
        {category.title}
      </h1>
      {category.description && (
        <CustomPortableText
          value={category.description}
          paragraphClasses="prose prose-lg prose-indigo text-sm font-medium text-zinc-500 sm:text-base md:text-lg lg:max-w-none pt-4"
        />
      )}
      <section className="space-y-8 pt-4">
        {category.combinedList.map((item: any) => {
          if (item._type === "post") {
            return <ArticleCard key={item._id} post={item} />;
          }
          return <DirectoryCard key={item._id} directoryItem={item} />;
        })}
      </section>
    </>
  );
}
