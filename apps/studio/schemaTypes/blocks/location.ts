import { PinIcon } from "@sanity/icons/Pin";
import { defineArrayMember, defineField, defineType } from "sanity";

export const location = defineType({
  name: "location",
  title: "Location",
  type: "object",
  icon: PinIcon,
  fields: [
    defineField({
      name: "headline",
      title: "Headline",
      type: "string",
      initialValue: "Find us in Maricopa",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "address",
      title: "Address",
      type: "text",
      rows: 3,
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "hours",
      title: "Hours",
      type: "array",
      of: [defineArrayMember({ type: "dayAndTime" })],
    }),
    defineField({
      name: "directionsUrl",
      title: "Directions link",
      type: "url",
      description: "Google Maps or other directions URL.",
      validation: (rule) => rule.uri({ scheme: ["http", "https"] }),
    }),
    defineField({
      name: "notes",
      title: "Notes",
      type: "text",
      rows: 2,
      description: "Parking, accessibility, or arrival tips.",
    }),
  ],
  preview: {
    select: { title: "headline", address: "address" },
    prepare({ title, address }) {
      return {
        title: title || "Location",
        subtitle: address || "Location",
        media: PinIcon,
      };
    },
  },
});
