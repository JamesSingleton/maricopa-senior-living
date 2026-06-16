import { defineQuery } from "next-sanity";

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
// Base fragments for reusable query parts
const imageFragment = /* groq */ `
  image {
    ${imageFields}
  }
`;

const customLinkFragment = /* groq */ `
  ...customLink{
    openInNewTab,
    "href": select(
      type == "internal" => internal->slug.current,
      type == "external" => external,
      "#"
    ),
  }
`;

const buttonsFragment = /* groq */ `
  buttons[]{
    text,
    variant,
    _key,
    _type,
    "openInNewTab": url.openInNewTab,
    "href": select(
      url.type == "internal" => url.internal->slug.current,
      url.type == "external" => url.external,
      url.href
    ),
  }
`;

const markDefsFragment = /* groq */ `
  markDefs[]{
    ...,
    ${customLinkFragment}
  }
`;

const richTextFragment = /* groq */ `
  richText[]{
    ...,
    _type == "block" => {
      ...,
      ${markDefsFragment}
    },
    _type == "image" => {
      ${imageFields},
      "caption": caption
    }
  }
`;

const blogAuthorFragment = /* groq */ `
  authors[0]->{
    _id,
    name,
    position,
    ${imageFragment}
  }
`;

const blogCardFragment = /* groq */ `
  _type,
  _id,
  title,
  description,
  "slug":slug.current,
  orderRank,
  ${imageFragment},
  publishedAt,
  ${blogAuthorFragment}
`;

/**
 * Query to extract a single image from a page document
 * This is used as a type reference only and not for actual data fetching
 * Helps with TypeScript inference for image objects
 */
export const queryImageType = defineQuery(`
  *[_type == "blog" && defined(image)][0]{
    ${imageFragment}
  }.image
`);

const pageBuilderFragment = /* groq */ `
  pageBuilder[]{
    ...,
    _type,
    _type == "featuredResources" => {
      ...,
      resources[]->{
        _id,
        title,
        "slug": slug.current,
        resourceType,
        description
      }
    },
    _type == "featuredEvents" => {
      ...,
      events[]->{
        _id,
        title,
        "slug": slug.current,
        summary,
        startDateTime,
        image {
          ${imageFields}
        }
      }
    },
    _type == "featuredBlogPosts" => {
      ...,
      posts[]->{
        ${blogCardFragment}
      }
    },
    _type == "featuredArticles" => {
      ...,
      articles[]->{
        _id,
        title,
        "slug": slug.current,
        excerpt,
        publishedAt,
        sourceName,
        mainImage {
          ${imageFields}
        }
      }
    },
    _type == "hero" => {
      ...,
      image {
        ${imageFields}
      },
      ${buttonsFragment}
    },
    _type == "splitImage" => {
      ...,
      image {
        ${imageFields}
      },
      ${richTextFragment}
    },
    _type == "richTextBlock" => {
      ...,
      ${richTextFragment}
    },
    _type == "callToAction" => {
      ...,
      ${buttonsFragment}
    }
  }
`;

export const querySlugPageData = defineQuery(`
  *[_type == "page" && slug.current == $slug][0]{
    ...,
    "slug": slug.current,
    ${pageBuilderFragment}
  }
  `);

export const queryNavbarData = defineQuery(`
  *[_type == "navbar" && _id == "navbar"][0]{
    _id,
    columns[]{
      _key,
      _type == "navbarColumn" => {
        "type": "column",
        title,
        links[]{
          _key,
          name,
          icon,
          description,
          "openInNewTab": url.openInNewTab,
          "href": select(
            url.type == "internal" => url.internal->slug.current,
            url.type == "external" => url.external,
            url.href
          )
        }
      },
      _type == "navbarLink" => {
        "type": "link",
        name,
        description,
        "openInNewTab": url.openInNewTab,
        "href": select(
          url.type == "internal" => url.internal->slug.current,
          url.type == "external" => url.external,
          url.href
        )
      }
    },
    ${buttonsFragment},
  }
`);

export const queryGlobalSeoSettings = defineQuery(`
  *[_type == "settings"][0]{
    _id,
    _type,
    siteTitle,
    logo {
      ${imageFields}
    },
    siteDescription,
    socialLinks{
      linkedin,
      facebook,
      twitter,
      instagram,
      youtube
    }
  }
`);

export const queryBlogIndexPageData = defineQuery(`
  *[_type == "blogIndex"][0]{
    ...,
    _id,
    _type,
    title,
    description,
    "displayFeaturedBlogs" : displayFeaturedBlogs == "yes",
    "featuredBlogsCount" : featuredBlogsCount,
    ${pageBuilderFragment},
    "slug": slug.current
  }
`);

export const queryBlogIndexPageBlogs = defineQuery(`
  *[_type == "blog" && (seoHideFromLists != true)] | order(orderRank asc) [$start...$end]{
    ${blogCardFragment}
  }
`);

export const queryAllBlogDataForSearch = defineQuery(`
  *[_type == "blog" && defined(slug.current) && (seoHideFromLists != true)]{
    ${blogCardFragment}
  }
`);

export const queryBlogIndexPageBlogsCount = defineQuery(`
  count(*[_type == "blog" && (seoHideFromLists != true)])
`);
export const queryBlogSlugPageData = defineQuery(`
  *[_type == "blog" && slug.current == $slug][0]{
    ...,
    "slug": slug.current,
    ${blogAuthorFragment},
    ${imageFragment},
    ${richTextFragment},
    ${pageBuilderFragment}
  }
`);

export const queryBlogPaths = defineQuery(`
  *[_type == "blog" && defined(slug.current)].slug.current
`);

export const queryHomePageData = defineQuery(`
  *[_type == "home" && _id == "home"][0]{
    _id,
    title,
    ${pageBuilderFragment}
  }
`);

export const queryArticleSlugPageData = defineQuery(`
  *[_type == "article" && slug.current == $slug][0]{
    ...,
    "slug": slug.current,
    author->{
      _id,
      name,
      slug,
      image
    },
    mainImage {
      ${imageFields}
    },
    categories[]->{
      _id,
      title,
      "slug": slug.current
    },
    tags[]->{
      _id,
      title,
      "slug": slug.current
    }
  }
`);

export const queryArticlePaths = defineQuery(`
  *[_type == "article" && defined(slug.current) && isArchived != true].slug.current
`);

export const queryEventSlugPageData = defineQuery(`
  *[_type == "event" && slug.current == $slug][0]{
    ...,
    "slug": slug.current,
    image {
      ${imageFields}
    },
    categories[]->{
      _id,
      title,
      "slug": slug.current
    },
    tags[]->{
      _id,
      title,
      "slug": slug.current
    },
    relatedResources[]->{
      _id,
      title,
      "slug": slug.current,
      resourceType,
      website,
      phone,
      address
    },
    recapBlog->{
      _id,
      title,
      "slug": slug.current
    }
  }
`);

export const queryEventPaths = defineQuery(`
  *[_type == "event" && defined(slug.current) && isArchived != true].slug.current
`);

export const queryResourceSlugPageData = defineQuery(`
  *[_type == "resource" && slug.current == $slug][0]{
    ...,
    "slug": slug.current,
    categories[]->{
      _id,
      title,
      "slug": slug.current
    },
    tags[]->{
      _id,
      title,
      "slug": slug.current
    },
    attachments[]{
      ...,
      asset->
    }
  }
`);

export const queryResourcePaths = defineQuery(`
  *[_type == "resource" && defined(slug.current)].slug.current
`);
