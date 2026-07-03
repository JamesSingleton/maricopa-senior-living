import { defineQuery } from "next-sanity";

const imageFields = /* groq */ `
  "id": asset._ref,
  "preview": asset->metadata.lqip,
  "alt": coalesce(alt, asset->altText, "untitled"),
  hotspot { x, y },
  crop { bottom, left, right, top }
`;

const imageFragment = /* groq */ `
  image { ${imageFields} }
`;

const seoProjection = /* groq */ `
  "seo": {
    "title": coalesce(seo.title, title, ""),
    "description": coalesce(seo.description, excerpt, description, ""),
    "image": coalesce(seo.image, mainImage, image),
    "noIndex": coalesce(seo.noIndex, false)
  }
`;

const linkProjection = /* groq */ `
  label,
  linkType,
  openInNewTab,
  "href": select(
    linkType == "internal" => select(
      internalReference->_type == "page" => "/" + internalReference->slug.current,
      internalReference->_type == "article" => "/articles/" + internalReference->slug.current,
      internalReference->_type == "guide" => "/guides/" + internalReference->slug.current,
      internalReference->_type == "resource" => "/resources/" + internalReference->slug.current,
      internalReference->_type == "category" => "/category/" + internalReference->slug.current,
      internalReference->_type == "tag" => "/tags/" + internalReference->slug.current,
      "/"
    ),
    linkType == "external" => coalesce(externalUrl, "#"),
    "#"
  )
`;

const blockContentProjection = /* groq */ `
  body[]{
    ...,
    _type == "block" => {
      ...,
      markDefs[]{
        ...,
        _type == "link" => { ..., "href": href }
      }
    },
    _type == "image" => { ${imageFields}, caption },
    _type == "attachment" => { ..., "url": asset->url }
  }
`;

const resourceCardFragment = /* groq */ `
  _type,
  _id,
  title,
  "slug": slug.current,
  description,
  ${imageFragment},
  contact { phone, email, website, streetAddress, city, state, zip },
  lastVerified,
  featured,
  "category": category->{ _id, title, "slug": slug.current }
`;

const articleCardFragment = /* groq */ `
  _type,
  _id,
  title,
  "slug": slug.current,
  excerpt,
  publishedAt,
  contentSource,
  featured,
  mainImage { ${imageFields} },
  "author": author->{ _id, name, image { ${imageFields} } }
`;

const guideCardFragment = /* groq */ `
  _type,
  _id,
  title,
  "slug": slug.current,
  excerpt,
  lastUpdated,
  featured,
  mainImage { ${imageFields} },
  "author": author->{ _id, name, image { ${imageFields} } }
`;

const pageBuilderProjection = /* groq */ `
  pageBuilder[]{
    _key,
    _type,
    _type == "heroBlock" => {
      heading,
      subheading,
      image { ${imageFields} },
      cta { ${linkProjection} }
    },
    _type == "richTextSection" => {
      heading,
      body[]{ ..., markDefs[]{ ..., _type == "link" => { ..., "href": href } } }
    },
    _type == "featuredResources" => {
      heading,
      resources[]->{ ${resourceCardFragment} }
    },
    _type == "featuredCategories" => {
      heading,
      categories[]->{ _id, title, "slug": slug.current, description, image { ${imageFields} } }
    },
    _type == "featuredArticles" => {
      heading,
      articles[]->{ ${articleCardFragment} }
    },
    _type == "featuredGuides" => {
      heading,
      guides[]->{ ${guideCardFragment} }
    },
    _type == "resourceGrid" => {
      heading,
      limit,
      "category": category->{ _id, title, "slug": slug.current },
      "resources": *[_type == "resource" && (!defined(^.category._ref) || category._ref == ^.category._ref)] | order(title asc) {
        ${resourceCardFragment}
      }
    },
    _type == "callToAction" => {
      heading,
      body,
      link { ${linkProjection} }
    },
    _type == "faqBlock" => {
      heading,
      items[]{ question, answer }
    },
    _type == "splitImage" => {
      heading,
      body[]{ ..., markDefs[]{ ..., _type == "link" => { ..., "href": href } } },
      image { ${imageFields} },
      imagePosition
    },
    _type == "communityAlert" => {
      message,
      severity,
      expiresAt,
      link { ${linkProjection} }
    }
  }
`;

// ─── Site ───────────────────────────────────────────────────────────────────

export const querySiteSettings = defineQuery(`
  *[_type == "siteSettings" && _id == "siteSettings"][0]{
    title,
    description,
    logo { ${imageFields} },
    favicon { ${imageFields} },
    ogImage { ${imageFields} },
    contactEmail,
    contactPhone,
    ${seoProjection}
  }
`);

export const queryHomePage = defineQuery(`
  *[_type == "homePage" && _id == "homePage"][0]{
    title,
    ${pageBuilderProjection},
    ${seoProjection}
  }
`);

export const queryMainNavigation = defineQuery(`
  *[_type == "mainNavigation" && _id == "mainNavigation"][0]{
    items[]{
      _key,
      link { ${linkProjection} },
      children[]{ ${linkProjection} }
    }
  }
`);

export const querySiteFooter = defineQuery(`
  *[_type == "siteFooter" && _id == "siteFooter"][0]{
    tagline,
    copyright,
    columns[]{
      _key,
      heading,
      links[]{ ${linkProjection} }
    }
  }
`);

// ─── Resources ────────────────────────────────────────────────────────────────

export const queryResourceBySlug = defineQuery(`
  *[_type == "resource" && slug.current == $slug][0]{
    _id,
    _updatedAt,
    title,
    "slug": slug.current,
    description,
    ${blockContentProjection},
    image { ${imageFields} },
    contact { phone, email, website, streetAddress, city, state, zip },
    hours[]{ day, opensAt, closesAt },
    lastVerified,
    featured,
    "category": category->{ _id, title, "slug": slug.current },
    "tags": tags[]->{ _id, title, "slug": slug.current },
    ${seoProjection}
  }
`);

export const queryResourcesIndex = defineQuery(`
  *[_type == "resource"
    && (coalesce($category, "") == "" || category->slug.current == $category)
    && (coalesce($tag, "") == "" || $tag in tags[]->slug.current)
  ] | order(title asc) [$start...$end]{
    ${resourceCardFragment}
  }
`);

export const queryResourcesCount = defineQuery(`
  count(*[_type == "resource"
    && (coalesce($category, "") == "" || category->slug.current == $category)
    && (coalesce($tag, "") == "" || $tag in tags[]->slug.current)
  ])
`);

export const queryResourceSlugs = defineQuery(`
  *[_type == "resource" && defined(slug.current)]{ "slug": slug.current }
`);

// ─── Articles ───────────────────────────────────────────────────────────────

export const queryArticleBySlug = defineQuery(`
  *[_type == "article" && slug.current == $slug][0]{
    _id,
    _updatedAt,
    title,
    "slug": slug.current,
    excerpt,
    ${blockContentProjection},
    mainImage { ${imageFields} },
    publishedAt,
    contentSource,
    syndication {
      originalPublication,
      originalUrl,
      originalAuthor,
      republishedAt,
      attribution,
    },
    "author": author->{ _id, name, image { ${imageFields} } },
    "category": category->{ _id, title, "slug": slug.current },
    "tags": tags[]->{ _id, title, "slug": slug.current },
    ${seoProjection}
  }
`);

export const queryArticlesIndex = defineQuery(`
  *[_type == "article"] | order(publishedAt desc) [$start...$end]{
    ${articleCardFragment}
  }
`);

export const queryArticlesCount = defineQuery(`
  count(*[_type == "article"])
`);

export const queryArticleSlugs = defineQuery(`
  *[_type == "article" && defined(slug.current)]{ "slug": slug.current }
`);

// ─── Guides ─────────────────────────────────────────────────────────────────

export const queryGuideBySlug = defineQuery(`
  *[_type == "guide" && slug.current == $slug][0]{
    _id,
    _updatedAt,
    title,
    "slug": slug.current,
    excerpt,
    ${blockContentProjection},
    steps[]{ title, body },
    mainImage { ${imageFields} },
    lastUpdated,
    "author": author->{ _id, name, image { ${imageFields} } },
    "category": category->{ _id, title, "slug": slug.current },
    "tags": tags[]->{ _id, title, "slug": slug.current },
    ${seoProjection}
  }
`);

export const queryGuidesIndex = defineQuery(`
  *[_type == "guide"] | order(lastUpdated desc) [$start...$end]{
    ${guideCardFragment}
  }
`);

export const queryGuidesCount = defineQuery(`
  count(*[_type == "guide"])
`);

export const queryGuideSlugs = defineQuery(`
  *[_type == "guide" && defined(slug.current)]{ "slug": slug.current }
`);

// ─── Pages ──────────────────────────────────────────────────────────────────

export const queryPageBySlug = defineQuery(`
  *[_type == "page" && slug.current == $slug][0]{
    _id,
    title,
    "slug": slug.current,
    ${pageBuilderProjection},
    ${seoProjection}
  }
`);

export const queryPageSlugs = defineQuery(`
  *[_type == "page" && defined(slug.current)]{ "slug": slug.current }
`);

// ─── Taxonomy ───────────────────────────────────────────────────────────────

export const queryCategoryBySlug = defineQuery(`
  *[_type == "category" && slug.current == $slug][0]{
    _id,
    title,
    "slug": slug.current,
    description,
    "descriptionText": pt::text(description),
    isFeatured,
    image { ${imageFields} },
    "parent": parent->{ _id, title, "slug": slug.current },
    "seo": {
      "title": coalesce(seo.title, title, ""),
      "description": coalesce(seo.description, pt::text(description), ""),
      "image": coalesce(seo.image, image),
      "noIndex": coalesce(seo.noIndex, false)
    }
  }
`);

export const queryCategoryContent = defineQuery(`
  {
    "resources": *[_type == "resource" && category->slug.current == $slug] | order(title asc){
      ${resourceCardFragment}
    },
    "articles": *[_type == "article" && category->slug.current == $slug] | order(publishedAt desc){
      ${articleCardFragment}
    },
    "guides": *[_type == "guide" && category->slug.current == $slug] | order(lastUpdated desc){
      ${guideCardFragment}
    }
  }
`);

export const queryCategorySlugs = defineQuery(`
  *[_type == "category" && defined(slug.current)]{ "slug": slug.current }
`);

export const queryTagBySlug = defineQuery(`
  *[_type == "tag" && slug.current == $slug][0]{
    _id,
    title,
    "slug": slug.current,
    description,
    "descriptionText": pt::text(description),
    synonyms,
    "seo": {
      "title": coalesce(seo.title, title, ""),
      "description": coalesce(seo.description, pt::text(description), ""),
      "image": coalesce(seo.image, image),
      "noIndex": coalesce(seo.noIndex, false)
    }
  }
`);

export const queryTagRefCount = defineQuery(`
  count(
    *[_type in ["resource", "article", "guide"] && references(*[_type == "tag" && slug.current == $slug]._id)]
  )
`);

export const queryTagContent = defineQuery(`
  {
    "resources": *[_type == "resource" && $slug in tags[]->slug.current] | order(title asc){
      ${resourceCardFragment}
    },
    "articles": *[_type == "article" && $slug in tags[]->slug.current] | order(publishedAt desc){
      ${articleCardFragment}
    },
    "guides": *[_type == "guide" && $slug in tags[]->slug.current] | order(lastUpdated desc){
      ${guideCardFragment}
    }
  }
`);

export const queryTagSlugs = defineQuery(`
  *[_type == "tag" && defined(slug.current)]{
    "slug": slug.current,
    "refCount": count(*[_type in ["resource", "article", "guide"] && references(^._id)])
  }[refCount >= 3]
`);

export const queryFeaturedCategories = defineQuery(`
  *[_type == "category" && isFeatured == true] | order(title asc){
    _id,
    title,
    "slug": slug.current,
    description,
    image { ${imageFields} },
    "count": count(*[_type == "resource" && references(^._id)])
  }
`);

export const querySidebarTags = defineQuery(`
  *[_type == "tag"] | order(title asc) {
    _id,
    title,
    "slug": slug.current,
    "refCount": count(*[_type in ["resource", "article", "guide"] && references(^._id)])
  }[refCount >= 3][0...24]
`);

export const queryLatestArticle = defineQuery(`
  *[_type == "article"] | order(publishedAt desc)[0]{
    ${articleCardFragment}
  }
`);

export const queryAllCategories = defineQuery(`
  *[_type == "category"] | order(title asc){
    _id,
    title,
    "slug": slug.current
  }
`);

export const queryAllTags = defineQuery(`
  *[_type == "tag"] | order(title asc){
    _id,
    title,
    "slug": slug.current
  }
`);

// ─── Search ─────────────────────────────────────────────────────────────────

export const querySearch = defineQuery(`
  [
    ...*[_type == "resource" && (
      title match $term + "*" ||
      description match $term + "*"
    )] | order(title asc) [0...10] { ${resourceCardFragment} },
    ...*[_type == "article" && (
      title match $term + "*" ||
      excerpt match $term + "*"
    )] | order(publishedAt desc) [0...10] { ${articleCardFragment} },
    ...*[_type == "guide" && (
      title match $term + "*" ||
      excerpt match $term + "*"
    )] | order(lastUpdated desc) [0...10] { ${guideCardFragment} }
  ]
`);

// ─── Sitemap ────────────────────────────────────────────────────────────────

export const querySitemapEntries = defineQuery(`
  {
    "resources": *[_type == "resource" && defined(slug.current)]{
      "slug": slug.current, _updatedAt
    },
    "articles": *[_type == "article" && defined(slug.current)]{
      "slug": slug.current, _updatedAt
    },
    "guides": *[_type == "guide" && defined(slug.current)]{
      "slug": slug.current, _updatedAt
    },
    "pages": *[_type == "page" && defined(slug.current)]{
      "slug": slug.current, _updatedAt
    },
    "categories": *[_type == "category" && defined(slug.current)]{
      "slug": slug.current, _updatedAt
    },
    "tags": *[_type == "tag" && defined(slug.current)]{
      "slug": slug.current,
      _updatedAt,
      "refCount": count(*[_type in ["resource", "article", "guide"] && references(^._id)])
    }[refCount >= 3]
  }
`);

// Legacy aliases for gradual migration
export const queryHomePageData = queryHomePage;
export const queryNavigation = defineQuery(`
  {
    "headerPrimary": *[_type == "mainNavigation" && _id == "mainNavigation"][0].items[]{
      _key,
      link { ${linkProjection} },
      children[]{ ${linkProjection} }
    },
    "footer": *[_type == "siteFooter" && _id == "siteFooter"][0].columns[]{
      _key,
      heading,
      links[]{ ${linkProjection} }
    }
  }
`);
export const queryArticleSlugPageData = queryArticleBySlug;
export const queryRecentArticleSlugs = queryArticleSlugs;
export const querySlugPageData = queryPageBySlug;
export const queryCategoryPaths = queryCategorySlugs;
export const queryAllPageSlugs = queryPageSlugs;
