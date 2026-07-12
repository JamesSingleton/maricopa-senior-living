import {
  defineBlueprint,
  defineSyncTagInvalidateFunction,
} from "@sanity/blueprints";

// Matches apps/web/sanity.cli.ts. Sanity CLI does not load .env files.
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
