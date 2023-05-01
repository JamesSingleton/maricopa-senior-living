import { groq } from 'next-sanity'

const authorFields = `
  name,
  "image": {
    "asset": image.asset->{ 
      _id,
      _type,
      metadata,
      url
    }
  },
  "slug": slug.current,
`

const postFields = `
  _id,
  title,
  "excerpt": array::join(string::split((pt::text(body)), "")[0..160], "") + "...",
  "slug": slug.current,
  "author": author->{
    ${authorFields}
  },
  "mainImage": {
    "asset": image.asset->{ 
      _id,
      _type,
      metadata,
      url
    }
  },
  "categories": categories[]->{
    title,
    "slug": slug.current,
  },
  "tags": tags[]->{
    title,
    "slug": slug.current,
  },
  publishedAt,
  body,
`

export const allPosts = groq`*[_type == "post"]{
  ${postFields}
}`

export const postBySlug = groq`*[_type == "post" && slug.current == $slug]{
  ${postFields}
}[0]`

export const allCategories = groq`*[_type == "category"]{
  title,
  "slug": slug.current,
}`

export const categoryBySlug = groq`*[_type == "category" && slug.current == $slug]{
  title,
  "slug": slug.current,
  description,
  "excerpt": array::join(string::split((pt::text(description)), "")[0..160], "") + "...",
  "content": content[]{
    _type=="reference" => @-> {
      ...,
      _type == "post" => {
        ${postFields}
      },
    }
  },
}[0]`

export const popularCategories = groq`*[_type == "category"]{
  _id,
  title,
  "slug": slug.current,
}[0...10]`
