import {
  defineLocations,
  type PresentationPluginOptions,
} from "sanity/presentation";

export const presentationResolve: PresentationPluginOptions["resolve"] = {
  locations: {
    home: defineLocations({
      select: { title: "title" },
      resolve: () => ({
        locations: [{ title: "Home", href: "/" }],
      }),
    }),
    page: defineLocations({
      select: { title: "title", slug: "slug.current" },
      resolve: (doc) => ({
        locations: [
          {
            title: doc?.title || "Untitled",
            href: doc?.slug ? `/${doc.slug}` : "/",
          },
        ],
      }),
    }),
    post: defineLocations({
      select: { title: "title", slug: "slug.current" },
      resolve: (doc) => ({
        locations: [
          {
            title: doc?.title || "Untitled",
            href: doc?.slug ? `/articles/${doc.slug}` : "/articles",
          },
        ],
      }),
    }),
    category: defineLocations({
      select: { title: "title", slug: "slug.current" },
      resolve: (doc) => ({
        locations: [
          {
            title: doc?.title || "Untitled",
            href: doc?.slug ? `/category/${doc.slug}` : "/",
          },
        ],
      }),
    }),
    tag: defineLocations({
      select: { title: "title", slug: "slug.current" },
      resolve: (doc) => ({
        locations: [
          {
            title: doc?.title || "Untitled",
            href: doc?.slug ? `/tag/${doc.slug}` : "/",
          },
        ],
      }),
    }),
  },
};
