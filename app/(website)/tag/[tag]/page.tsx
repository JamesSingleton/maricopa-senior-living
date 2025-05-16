import type { Metadata, ResolvingMetadata } from 'next'
import Image from 'next/image'
import { notFound } from 'next/navigation'

import DirectoryCard from '@/components/DirectoryCard'
import ArticleCard from '@/components/ArticleCard'
import { getTags, getTagBySlug } from '@/lib/sanity.fetch'
import { CustomPortableText } from '@/components/CustomPortableText'
import { baseUrl } from '@/lib/constants'

// export async function generateStaticParams() {
//   const tags = await getTags()

//   return tags.map((tag) => ({
//     tag: tag.slug,
//   }))
// }

export async function generateMetadata(
  { params }: { params: Promise<{ tag: string }> },
  parent: ResolvingMetadata,
): Promise<Metadata> {
  const { tag: tagParam } = await params
  const tag = await getTagBySlug(tagParam)
  const previousOpenGraph = (await parent)?.openGraph

  if (!tag) return {}

  return {
    title: `${tag.title}`,
    description: `${tag.excerpt}`,
    openGraph: {
      ...previousOpenGraph,
      title: `${tag.title}`,
      description: `${tag.excerpt}`,
      url: `${baseUrl}/tag/${tag.slug}`,
    },
  }
}

export default async function TagsPage({ params }: { params: Promise<{ tag: string }> }) {
  const { tag: tagParam } = await params
  const tag = await getTagBySlug(tagParam)

  if (!tag) return notFound()

  return (
    <div>
      <h1 className="inline-block align-middle text-4xl font-semibold capitalize sm:text-5xl md:text-6xl">
        {tag.title}
      </h1>
      <CustomPortableText
        value={tag.description}
        paragraphClasses="prose prose-lg prose-indigo text-sm font-medium text-zinc-500 sm:text-base md:text-lg lg:max-w-none pt-4"
      />
      <section className="space-y-8 pt-4">
        {tag.services &&
          tag.services.length > 0 &&
          tag.services.map((service: any) => (
            <DirectoryCard key={service._id} directoryItem={service} />
          ))}
        {tag.posts &&
          tag.posts.length > 0 &&
          tag.posts.map((post: any) => <ArticleCard key={post._id} post={post} />)}
        {tag.services && tag.services.length === 0 && tag.posts && tag.posts.length === 0 && (
          <div className="flex flex-col items-center justify-center">
            <Image
              src="/images/empty-state.png"
              alt="No Posts"
              width={613}
              height={420}
              placeholder="blur"
              blurDataURL="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAYAAABzenr0AAAAAXNSR0IArs4c6QAAA6ZJREFUWEe1VwFuGzEMk2///+8uydmDSFGWfdduKLAUQYqsiyiKpJQ2xhj2t4f/RR82RreO18FX/xlm+oDWzKw1a63Z4c+Dz3YcX1ZoPwLQh/VBIF48O2he/78BiO57R3ECMIDAw7s3L27WvGswcCQT+IeHx78x4HR7Ye9cIygM5Oc+MnBgDD8HkDPvNgJAHz27XwRUAfj8G4tTBxDIjYPvGfAuUfSJfo7AH/4SE5gaQOE5Av/9iYWvAWzFvWvQXwVYDQTxFRF68dTCBLODeAYQImPnon7VgBxQOYUDQL1e5wj4njNCq2ocNwD4YPicxSm8+bsYcP7r/GW/BFE0IFBiBH8D0zQrADhTCKzM3YtfVQMhSrIf03fq/adSro4XRmhPPsO93av5R8lWpTgLx/Ny788k9No1ATOAQnjoOoTITFiL+3sg4epXhiE9ziIofrE4fycAx0uwMX11X4pA/bJfWHGCCOojvdr780EvSrU6dy98BYj5PgEU82X2q4gAZBo+da8RvN7vGwBR78UnEyHGGJX4l6Co8Ek7KQ8rSgfwqawaGjhfr0UDolydJ4gtimU/iK/ZLXS0BaclqQFuS7oQ//d8nWAUqzWiFtRj7hdGMEeh+U8DEkB0rgWkFIxVLBC5rmVBx/H7PJMBbLlQPQqX4hqLRFgZyC4lvtwBcwQ1J9h9iHEBgJjdCl8XnQAxcg0jhAY/5L7/vahccCzJmP6XBR3IIwOl8w8KcxRax0rBnwEIIYqB83whVNnYzACOYNeAr+Gwoe6Q5QKanSuEMoA2K4YKXYTFBQqgEGHqwIFEQtYg0gqGBm4CLIvoONYIzihu1pADxQV7BogJ2pNOSRZ4hH3jgpIDhQFYMc44JmHcdtqCsl3aT4GkpRRC1DGIHCjXD0Wo4gyouqaVAXi9PheDdVnDg/MP9e9xXBnQIYoUbKH64oJcSCUN5/lu1rrzGgCYA3sWEIgvJn/d7wGMwEdRL+ESRIslyyrObYhVuIyAAOoikhjzQsptyHsg7agVjHEcdvyqdyHZURbkDsldHCBuDJTusZ5xK8ZVHBtJQty3Ye1+2Q2xkKDD5ZuRg4gRLG74diXrC0lxQ45gzYX9MLkD8He6zSNEEby7YLOibDVvv1p4i+UaSDcG4sxzFpaLSJfRPoJylueyKafYPgJ9T6g74fEsH85CLbpdRvp2LPekosNqa+FtDPE3ukqfvxdoDBuIeq4td2Gc+uxsjeB0Q1nRPEx4lPwBA2anSbfNT08AAAAASUVORK5CYII="
            />
            <p className="font-cal text-2xl">No articles or services yet.</p>
          </div>
        )}
      </section>
    </div>
  )
}
