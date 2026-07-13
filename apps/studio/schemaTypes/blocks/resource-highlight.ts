import { CaseIcon } from "@sanity/icons/Case";
import { defineArrayMember, defineField, defineType } from "sanity";

export const resourceHighlight = defineType({
  name: "resourceHighlight",
  title: "Resource highlight",
  type: "object",
  icon: CaseIcon,
  fields: [
    defineField({
      name: "headline",
      title: "Headline",
      type: "string",
      initialValue: "Featured resources",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "intro",
      title: "Intro",
      type: "text",
      rows: 2,
    }),
    defineField({
      name: "resources",
      title: "Resources",
      type: "array",
      of: [
        defineArrayMember({ type: "reference", to: [{ type: "resource" }] }),
      ],
      validation: (rule) => rule.min(1),
    }),
  ],
  preview: {
    select: { title: "headline", resources: "resources" },
    prepare({ title, resources }) {
      const count = Array.isArray(resources) ? resources.length : 0;
      return {
        title: title || "Featured resources",
        subtitle: `Resource highlight · ${count} resource${count === 1 ? "" : "s"}`,
        media: CaseIcon,
      };
    },
  },
});
