import { BlockContentIcon } from "@sanity/icons";
import { defineField, defineType } from "sanity";

import { richTextField } from "../common";

export const richTextBlock = defineType({
  name: "richTextBlock",
  title: "Rich Text",
  type: "object",
  icon: BlockContentIcon,
  fields: [
    defineField({
      name: "title",
      title: "Section Title",
      type: "string",
    }),
    richTextField,
  ],
  preview: {
    select: { title: "title" },
    prepare({ title }) {
      return {
        title: title || "Rich Text",
        subtitle: "Rich Text",
        media: BlockContentIcon,
      };
    },
  },
});
