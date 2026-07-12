"use client";
import { env } from "@maricopa-senior-living/env/client";
import { assist } from "@sanity/assist";
import { visionTool } from "@sanity/vision";
import { defineConfig } from "sanity";
import { presentationTool } from "sanity/presentation";
import { structureTool } from "sanity/structure";
import { media } from "sanity-plugin-media";

import { presentationResolve } from "./sanity/presentation/resolve";
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
    presentationTool({
      resolve: presentationResolve,
      previewUrl: {
        origin:
          process.env.SANITY_STUDIO_PREVIEW_ORIGIN ??
          env.NEXT_PUBLIC_VERCEL_PROJECT_PRODUCTION_URL,
        previewMode: {
          enable: "/api/draft-mode/enable",
        },
      },
    }),
    media({
      creditLine: {
        enabled: true,
      },
    }),
    visionTool(),
    assist(),
  ],
});
