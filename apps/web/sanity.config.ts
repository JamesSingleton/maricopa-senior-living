"use client";
import { assist } from "@sanity/assist";
import { visionTool } from "@sanity/vision";
import { defineConfig } from "sanity";
import { structureTool } from "sanity/structure";
import { media } from "sanity-plugin-media";
import { env } from "@maricopa-senior-living/env/client";

import schemaTypes from "./sanity/schemaTypes";
import { structure } from "./sanity/studio-structure";

export default defineConfig({
  title: "Maricopa Senior Living",
  basePath: "/admin",
  projectId: env.NEXT_PUBLIC_SANITY_PROJECT_ID,
  dataset: env.NEXT_PUBLIC_SANITY_DATASET,
  schema: {
    types: schemaTypes,
  },
  mediaLibrary: {
    enabled: true,
  },
  plugins: [
    structureTool({
      structure,
    }) as any,
    media({
      creditLine: {
        enabled: true,
      },
    }),
    visionTool(),
    assist(),
  ],
});
