/**
 * Seeds starter singletons, taxonomy, and sample content for the greenfield schema.
 *
 * Usage: pnpm seed:content
 */
import { createClient } from "@sanity/client";

const projectId = process.env.SANITY_STUDIO_PROJECT_ID;
const dataset = process.env.SANITY_STUDIO_DATASET ?? "production";
const token = process.env.SANITY_API_WRITE_TOKEN;

if (!projectId || !token) {
  console.error("Set SANITY_STUDIO_PROJECT_ID and SANITY_API_WRITE_TOKEN");
  process.exit(1);
}

const client = createClient({ projectId, dataset, token, apiVersion: "2025-02-10" });

const categories = [
  { title: "Health & Wellness", slug: "health-wellness", isFeatured: true },
  { title: "Meals & Nutrition", slug: "meals-nutrition", isFeatured: true },
  { title: "Transportation", slug: "transportation", isFeatured: true },
  { title: "Housing", slug: "housing", isFeatured: true },
  { title: "Social & Recreation", slug: "social-recreation", isFeatured: true },
  { title: "Legal & Financial", slug: "legal-financial", isFeatured: true },
  { title: "Caregiver Support", slug: "caregiver-support", isFeatured: true },
];

const tags = [
  { title: "Medicare", slug: "medicare" },
  { title: "Senior Center", slug: "senior-center" },
];

function blockKey() {
  return Math.random().toString(36).slice(2, 10);
}

function portableText(text: string) {
  const key = blockKey();
  return [
    {
      _type: "block",
      _key: key,
      style: "normal",
      markDefs: [],
      children: [{ _type: "span", _key: `${key}-span`, text, marks: [] }],
    },
  ];
}

function ref(id: string) {
  return { _type: "reference", _ref: id };
}

async function upsertSingleton(id: string, doc: Record<string, unknown>) {
  await client.createOrReplace({ _id: id, ...doc });
  console.log(`Upserted ${id}`);
}

async function main() {
  await upsertSingleton("siteSettings", {
    _type: "siteSettings",
    title: "Maricopa Senior Resource Hub",
    description:
      "Local resources, guides, and news for seniors and caregivers in Maricopa, Arizona.",
  });

  await upsertSingleton("homePage", {
    _type: "homePage",
    title: "Home",
    pageBuilder: [
      {
        _type: "heroBlock",
        _key: "hero1",
        heading: "Aging well, your way — in Maricopa",
        subheading:
          "Find local services, trusted guides, and community news for seniors and caregivers.",
      },
      {
        _type: "featuredCategories",
        _key: "cats1",
        heading: "Browse by category",
      },
    ],
  });

  await upsertSingleton("mainNavigation", {
    _type: "mainNavigation",
    title: "Main Navigation",
    items: [
      {
        _key: "nav-resources",
        link: {
          label: "Resources",
          linkType: "external",
          externalUrl: "/resources",
          openInNewTab: false,
        },
      },
      {
        _key: "nav-guides",
        link: {
          label: "Guides",
          linkType: "external",
          externalUrl: "/guides",
          openInNewTab: false,
        },
      },
      {
        _key: "nav-articles",
        link: {
          label: "Articles",
          linkType: "external",
          externalUrl: "/articles",
          openInNewTab: false,
        },
      },
    ],
  });

  await upsertSingleton("siteFooter", {
    _type: "siteFooter",
    title: "Site Footer",
    tagline: "Helping seniors and caregivers find what they need in Maricopa.",
    copyright: `© ${new Date().getFullYear()} Maricopa Senior Resource Hub`,
    columns: [],
  });

  for (const cat of categories) {
    const id = `category-${cat.slug}`;
    await client.createOrReplace({
      _id: id,
      _type: "category",
      title: cat.title,
      slug: { _type: "slug", current: cat.slug },
      isFeatured: cat.isFeatured,
      description: portableText(
        `Resources and guides about ${cat.title.toLowerCase()} in Maricopa.`,
      ),
    });
    console.log(`Category: ${cat.title}`);
  }

  for (const tag of tags) {
    const id = `tag-${tag.slug}`;
    await client.createOrReplace({
      _id: id,
      _type: "tag",
      title: tag.title,
      slug: { _type: "slug", current: tag.slug },
    });
    console.log(`Tag: ${tag.title}`);
  }

  await client.createOrReplace({
    _id: "author-maricopa-team",
    _type: "author",
    name: "Maricopa Senior Resource Hub",
    slug: { _type: "slug", current: "maricopa-team" },
  });
  console.log("Author: Maricopa Senior Resource Hub");

  const today = new Date().toISOString().split("T")[0];

  await client.createOrReplace({
    _id: "resource-maricopa-senior-center",
    _type: "resource",
    title: "Maricopa Senior Center",
    slug: { _type: "slug", current: "maricopa-senior-center" },
    description:
      "Activities, meals, and social programs for older adults in Maricopa. Call for hours and upcoming events.",
    body: portableText(
      "The Maricopa Senior Center offers weekday programs, fitness classes, and community meals. Staff can help you learn about transportation options and other local services.",
    ),
    contact: {
      phone: "(520) 555-0100",
      email: "seniorcenter@example.com",
      streetAddress: "123 Example Blvd",
      city: "Maricopa",
      state: "AZ",
      zip: "85138",
    },
    category: ref("category-social-recreation"),
    tags: [ref("tag-senior-center")],
    lastVerified: today,
    featured: true,
  });
  console.log("Resource: Maricopa Senior Center");

  await client.createOrReplace({
    _id: "guide-meals-on-wheels",
    _type: "guide",
    title: "How to sign up for Meals on Wheels",
    slug: { _type: "slug", current: "meals-on-wheels-signup" },
    excerpt:
      "A step-by-step overview of who qualifies and how to request home-delivered meals in Maricopa.",
    body: portableText(
      "Meals on Wheels helps homebound seniors get nutritious meals delivered on weekdays. Start by calling your local Area Agency on Aging — they will walk you through eligibility and paperwork.",
    ),
    steps: [
      {
        _type: "howToStep",
        _key: "step1",
        title: "Call the local intake line",
        body: "Ask for Meals on Wheels or home-delivered meal programs serving Maricopa.",
      },
      {
        _type: "howToStep",
        _key: "step2",
        title: "Complete a short assessment",
        body: "A caseworker may ask about mobility, living situation, and dietary needs.",
      },
      {
        _type: "howToStep",
        _key: "step3",
        title: "Confirm your delivery schedule",
        body: "Once approved, note your delivery days and who to call if you will be away.",
      },
    ],
    author: ref("author-maricopa-team"),
    lastUpdated: today,
    category: ref("category-meals-nutrition"),
    tags: [ref("tag-medicare")],
    featured: true,
  });
  console.log("Guide: Meals on Wheels signup");

  await client.createOrReplace({
    _id: "article-welcome",
    _type: "article",
    title: "Welcome to the Maricopa Senior Resource Hub",
    slug: { _type: "slug", current: "welcome-to-the-hub" },
    excerpt:
      "A new home for local senior services, guides, and community news in one place.",
    body: portableText(
      "We built this site to make it easier for seniors and caregivers to find phone numbers, programs, and trustworthy how-to guides without digging through scattered links. Browse by category, search by keyword, or call the number on any resource page.",
    ),
    author: ref("author-maricopa-team"),
    publishedAt: new Date().toISOString(),
    contentSource: "original",
    category: ref("category-health-wellness"),
    featured: true,
  });
  console.log("Article: Welcome post");

  await client.createOrReplace({
    _id: "page-about",
    _type: "page",
    title: "About",
    slug: { _type: "slug", current: "about" },
    pageBuilder: [
      {
        _type: "richTextSection",
        _key: "about1",
        heading: "About this site",
        body: portableText(
          "The Maricopa Senior Resource Hub connects older adults and caregivers with local programs, services, and practical guides. Content is maintained by community partners committed to accurate, phone-friendly listings.",
        ),
      },
    ],
  });
  console.log("Page: About");

  await client.createOrReplace({
    _id: "page-privacy",
    _type: "page",
    title: "Privacy Policy",
    slug: { _type: "slug", current: "privacy" },
    pageBuilder: [
      {
        _type: "richTextSection",
        _key: "privacy1",
        heading: "Privacy Policy",
        body: portableText(
          "We use privacy-friendly analytics to understand how visitors use the site. We do not sell personal information. Contact the site maintainer with any privacy questions.",
        ),
      },
    ],
  });
  console.log("Page: Privacy Policy");

  console.log("\nSeed complete. Review content in Studio and wire internal navigation links.");
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
