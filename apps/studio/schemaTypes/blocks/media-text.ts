import { ImageIcon } from "@sanity/icons/Image";
import { defineArrayMember, defineField, defineType } from "sanity";

import { createRadioListLayout } from "../../utils/helper";

export const mediaText = defineType({
  name: "mediaText",
  title: "Media and text",
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
      name: "body",
      title: "Body",
      type: "portableText",
    }),
    defineField({
      name: "image",
      title: "Image",
      type: "image",
      options: { hotspot: true },
      fields: [
        defineField({
          name: "alt",
          title: "Alternative text",
          type: "string",
          validation: (rule) => rule.required(),
        }),
      ],
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "mediaPlacement",
      title: "Media placement",
      type: "string",
      options: createRadioListLayout([
        { title: "Media first", value: "start" },
        { title: "Media last", value: "end" },
      ]),
      initialValue: "start",
    }),
    defineField({
      name: "actions",
      title: "Actions",
      type: "array",
      of: [defineArrayMember({ type: "link" })],
      validation: (rule) => rule.max(2),
    }),
  ],
  preview: {
    select: { title: "headline", media: "image" },
    prepare({ title, media }) {
      return {
        title: title || "Untitled",
        subtitle: "Media and text",
        media: media ?? ImageIcon,
      };
    },
  },
});
