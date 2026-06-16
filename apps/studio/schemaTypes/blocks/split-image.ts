import { BlockElementIcon } from "@sanity/icons";
import { defineField, defineType } from "sanity";

import { createRadioListLayout } from "../../utils/helper";
import { richTextField } from "../common";

export const splitImage = defineType({
  name: "splitImage",
  title: "Split Image",
  type: "object",
  icon: BlockElementIcon,
  fields: [
    defineField({
      name: "title",
      title: "Section Title",
      type: "string",
    }),
    defineField({
      name: "orientation",
      title: "Image Position",
      type: "string",
      options: createRadioListLayout([
        { title: "Image Left", value: "imageLeft" },
        { title: "Image Right", value: "imageRight" },
      ]),
      initialValue: "imageLeft",
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
      validation: (rule) => rule.required(),
    }),
    richTextField,
  ],
  preview: {
    select: { title: "title", media: "image", orientation: "orientation" },
    prepare({ title, media, orientation }) {
      return {
        title: title || "Split Image",
        subtitle: `Split Image • ${orientation === "imageRight" ? "Image Right" : "Image Left"}`,
        media: media ?? BlockElementIcon,
      };
    },
  },
});
