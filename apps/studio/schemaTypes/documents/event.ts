import { CalendarIcon } from "@sanity/icons/Calendar";
import { defineArrayMember, defineField, defineType } from "sanity";

import { howToField } from "../../components/HowTo";
import { slugField } from "../../utils/slug";
import { summaryField, topicsField } from "../shared";

type EventDoc = {
  start?: string;
  end?: string;
  repeat?: { frequency?: string; until?: string };
};

/**
 * Something happening on a date. Repeats cover the common cases on the
 * community calendars (every Wednesday; the first Thursday of the month)
 * without a full calendar-rule editor.
 */
export const event = defineType({
  name: "event",
  type: "document",
  icon: CalendarIcon,
  groups: [
    { name: "when", title: "When & where", default: true },
    { name: "details", title: "Details" },
  ],
  fields: [
    {
      ...howToField("howTo", [
        "Add one event for each thing that's happening. For something every week or month, set it once under “Repeats” instead of adding it again and again.",
        "If one date is cancelled, add it under “Skip these dates”.",
      ]),
      group: "when",
    },
    defineField({
      name: "title",
      type: "string",
      group: "when",
      validation: (rule) => rule.required().max(100),
    }),
    { ...slugField(), group: "when" },
    defineField({
      name: "start",
      title: "Starts",
      type: "datetime",
      group: "when",
      description: "Date and start time (Arizona time).",
      options: { timeStep: 15 },
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "end",
      title: "Ends",
      type: "datetime",
      group: "when",
      description:
        "Optional. For a repeating event, use the end time on the first day.",
      options: { timeStep: 15 },
      validation: (rule) =>
        rule.custom((end, { document }) => {
          const start = (document as EventDoc)?.start;
          return start && end && new Date(end) <= new Date(start)
            ? "The end has to be after the start."
            : true;
        }),
    }),
    defineField({
      name: "allDay",
      title: "All-day event",
      type: "boolean",
      group: "when",
      initialValue: false,
    }),
    defineField({
      name: "repeat",
      title: "Repeats",
      type: "object",
      group: "when",
      fields: [
        defineField({
          name: "frequency",
          title: "How often",
          type: "string",
          initialValue: "none",
          options: {
            layout: "radio",
            list: [
              { title: "Doesn't repeat", value: "none" },
              { title: "Every week on the same day", value: "weekly" },
              {
                title:
                  "Every month on the same weekday (e.g. the 1st Thursday)",
                value: "monthlyWeekday",
              },
              {
                title: "Every month on the same date (e.g. the 15th)",
                value: "monthlyDate",
              },
            ],
          },
        }),
        defineField({
          name: "until",
          title: "Repeat until",
          type: "date",
          hidden: ({ parent }) =>
            !parent?.frequency || parent.frequency === "none",
          validation: (rule) =>
            rule.custom((until, { document }) => {
              const doc = document as EventDoc;
              const frequency = doc?.repeat?.frequency;
              if (!frequency || frequency === "none") return true;
              if (!until) return "Choose the last date it repeats.";
              const start = doc.start ? new Date(doc.start) : null;
              if (start && new Date(until) < start) {
                return "This has to be after the first date.";
              }
              if (
                start &&
                new Date(until).getTime() - start.getTime() >
                  366 * 24 * 3600 * 1000
              ) {
                return "Repeats can run for up to one year. Add a new event after that.";
              }
              return true;
            }),
        }),
        defineField({
          name: "skipDates",
          title: "Skip these dates",
          type: "array",
          description: "Dates it's cancelled, e.g. a holiday.",
          of: [defineArrayMember({ type: "date" })],
          hidden: ({ parent }) =>
            !parent?.frequency || parent.frequency === "none",
        }),
      ],
    }),
    defineField({
      name: "location",
      title: "Place",
      type: "string",
      group: "when",
      description: 'For example "Maricopa Library" or "Online".',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "address",
      type: "string",
      group: "when",
      description: "Optional street address, for directions.",
    }),
    { ...summaryField(), group: "details" },
    { ...topicsField({ min: 0, max: 3 }), group: "details" },
    defineField({
      name: "hostedByMsl",
      title: "Hosted by Maricopa Senior Living",
      type: "boolean",
      group: "details",
      initialValue: false,
    }),
    defineField({
      name: "registration",
      title: "Sign-up",
      type: "object",
      group: "details",
      fields: [
        defineField({
          name: "required",
          title: "Sign-up required",
          type: "boolean",
          initialValue: false,
        }),
        defineField({
          name: "link",
          title: "Sign-up page or phone",
          type: "link",
        }),
      ],
    }),
    defineField({
      name: "cost",
      type: "string",
      group: "details",
      description: 'For example "Free" or "$10".',
    }),
    defineField({
      name: "flyer",
      title: "Flyer picture",
      type: "imageWithAlt",
      group: "details",
    }),
    defineField({
      name: "details",
      title: "More information",
      type: "richText",
      group: "details",
    }),
  ],
  orderings: [
    {
      title: "Soonest first",
      name: "start",
      by: [{ field: "start", direction: "asc" }],
    },
    {
      title: "Latest first",
      name: "startDesc",
      by: [{ field: "start", direction: "desc" }],
    },
  ],
  preview: {
    select: {
      title: "title",
      start: "start",
      frequency: "repeat.frequency",
      media: "flyer",
    },
    prepare: ({ title, start, frequency, media }) => ({
      title,
      subtitle: [
        start
          ? new Date(start).toLocaleString("en-US", {
              timeZone: "America/Phoenix",
              dateStyle: "medium",
              timeStyle: "short",
            })
          : null,
        frequency && frequency !== "none" ? "Repeats" : null,
      ]
        .filter(Boolean)
        .join(" · "),
      media,
    }),
  },
});
