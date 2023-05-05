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
  _updatedAt,
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
    _id,
    title,
    "slug": slug.current,
  },
  "tags": tags[]->{
    _id,
    title,
    "slug": slug.current,
  },
  publishedAt,
  "body": body[]{
    ...,
    _type == "attachment" => {
      ...,
      asset->
    }
  },
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
  "posts": *[_type == "post" && references(^._id)]{
    ${postFields}
  },
  "services": *[_type == "service" && references(^._id)]{
    ...,
    attachments[]{
      ...,
      "documentSize": asset->size,
    }
  },
}[0]`

export const popularCategories = groq`*[_type == "category"]{
  _id,
  title,
  "slug": slug.current,
  "count": count(*[_type == "post" && references(^._id)]) + count(*[_type == "service" && references(^._id)])
} | order(count desc, title asc) [0..10]`

export const allTags = groq`*[_type == "tag"]{
  title,
  "slug": slug.current,
}`

export const tagBySlug = groq`*[_type == "tag" && slug.current == $slug]{
  title,
  "slug": slug.current,
  description,
  "excerpt": array::join(string::split((pt::text(description)), "")[0..160], "") + "...",
  "posts": *[_type == "post" && references(^._id)]{
    ${postFields}
  },
  "services": *[_type == "service" && references(^._id)]{
    ...,
  },
}[0]`

export const popularTags = groq`*[_type == "tag"]{
  _id,
  title,
  "slug": slug.current,
  "count": count(*[_type == "post" && references(^._id)]) + count(*[_type == "service" && references(^._id)])
} | order(count desc, title asc) [0..10]`

export const search = groq`*[
  (_type == "post" && (title match "*" + $query + "*" || pt::text(body) match "*" + $query + "*" || tags[]->title match "*" + $query + "*" || categories[]->title match "*" + $query + "*")) ||
  (_type == "service" && (title match "*" + $query + "*" || description match "*" + $query + "*" || tags[]->title match "*" + $query + "*" || categories[]->title match "*" + $query + "*"))
]{
  ...,
  _type == "post" => {
    ${postFields}
  },
}`

export const joansCorner = groq`*[_type == "post" && references(*[_type == "category" && title == "Joan's Corner"]._id)]{
  _id,
  title,
  "slug": slug.current,
  "author": author->{
    ${authorFields}
  },
  publishedAt,
  "excerpt": array::join(string::split((pt::text(body)), "")[0..160], "") + "...",
}`

export const menu = groq`*[_type == "menu"][0]{
  "headerPrimary": headerPrimary[]{
    _key,
    "link": link{
      url,
      text,
      reference->{
        _id,
        _type,
        title,
        "slug": slug.current
      }
    },
    children
  }
}`
