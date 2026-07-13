import {
  defineLocations,
  type PresentationPluginOptions,
} from "sanity/presentation";

export const presentationResolve: PresentationPluginOptions["resolve"] = {
  locations: {
    homePage: defineLocations({
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
    resource: defineLocations({
      select: { title: "title", slug: "slug.current" },
      resolve: (doc) => ({
        locations: [
          {
            title: doc?.title || "Untitled",
            href: doc?.slug ? `/resources/${doc.slug}` : "/resources",
          },
        ],
      }),
    }),
    article: defineLocations({
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
            href: doc?.slug ? `/categories/${doc.slug}` : "/categories",
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
            href: doc?.slug ? `/tags/${doc.slug}` : "/tags",
          },
        ],
      }),
    }),
  },
};
