import { ImageIcon } from "@sanity/icons";
import { defineField, defineType } from "sanity";

import { buttonsField } from "../common";

export const hero = defineType({
  name: "hero",
  title: "Hero",
  type: "object",
  icon: ImageIcon,
  fields: [
    defineField({
      name: "headline",
      title: "Headline",
      type: "string",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "subheadline",
      title: "Subheadline",
      type: "text",
      rows: 2,
    }),
    defineField({
      name: "image",
      title: "Image",
      type: "image",
      options: { hotspot: true },
      fields: [
        defineField({
          name: "alt",
          title: "Alt Text",
          type: "string",
          validation: (rule) => rule.required(),
        }),
      ],
    }),
    buttonsField,
  ],
  preview: {
    select: { title: "headline", media: "image" },
    prepare({ title, media }) {
      return {
        title: title || "Hero",
        subtitle: "Hero",
        media: media ?? ImageIcon,
      };
    },
  },
});
