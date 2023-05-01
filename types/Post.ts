import { PortableTextBlock } from 'sanity'

export type Post = {
  _id: string
  createdAt: string
  title: string
  excerpt: string
  slug: string
  author: {
    name: string
    image?: string
    slug: string
  }
  mainImage?: string
  categories: {
    title: string
    slug: string
    description?: string
  }[]
  tags: {
    title: string
    slug: string
    description?: string
  }[]
  publishedAt: string
  body: PortableTextBlock[]
}
