import { HomeIcon } from "@sanity/icons/Home";
import { TagsIcon } from "@sanity/icons/Tags";
import { visionTool } from "@sanity/vision";
import { defineConfig, defineSingleton } from "sanity";
import { presentationTool } from "sanity/presentation";
import { structureTool } from "sanity/structure";

import { StartHere } from "./components/StartHere";
import { TopicsTool } from "./components/TopicsTool";
import { ADMIN_ONLY_TYPES, isAdmin } from "./lib/access";
import { presentationResolve } from "./presentation/resolve";
import { schemaTypes } from "./schemaTypes";
import { structure } from "./structure";
import {
  newsletterNextTemplate,
  pageTemplates,
  startNextMonthTemplate,
} from "./templates";

const projectId = process.env.SANITY_STUDIO_PROJECT_ID ?? "bksfw1p8";
// Never fall back to production: a missing env var must not point Ron's
// test edits (or a migration) at the live site.
const dataset = process.env.SANITY_STUDIO_DATASET ?? "development";

/**
 * Ron may publish and undo changes on singletons, but not delete or
 * unpublish them (the built-in registry only removes Duplicate).
 */
const SINGLETON_ACTIONS = new Set(["publish", "discardChanges", "restore"]);

/** Monthly types are created from "Start next month", never from scratch. */
const STARTED_FROM_TEMPLATE = new Set(["monthlyUpdate", "newsletterEdition"]);

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
      ...previous,
      startNextMonthTemplate,
      newsletterNextTemplate,
      ...pageTemplates,
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
    {
      name: "topics",
      title: "Topics",
      icon: TagsIcon,
      component: TopicsTool,
    },
  ],
  document: {
    // Fixed-ID documents: no "Create new", no Duplicate, edited in place.
    singletons: [
      defineSingleton({
        documentId: "home",
        schemaType: "home",
        title: "Home page",
      }),
      defineSingleton({
        documentId: "settings",
        schemaType: "settings",
        title: "Site settings",
      }),
      defineSingleton({
        documentId: "navigation",
        schemaType: "navigation",
        title: "Menus",
      }),
    ],
    // Ron's "Create new" menu only offers content, never structure.
    newDocumentOptions: (previous, { currentUser, creationContext }) => {
      const filtered = previous.filter(
        (item) =>
          !(
            STARTED_FROM_TEMPLATE.has(item.templateId) &&
            creationContext.type === "global"
          ),
      );
      return isAdmin(currentUser)
        ? filtered
        : filtered.filter((item) => !ADMIN_ONLY_TYPES.has(item.templateId));
    },
    actions: (previous, { singleton, schemaType, currentUser }) => {
      if (singleton) {
        return isAdmin(currentUser)
          ? previous
          : previous.filter(
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
