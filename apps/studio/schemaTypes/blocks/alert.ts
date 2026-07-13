import { WarningOutlineIcon } from "@sanity/icons/WarningOutline";
import { defineArrayMember, defineField, defineType } from "sanity";

import { createRadioListLayout } from "../../utils/helper";

export const alert = defineType({
  name: "alert",
  title: "Alert",
  type: "object",
  icon: WarningOutlineIcon,
  fields: [
    defineField({
      name: "severity",
      title: "Severity",
      type: "string",
      options: createRadioListLayout([
        { title: "Info", value: "info" },
        { title: "Warning", value: "warning" },
        { title: "Urgent", value: "urgent" },
      ]),
      initialValue: "warning",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "headline",
      title: "Headline",
      type: "string",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "body",
      title: "Body",
      type: "text",
      rows: 3,
      validation: (rule) => rule.required(),
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
    select: { title: "headline", severity: "severity" },
    prepare({ title, severity }) {
      return {
        title: title || "Alert",
        subtitle: `Alert · ${severity || "warning"}`,
        media: WarningOutlineIcon,
      };
    },
  },
});
