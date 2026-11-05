import { defineQuery } from "next-sanity";

/*
 * Queries for the rebuilt site. Fragments are plain strings so TypeGen can
 * evaluate them (it can't run helper functions).
 */

const imageFields = /* groq */ `
  "id": asset._ref,
  "preview": asset->metadata.lqip,
  "alt": coalesce(alt, ""),
  caption,
  hotspot { x, y },
  crop { top, bottom, left, right }
`;

/** Used only for TypeScript inference of image objects (see image.ts). */
export const queryImageType = defineQuery(`
  *[_type == "article" && defined(mainImage)][0].mainImage{
    ${imageFields}
  }
`);

/** Enough of any linkable document to build its URL. */
/** "2026-11" from a publishMonth date, for /whats-new and /newsletter URLs. */
const monthKey = /* groq */ `string::split(publishMonth, "-")[0] + "-" + string::split(publishMonth, "-")[1]`;

const targetFields = /* groq */ `
  _type,
  "slug": slug.current,
  "month": ${monthKey},
  title
`;

const linkFields = /* groq */ `
  _key,
  label,
  kind,
  section,
  url,
  phone,
  email,
  "target": reference->{ ${targetFields} }
`;

const phoneFields = /* groq */ `_key, label, number`;

const eventCardFields = /* groq */ `
  _id,
  title,
  "slug": slug.current,
  start,
  end,
  allDay,
  repeat { frequency, until, skipDates },
  location,
  hostedByMsl,
  summary
`;

const resourceCardFields = /* groq */ `
  _id,
  title,
  "slug": slug.current,
  summary,
  serviceArea,
  phones[]{ ${phoneFields} },
  website,
  address,
  "topics": topics[]->{ title, "slug": slug.current }
`;

const linkCardFields = /* groq */ `
  _id,
  title,
  url,
  source,
  summary,
  publishedAt
`;

const articleCardFields = /* groq */ `
  _id,
  title,
  "slug": slug.current,
  summary,
  publishedAt,
  series,
  "author": author->{ name, "slug": slug.current },
  mainImage { ${imageFields} }
`;

const richTextFields = /* groq */ `
  ...,
  markDefs[]{
    ...,
    _type == "internalLink" => { "target": reference->{ ${targetFields} } }
  },
  _type == "imageWithAlt" => { _key, _type, ${imageFields} },
  _type == "fileAttachment" => {
    _key,
    _type,
    title,
    "file": asset->{ url, size, extension, originalFilename }
  },
  _type == "eventCard" => { _key, _type, "event": event->{ ${eventCardFields} } },
  _type == "resourceCard" => { _key, _type, "resource": resource->{ ${resourceCardFields} } }
`;

const pageBuilderFields = /* groq */ `
  ...,
  _key,
  _type,
  _type == "heroBlock" => { image { ${imageFields} }, buttons[]{ ${linkFields} } },
  _type == "textBlock" => { body[]{ ${richTextFields} } },
  _type == "imageBlock" => { images[]{ _key, ${imageFields} } },
  _type == "buttonsBlock" => { buttons[]{ ${linkFields} } },
  _type == "calloutBlock" => { link{ ${linkFields} } },
  _type == "resourceListBlock" => {
    "topicSlug": topic->slug.current,
    "topicTitle": topic->title,
    "picked": resources[]->{ ${resourceCardFields} }
  },
  _type == "eventListBlock" => { "topicId": topic._ref, "topicSlug": topic->slug.current },
  _type == "articleListBlock" => { "topicId": topic._ref, "topicSlug": topic->slug.current },
  _type == "linkListBlock" => {
    "topicId": topic._ref,
    "topicSlug": topic->slug.current,
    "picked": links[]->{ ${linkCardFields} }
  },
  _type == "faqBlock" => { items[]{ _key, question, answer } },
  _type == "fileBlock" => { "file": file.asset->{ url, size, extension, originalFilename } }
`;

// ---------------------------------------------------------------------------
// Site-wide
// ---------------------------------------------------------------------------

export const querySettings = defineQuery(`
  *[_id == "settings"][0]{
    siteTitle,
    tagline,
    description,
    heroImage { ${imageFields} },
    contactEmail,
    contactPhone { label, number },
    mailingAddress,
    donateUrl,
    nonprofitStatement,
    newsletterTitle,
    newsletterDedication,
    subscribeInstructions
  }
`);

export const queryNavigation = defineQuery(`
  *[_id == "navigation"][0]{
    main[]{ ${linkFields} },
    footer[]{ ${linkFields} }
  }
`);

export const queryHome = defineQuery(`
  *[_id == "home"][0]{
    sections[]{ ${pageBuilderFields} }
  }
`);

/** Numbers for the home page hero. */
export const queryStats = defineQuery(`
  {
    "resources": count(*[_type == "resource"]),
    "topics": count(*[_type == "topic"]),
    "links": count(*[_type == "helpfulLink"])
  }
`);

export const queryTopics = defineQuery(`
  *[_type == "topic"] | order(order asc){
    _id,
    title,
    "slug": slug.current,
    description,
    icon,
    "resourceCount": count(*[_type == "resource" && references(^._id)])
  }
`);

// ---------------------------------------------------------------------------
// Pages
// ---------------------------------------------------------------------------

export const queryPage = defineQuery(`
  *[_type == "page" && slug.current == $slug][0]{
    _id,
    title,
    description,
    "slug": slug.current,
    sections[]{ ${pageBuilderFields} }
  }
`);

export const queryPagePaths = defineQuery(`
  *[_type == "page" && defined(slug.current)].slug.current
`);

// ---------------------------------------------------------------------------
// Topics, resources, helpful links
// ---------------------------------------------------------------------------

export const queryTopic = defineQuery(`
  *[_type == "topic" && slug.current == $slug][0]{
    _id,
    title,
    "slug": slug.current,
    description,
    icon,
    "resources": *[_type == "resource" && references(^._id)] | order(title asc){ ${resourceCardFields} },
    "links": *[_type == "helpfulLink" && references(^._id)] | order(publishedAt desc)[0...12]{ ${linkCardFields} },
    "linkCount": count(*[_type == "helpfulLink" && references(^._id)]),
    "articles": *[_type == "article" && references(^._id)] | order(publishedAt desc)[0...6]{ ${articleCardFields} }
  }
`);

/** Resources with optional topic / service-area / text filters. */
const resourceFilter = /* groq */ `
  _type == "resource"
  && ($topic == "" || $topic in topics[]->slug.current)
  && ($area == "" || serviceArea == $area)
  && ($q == "" || title match $q + "*" || summary match $q + "*" || pt::text(description) match $q + "*")
`;

export const queryResourcesCount = defineQuery(`count(*[${resourceFilter}])`);

/** Slice bounds must be literals; callers pass validated integers. */
export function queryResourcesSlice(start: number, end: number) {
  return defineQuery(`
    *[${resourceFilter}] | order(title asc)[${start}...${end}]{ ${resourceCardFields} }
  `);
}

/** Everything in a topic (or all), for the printable list. */
export const queryResourcesForPrint = defineQuery(`
  *[${resourceFilter}] | order(title asc){
    ${resourceCardFields},
    hours[]{ day, opens, closes },
    hoursNote
  }
`);

export const queryResource = defineQuery(`
  *[_type == "resource" && slug.current == $slug][0]{
    ${resourceCardFields},
    email,
    isGovernment,
    hours[]{ _key, day, opens, closes },
    hoursNote,
    description[]{ ${richTextFields} },
    eligibility,
    cost,
    attachments[]{ _key, title, "file": asset->{ url, size, extension } },
    lastVerified,
    _updatedAt
  }
`);

export const queryResourcePaths = defineQuery(`
  *[_type == "resource" && defined(slug.current)].slug.current
`);

const linkFilter = /* groq */ `
  _type == "helpfulLink" && ($topic == "" || $topic in topics[]->slug.current)
`;

export const queryLinksCount = defineQuery(`count(*[${linkFilter}])`);

export function queryLinksSlice(start: number, end: number) {
  return defineQuery(`
    *[${linkFilter}] | order(publishedAt desc, title asc)[${start}...${end}]{
      ${linkCardFields},
      "topics": topics[]->{ title, "slug": slug.current }
    }
  `);
}

export const queryLinksByTopic = defineQuery(`
  *[_type == "helpfulLink" && references($topicId)] | order(publishedAt desc)[0...30]{ ${linkCardFields} }
`);

export const queryResourcesByTopicSlug = defineQuery(`
  *[_type == "resource" && $topic in topics[]->slug.current] | order(title asc)[0...30]{ ${resourceCardFields} }
`);

// ---------------------------------------------------------------------------
// Articles and writers
// ---------------------------------------------------------------------------

const articleFilter = /* groq */ `
  _type == "article"
  && ($series == "" || series == $series)
  && ($topicId == "" || references($topicId))
`;

export const queryArticlesCount = defineQuery(`count(*[${articleFilter}])`);

export function queryArticlesSlice(start: number, end: number) {
  return defineQuery(`
    *[${articleFilter}] | order(publishedAt desc)[${start}...${end}]{ ${articleCardFields} }
  `);
}

export const queryArticle = defineQuery(`
  *[_type == "article" && slug.current == $slug][0]{
    ${articleCardFields},
    "author": author->{ name, "slug": slug.current, bio, image { ${imageFields} } },
    "topics": topics[]->{ title, "slug": slug.current },
    body[]{ ${richTextFields} },
    _updatedAt
  }
`);

export const queryArticlePaths = defineQuery(`
  *[_type == "article" && defined(slug.current)] | order(publishedAt desc)[0...200].slug.current
`);

export const queryWriter = defineQuery(`
  *[_type == "author" && slug.current == $slug][0]{
    name,
    "slug": slug.current,
    bio,
    tribute,
    image { ${imageFields} },
    "articles": *[_type == "article" && references(^._id)] | order(publishedAt desc){ ${articleCardFields} }
  }
`);

// ---------------------------------------------------------------------------
// Events (repeats are expanded in code; see apps/web/lib/events.ts)
// ---------------------------------------------------------------------------

/** Events that may have a date between $from and $to (ISO strings). */
export const queryEventsInRange = defineQuery(`
  *[
    _type == "event"
    && dateTime(start) <= dateTime($to)
    && (
      dateTime(coalesce(end, start)) >= dateTime($from)
      || (repeat.frequency in ["weekly", "monthlyWeekday", "monthlyDate"] && repeat.until >= string::split($from, "T")[0])
    )
    && ($topicId == "" || references($topicId))
    && ($mslOnly == false || hostedByMsl == true)
  ] | order(start asc){ ${eventCardFields} }
`);

export const queryEvent = defineQuery(`
  *[_type == "event" && slug.current == $slug][0]{
    ${eventCardFields},
    address,
    cost,
    registration { required, link{ ${linkFields} } },
    flyer { ${imageFields} },
    details[]{ ${richTextFields} },
    "topics": topics[]->{ title, "slug": slug.current }
  }
`);

export const queryEventPaths = defineQuery(`
  *[_type == "event" && defined(slug.current)] | order(start desc)[0...200].slug.current
`);

// ---------------------------------------------------------------------------
// What's New (monthly) and the newsletter
// ---------------------------------------------------------------------------

export const queryMonthlyUpdate = defineQuery(`
  *[_type == "monthlyUpdate" && string::startsWith(publishMonth, $month)][0]{
    _id, "month": ${monthKey}, title, intro, body[]{ ${richTextFields} }, _updatedAt
  }
`);

/** The newest month that isn't in the future. */
export const queryCurrentMonthlyUpdate = defineQuery(`
  *[_type == "monthlyUpdate" && publishMonth <= $month + "-31"] | order(publishMonth desc)[0]{
    _id, "month": ${monthKey}, title, intro
  }
`);

export const queryMonthlyUpdateList = defineQuery(`
  *[_type == "monthlyUpdate" && publishMonth <= $month + "-31"] | order(publishMonth desc){ "month": ${monthKey}, title, intro }
`);

const newsletterSectionFields = /* groq */ `
  _key,
  _type,
  heading,
  _type == "comingUpSection" => {
    includeEvents,
    "hiddenEventIds": hiddenEvents[]._ref,
    extraRows[]{ _key, when, what, where }
  },
  _type == "storySection" => {
    byline,
    image { ${imageFields} },
    body[]{ ${richTextFields} },
    "article": article->{ title, "slug": slug.current, "author": author->name, body[]{ ${richTextFields} } }
  },
  _type == "flyerSection" => { pages[]{ _key, ${imageFields} } },
  _type == "funSection" => { body[]{ ${richTextFields} } }
`;

export const queryNewsletter = defineQuery(`
  *[_type == "newsletterEdition" && string::startsWith(publishMonth, $month)][0]{
    _id,
    "month": ${monthKey},
    coverImage { ${imageFields} },
    coverMessage,
    sections[]{ ${newsletterSectionFields} },
    "uploadedPdf": uploadedPdf.asset->{ url, size },
    _updatedAt
  }
`);

export const queryNewsletterList = defineQuery(`
  *[_type == "newsletterEdition" && publishMonth <= $month + "-31"] | order(publishMonth desc){
    "month": ${monthKey},
    coverImage { ${imageFields} },
    "hasSections": count(sections) > 0,
    "uploadedPdf": uploadedPdf.asset->{ url, size }
  }
`);

// ---------------------------------------------------------------------------
// Search, redirects, sitemap
// ---------------------------------------------------------------------------

/** Callers must skip empty terms — an empty term matches everything. */
export const querySearch = defineQuery(`
  *[
    _type in ["resource", "helpfulLink", "article", "event", "page"]
    && (
      title match $q + "*"
      || summary match $q + "*"
      || pt::text(description) match $q + "*"
      || pt::text(body) match $q + "*"
      || topics[]->title match $q + "*"
    )
  ]
  | score(
      boost(title match $q + "*", 5),
      boost(_type == "resource", 2),
      summary match $q + "*"
    )
  | order(_score desc)[0...40]{
    _type,
    _id,
    title,
    "slug": slug.current,
    summary,
    url,
    source,
    start,
    phones[]{ ${phoneFields} }
  }
`);

export const queryRedirect = defineQuery(`
  *[_type == "redirect" && source == $source][0]{ destination, permanent }
`);

export const querySitemap = defineQuery(`
  {
    "pages": *[_type == "page" && defined(slug.current)]{ "slug": slug.current, _updatedAt },
    "resources": *[_type == "resource" && defined(slug.current)]{ "slug": slug.current, _updatedAt },
    "articles": *[_type == "article" && defined(slug.current)]{ "slug": slug.current, _updatedAt },
    "events": *[_type == "event" && defined(slug.current)]{ "slug": slug.current, _updatedAt },
    "topics": *[_type == "topic" && defined(slug.current)]{ "slug": slug.current, _updatedAt },
    "months": *[_type == "monthlyUpdate" && defined(publishMonth)]{ "month": ${monthKey}, _updatedAt },
    "newsletters": *[_type == "newsletterEdition" && defined(publishMonth)]{ "month": ${monthKey}, _updatedAt },
    "writers": *[_type == "author" && defined(slug.current)]{ "slug": slug.current, _updatedAt }
  }
`);
