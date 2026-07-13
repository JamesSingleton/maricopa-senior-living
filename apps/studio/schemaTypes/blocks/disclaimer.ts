import { InfoOutlineIcon } from "@sanity/icons/InfoOutline";
import { defineField, defineType } from "sanity";

import { createRadioListLayout } from "../../utils/helper";

export const disclaimer = defineType({
  name: "disclaimer",
  title: "Disclaimer",
  type: "object",
  icon: InfoOutlineIcon,
  fields: [
    defineField({
      name: "tone",
      title: "Tone",
      type: "string",
      options: createRadioListLayout([
        { title: "Info", value: "info" },
        { title: "Warning", value: "warning" },
      ]),
      initialValue: "info",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "title",
      title: "Title",
      type: "string",
    }),
    defineField({
      name: "body",
      title: "Body",
      type: "portableText",
      validation: (rule) => rule.required(),
    }),
  ],
  preview: {
    select: { title: "title", tone: "tone" },
    prepare({ title, tone }) {
      return {
        title: title || "Disclaimer",
        subtitle: `Disclaimer · ${tone || "info"}`,
        media: InfoOutlineIcon,
      };
    },
  },
});
