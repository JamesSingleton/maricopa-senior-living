import {
  defineLocations,
  type PresentationPluginOptions,
} from "sanity/presentation";

/** Public URL for each document type; must match the website's routes. */
const at = (title: string, href: string) => ({ locations: [{ title, href }] });

export const presentationResolve: PresentationPluginOptions["resolve"] = {
  locations: {
    home: defineLocations({
      select: { title: "title" },
      resolve: () => at("Home", "/"),
    }),
    page: defineLocations({
      select: { title: "title", slug: "slug.current" },
      resolve: (doc) => at(doc?.title ?? "Page", `/${doc?.slug}`),
    }),
    article: defineLocations({
      select: { title: "title", slug: "slug.current" },
      resolve: (doc) => at(doc?.title ?? "Article", `/articles/${doc?.slug}`),
    }),
    resource: defineLocations({
      select: { title: "title", slug: "slug.current" },
      resolve: (doc) => at(doc?.title ?? "Resource", `/resources/${doc?.slug}`),
    }),
    event: defineLocations({
      select: { title: "title", slug: "slug.current" },
      resolve: (doc) => at(doc?.title ?? "Event", `/events/${doc?.slug}`),
    }),
    topic: defineLocations({
      select: { title: "title", slug: "slug.current" },
      resolve: (doc) => at(doc?.title ?? "Topic", `/topics/${doc?.slug}`),
    }),
    monthlyUpdate: defineLocations({
      select: { month: "publishMonth" },
      resolve: (doc) =>
        at("What's New", `/whats-new/${String(doc?.month ?? "").slice(0, 7)}`),
    }),
    newsletterEdition: defineLocations({
      select: { month: "publishMonth" },
      resolve: (doc) =>
        at("Newsletter", `/newsletter/${String(doc?.month ?? "").slice(0, 7)}`),
    }),
  },
};
