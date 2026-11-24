import { defineCliConfig } from "sanity/cli";

const projectId = process.env.SANITY_STUDIO_PROJECT_ID;
// Never fall back to production (see sanity.config.ts).
const dataset = process.env.SANITY_STUDIO_DATASET ?? "development";

export default defineCliConfig({
  api: {
    projectId,
    dataset,
  },
  schemaExtraction: {
    enabled: true,
    enforceRequiredFields: true,
  },
  typegen: {
    enabled: true,
    formatGeneratedCode: true,
    path: "../../packages/sanity/src/**/*.{ts,tsx,js,jsx}",
    schema: "schema.json",
    generates: "../../packages/sanity/src/types.ts",
    overloadClientMethods: true,
  },
});
