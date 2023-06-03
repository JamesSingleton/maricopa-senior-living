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

export const allPosts = groq`*[_type == "post" && isArchived != true] | order(publishedAt desc){
  ${postFields}
}`

export const postBySlug = groq`*[_type == "post" && slug.current == $slug && isArchived != true]{
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
  "posts": *[_type == "post" && references(^._id) && isArchived != true]{
    ${postFields}
  },
  "services": *[_type == "service" && references(^._id)]{
    ...,
    tags[]->{
      _id,
      title,
      "slug": slug.current,
    }
  },
}[0]`

const COUNT_FOR_SIDEBAR = `count(*[_type == "post" && references(^._id) && isArchived != true]) + count(*[_type == "service" && references(^._id)])`

export const popularCategories = groq`*[_type == "category" && ${COUNT_FOR_SIDEBAR} > 0 && highlight == true]{
  _id,
  title,
  "slug": slug.current,
  "count": ${COUNT_FOR_SIDEBAR}
} | order(title asc, count desc)`

export const allTags = groq`*[_type == "tag"]{
  title,
  "slug": slug.current,
}`

export const tagBySlug = groq`*[_type == "tag" && slug.current == $slug]{
  title,
  "slug": slug.current,
  description,
  "excerpt": array::join(string::split((pt::text(description)), "")[0..160], "") + "...",
  "posts": *[_type == "post" && references(^._id) && isArchived != true]{
    ${postFields}
  },
  "services": *[_type == "service" && references(^._id)]{
    ...,
    tags[]->{
      _id,
      title,
      "slug": slug.current,
    }
  },
}[0]`

export const popularTags = groq`*[_type == "tag" && ${COUNT_FOR_SIDEBAR} > 0 && highlight == true]{
  _id,
  title,
  "slug": slug.current,
  "count": ${COUNT_FOR_SIDEBAR}
} | order(title asc, count desc)`

export const search = groq`
*[(_type == "post" && isArchived != true && (title match "*" + $query + "*" || tags[]->title match "*" + $query + "*" || categories[]->title match "*" + $query + "*")) ||
(_type == "service" && (title match "*" + $query + "*" || tags[]->title match "*" + $query + "*" || categories[]->title match "*" + $query + "*"))] | score(
  boost(title match "*" + $query + "*", 4)
)| order(_score desc){
  ...,
  _score,
  _type == "post" => {
    ${postFields}
  },
  _type == "service" => {
    ...,
    tags[]->{
      _id,
      title,
      "slug": slug.current,
    }
  },
}
`

export const joansCorner = groq`*[_type == "post" && isArchived != true && references(*[_type == "category" && title == "Joan's Corner"]._id)][0]{
  _id,
  title,
  "slug": slug.current,
  "author": author->{
    ${authorFields}
  },
  publishedAt,
  "excerpt": array::join(string::split((pt::text(body)), "")[0..160], "") + "...",
}`

export const ronsRamblings = groq`*[_type == "post" && isArchived != true && references(*[_type == "category" && title == "Ron's Ramblings"]._id)][0]{
  _id,
  title,
  "slug": slug.current,
  "author": author->{
    ${authorFields}
  },
  publishedAt,
  "excerpt": array::join(string::split((pt::text(body)), "")[0..160], "") + "...",
}`

export const seniorCenterNewsletters = groq`
  *[(_type == "post" && isArchived != true && references(*[_type == "category" && title == "City of Maricopa Community / Senior Center"]._id))][0..1] | order(publishedAt desc){
    _id,
    title,
    "slug": slug.current,
    publishedAt,
    "excerpt": array::join(string::split((pt::text(body)), "")[0..160], "") + "...",
  }
`

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
  },
  "footer": footer[]{
    _key,
    url,
    text,
    reference->{
      _id,
      _type,
      title,
      "slug": slug.current
    }
  },
}`

export const pageBySlug = groq`*[_type == "page" && slug.current == $slug][0]{
  title,
  "slug": slug.current,
  "excerpt": array::join(string::split((pt::text(description)), "")[0..160], "") + "...",
  body,
}`
