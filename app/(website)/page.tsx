import { baseUrl } from '@/lib/constants'
import ImageComponent from '@/components/ImageComponent'

import type { Metadata, ResolvingMetadata } from 'next'
import { getHomePage } from '@/lib/sanity.fetch'
import { CustomPortableText } from '@/components/CustomPortableText'

type Props = {
  params: { id: string }
  searchParams: { [key: string]: string | string[] | undefined }
}

export async function generateMetadata(
  { params, searchParams }: Props,
  parent: ResolvingMetadata,
): Promise<Metadata> {
  const previousOpenGraph = (await parent)?.openGraph
  return {
    title: 'Maricopa Senior Living - Aging Well Your Way!',
    description: 'Your go to source for senior living in Maricopa, AZ',
    openGraph: {
      ...previousOpenGraph,
      title: 'Maricopa Senior Living - Aging Well Your Way!',
      description: 'Your go to source for senior living in Maricopa, AZ',
      locale: 'en_US',
      url: baseUrl,
      siteName: 'Maricopa Senior Living',
      type: 'website',
    },
    alternates: {
      canonical: '/',
    },
  }
}

export default async function Home() {
  const homePageData = await getHomePage()
  return (
    <div className="rounded-md bg-white px-8 py-8 shadow-lg lg:px-4 lg:py-4">
      <figure>
        <ImageComponent
          image={homePageData?.image}
          alt={homePageData?.image?.alt}
          width={1024}
          height={686}
          loading="eager"
        />
        <figcaption className="mt-4 text-left text-sm italic text-zinc-500">
          {homePageData?.image?.caption}
        </figcaption>
      </figure>
      <div className="prose prose-indigo mx-auto pt-8 lg:pt-4">
        <CustomPortableText value={homePageData?.content} />
      </div>
    </div>
  )
}
