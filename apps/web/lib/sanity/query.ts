import { defineQuery } from 'next-sanity'

const COUNT_FOR_SIDEBAR = /* groq */ `count(*[_type == "post" && references(^._id) && isArchived != true]) + count(*[_type == "service" && references(^._id)])`

const imageFields = /* groq */ `
  "id": asset._ref,
  "preview": asset->metadata.lqip,
  "alt": coalesce(
    alt,
    asset->altText,
    caption,
    asset->originalFilename,
    "untitled"
  ),
  hotspot {
    x,
    y
  },
  crop {
    bottom,
    left,
    right,
    top
  }
`

export const highlightedCategories = defineQuery(`
  *[_type == "category" && ${COUNT_FOR_SIDEBAR} > 0 && highlight == true]{
    _id,
    title,
    "slug": slug.current,
    "count": ${COUNT_FOR_SIDEBAR}
  } | order(title asc, count desc)
`)

export const highlightedTags = defineQuery(`
  *[_type == "tag" && ${COUNT_FOR_SIDEBAR} > 0 && highlight == true]{
    _id,
    title,
    "slug": slug.current,
    "count": ${COUNT_FOR_SIDEBAR}
  } | order(title asc, count desc)
`)
