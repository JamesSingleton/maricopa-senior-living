import type { SanityImageData } from "@maricopa-senior-living/sanity/image";
import type { PortableTextBlock } from "sanity";

type Taxonomy = {
  _id: string;
  title: string;
  slug: string;
  description?: string;
};

export type Post = {
  _id: string;
  _updatedAt: string;
  title: string;
  excerpt?: string | null;
  slug: string;
  author?: {
    name?: string | null;
    image?: SanityImageData | null;
    slug?: string | null;
  } | null;
  mainImage?: SanityImageData | null;
  categories?: Array<Taxonomy | null> | null;
  tags?: Array<Taxonomy | null> | null;
  publishedAt?: string | null;
  body?: PortableTextBlock[] | null;
};
