import { assist } from "@sanity/assist";
import { visionTool } from "@sanity/vision";
import { defineConfig } from "sanity";
import { presentationTool } from "sanity/presentation";
import { structureTool } from "sanity/structure";
import { media } from "sanity-plugin-media";

import { presentationResolve } from "./presentation/resolve";
import { schemaTypes } from "./schemaTypes";
import { structure } from "./structure";

const projectId = process.env.SANITY_STUDIO_PROJECT_ID ?? "";
const dataset = process.env.SANITY_STUDIO_DATASET;
const title = process.env.SANITY_STUDIO_TITLE;

export default defineConfig({
  name: "default",
  title,
  projectId,
  dataset: dataset ?? "production",
  schema: {
    types: schemaTypes,
  },
  plugins: [
    structureTool({
      structure,
    }),
    presentationTool({
      resolve: presentationResolve,
      previewUrl: {
        origin:
          process.env.SANITY_STUDIO_PREVIEW_ORIGIN ?? "http://localhost:3000",
        previewMode: {
          enable: "/api/draft-mode/enable",
        },
      },
    }),
    visionTool(),
    media(),
    assist(),
  ],
});
