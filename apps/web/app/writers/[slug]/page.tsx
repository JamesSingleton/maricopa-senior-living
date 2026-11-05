import {
  cachedSanity,
  cachedSanityMetadata,
} from "@maricopa-senior-living/sanity/live";
import { queryWriter } from "@maricopa-senior-living/sanity/queries";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Suspense } from "react";

import { ArticleCard } from "@/components/cards";
import { PageHeader } from "@/components/page-header";
import { draftAware, Loading } from "@/lib/draft";

type Params = Promise<{ slug: string }>;

export async function generateStaticParams() {
  return [{ slug: "joan-koczor" }, { slug: "ron-smith" }];
}

export async function generateMetadata({
  params,
}: {
  params: Params;
}): Promise<Metadata> {
  const { slug } = await params;
  const { data } = await cachedSanityMetadata({
    query: queryWriter,
    params: { slug },
    perspective: "published",
  });
  return data
    ? { title: data.name ?? undefined, description: data.bio ?? undefined }
    : {};
}

/**
 * Params are request data for paths not built ahead of time, so the content
 * renders inside Suspense; prebuilt paths are still fully static.
 */
export default function WriterPage({ params }: { params: Params }) {
  return (
    <Suspense fallback={<Loading />}>
      <WriterPageContent params={params} />
    </Suspense>
  );
}

async function WriterPageContent({ params }: { params: Params }) {
  const { slug } = await params;
  return draftAware(async ({ perspective, stega }) => {
    const { data: writer } = await cachedSanity({
      query: queryWriter,
      params: { slug },
      perspective,
      stega,
    });
    if (!writer) notFound();
    return (
      <>
        <PageHeader
          eyebrow={
            [writer.role, writer.credentials].filter(Boolean).join(" · ") ||
            null
          }
          title={writer.name ?? "Writer"}
          intro={writer.bio}
          crumbs={[{ label: "Articles", href: "/articles" }]}
        >
          {writer.tribute ? (
            <p className="mt-4 measure rounded-[var(--msl-radius)] bg-[var(--msl-surface)] p-4 text-lg italic">
              {writer.tribute}
            </p>
          ) : null}
        </PageHeader>
        <div className="container-page py-8">
          <h2>Articles by {writer.name}</h2>
          <ul className="mt-4 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {(writer.articles ?? []).map((article) => (
              <li key={article._id}>
                <ArticleCard article={article} />
              </li>
            ))}
          </ul>
        </div>
      </>
    );
  });
}
