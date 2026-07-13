import { SearchIcon } from "@sanity/icons/Search";
import { defineField, defineType } from "sanity";

export const seo = defineType({
  name: "seo",
  title: "SEO",
  type: "object",
  icon: SearchIcon,
  fields: [
    defineField({
      name: "title",
      title: "Title",
      type: "string",
      description:
        "Overrides the page title in search results and social shares.",
      validation: (rule) => rule.max(70).warning("Keep under 70 characters"),
    }),
    defineField({
      name: "description",
      title: "Description",
      type: "text",
      rows: 3,
      description: "Short summary for search engines and social shares.",
      validation: (rule) => rule.max(160).warning("Keep under 160 characters"),
    }),
    defineField({
      name: "image",
      title: "Social image",
      type: "image",
      description: "Image for social sharing (1200×630 recommended).",
      options: { hotspot: true },
      fields: [
        defineField({
          name: "alt",
          title: "Alternative text",
          type: "string",
        }),
      ],
    }),
    defineField({
      name: "noIndex",
      title: "Hide from search engines",
      type: "boolean",
      description: "When enabled, this content will not be indexed.",
      initialValue: false,
    }),
  ],
});
