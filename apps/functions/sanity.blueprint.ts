import {
  defineBlueprint,
  defineDocumentFunction,
  defineSyncTagInvalidateFunction,
} from "@sanity/blueprints";

/*
 * These Functions serve the live website, so they target production unless
 * BLUEPRINT_DATASET says otherwise. Deliberately NOT the Studio's
 * SANITY_STUDIO_DATASET (which is "development" locally): deploying from a
 * dev machine must never move the live functions to the test dataset.
 */
const projectId = process.env.SANITY_PROJECT_ID ?? "bksfw1p8";
const dataset = process.env.BLUEPRINT_DATASET ?? "production";

export default defineBlueprint({
  resources: [
    defineSyncTagInvalidateFunction({
      name: "invalidate-tags",
      // Required for organization-scoped stacks
      project: projectId,
      event: {
        resource: {
          type: "dataset",
          id: `${projectId}.${dataset}`,
        },
      },
    }),
    // Keep old web addresses working when a slug changes on publish.
    defineDocumentFunction({
      name: "auto-redirect",
      project: projectId,
      event: {
        on: ["update"],
        filter:
          '_type in ["page", "article", "resource", "event", "topic", "author"] && delta::changedAny(slug.current)',
        projection:
          '{_type, "oldSlug": before().slug.current, "newSlug": after().slug.current}',
        resource: { type: "dataset", id: `${projectId}.${dataset}` },
      },
    }),
    // Redirects are built into the website, so redeploy when they change.
    defineDocumentFunction({
      name: "deploy-on-redirect",
      project: projectId,
      event: {
        on: ["create", "update", "delete"],
        filter: '_type == "redirect"',
        resource: { type: "dataset", id: `${projectId}.${dataset}` },
      },
    }),
  ],
});
