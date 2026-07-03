import { assist } from "@sanity/assist";
import { dashboardTool } from "@sanity/dashboard";
import { visionTool } from "@sanity/vision";
import { defineConfig } from "sanity";
import { presentationTool } from "sanity/presentation";
import { structureTool } from "sanity/structure";
import { media } from "sanity-plugin-media";

import { studioOverviewWidget } from "./plugins/dashboard-widgets";
import { schemaTypes } from "./schemaTypes";
import { structure } from "./structure";

const projectId = process.env.SANITY_STUDIO_PROJECT_ID ?? "";
const dataset = process.env.SANITY_STUDIO_DATASET;
const title = process.env.SANITY_STUDIO_TITLE;
const previewOrigin =
  process.env.SANITY_STUDIO_PREVIEW_ORIGIN ?? "http://localhost:3000";

export default defineConfig({
  name: "default",
  title,
  projectId,
  dataset: dataset ?? "production",
  schema: {
    types: schemaTypes,
  },
  plugins: [
    structureTool({ structure }),
    dashboardTool({
      widgets: [studioOverviewWidget],
    }),
    presentationTool({
      previewUrl: {
        origin: previewOrigin,
        previewMode: {
          enable: "/api/draft-mode/enable",
        },
      },
      resolve: {
        locations: {
          homePage: {
            select: { title: "title" },
            resolve: () => ({
              locations: [{ title: "Home", href: "/" }],
            }),
          },
          article: {
            select: { title: "title", slug: "slug.current" },
            resolve: (doc) => ({
              locations: doc?.slug
                ? [{ title: doc.title ?? "Article", href: `/articles/${doc.slug}` }]
                : { locations: [] },
            }),
          },
          guide: {
            select: { title: "title", slug: "slug.current" },
            resolve: (doc) => ({
              locations: doc?.slug
                ? [{ title: doc.title ?? "Guide", href: `/guides/${doc.slug}` }]
                : { locations: [] },
            }),
          },
          resource: {
            select: { title: "title", slug: "slug.current" },
            resolve: (doc) => ({
              locations: doc?.slug
                ? [{ title: doc.title ?? "Resource", href: `/resources/${doc.slug}` }]
                : { locations: [] },
            }),
          },
          page: {
            select: { title: "title", slug: "slug.current" },
            resolve: (doc) => ({
              locations: doc?.slug
                ? [{ title: doc.title ?? "Page", href: `/${doc.slug}` }]
                : { locations: [] },
            }),
          },
          category: {
            select: { title: "title", slug: "slug.current" },
            resolve: (doc) => ({
              locations: doc?.slug
                ? [{ title: doc.title ?? "Category", href: `/category/${doc.slug}` }]
                : { locations: [] },
            }),
          },
          tag: {
            select: { title: "title", slug: "slug.current" },
            resolve: (doc) => ({
              locations: doc?.slug
                ? [{ title: doc.title ?? "Tag", href: `/tags/${doc.slug}` }]
                : { locations: [] },
            }),
          },
        },
      },
    }),
    visionTool(),
    media(),
    assist(),
  ],
});
