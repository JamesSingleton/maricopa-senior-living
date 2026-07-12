import {
  type DynamicFetchOptions,
  getDynamicFetchOptions,
  sanityFetch,
  sanityFetchMetadata,
} from "@maricopa-senior-living/sanity/live";
import {
  queryGlobalSeoSettings,
  queryHomePageData,
} from "@maricopa-senior-living/sanity/queries";
import type { Metadata, ResolvingMetadata } from "next";
import { draftMode } from "next/headers";
import { Suspense } from "react";

import { CustomPortableText } from "@/components/CustomPortableText";
import { SanityImage } from "@/components/sanity-image";
import { baseUrl } from "@/lib/constants";

export async function generateMetadata(
  _props: unknown,
  parent: ResolvingMetadata,
): Promise<Metadata> {
  const { perspective } = await getDynamicFetchOptions();
  const { data } = await sanityFetchMetadata({
    query: queryGlobalSeoSettings,
    perspective,
  });
  const settings = data as {
    siteTitle?: string | null;
    siteDescription?: string | null;
  } | null;
  const previousOpenGraph = (await parent)?.openGraph;
  const title =
    settings?.siteTitle ?? "Maricopa Senior Living - Aging Well Your Way!";
  const description =
    settings?.siteDescription ??
    "Your go to source for senior living in Maricopa, AZ";

  return {
    title,
    description,
    openGraph: {
      ...previousOpenGraph,
      title,
      description,
      locale: "en_US",
      url: baseUrl,
      siteName: settings?.siteTitle ?? "Maricopa Senior Living",
      type: "website",
    },
    alternates: {
      canonical: "/",
    },
  };
}

export default async function Home() {
  const { isEnabled: isDraftMode } = await draftMode();

  if (isDraftMode) {
    return (
      <Suspense fallback={<HomeFallback />}>
        <DynamicHome />
      </Suspense>
    );
  }

  return <CachedHome perspective="published" stega={false} />;
}

async function DynamicHome() {
  const { perspective, stega } = await getDynamicFetchOptions();
  return <CachedHome perspective={perspective} stega={stega} />;
}

async function CachedHome({ perspective, stega }: DynamicFetchOptions) {
  "use cache";
  const { data: homePageData } = await sanityFetch({
    query: queryHomePageData,
    perspective,
    stega,
  });

  return (
    <>
      <figure>
        <SanityImage
          image={homePageData?.image}
          width={1024}
          height={686}
          loading="eager"
        />
        <figcaption className="mt-4 text-left text-sm text-zinc-500 italic">
          {homePageData?.image?.caption}
        </figcaption>
      </figure>
      <div className="prose prose-indigo mx-auto pt-8 lg:pt-4">
        <CustomPortableText value={homePageData?.content ?? []} />
      </div>
    </>
  );
}

function HomeFallback() {
  return (
    <div className="flex flex-col gap-8" aria-busy>
      <div className="aspect-[3/2] animate-pulse rounded-md bg-zinc-200" />
      <div className="flex flex-col gap-4">
        <div className="h-4 animate-pulse rounded bg-zinc-200" />
        <div className="h-4 animate-pulse rounded bg-zinc-200" />
        <div className="h-4 w-2/3 animate-pulse rounded bg-zinc-200" />
      </div>
    </div>
  );
}
