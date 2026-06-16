import { CalendarIcon } from "@sanity/icons";
import { defineArrayMember, defineField, defineType } from "sanity";

export const featuredEvents = defineType({
  name: "featuredEvents",
  title: "Featured Events",
  type: "object",
  icon: CalendarIcon,
  fields: [
    defineField({
      name: "title",
      title: "Section Title",
      type: "string",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "events",
      title: "Events",
      type: "array",
      of: [defineArrayMember({ type: "reference", to: [{ type: "event" }] })],
      validation: (rule) => rule.required().min(1),
    }),
  ],
  preview: {
    select: { title: "title", events: "events" },
    prepare({ title, events = [] }) {
      return {
        title: title || "Featured Events",
        subtitle: `Featured Events • ${events.length} item${events.length === 1 ? "" : "s"}`,
        media: CalendarIcon,
      };
    },
  },
});
