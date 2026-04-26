import { defineQuery } from "next-sanity";

const COUNT_FOR_SIDEBAR = /* groq */ `count(*[_type == "post" && references(^._id) && isArchived != true]) + count(*[_type == "service" && references(^._id)])`;

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
`;

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
`;

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
`;

export const highlightedCategories = defineQuery(`
  *[_type == "category" && ${COUNT_FOR_SIDEBAR} > 0 && highlight == true]{
    _id,
    title,
    "slug": slug.current,
    "count": ${COUNT_FOR_SIDEBAR}
  } | order(title asc, count desc)
`);

export const highlightedTags = defineQuery(`
  *[_type == "tag" && ${COUNT_FOR_SIDEBAR} > 0 && highlight == true]{
    _id,
    title,
    "slug": slug.current,
    "count": ${COUNT_FOR_SIDEBAR}
  } | order(title asc, count desc)
`);

export const queryArticleSlugPageData = defineQuery(`
  *[_type == "post" && slug.current == $slug][0]{
    ${postFields}
  }
`);

export const queryArticlePaths = defineQuery(`
  *[_type == "post" && defined(slug.current)].slug.current
`);
