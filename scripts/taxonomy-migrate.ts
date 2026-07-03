/**
 * Merges duplicate tags/categories by canonical slug and patches references.
 *
 * Usage: pnpm tsx scripts/taxonomy-migrate.ts --dry-run
 *        pnpm tsx scripts/taxonomy-migrate.ts --apply
 *
 * Edit MERGE_MAP below with audit results before running --apply.
 */
import { createClient } from "@sanity/client";

const projectId = process.env.SANITY_STUDIO_PROJECT_ID;
const dataset = process.env.SANITY_STUDIO_DATASET ?? "production";
const token = process.env.SANITY_API_WRITE_TOKEN;

const dryRun = !process.argv.includes("--apply");

/** Map duplicate _id → canonical _id */
const MERGE_MAP: Record<string, string> = {
  // Example: "drafts.tag-dupe-id": "tag-canonical-id",
};

if (!projectId || !token) {
  console.error("Set SANITY_STUDIO_PROJECT_ID and SANITY_API_WRITE_TOKEN");
  process.exit(1);
}

const client = createClient({ projectId, dataset, token, apiVersion: "2025-02-10" });

async function repointReferences(fromId: string, toId: string) {
  const docs = await client.fetch<{ _id: string; _type: string }[]>(
    `*[references($fromId)]{ _id, _type }`,
    { fromId },
  );
  for (const doc of docs) {
    const full = await client.getDocument(doc._id);
    if (!full) continue;
    const patch = client.patch(doc._id);
    let changed = false;
    for (const [key, value] of Object.entries(full)) {
      if (key.startsWith("_")) continue;
      if (value === fromId) {
        patch.set({ [key]: { _type: "reference", _ref: toId } });
        changed = true;
      }
      if (Array.isArray(value)) {
        const updated = value.map((item) => {
          if (item?._ref === fromId) {
            changed = true;
            return { ...item, _ref: toId };
          }
          return item;
        });
        if (changed) patch.set({ [key]: updated });
      }
    }
    if (changed) {
      console.log(`${dryRun ? "[dry-run] " : ""}Patch ${doc._id} (${doc._type})`);
      if (!dryRun) await patch.commit();
    }
  }
  console.log(`${dryRun ? "[dry-run] " : ""}Delete duplicate ${fromId}`);
  if (!dryRun) await client.delete(fromId);
}

async function main() {
  const entries = Object.entries(MERGE_MAP);
  if (!entries.length) {
    console.log("MERGE_MAP is empty. Run taxonomy-audit.ts first and populate merges.");
    return;
  }
  for (const [fromId, toId] of entries) {
    await repointReferences(fromId, toId);
  }
  console.log(dryRun ? "\nDry run complete. Pass --apply to execute." : "\nMigration complete.");
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
