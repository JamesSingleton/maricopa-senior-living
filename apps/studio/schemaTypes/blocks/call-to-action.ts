import { BulbOutlineIcon } from "@sanity/icons";
import { defineField, defineType } from "sanity";

import { buttonsField } from "../common";

export const callToAction = defineType({
  name: "callToAction",
  title: "Call to Action",
  type: "object",
  icon: BulbOutlineIcon,
  fields: [
    defineField({
      name: "headline",
      title: "Headline",
      type: "string",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "description",
      title: "Description",
      type: "text",
      rows: 3,
    }),
    buttonsField,
  ],
  preview: {
    select: { title: "headline" },
    prepare({ title }) {
      return {
        title: title || "Call to Action",
        subtitle: "Call to Action",
        media: BulbOutlineIcon,
      };
    },
  },
});
