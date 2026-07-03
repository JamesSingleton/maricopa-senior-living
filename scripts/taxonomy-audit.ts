/**
 * Audits category and tag taxonomy for duplicates, orphans, and low-use tags.
 *
 * Usage: pnpm tsx scripts/taxonomy-audit.ts
 * Requires SANITY_STUDIO_PROJECT_ID, SANITY_STUDIO_DATASET, SANITY_API_READ_TOKEN
 */
import { createClient } from "@sanity/client";

const projectId = process.env.SANITY_STUDIO_PROJECT_ID;
const dataset = process.env.SANITY_STUDIO_DATASET ?? "production";
const token = process.env.SANITY_API_READ_TOKEN;

if (!projectId || !token) {
  console.error("Set SANITY_STUDIO_PROJECT_ID and SANITY_API_READ_TOKEN");
  process.exit(1);
}

const client = createClient({ projectId, dataset, token, apiVersion: "2025-02-10" });

type TaxonomyDoc = {
  _id: string;
  title: string;
  slug: string;
  refCount: number;
};

function normalizeTitle(title: string) {
  return title.toLowerCase().replace(/[^a-z0-9]+/g, " ").trim();
}

async function main() {
  const categories = await client.fetch<TaxonomyDoc[]>(`
    *[_type == "category"]{
      _id, title, "slug": slug.current,
      "refCount": count(*[_type in ["resource", "article", "guide"] && references(^._id)])
    } | order(title asc)
  `);

  const tags = await client.fetch<TaxonomyDoc[]>(`
    *[_type == "tag"]{
      _id, title, "slug": slug.current,
      "refCount": count(*[_type in ["resource", "article", "guide"] && references(^._id)])
    } | order(title asc)
  `);

  console.log(`\nCategories: ${categories.length} (target: 15–25)`);
  console.log(`Tags: ${tags.length} (target: 30–50)\n`);

  const dupes = new Map<string, TaxonomyDoc[]>();
  for (const tag of tags) {
    const key = normalizeTitle(tag.title);
    const group = dupes.get(key) ?? [];
    group.push(tag);
    dupes.set(key, group);
  }

  const duplicateGroups = [...dupes.values()].filter((g) => g.length > 1);
  if (duplicateGroups.length) {
    console.log("=== Likely duplicate tags (normalized title match) ===");
    for (const group of duplicateGroups) {
      console.log(
        group.map((t) => `  - ${t.title} (${t.slug}, ${t.refCount} refs)`).join("\n"),
      );
      console.log("");
    }
  }

  const orphanTags = tags.filter((t) => t.refCount === 0);
  console.log(`=== Orphan tags (0 refs): ${orphanTags.length} ===`);
  orphanTags.slice(0, 20).forEach((t) => console.log(`  - ${t.title} (${t.slug})`));
  if (orphanTags.length > 20) console.log(`  … and ${orphanTags.length - 20} more`);

  const lowUseTags = tags.filter((t) => t.refCount > 0 && t.refCount < 3);
  console.log(`\n=== Tags with 1–2 refs (no public page): ${lowUseTags.length} ===`);
  lowUseTags.slice(0, 15).forEach((t) =>
    console.log(`  - ${t.title} (${t.refCount} refs)`),
  );

  const emptyCategories = categories.filter((c) => c.refCount === 0);
  console.log(`\n=== Categories with no content: ${emptyCategories.length} ===`);
  emptyCategories.forEach((c) => console.log(`  - ${c.title} (${c.slug})`));
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
