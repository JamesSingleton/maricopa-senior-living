import {
  type DynamicFetchOptions,
  getDynamicFetchOptions,
  sanityFetch,
  sanityFetchMetadata,
  sanityFetchStaticParams,
} from "@maricopa-senior-living/sanity/live";
import {
  queryTagBySlug,
  queryTagPaths,
} from "@maricopa-senior-living/sanity/queries";
import {
  Empty,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "@maricopa-senior-living/ui/components/empty";
import { InboxIcon } from "lucide-react";
import type { Metadata, ResolvingMetadata } from "next";
import { draftMode } from "next/headers";
import { notFound } from "next/navigation";
import { Suspense } from "react";

import ArticleCard from "@/components/ArticleCard";
import { CustomPortableText } from "@/components/CustomPortableText";
import DirectoryCard from "@/components/DirectoryCard";
import { baseUrl } from "@/lib/constants";
import type { GroupItem } from "@/types/common";

export async function generateStaticParams() {
  const { data } = await sanityFetchStaticParams({ query: queryTagPaths });
  return data ?? [];
}

export async function generateMetadata(
  { params }: { params: Promise<{ tag: string }> },
  parent: ResolvingMetadata,
): Promise<Metadata> {
  const [{ tag: tagParam }, { perspective }] = await Promise.all([
    params,
    getDynamicFetchOptions(),
  ]);
  const { data } = await sanityFetchMetadata({
    query: queryTagBySlug,
    params: { slug: tagParam },
    perspective,
  });
  const tag = data as GroupItem | null;
  const previousOpenGraph = (await parent)?.openGraph;

  if (!tag) return {};

  return {
    title: `${tag.title}`,
    description: `${tag.excerpt}`,
    openGraph: {
      ...previousOpenGraph,
      title: `${tag.title}`,
      description: `${tag.excerpt}`,
      url: `${baseUrl}/tag/${tag.slug}`,
    },
  };
}

export default async function TagsPage({
  params,
}: {
  params: Promise<{ tag: string }>;
}) {
  const { isEnabled: isDraftMode } = await draftMode();

  if (isDraftMode) {
    return (
      <Suspense fallback={<TagFallback />}>
        <DynamicTagPage params={params} />
      </Suspense>
    );
  }

  const { tag } = await params;
  return <CachedTagPage tag={tag} perspective="published" stega={false} />;
}

async function DynamicTagPage({
  params,
}: {
  params: Promise<{ tag: string }>;
}) {
  const [{ tag }, { perspective, stega }] = await Promise.all([
    params,
    getDynamicFetchOptions(),
  ]);

  return <CachedTagPage tag={tag} perspective={perspective} stega={stega} />;
}

async function CachedTagPage({
  tag,
  perspective,
  stega,
}: { tag: string } & DynamicFetchOptions) {
  "use cache";
  const { data } = await sanityFetch({
    query: queryTagBySlug,
    params: { slug: tag },
    perspective,
    stega,
  });
  const tagData = data as GroupItem | null;

  if (!tagData) return notFound();

  return (
    <div>
      <h1 className="inline-block align-middle text-4xl font-semibold capitalize sm:text-5xl md:text-6xl">
        {tagData.title}
      </h1>
      <CustomPortableText
        value={tagData.description}
        paragraphClasses="prose prose-lg prose-indigo text-sm font-medium text-zinc-500 sm:text-base md:text-lg lg:max-w-none pt-4"
      />
      <section className="space-y-8 pt-4">
        {tagData.services &&
          tagData.services.length > 0 &&
          tagData.services.map((service: any) => (
            <DirectoryCard key={service._id} directoryItem={service} />
          ))}
        {tagData.posts &&
          tagData.posts.length > 0 &&
          tagData.posts.map((post: any) => (
            <ArticleCard key={post._id} post={post} />
          ))}
        {tagData.services &&
          tagData.services.length === 0 &&
          tagData.posts &&
          tagData.posts.length === 0 && (
            <Empty>
              <EmptyHeader>
                <EmptyMedia variant="icon">
                  <InboxIcon />
                </EmptyMedia>
                <EmptyTitle>No articles or services yet</EmptyTitle>
                <EmptyDescription>
                  Check back soon for content tagged with {tagData.title}.
                </EmptyDescription>
              </EmptyHeader>
            </Empty>
          )}
      </section>
    </div>
  );
}

function TagFallback() {
  return (
    <div aria-busy>
      <div className="h-12 w-2/3 animate-pulse rounded bg-zinc-200" />
      <div className="mt-8 space-y-8">
        {Array.from({ length: 3 }).map((_, index) => (
          <div key={index} className="h-32 animate-pulse rounded bg-zinc-200" />
        ))}
      </div>
    </div>
  );
}
