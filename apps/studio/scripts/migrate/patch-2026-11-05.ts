/**
 * One-off patch of the development dataset for the 2026-11-05 model changes:
 * - monthly documents: `month` ("2026-11") → `publishMonth` date ("2026-11-01")
 * - pages: no more `section`; "Who We Are" becomes the /about page and links
 *   to the other nonprofit pages, which now live at /<slug>
 * - redirects: /about/<slug> destinations → /<slug>
 * - resources: drop generic phone labels such as "Phone"
 *
 *   node --env-file=../web/.env.local scripts/migrate/patch-2026-11-05.ts
 */
import { createClient } from "@sanity/client";

const dev = createClient({
  projectId: "bksfw1p8",
  dataset: "development",
  apiVersion: "2025-02-19",
  token: process.env.SANITY_API_WRITE_TOKEN,
  useCdn: false,
});
if (dev.config().dataset !== "development")
  throw new Error("Refusing: not development");

// biome-ignore lint/suspicious/noExplicitAny: loose documents
type Doc = Record<string, any>;
const tx = dev.transaction();
let ops = 0;

// 1. Monthly documents
const monthly = await dev.fetch<Doc[]>(
  '*[_type in ["monthlyUpdate", "newsletterEdition"] && defined(month) && !(_id in path("drafts.**"))]{_id, month}',
);
for (const doc of monthly) {
  tx.patch(doc._id, (p) =>
    p.set({ publishMonth: `${doc.month}-01` }).unset(["month"]),
  );
  ops++;
}

// 2. Pages
const pages = await dev.fetch<Doc[]>(
  '*[_type == "page" && !(_id in path("drafts.**"))]{_id, title, "slug": slug.current, section, sections}',
);
const formerAbout = pages.filter(
  (p) => p.section === "about" && p.slug !== "who-we-are",
);
for (const page of pages) {
  if (page.section) {
    tx.patch(page._id, (p) => p.unset(["section"]));
    ops++;
  }
}
const whoWeAre = pages.find((p) => p.slug === "who-we-are");
if (whoWeAre) {
  const hasLinks = (whoWeAre.sections ?? []).some(
    (s: Doc) => s._key === "about-more",
  );
  tx.patch(whoWeAre._id, (p) => {
    let patch = p.set({
      slug: { _type: "slug", current: "about" },
      title: "About us",
    });
    if (!hasLinks && formerAbout.length) {
      patch = patch.append("sections", [
        {
          _type: "buttonsBlock",
          _key: "about-more",
          heading: "More about Maricopa Senior Living",
          buttons: formerAbout.map((page, index) => ({
            _type: "link",
            _key: `about-more-${index}`,
            label: page.title,
            kind: "internal",
            reference: { _type: "reference", _ref: page._id },
          })),
        },
      ]);
    }
    return patch;
  });
  ops++;
}

// 3. Redirects
const redirects = await dev.fetch<Doc[]>(
  '*[_type == "redirect" && destination match "/about/*"]{_id, destination}',
);
for (const r of redirects) {
  const slug = r.destination.replace(/^\/about\//, "");
  tx.patch(r._id, (p) =>
    p.set({ destination: slug === "who-we-are" ? "/about" : `/${slug}` }),
  );
  ops++;
}

// 4. Generic phone labels add nothing next to a "Call" button.
const GENERIC =
  /^(phone|phone number|tel|telephone|main|main phone|office|call|number)$/i;
const resources = await dev.fetch<Doc[]>(
  '*[_type == "resource" && count(phones[defined(label)]) > 0]{_id, phones}',
);
for (const r of resources) {
  const generic = (r.phones as Doc[]).filter(
    (p) => p.label && GENERIC.test(p.label.trim()),
  );
  if (!generic.length) continue;
  tx.patch(r._id, (p) =>
    p.unset(generic.map((g) => `phones[_key=="${g._key}"].label`)),
  );
  ops++;
}

console.log(`Applying ${ops} patches to development…`);
await tx.commit();
console.log("Done.");
