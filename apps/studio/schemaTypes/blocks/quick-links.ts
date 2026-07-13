import { LinkIcon } from "@sanity/icons/Link";
import { defineArrayMember, defineField, defineType } from "sanity";

export const quickLinks = defineType({
  name: "quickLinks",
  title: "Quick links",
  type: "object",
  icon: LinkIcon,
  fields: [
    defineField({
      name: "headline",
      title: "Headline",
      type: "string",
      initialValue: "I need help with…",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "intro",
      title: "Intro",
      type: "text",
      rows: 2,
    }),
    defineField({
      name: "links",
      title: "Links",
      type: "array",
      of: [defineArrayMember({ type: "link" })],
      validation: (rule) => rule.min(1),
    }),
  ],
  preview: {
    select: { title: "headline", links: "links" },
    prepare({ title, links }) {
      const count = Array.isArray(links) ? links.length : 0;
      return {
        title: title || "Quick links",
        subtitle: `Quick links · ${count} item${count === 1 ? "" : "s"}`,
        media: LinkIcon,
      };
    },
  },
});
