import type { Post } from './Post'
import type { PortableTextBlock } from 'sanity'

export type Service = {
  _id: string
  title: string
  description?: string
  audience?: string
  website?: string
  phone?: string
  address?: string
  categories: TitleAndSlug[]
  tags: TitleAndSlug[]
  notes?: string
  attachments?: any
}

export type TitleAndSlug = {
  _id: string
  title: string
  slug: string
}

export type GroupItem = TitleAndSlug & {
  description: PortableTextBlock[]
  excerpt: string
  posts?: Post[]
  services?: Service[]
}

export type PopularItems = TitleAndSlug & {
  count: number
}
