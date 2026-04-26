import { sanityFetch } from "@maricopa-senior-living/sanity/live";
import { queryHomePage } from "@maricopa-senior-living/sanity/query";
import type { Metadata, ResolvingMetadata } from "next";

import { CustomPortableText } from "@/components/CustomPortableText";
import { SanityImage } from "@/components/elements/sanity-image";
import { baseUrl } from "@/lib/constants";

type Props = {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
};

async function fetchHomePageData() {
  return await sanityFetch({
    query: queryHomePage,
  });
}

export async function generateMetadata(
  { params, searchParams }: Props,
  parent: ResolvingMetadata,
): Promise<Metadata> {
  const previousOpenGraph = (await parent)?.openGraph;
  return {
    title: "Maricopa Senior Living - Aging Well Your Way!",
    description: "Your go to source for senior living in Maricopa, AZ",
    openGraph: {
      ...previousOpenGraph,
      title: "Maricopa Senior Living - Aging Well Your Way!",
      description: "Your go to source for senior living in Maricopa, AZ",
      locale: "en_US",
      url: baseUrl,
      siteName: "Maricopa Senior Living",
      type: "website",
    },
    alternates: {
      canonical: "/",
    },
  };
}

export default async function Home() {
  const { data: homePageData } = await fetchHomePageData();

  if (!homePageData) {
    return <div>No home page data</div>;
  }

  return (
    <div className="rounded-md bg-white px-8 py-8 shadow-lg lg:px-4 lg:py-4">
      <SanityImage image={homePageData.image!} height={686} width={1024} />
      <div className="prose prose-indigo mx-auto pt-8 lg:pt-4">
        <CustomPortableText value={homePageData.content!} />
      </div>
    </div>
  );
}
