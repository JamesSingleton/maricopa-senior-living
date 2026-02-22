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
  _type,
  title,
  "excerpt": array::join(string::split((pt::text(body)), "")[0..160], "") + "...",
  "slug": slug.current,
  "author": author->{
    ${authorFields}
  },
  mainImage,
  "categories": categories[]->{
    _id,
    title,
    "slug": slug.current,
  },
  "tags": tags[]->{
    _id,
    title,
    "slug": slug.current,
  } {
    ...,
    "rank": select(
      count(tags[title == "Local Resources"]) > 0 => 1,
      2
    )
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

const newsletterFields = `
  _id,
  _updatedAt,
  _type,
  title,
  excerpt,
  "slug": slug.current,
  "author": author->{
    ${authorFields}
  },
  mainImage,
  publishedAt,
  featured,
  "content": content[]{
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

export const allPostSlugs = groq`
*[_type == "post" && defined(slug.current) && isArchived != true][].slug.current
`

export const postBySlug = groq`*[_type == "post" && slug.current == $slug && isArchived != true]{
  ${postFields}
}[0]`

export const allCategories = groq`*[_type == "category"][].slug.current`

export const categoryBySlug = groq`*[_type == "category" && slug.current == $slug]{
  title,
  "slug": slug.current,
  description,
  "excerpt": array::join(string::split((pt::text(description)), "")[0..160], "") + "...",
  "combinedList": [
    ...(*[_type == "service" && references(^._id)]{
      ...,
      tags[]->{
        _id,
        title,
        "slug": slug.current,
      }
    }),
    ...(*[_type == "post" && references(^._id) && isArchived != true]{
      _id,
      _updatedAt,
      _type,
      publishedAt,
      title,
      "excerpt": array::join(string::split((pt::text(body)), "")[0..160], "") + "...",
      "slug": slug.current,
      "author": author->{
        ${authorFields}
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
      }
    })
  ] {
    ...,
    "rank": select(
      count(tags[title == "Local Resources"]) > 0 => 1,
      2
    )
  } | order(rank),
}[0]`

const COUNT_FOR_SIDEBAR = `count(*[_type == "post" && references(^._id) && isArchived != true]) + count(*[_type == "service" && references(^._id)])`

export const allTags = groq`*[_type == "tag" && defined(slug.current)][].slug.current`

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

export const navigationQuery = groq`*[_type == "navigation"][0]{
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
  "body": body[]{
    ...,
    _type == "attachment" => {
      ...,
      asset->
    }
  },
}`

export const rightSidebarQuery = groq`{
  "whatsNew": *[_type == "post" && isArchived != true && references(*[_type == "category" && title == "What's New!"]._id)][0]{
    _id,
    title,
    "slug": slug.current,
    "author": author->{
      ${authorFields}
    },
    publishedAt,
    "excerpt": array::join(string::split((pt::text(body)), "")[0..160], "") + "...",
  },
  "seniorCenterNewsletters": *[(_type == "post" && isArchived != true && references(*[_type == "category" && title == "City of Maricopa Community / Senior Center"]._id))][0..1] | order(publishedAt desc){
    _id,
    title,
    "slug": slug.current,
    publishedAt,
    "excerpt": array::join(string::split((pt::text(body)), "")[0..160], "") + "...",
  },
  "nonProfit": *[_type == "category" && slug.current == "maricopa-senior-living-an-arizona-501-c3-nonprofit"][0]{
    ...,
    "slug": slug.current,
  }
}`

// Newsletter queries
export const allNewsletters = groq`*[_type == "newsletter" && isArchived != true] | order(publishedAt desc){
  ${newsletterFields}
}`

export const allNewsletterSlugs = groq`
*[_type == "newsletter" && defined(slug.current) && isArchived != true][].slug.current
`

export const newsletterBySlug = groq`*[_type == "newsletter" && slug.current == $slug && isArchived != true]{
  ${newsletterFields}
}[0]`

export const latestNewsletter = groq`*[_type == "newsletter" && isArchived != true] | order(publishedAt desc)[0]{
  ${newsletterFields}
}`

export const featuredNewsletter = groq`*[_type == "newsletter" && featured == true && isArchived != true] | order(publishedAt desc)[0]{
  ${newsletterFields}
}`
