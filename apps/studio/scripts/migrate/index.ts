/**
 * One-way migration: old production content → the new model in the
 * `development` dataset.
 *
 *   node --env-file=../web/.env.local scripts/migrate/index.ts [--dry-run] [--skip-assets]
 *
 * Reads production only from the local export (migration/data/production.ndjson,
 * made with the read-only export API) and the public CDN for files. It never
 * writes to production: the target dataset is fixed below and checked.
 * Safe to re-run: documents are matched by legacyId / slug / month and
 * replaced, and asset uploads are deduplicated by Sanity's content hash.
 */
import { randomUUID } from "node:crypto";
import { existsSync, readFileSync, writeFileSync } from "node:fs";
import { resolve } from "node:path";
import { createClient } from "@sanity/client";

import {
  convertImage,
  convertRichText,
  newKey,
  parsePhones,
  plainText,
  publisherFor,
  slugMaker,
  summarize,
} from "./convert.ts";
import {
  NON_TOPIC_CATEGORIES,
  TOPICS,
  topicForCategory,
  topicsForTag,
} from "./topics.ts";

const TARGET_DATASET = "development";
const PROJECT_ID = "bksfw1p8";
const ROOT = resolve(import.meta.dirname, "../../../..");
const DATA = resolve(ROOT, "migration/data");
const DRY_RUN = process.argv.includes("--dry-run");
const SKIP_ASSETS = process.argv.includes("--skip-assets");

if (TARGET_DATASET !== "development")
  throw new Error("Refusing: target must be development");
const token = process.env.SANITY_API_WRITE_TOKEN;
if (!token && !DRY_RUN) throw new Error("SANITY_API_WRITE_TOKEN is required");

const dev = createClient({
  projectId: PROJECT_ID,
  dataset: TARGET_DATASET,
  apiVersion: "2025-02-19",
  token,
  useCdn: false,
});
if (dev.config().dataset !== "development")
  throw new Error("Refusing: client is not on development");

// biome-ignore lint/suspicious/noExplicitAny: loose legacy documents
type Doc = Record<string, any>;

const source = new Map<string, Doc>();
for (const line of readFileSync(
  resolve(DATA, "production.ndjson"),
  "utf8",
).split("\n")) {
  if (!line.trim()) continue;
  const doc = JSON.parse(line) as Doc;
  if (doc._id.startsWith("drafts.")) continue;
  source.set(doc._id, doc);
}
const ofType = (type: string) =>
  [...source.values()].filter((d) => d._type === type);
const deref = (ref?: { _ref?: string }) =>
  ref?._ref ? source.get(ref._ref) : undefined;
const titleOf = (ref?: { _ref?: string }) =>
  deref(ref)?.title ?? deref(ref)?.name;

const report: Record<string, number> = {};
const count = (key: string) => {
  report[key] = (report[key] ?? 0) + 1;
};

// ---------------------------------------------------------------------------
// Existing development documents (for stable IDs on re-runs)
// ---------------------------------------------------------------------------
const existing = DRY_RUN
  ? []
  : await dev.fetch<{ _id: string; _type: string; key?: string }[]>(
      `*[!(_id in path("drafts.**")) && _type in ["topic","author","resource","helpfulLink","article","page","monthlyUpdate","newsletterEdition","redirect"]]{
        _id, _type, "key": select(
          _type == "author" => name,
          _type == "redirect" => source,
          _type in ["monthlyUpdate", "newsletterEdition"] => month,
          _type in ["topic", "page"] => slug.current,
          legacyId
        )
      }`,
    );
const existingId = new Map(existing.map((d) => [`${d._type}:${d.key}`, d._id]));
const idFor = (type: string, key: string) =>
  existingId.get(`${type}:${key}`) ?? randomUUID();

const out: Doc[] = [];
const ref = (_ref: string) => ({ _type: "reference", _ref });
const keyedRef = (_ref: string) => ({
  _type: "reference",
  _ref,
  _key: newKey(),
});

// ---------------------------------------------------------------------------
// Topics
// ---------------------------------------------------------------------------
const topicId = new Map<string, string>();
TOPICS.forEach((topic, index) => {
  const _id = idFor("topic", topic.slug);
  topicId.set(topic.slug, _id);
  out.push({
    _id,
    _type: "topic",
    title: topic.title,
    slug: { _type: "slug", current: topic.slug },
    description: topic.description,
    icon: topic.icon,
    order: (index + 1) * 10,
    legacyCategories: topic.categories,
  });
});

/** Up to 3 topics for a legacy document from its categories, then tags. */
function topicsFor(doc: Doc, fallback = "community-activities") {
  const tally = new Map<string, number>();
  for (const category of doc.categories ?? []) {
    const slug = topicForCategory(titleOf(category));
    if (slug) tally.set(slug, (tally.get(slug) ?? 0) + 3);
  }
  for (const tag of doc.tags ?? []) {
    for (const slug of topicsForTag(titleOf(tag)))
      tally.set(slug, (tally.get(slug) ?? 0) + 1);
  }
  const slugs = [...tally.entries()]
    .sort((a, b) => b[1] - a[1])
    .slice(0, 3)
    .map(([s]) => s);
  if (!slugs.length) slugs.push(fallback);
  return slugs.map((slug) => keyedRef(topicId.get(slug) as string));
}

// ---------------------------------------------------------------------------
// Writers
// ---------------------------------------------------------------------------
const PUBLISHER_AUTHORS = new Set([
  "InMaricopa Magazine",
  "Maricopa Monitor",
  "Pinal Central",
  "Pinal County",
]);
const authorId = new Map<string, string>();
function writer(name: string, sourceDoc?: Doc) {
  if (authorId.has(name)) return authorId.get(name) as string;
  const _id = idFor("author", name);
  authorId.set(name, _id);
  out.push({
    _id,
    _type: "author",
    name,
    slug: { _type: "slug", current: slugMaker()(name) },
    ...(sourceDoc?.image?.asset
      ? { image: convertImage(sourceDoc.image) }
      : {}),
  });
  return _id;
}

// ---------------------------------------------------------------------------
// Services → resources (reachable organizations) or helpful links
// ---------------------------------------------------------------------------
const resourceSlug = slugMaker();
const linkTitles = new Set<string>();
const linkUrls = new Set<string>();
const redirects: { source: string; destination: string }[] = [];

function serviceArea(doc: Doc) {
  const address = (doc.address ?? "").toLowerCase();
  const phone = doc.phone ?? "";
  if (address.includes("maricopa") || /\b520[\s.-]?568/.test(phone))
    return "maricopa";
  if (/\b(800|888|877|866|855|844|833)\b/.test(phone) && !address)
    return "national";
  if (
    /pinal|casa grande|florence|coolidge|eloy|san tan/.test(address) ||
    /pinal/i.test(doc.website ?? "")
  )
    return "pinal";
  return "arizona";
}

const DAY_ORDER = [
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
  "Sunday",
];

for (const doc of ofType("service")) {
  const description = plainText(doc.description);
  const hasContact = Boolean(
    (doc.phone && parsePhones(doc.phone).length) || doc.address,
  );
  if (hasContact) {
    count("resource");
    const phones = parsePhones(doc.phone);
    const notes = convertRichText(doc.notes, { simple: true });
    out.push({
      _id: idFor("resource", doc._id),
      _type: "resource",
      legacyId: doc._id,
      title: doc.title.trim(),
      slug: { _type: "slug", current: resourceSlug(doc.title) },
      summary: summarize(description || doc.title, 300),
      topics: topicsFor(doc),
      serviceArea: serviceArea(doc),
      isGovernment: /\.gov\b/i.test(doc.website ?? ""),
      ...(phones.length ? { phones } : {}),
      ...(doc.website ? { website: doc.website.trim() } : {}),
      ...(doc.address ? { address: doc.address.trim() } : {}),
      ...(doc.businessHours?.length
        ? {
            hours: [...doc.businessHours]
              .filter((h: Doc) => h.day && h.opensAt && h.closesAt)
              .sort(
                (a: Doc, b: Doc) =>
                  DAY_ORDER.indexOf(a.day) - DAY_ORDER.indexOf(b.day),
              )
              .map((h: Doc) => ({
                _type: "openingHours",
                _key: newKey(),
                day: h.day,
                opens: h.opensAt,
                closes: h.closesAt,
              })),
          }
        : {}),
      description: [
        ...convertRichText(doc.description, { simple: true }),
        ...notes,
      ],
      ...(doc.audience?.length ? { eligibility: plainText(doc.audience) } : {}),
      ...(doc.attachments?.length
        ? {
            attachments: doc.attachments
              .filter((a: Doc) => a.asset?._ref)
              .map((a: Doc) => ({
                _type: "file",
                _key: a._key ?? newKey(),
                asset: ref(a.asset._ref),
                title: a.name ?? "Download",
              })),
          }
        : {}),
      needsReview: true,
    });
    if (doc.phone && !phones.length) count("resource-phone-unparsed");
  } else if (doc.website) {
    const key = doc.website.trim().toLowerCase().replace(/\/+$/, "");
    if (linkUrls.has(key)) {
      count("helpfulLink-duplicate-skipped");
      continue;
    }
    linkUrls.add(key);
    count("helpfulLink-from-service");
    // "AARP - Some title" → source "AARP", title "Some title"
    const prefix = doc.title.match(/^(.{2,40}?)\s+[-–:]\s+(.+)$/);
    const sourceName = prefix?.[1]?.trim() ?? publisherFor(doc.website);
    const title = (prefix?.[2] ?? doc.title).trim();
    linkTitles.add(title.toLowerCase());
    out.push({
      _id: idFor("helpfulLink", doc._id),
      _type: "helpfulLink",
      legacyId: doc._id,
      title,
      url: doc.website.trim(),
      source: sourceName ?? "Website",
      summary: summarize(description || title, 400),
      topics: topicsFor(doc),
      publishedAt: (doc._createdAt ?? new Date().toISOString()).slice(0, 10),
      needsReview: true,
    });
  } else {
    count("service-skipped-no-contact-or-url");
  }
}

// ---------------------------------------------------------------------------
// Posts → articles, helpful links, About pages, newsletter archive
// ---------------------------------------------------------------------------
const MONTHS = [
  "january",
  "february",
  "march",
  "april",
  "may",
  "june",
  "july",
  "august",
  "september",
  "october",
  "november",
  "december",
];
function monthKeyFrom(text: string) {
  const match = text
    .toLowerCase()
    .match(new RegExp(`(${MONTHS.join("|")})\\s*,?\\s*(20\\d\\d)`));
  if (!match) return undefined;
  return `${match[2]}-${String(MONTHS.indexOf(match[1] as string) + 1).padStart(2, "0")}`;
}

const newsletterPdfs = new Map<string, { asset: string; title: string }>();
const aboutSlug = slugMaker();
const pages: Doc[] = [];

function firstExternalUrl(doc: Doc) {
  for (const block of doc.body ?? []) {
    for (const def of block.markDefs ?? []) {
      const href: string = def.href ?? "";
      if (
        /^https?:/.test(href) &&
        !/maricopaseniorliving|\/author\/|\/users\/profile|\/tag\//.test(href)
      )
        return href;
    }
  }
  return undefined;
}

const categoryNames = (doc: Doc) =>
  (doc.categories ?? []).map((c: Doc) =>
    (titleOf(c) ?? "").trim().toLowerCase(),
  );

for (const doc of ofType("post")) {
  const slug = doc.slug?.current;
  // Collect every "Keeping you informed" PDF anywhere in posts for the archive.
  for (const block of doc.body ?? []) {
    if (block._type !== "attachment" || !block.asset?._ref) continue;
    const label = block.description ?? "";
    const month = /keeping you informed/i.test(label)
      ? monthKeyFrom(label)
      : undefined;
    if (month && !newsletterPdfs.has(month))
      newsletterPdfs.set(month, { asset: block.asset._ref, title: label });
  }
  if (doc.isArchived) {
    count("post-archived-skipped");
    if (slug)
      redirects.push({ source: `/articles/${slug}`, destination: "/articles" });
    continue;
  }
  const authorName = titleOf(doc.author) ?? "Maricopa Senior Living";
  const cats = categoryNames(doc);
  if (slug === "check-out-whats-new") {
    redirects.push({ source: `/articles/${slug}`, destination: "/whats-new" });
    continue;
  }
  if (cats.some((c: string) => c.includes("newsletter"))) {
    count("post-newsletter-to-archive");
    redirects.push({ source: `/articles/${slug}`, destination: "/newsletter" });
    continue;
  }
  if (
    /^msl\s*[-–]/i.test(doc.title) ||
    cats.includes("maricopa senior living a 501 (c)(3) arizona nonprofit")
  ) {
    count("page-about");
    const title = doc.title.replace(/^msl\s*[-–]\s*/i, "").trim();
    const pageSlug = aboutSlug(title);
    pages.push({
      _id: idFor("page", pageSlug),
      _type: "page",
      title,
      slug: { _type: "slug", current: pageSlug },
      section: "about",
      description: summarize(plainText(doc.body), 200),
      sections: [
        { _type: "textBlock", _key: newKey(), body: convertRichText(doc.body) },
      ],
    });
    redirects.push({
      source: `/articles/${slug}`,
      destination: `/about/${pageSlug}`,
    });
    continue;
  }
  if (PUBLISHER_AUTHORS.has(authorName)) {
    const url = firstExternalUrl(doc);
    if (!url) {
      count("post-copied-no-source-skipped");
      redirects.push({ source: `/articles/${slug}`, destination: "/articles" });
      continue;
    }
    count("helpfulLink-from-copied-post");
    out.push({
      _id: idFor("helpfulLink", doc._id),
      _type: "helpfulLink",
      legacyId: doc._id,
      title: doc.title.trim(),
      url,
      source: authorName === "InMaricopa Magazine" ? "InMaricopa" : authorName,
      summary: summarize(plainText(doc.body), 400),
      topics: topicsFor(doc),
      publishedAt: (doc.publishedAt ?? doc._createdAt).slice(0, 10),
      needsReview: true,
    });
    redirects.push({ source: `/articles/${slug}`, destination: url });
    continue;
  }
  count("article");
  const authorDoc = deref(doc.author);
  out.push({
    _id: idFor("article", doc._id),
    _type: "article",
    legacyId: doc._id,
    title: doc.title.trim(),
    slug: { _type: "slug", current: slug },
    author: ref(writer(authorName, authorDoc)),
    publishedAt: (doc.publishedAt ?? doc._createdAt).slice(0, 10),
    series:
      cats.includes("joan's corner") || authorName === "Joan Koczor"
        ? "joans-corner"
        : cats.includes("ron's ramblings")
          ? "rons-ramblings"
          : "none",
    summary: summarize(plainText(doc.body), 300) || doc.title,
    topics: topicsFor(doc),
    ...(doc.mainImage?.asset ? { mainImage: convertImage(doc.mainImage) } : {}),
    body: convertRichText(doc.body),
    needsReview: true,
  });
}

// Newsletter archive: one edition per month with its original PDF.
for (const [month, pdf] of newsletterPdfs) {
  count("newsletterEdition-archive");
  out.push({
    _id: idFor("newsletterEdition", month),
    _type: "newsletterEdition",
    month,
    sections: [],
    uploadedPdf: { _type: "file", asset: ref(pdf.asset) },
  });
}

// ---------------------------------------------------------------------------
// What's New: early-month snapshots of the one post Ron kept overwriting
// ---------------------------------------------------------------------------
const SNAPSHOTS: Record<string, string> = {
  "2026-08": "snap-2026-08-08.json",
  "2026-09": "snap-2026-09-01.json",
  "2026-10": "snap-2026-10-01.json",
  "2026-11": "2026-11.json",
};
for (const [month, file] of Object.entries(SNAPSHOTS)) {
  const path = resolve(DATA, "whats-new-history", file);
  if (!existsSync(path)) continue;
  const snapshot = JSON.parse(readFileSync(path, "utf8")).documents?.[0];
  if (!snapshot) continue;
  const body = [...(snapshot.body ?? [])];
  // The first heading is the standing intro line; use it as the intro.
  const first = body[0];
  const introText =
    first?._type === "block" && first.style === "h1"
      ? (body.shift(), (first.children ?? []).map((c: Doc) => c.text).join(""))
      : "What's happening in Maricopa this month.";
  count("monthlyUpdate");
  out.push({
    _id: idFor("monthlyUpdate", month),
    _type: "monthlyUpdate",
    month,
    intro: summarize(introText.replace(/\s*\.\s*\.\s*\.\s*$/, "…"), 400),
    body: convertRichText(body),
  });
}

// ---------------------------------------------------------------------------
// Pages, menus, settings, home
// ---------------------------------------------------------------------------
for (const old of ofType("page")) {
  const pageSlug = old.slug.current.replace(/^\//, "");
  count("page-general");
  pages.push({
    _id: idFor("page", pageSlug),
    _type: "page",
    title: old.title,
    slug: { _type: "slug", current: pageSlug },
    section: "general",
    sections: [
      { _type: "textBlock", _key: newKey(), body: convertRichText(old.body) },
    ],
  });
}

// The old drop-down menus (100+ outside links) become a Quick Links page.
const oldNav = ofType("navigation")[0];
const quickLinkSections = (oldNav?.headerPrimary ?? [])
  .filter((item: Doc) => item.children?.length)
  .map((item: Doc) => ({
    _type: "textBlock",
    _key: newKey(),
    heading: (item.link?.text ?? "Links").trim(),
    body: (item.children as Doc[])
      .filter((child) => child.link?.url && /^https?:/.test(child.link.url))
      .map((child) => {
        const linkKey = newKey();
        return {
          _type: "block",
          _key: newKey(),
          style: "normal",
          listItem: "bullet",
          level: 1,
          markDefs: [
            { _type: "link", _key: linkKey, href: child.link.url.trim() },
          ],
          children: [
            {
              _type: "span",
              _key: newKey(),
              text: (child.link.text ?? child.link.url).trim(),
              marks: [linkKey],
            },
          ],
        };
      }),
  }));
pages.push({
  _id: idFor("page", "quick-links"),
  _type: "page",
  title: "Quick Links",
  slug: { _type: "slug", current: "quick-links" },
  section: "general",
  description:
    "Websites for the City of Maricopa, weather, traffic, and local and national services.",
  sections: quickLinkSections,
});
out.push(...pages);

const oldSettings = ofType("settings")[0] ?? {};
const oldHome = ofType("home")[0] ?? {};
const heroImage = convertImage(oldHome.image);
out.push({
  _id: "settings",
  _type: "settings",
  siteTitle: "Maricopa Senior Living",
  tagline: "A directory of resources to help you age your way!",
  description:
    oldSettings.siteDescription ??
    "Local resources, events and news for seniors and caregivers in Maricopa, Arizona.",
  ...(heroImage
    ? {
        heroImage: {
          ...heroImage,
          alt: "Wild horses grazing in the desert near Maricopa, Arizona",
        },
      }
    : {}),
  ...(oldSettings.contactEmail
    ? { contactEmail: oldSettings.contactEmail }
    : {}),
  donateUrl: "https://www.paypal.com/donate?hosted_button_id=VDPMC329ZC5ZE",
  nonprofitStatement:
    "Maricopa Senior Living is an Arizona 501(c)(3) nonprofit.",
  newsletterTitle: "Keeping you informed…still",
  subscribeInstructions:
    "Subscribe today! It's free, quick & easy. Email your name to pjchoa@msn.com or rondsmithaz@msn.com.",
});

const section = (label: string, path: string) => ({
  _type: "link",
  _key: newKey(),
  label,
  kind: "section",
  section: path,
});
const pageLink = (label: string, slug: string) => {
  const target = pages.find((p) => p.slug.current === slug);
  return target
    ? {
        _type: "link",
        _key: newKey(),
        label,
        kind: "internal",
        reference: ref(target._id),
      }
    : section(label, "/about");
};
out.push({
  _id: "navigation",
  _type: "navigation",
  main: [
    section("Find Help", "/resources"),
    section("What's New", "/whats-new"),
    section("Events", "/events"),
    section("Newsletter", "/newsletter"),
    section("Articles", "/articles"),
    section("About Us", "/about"),
  ],
  footer: [
    pageLink("Quick Links", "quick-links"),
    pageLink("Quick Contacts", "quick-contacts"),
    section("Helpful links", "/links"),
    pageLink("How to Donate", "how-to-donate"),
    pageLink("Contact Us", "how-to-contact-us"),
    pageLink("Disclaimer", "disclaimer-of-liability"),
  ],
});

out.push({
  _id: "home",
  _type: "home",
  title: "Home",
  sections: [
    {
      _type: "heroBlock",
      _key: newKey(),
      heading: "Find help in Maricopa",
      text: "A directory of resources to help you age your way.",
      ...(heroImage
        ? {
            image: {
              ...heroImage,
              alt: "Wild horses grazing in the desert near Maricopa, Arizona",
            },
          }
        : {}),
      showSearch: true,
    },
    {
      _type: "topicsBlock",
      _key: newKey(),
      heading: "What do you need help with?",
    },
    {
      _type: "whatsNewBlock",
      _key: newKey(),
      heading: "This month in Maricopa",
      buttonLabel: "Read this month's What's New",
    },
    {
      _type: "eventListBlock",
      _key: newKey(),
      heading: "Coming up",
      mode: "all",
      limit: 5,
    },
    {
      _type: "quickContactsBlock",
      _key: newKey(),
      heading: "Important phone numbers",
      contacts: [
        {
          _type: "quickContact",
          _key: newKey(),
          name: "Emergency",
          number: { _type: "phoneNumber", number: "911" },
        },
        {
          _type: "quickContact",
          _key: newKey(),
          name: "Maricopa Police (non-emergency)",
          number: { _type: "phoneNumber", number: "520-568-3673" },
        },
        {
          _type: "quickContact",
          _key: newKey(),
          name: "Suicide & Crisis Lifeline",
          number: { _type: "phoneNumber", number: "988" },
          note: "Call or text, any time",
        },
      ],
    },
    {
      _type: "newsletterSignupBlock",
      _key: newKey(),
      heading: "Keeping you informed…still",
      showLatest: true,
    },
    {
      _type: "donateBlock",
      _key: newKey(),
      heading: "Support Maricopa Senior Living",
      text: "We're a volunteer-run Arizona 501(c)(3) nonprofit. Your gift keeps this guide free for everyone.",
    },
  ],
});

// ---------------------------------------------------------------------------
// Redirects: categories and tags → topics; converted posts handled above
// ---------------------------------------------------------------------------
for (const category of ofType("category")) {
  const slug = category.slug?.current;
  if (!slug) continue;
  const name = (category.title ?? "").trim().toLowerCase();
  const topic = topicForCategory(category.title);
  const destination = topic
    ? `/topics/${topic}`
    : name === "joan's corner"
      ? "/articles/series/joans-corner"
      : name.includes("newsletter")
        ? "/newsletter"
        : name === "what's new!"
          ? "/whats-new"
          : name.includes("nonprofit")
            ? "/about"
            : "/articles";
  redirects.push({ source: `/category/${slug}`, destination });
}
for (const tag of ofType("tag")) {
  const slug = tag.slug?.current;
  if (!slug) continue;
  const [topic] = topicsForTag(tag.title);
  redirects.push({
    source: `/tag/${slug}`,
    destination: topic
      ? `/topics/${topic}`
      : `/search?q=${encodeURIComponent(tag.title ?? slug)}`,
  });
}
const seenSources = new Set<string>();
for (const r of redirects) {
  if (seenSources.has(r.source)) continue;
  seenSources.add(r.source);
  out.push({
    _id: idFor("redirect", r.source),
    _type: "redirect",
    source: r.source,
    destination: r.destination,
    permanent: true,
  });
}
report.redirect = seenSources.size;

// ---------------------------------------------------------------------------
// Assets referenced by the migrated documents
// ---------------------------------------------------------------------------
const assetRefs = new Set<string>();
const walk = (value: unknown) => {
  if (Array.isArray(value)) value.forEach(walk);
  else if (value && typeof value === "object") {
    const v = value as Doc;
    if (
      v._type === "reference" &&
      typeof v._ref === "string" &&
      /^(image|file)-/.test(v._ref)
    )
      assetRefs.add(v._ref);
    Object.values(v).forEach(walk);
  }
};
out.forEach(walk);

console.log("Planned documents:", out.length, report);
console.log("Assets referenced:", assetRefs.size);
if (DRY_RUN) process.exit(0);

// Some files come back with a new ID (Sanity re-encodes e.g. WebP), so keep
// a map from old → new IDs and rewrite references before writing.
const MAP_FILE = resolve(DATA, "asset-map.json");
const assetMap: Record<string, string> = existsSync(MAP_FILE)
  ? JSON.parse(readFileSync(MAP_FILE, "utf8"))
  : {};
if (!SKIP_ASSETS) {
  const wanted = [...assetRefs].map((id) => assetMap[id] ?? id);
  const present = new Set(
    await dev.fetch<string[]>("*[_id in $ids]._id", { ids: wanted }),
  );
  const missing = [...assetRefs].filter(
    (id) => !present.has(assetMap[id] ?? id),
  );
  console.log(
    `Uploading ${missing.length} assets (${present.size} already in development)…`,
  );
  let done = 0;
  const queue = [...missing];
  await Promise.all(
    Array.from({ length: 4 }, async () => {
      while (queue.length) {
        const id = queue.shift() as string;
        const asset = source.get(id);
        if (!asset?.url) continue;
        const response = await fetch(asset.url);
        if (!response.ok) {
          console.warn("  could not download", id, response.status);
          continue;
        }
        const buffer = Buffer.from(await response.arrayBuffer());
        const uploaded = await dev.assets.upload(
          id.startsWith("image-") ? "image" : "file",
          buffer,
          {
            filename: asset.originalFilename,
          },
        );
        if (uploaded._id !== id) assetMap[id] = uploaded._id;
        done++;
        if (done % 25 === 0) console.log(`  ${done}/${missing.length}`);
      }
    }),
  );
  writeFileSync(MAP_FILE, JSON.stringify(assetMap, null, 2));
}
const remap = (value: unknown): unknown => {
  if (Array.isArray(value)) return value.map(remap);
  if (value && typeof value === "object") {
    const v = value as Doc;
    if (
      v._type === "reference" &&
      typeof v._ref === "string" &&
      assetMap[v._ref]
    ) {
      return { ...v, _ref: assetMap[v._ref] };
    }
    return Object.fromEntries(Object.entries(v).map(([k, x]) => [k, remap(x)]));
  }
  return value;
};
for (let i = 0; i < out.length; i++) out[i] = remap(out[i]) as Doc;
console.log(`Remapped ${Object.keys(assetMap).length} changed asset IDs.`);

// Write in batches. Topics and authors first so references resolve.
const order = ["topic", "author"];
out.sort((a, b) => {
  const ia = order.indexOf(a._type);
  const ib = order.indexOf(b._type);
  return (ia === -1 ? 99 : ia) - (ib === -1 ? 99 : ib);
});
for (let index = 0; index < out.length; index += 50) {
  const batch = out.slice(index, index + 50);
  const tx = dev.transaction();
  for (const doc of batch)
    tx.createOrReplace(doc as { _id: string; _type: string });
  await tx.commit({ visibility: "async" });
  console.log(`  wrote ${Math.min(index + 50, out.length)}/${out.length}`);
}
console.log("Done.");
