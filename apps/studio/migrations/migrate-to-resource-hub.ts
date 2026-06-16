import { createClient } from "@sanity/client";

/**
 * One-time migration: post → article, service → resource, page.body → pageBuilder.
 *
 * Run with:
 *   SANITY_STUDIO_PROJECT_ID=... SANITY_STUDIO_DATASET=... npx tsx migrations/migrate-to-resource-hub.ts
 *
 * Use a staging dataset first. Requires a token with write access:
 *   SANITY_API_TOKEN=...
 */

const projectId = process.env.SANITY_STUDIO_PROJECT_ID;
const dataset = process.env.SANITY_STUDIO_DATASET ?? "production";
const token = process.env.SANITY_API_TOKEN;

if (!projectId || !token) {
  console.error(
    "Set SANITY_STUDIO_PROJECT_ID and SANITY_API_TOKEN before running.",
  );
  process.exit(1);
}

const client = createClient({
  projectId,
  dataset,
  token,
  apiVersion: "2025-02-10",
  useCdn: false,
});

async function migratePostsToArticles() {
  const posts = await client.fetch<
    Array<{
      _id: string;
      title?: string;
      excerpt?: string;
    }>
  >(`*[_type == "post"]{ _id, title, excerpt }`);

  console.log(`Migrating ${posts.length} post(s) to article...`);

  for (const post of posts) {
    await client
      .patch(post._id)
      .set({
        _type: "article",
        sourceName: "",
        sourceUrl: "",
        excerpt: post.excerpt ?? post.title ?? "",
      })
      .commit();
  }
}

async function migrateServicesToResources() {
  const services = await client.fetch<Array<{ _id: string }>>(
    `*[_type == "service"]{ _id }`,
  );

  console.log(`Migrating ${services.length} service(s) to resource...`);

  for (const service of services) {
    await client
      .patch(service._id)
      .set({ _type: "resource", resourceType: "business" })
      .commit();
  }
}

async function migratePageBodies() {
  const pages = await client.fetch<
    Array<{
      _id: string;
      body?: unknown[];
      pageBuilder?: unknown[];
    }>
  >(`*[_type == "page"]{ _id, body, pageBuilder }`);

  console.log(`Migrating ${pages.length} page(s)...`);

  for (const page of pages) {
    if (page.pageBuilder?.length) continue;
    if (!page.body?.length) continue;

    await client
      .patch(page._id)
      .set({
        pageBuilder: [
          {
            _type: "richTextBlock",
            _key: `migrated-${page._id}`,
            title: "",
            richText: page.body,
          },
        ],
      })
      .unset(["body"])
      .commit();
  }
}

async function main() {
  await migratePostsToArticles();
  await migrateServicesToResources();
  await migratePageBodies();
  console.log("Migration complete.");
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
