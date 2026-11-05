import { HomeIcon } from "@sanity/icons/Home";
import { visionTool } from "@sanity/vision";
import { defineConfig } from "sanity";
import { presentationTool } from "sanity/presentation";
import { structureTool } from "sanity/structure";

import { StartHere } from "./components/StartHere";
import {
  ADMIN_ONLY_TYPES,
  isAdmin,
  SINGLETON_TYPES,
} from "./lib/access";
import { presentationResolve } from "./presentation/resolve";
import { schemaTypes } from "./schemaTypes";
import { structure } from "./structure";
import { newsletterNextTemplate, startNextMonthTemplate } from "./templates";

const projectId = process.env.SANITY_STUDIO_PROJECT_ID ?? "bksfw1p8";
// Never fall back to production: a missing env var must not point Ron's
// test edits (or a migration) at the live site.
const dataset = process.env.SANITY_STUDIO_DATASET ?? "development";

const SINGLETON_ACTIONS = new Set(["publish", "discardChanges", "restore"]);

export default defineConfig({
  name: "default",
  title:
    process.env.SANITY_STUDIO_TITLE ??
    (dataset === "production"
      ? "Maricopa Senior Living"
      : `Maricopa Senior Living (${dataset})`),
  projectId,
  dataset,
  schema: {
    types: schemaTypes,
    templates: (previous) => [
      ...previous.filter(
        (template) =>
          !SINGLETON_TYPES.has(template.schemaType) &&
          template.schemaType !== "topic",
      ),
      startNextMonthTemplate,
      newsletterNextTemplate,
    ],
  },
  tools: (previous, { currentUser }) => [
    {
      name: "start-here",
      title: "Start here",
      icon: HomeIcon,
      component: StartHere,
    },
    // The query tool is for James only.
    ...(isAdmin(currentUser)
      ? previous
      : previous.filter((tool) => tool.name !== "vision")),
  ],
  document: {
    // Ron's "Create new" menu only offers content, never structure.
    newDocumentOptions: (previous, { currentUser, creationContext }) => {
      const filtered = previous.filter(
        (item) =>
          !SINGLETON_TYPES.has(item.templateId) &&
          !(item.templateId === "monthlyUpdate" && creationContext.type === "global") &&
          !(item.templateId === "newsletterEdition" && creationContext.type === "global"),
      );
      return isAdmin(currentUser)
        ? filtered
        : filtered.filter((item) => !ADMIN_ONLY_TYPES.has(item.templateId));
    },
    actions: (previous, { schemaType, currentUser }) => {
      if (SINGLETON_TYPES.has(schemaType)) {
        return previous.filter(
          (action) => action.action && SINGLETON_ACTIONS.has(action.action),
        );
      }
      if (ADMIN_ONLY_TYPES.has(schemaType) && !isAdmin(currentUser)) {
        return [];
      }
      return previous;
    },
  },
  plugins: [
    structureTool({ structure, title: "Content" }),
    presentationTool({
      title: "Preview",
      resolve: presentationResolve,
      previewUrl: {
        origin:
          process.env.SANITY_STUDIO_PREVIEW_ORIGIN ?? "http://localhost:3000",
        previewMode: { enable: "/api/draft-mode/enable" },
      },
    }),
    visionTool({ defaultDataset: dataset }),
  ],
});
