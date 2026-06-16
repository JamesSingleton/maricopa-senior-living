import { BookIcon } from "@sanity/icons";
import { defineArrayMember, defineField, defineType } from "sanity";

export const featuredResources = defineType({
  name: "featuredResources",
  title: "Featured Resources",
  type: "object",
  icon: BookIcon,
  fields: [
    defineField({
      name: "title",
      title: "Section Title",
      type: "string",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "resources",
      title: "Resources",
      type: "array",
      of: [
        defineArrayMember({ type: "reference", to: [{ type: "resource" }] }),
      ],
      validation: (rule) => rule.required().min(1),
    }),
  ],
  preview: {
    select: { title: "title", resources: "resources" },
    prepare({ title, resources = [] }) {
      return {
        title: title || "Featured Resources",
        subtitle: `Featured Resources • ${resources.length} item${resources.length === 1 ? "" : "s"}`,
        media: BookIcon,
      };
    },
  },
});
