import { CommentIcon } from "@sanity/icons/Comment";
import { defineField, defineType } from "sanity";

export const testimonial = defineType({
  name: "testimonial",
  title: "Testimonial",
  type: "object",
  icon: CommentIcon,
  fields: [
    defineField({
      name: "quote",
      title: "Quote",
      type: "text",
      rows: 4,
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "attribution",
      title: "Attribution",
      type: "string",
      description: "Name of the person sharing the quote.",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "role",
      title: "Role",
      type: "string",
      description: "e.g. Resident, Caregiver, Community partner",
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
        }),
      ],
    }),
  ],
  preview: {
    select: { title: "attribution", subtitle: "quote", media: "image" },
    prepare({ title, subtitle, media }) {
      return {
        title: title || "Testimonial",
        subtitle: subtitle
          ? `Testimonial · ${subtitle.slice(0, 60)}${subtitle.length > 60 ? "…" : ""}`
          : "Testimonial",
        media: media ?? CommentIcon,
      };
    },
  },
});
