import { CalendarIcon } from "@heroicons/react/24/outline";
import {
  getDynamicFetchOptions,
  sanityFetch,
  sanityFetchMetadata,
  sanityFetchStaticParams,
  type DynamicFetchOptions,
} from "@maricopa-senior-living/sanity/live";
import { queryArticleSlugPageData } from "@maricopa-senior-living/sanity/queries";
import type { QueryArticleSlugPageDataResult } from "@maricopa-senior-living/sanity/types";
import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";

import BackButton from "@/components/BackButton";
import { CustomPortableText } from "@/components/CustomPortableText";
import DateComponent from "@/components/Date";
import ImageComponent from "@/components/ImageComponent";
import { queryRecentArticleSlugs } from "@maricopa-senior-living/sanity/queries";

export async function generateStaticParams() {
  const { data } = await sanityFetchStaticParams({ query: queryRecentArticleSlugs });
  return data ?? [];
}


export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const [{ slug }, { perspective }] = await Promise.all([
    params,
    getDynamicFetchOptions(),
  ]);
  const { data: post } = await sanityFetchMetadata({
    query: queryArticleSlugPageData,
    params: { slug },
    perspective,
  });

  if (!post) {
    return {};
  }

  return {
    title: `${post.title}`,
    description: `${post.excerpt}`,
    openGraph: {
      title: `${post.title}`,
      description: `${post.excerpt}`,
      type: "article",
      tags: post.tags?.map((tag) => tag.title),
      publishedTime: post.publishedAt,
      modifiedTime: post._updatedAt,
    },
  };
}

export default async function ArticlePage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const [{ slug }, { perspective, stega }] = await Promise.all([
    params,
    getDynamicFetchOptions(),
  ]);

  return (
    <CachedArticlePage slug={slug} perspective={perspective} stega={stega} />
  );
}

async function CachedArticlePage({
  slug,
  perspective,
  stega,
}: { slug: string } & DynamicFetchOptions) {
  "use cache";
  const { data } = await sanityFetch({
    query: queryArticleSlugPageData,
    params: { slug },
    perspective,
    stega,
  });
  const post = data as QueryArticleSlugPageDataResult;

  if (!post) {
    notFound();
  }

  return (
    <>
      <BackButton />
      <article className="prose prose-lg prose-indigo mt-4 rounded-md bg-white shadow-sm lg:max-w-none">
        <div className="px-4 py-4 sm:px-10 sm:py-10">
          <div className="flex flex-wrap space-x-5 xl:space-x-10">
            <span className="flex items-center space-x-2">
              <ImageComponent
                image={post.author.image}
                alt={`Avatar of ${post.author.name}`}
                width={24}
                height={24}
                className="h-6 w-6 rounded-full"
              />
              <span>{post.author.name}</span>
            </span>
            <span className="flex items-center space-x-2">
              <CalendarIcon className="h-5 w-5 text-zinc-500" />
              <span className="sr-only">Published on</span>{" "}
              <DateComponent dateString={post.publishedAt} />
            </span>
          </div>
          <h1 className="mt-2 text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
            {post.title}
          </h1>
          {post.mainImage && (
            <div className="flex items-center justify-center">
              <ImageComponent
                image={post.mainImage}
                alt={post.mainImage.alt}
                width={1024}
                height={768}
                className="rounded-md"
              />
            </div>
          )}
          <CustomPortableText value={post.body} />
          {post.tags && (
            <div className="mt-8 md:mt-14">
              <h2 className="text-xl font-semibold">Tags</h2>
              <ul className="not-prose flex list-none items-center space-x-4 pl-0">
                {post.tags.map((tag) => (
                  <li key={tag._id}>
                    <Link
                      href={`/tag/${tag.slug}`}
                      prefetch={false}
                      className="rounded bg-zinc-200 px-3 py-1 text-base transition-all duration-150 hover:bg-red-400 hover:text-white"
                    >
                      {tag.title}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </article>
    </>
  );
}
