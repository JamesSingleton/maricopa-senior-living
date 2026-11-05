/**
 * Development-only patch: resource addresses from free text to the
 * `postalAddress` object. Anything that can't be split is kept as the street
 * line and flagged "Needs review".
 *
 *   node --env-file=../web/.env.local scripts/migrate/patch-2026-11-06.ts
 */
import { createClient } from "@sanity/client";

import { parseAddress } from "./convert.ts";

const dev = createClient({
  projectId: "bksfw1p8",
  dataset: "development",
  apiVersion: "2025-02-19",
  token: process.env.SANITY_API_WRITE_TOKEN,
  useCdn: false,
});
if (dev.config().dataset !== "development")
  throw new Error("Refusing: not development");

// Free-text addresses, plus earlier attempts that couldn't find the city.
const docs = (
  await dev.fetch<
    { _id: string; address: string | { street?: string; city?: string } }[]
  >(
    '*[_type == "resource" && defined(address) && !(_id in path("drafts.**"))]{_id, address}',
  )
)
  .map((d) => ({
    _id: d._id,
    address:
      typeof d.address === "string"
        ? d.address
        : d.address.city
          ? ""
          : (d.address.street ?? ""),
  }))
  .filter((d) => d.address);
const tx = dev.transaction();
let parsed = 0;
let flagged = 0;
let cleared = 0;
for (const doc of docs) {
  if (typeof doc.address !== "string") continue;
  const result = parseAddress(doc.address);
  if (!result) {
    tx.patch(doc._id, (p) => p.unset(["address"]));
    cleared++;
    continue;
  }
  tx.patch(doc._id, (p) => {
    const patch = p.set({ address: result.address });
    return result.parsed ? patch : patch.set({ needsReview: true });
  });
  result.parsed ? parsed++ : flagged++;
}
console.log(
  `Addresses: ${parsed} split, ${flagged} flagged for review, ${cleared} empty removed`,
);
await tx.commit();
