import {
  defineBlueprint,
  defineSyncTagInvalidateFunction,
} from "@sanity/blueprints";

// Sanity CLI does not load .env files. The functions serve the live site, so
// they default to production; set SANITY_STUDIO_DATASET to test elsewhere.
const projectId =
  process.env.SANITY_STUDIO_PROJECT_ID ??
  process.env.NEXT_PUBLIC_SANITY_PROJECT_ID ??
  "bksfw1p8";
const dataset =
  process.env.SANITY_STUDIO_DATASET ??
  process.env.NEXT_PUBLIC_SANITY_DATASET ??
  "production";

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
  ],
});
