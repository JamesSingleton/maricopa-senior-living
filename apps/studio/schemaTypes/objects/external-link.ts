import { LaunchIcon } from "@sanity/icons/Launch";
import { defineField, defineType } from "sanity";

export const externalLink = defineType({
  name: "externalLink",
  title: "External link",
  type: "object",
  icon: LaunchIcon,
  fields: [
    defineField({
      name: "title",
      title: "Title",
      type: "string",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "description",
      title: "Description",
      type: "text",
      rows: 2,
    }),
    defineField({
      name: "url",
      title: "URL",
      type: "url",
      validation: (rule) =>
        rule.required().uri({
          scheme: ["http", "https"],
        }),
    }),
  ],
  preview: {
    select: {
      title: "title",
      url: "url",
    },
    prepare({ title, url }) {
      return {
        title: title || "Untitled link",
        subtitle: url,
        media: LaunchIcon,
      };
    },
  },
});
