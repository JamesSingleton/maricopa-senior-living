"use client";
import { assist } from "@sanity/assist";
import { visionTool } from "@sanity/vision";
import { defineConfig } from "sanity";
import { structureTool } from "sanity/structure";
import { media } from "sanity-plugin-media";

import { dataset, projectId } from "./lib/sanity.api";
import schemaTypes from "./sanity/schemaTypes";
import { structure } from "./sanity/studio-structure";

export default defineConfig({
  title: "Maricopa Senior Living",
  basePath: "/admin",
  projectId,
  dataset,
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
