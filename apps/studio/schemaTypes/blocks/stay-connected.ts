import { EnvelopeIcon } from "@sanity/icons/Envelope";
import { defineArrayMember, defineField, defineType } from "sanity";

export const stayConnected = defineType({
  name: "stayConnected",
  title: "Stay connected",
  type: "object",
  icon: EnvelopeIcon,
  fields: [
    defineField({
      name: "headline",
      title: "Headline",
      type: "string",
      initialValue: "Stay connected",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "body",
      title: "Supporting text",
      type: "text",
      rows: 3,
      description: "Invite people to join the newsletter or community updates.",
    }),
    defineField({
      name: "actions",
      title: "Actions",
      type: "array",
      of: [defineArrayMember({ type: "link" })],
      validation: (rule) => rule.max(2),
    }),
    defineField({
      name: "embedPlaceholder",
      title: "Embed placeholder ID",
      type: "string",
      description:
        "Optional form or newsletter embed ID for the frontend to wire up later.",
    }),
  ],
  preview: {
    select: { title: "headline" },
    prepare({ title }) {
      return {
        title: title || "Stay connected",
        subtitle: "Stay connected",
        media: EnvelopeIcon,
      };
    },
  },
});
