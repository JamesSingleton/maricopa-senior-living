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

const blockContentFragment = /* groq */ `
  ...,
  _type == "block" => {
    ...
  },
  _type == "image" => {
    ${imageFields},
    "caption": caption
  },
  _type == "attachment" => {
    ...,
    asset->
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
  *[_type == "post" && defined(mainImage)][0].mainImage{
    ${imageFields}
  }
`);

const pageBuilderFragment = /* groq */ `
  pageBuilder[]{
    ...,
    _type,

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

const authorFields = /* groq */ `
  name,
  ${imageFragment},
  "slug": slug.current,
`;

const bodyExcerptFragment = /* groq */ `
  "excerpt": array::join(string::split((pt::text(body)), "")[0..160], "") + "..."
`;

const rightSidebarAuthorFields = /* groq */ `
  name,
  ${imageFragment}
`;

const rightSidebarPostListFields = /* groq */ `
  _id,
  title,
  "slug": slug.current,
  publishedAt,
  ${bodyExcerptFragment}
`;

/** Category slugs for the right sidebar — verify in Sanity Studio if a section is empty. */
const RIGHT_SIDEBAR_WHATS_NEW_CATEGORY_SLUG = "whats-new";
const RIGHT_SIDEBAR_SENIOR_CENTER_CATEGORY_SLUG =
  "city-of-maricopa-community-senior-center";
const RIGHT_SIDEBAR_NEWSLETTER_CATEGORY_SLUG =
  "keeping-you-informed-still-newsletter";
const RIGHT_SIDEBAR_NONPROFIT_CATEGORY_SLUG =
  "maricopa-senior-living-an-arizona-501-c3-nonprofit";

const postFields = /* groq */ `
  _id,
  _updatedAt,
  _type,
  title,
  ${bodyExcerptFragment},
  "slug": slug.current,
  "author": author->{
    ${authorFields}
  },
  mainImage {
    ${imageFields}
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
  } {
    ...,
    "rank": select(
      count(tags[title == "Local Resources"]) > 0 => 1,
      2
    )
  },
  publishedAt,
  "body": body[]{
    ${blockContentFragment}
  },
`;

/** Highlighted taxonomies only — no live counts (those tag every referencing post). */
export const highlightedCategories = defineQuery(`
  *[_type == "category" && highlight == true]{
    _id,
    title,
    "slug": slug.current
  } | order(title asc)
`);

export const highlightedTags = defineQuery(`
  *[_type == "tag" && highlight == true]{
    _id,
    title,
    "slug": slug.current
  } | order(title asc)
`);

export const queryArticleSlugPageData = defineQuery(`
  *[_type == "post" && slug.current == $slug][0]{
    ${postFields}
  }
`);

export const queryArticlePaths = defineQuery(`
  *[_type == "post" && defined(slug.current)].slug.current
`);

/** Per-widget sidebar queries so each cache entry only carries its own sync tags. */
export const rightSidebarNonProfitQuery = defineQuery(/* groq */ `
  *[_type == "category" && slug.current == "${RIGHT_SIDEBAR_NONPROFIT_CATEGORY_SLUG}"][0]{
    title,
    "description": description[]{
      ${blockContentFragment}
    },
    "slug": slug.current
  }
`);

export const rightSidebarWhatsNewQuery = defineQuery(/* groq */ `
  *[
    _type == "post"
    && isArchived != true
    && references(*[_type == "category" && slug.current == "${RIGHT_SIDEBAR_WHATS_NEW_CATEGORY_SLUG}"][0]._id)
  ] | order(publishedAt desc)[0]{
    ${rightSidebarPostListFields},
    "author": author->{
      ${rightSidebarAuthorFields}
    }
  }
`);

export const rightSidebarSeniorCenterQuery = defineQuery(/* groq */ `
  *[
    _type == "post"
    && isArchived != true
    && references(*[_type == "category" && slug.current == "${RIGHT_SIDEBAR_SENIOR_CENTER_CATEGORY_SLUG}"][0]._id)
  ] | order(publishedAt desc)[0...2]{
    ${rightSidebarPostListFields}
  }
`);

export const rightSidebarNewsletterQuery = defineQuery(/* groq */ `
  *[
    _type == "post"
    && isArchived != true
    && references(*[_type == "category" && slug.current == "${RIGHT_SIDEBAR_NEWSLETTER_CATEGORY_SLUG}"][0]._id)
  ] | order(publishedAt desc)[0]{
    ${rightSidebarPostListFields}
  }
`);

export const queryHomePageData = defineQuery(`
  *[_type == "home"][0]{
    _id,
    _type,
    image {
      ${imageFields},
      "caption": caption
    },
    "content": content[]{
      ...,
      _type == "image" => {
        ${imageFields},
        "caption": caption
      },
      _type == "attachment" => {
        ...,
        asset->
      }
    }
  }
`);

export const queryAllPosts = defineQuery(`
  *[_type == "post" && isArchived != true] | order(publishedAt desc){
    ${postFields}
  }
`);

export const queryAllPostSlugs = defineQuery(`
  *[_type == "post" && defined(slug.current) && isArchived != true][].slug.current
`);

export const queryRecentArticleSlugs = defineQuery(`
  *[_type == "post" && defined(slug.current) && isArchived != true] | order(_updatedAt desc) [0...100]{"slug": slug.current}
`);

export const queryAllPageSlugs = defineQuery(`
  *[_type == "page" && defined(slug.current)]{"slug": slug.current}
`);

export const queryPostBySlug = defineQuery(`
  *[_type == "post" && slug.current == $slug && isArchived != true]{
    ${postFields}
  }[0]
`);

export const queryAllCategories = defineQuery(`
  *[_type == "category"][].slug.current
`);

export const queryCategoryPaths = defineQuery(`
  *[_type == "category" && defined(slug.current)]{"category": slug.current}
`);

export const queryCategoryBySlug = defineQuery(`
  *[_type == "category" && slug.current == $slug]{
    title,
    "slug": slug.current,
    "description": description[]{
      ${blockContentFragment}
    },
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
  }[0]
`);

export const queryAllTags = defineQuery(`
  *[_type == "tag" && defined(slug.current)][].slug.current
`);

export const queryTagPaths = defineQuery(`
  *[_type == "tag" && defined(slug.current)]{"tag": slug.current}
`);

export const queryTagBySlug = defineQuery(`
  *[_type == "tag" && slug.current == $slug]{
    title,
    "slug": slug.current,
    "description": description[]{
      ${blockContentFragment}
    },
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
  }[0]
`);

export const querySearch = defineQuery(`
  *[(_type == "post" && isArchived != true && (title match "*" + $searchTerm + "*" || tags[]->title match "*" + $searchTerm + "*" || categories[]->title match "*" + $searchTerm + "*")) ||
  (_type == "service" && (title match "*" + $searchTerm + "*" || tags[]->title match "*" + $searchTerm + "*" || categories[]->title match "*" + $searchTerm + "*"))] | score(
    boost(title match "*" + $searchTerm + "*", 4)
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
`);

export const queryNavigation = defineQuery(`
  *[_type == "navigation"][0]{
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
      children[]{
        _key,
        link{
          url,
          text,
          reference->{
            _id,
            _type,
            title,
            "slug": slug.current
          }
        }
      }
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
  }
`);

export const queryPageBySlug = defineQuery(`
  *[_type == "page" && slug.current == $slug][0]{
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
  }
`);
