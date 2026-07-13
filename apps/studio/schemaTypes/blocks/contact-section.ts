import { EnvelopeIcon } from "@sanity/icons/Envelope";
import { defineArrayMember, defineField, defineType } from "sanity";

export const contactSection = defineType({
  name: "contactSection",
  title: "Contact section",
  type: "object",
  icon: EnvelopeIcon,
  fields: [
    defineField({
      name: "headline",
      title: "Headline",
      type: "string",
      initialValue: "Get in touch",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "intro",
      title: "Intro",
      type: "portableText",
    }),
    defineField({
      name: "phone",
      title: "Phone override",
      type: "string",
      description: "Optional. Falls back to site settings when empty.",
    }),
    defineField({
      name: "email",
      title: "Email override",
      type: "string",
      validation: (rule) => rule.email(),
      description: "Optional. Falls back to site settings when empty.",
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
    select: { title: "headline", phone: "phone", email: "email" },
    prepare({ title, phone, email }) {
      return {
        title: title || "Contact section",
        subtitle:
          [phone, email].filter(Boolean).join(" · ") || "Contact section",
        media: EnvelopeIcon,
      };
    },
  },
});
