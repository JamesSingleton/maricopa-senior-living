import { CalendarIcon } from "@sanity/icons/Calendar";
import { defineArrayMember, defineField, defineType } from "sanity";

import { withHowTo } from "../../components/HowTo";
import { slugField } from "../../utils/slug";
import { seoField } from "../objects/seo";
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
  // New events start tomorrow, 9–10 AM Arizona time (UTC−7 all year).
  initialValue: () => {
    const tomorrow = new Date(Date.now() + 24 * 3600 * 1000);
    const day = new Intl.DateTimeFormat("en-CA", {
      timeZone: "America/Phoenix",
    }).format(tomorrow);
    return {
      start: new Date(`${day}T09:00:00-07:00`).toISOString(),
      end: new Date(`${day}T10:00:00-07:00`).toISOString(),
      status: "scheduled",
      attendance: "inPerson",
      isFree: true,
    };
  },
  groups: [
    { name: "when", title: "When & where", default: true },
    { name: "details", title: "Details" },
  ],
  components: {
    input: withHowTo([
      "Add one event for each thing that's happening. For something every week or month, set it once under “Repeats” instead of adding it again and again.",
      "If one date is cancelled, add it under “Skip these dates”.",
    ]),
  },
  fields: [
    defineField({
      name: "title",
      type: "string",
      group: "when",
      validation: (rule) => rule.required().max(100),
    }),
    { ...slugField({ prefix: "/events" }), group: "when" },
    defineField({
      name: "start",
      title: "Starts",
      type: "datetime",
      group: "when",
      description: "Date and start time (Arizona time).",
      // Always Arizona time, wherever the editor is.
      options: {
        timeStep: 15,
        displayTimeZone: "America/Phoenix",
        allowTimeZoneSwitch: false,
      } as { timeStep: number },
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "end",
      title: "Ends",
      type: "datetime",
      group: "when",
      description:
        "Optional. For a repeating event, use the end time on the first day.",
      // Always Arizona time, wherever the editor is.
      options: {
        timeStep: 15,
        displayTimeZone: "America/Phoenix",
        allowTimeZoneSwitch: false,
      } as { timeStep: number },
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
      title: "Street address",
      type: "postalAddress",
      group: "when",
      description: "Optional, for directions. Leave empty for online events.",
      hidden: ({ document }) =>
        (document as { attendance?: string })?.attendance === "online",
    }),
    defineField({
      name: "attendance",
      title: "In person or online?",
      type: "string",
      group: "when",
      initialValue: "inPerson",
      options: {
        layout: "radio",
        list: [
          { title: "In person", value: "inPerson" },
          { title: "Online", value: "online" },
          { title: "Both", value: "mixed" },
        ],
      },
    }),
    defineField({
      name: "onlineUrl",
      title: "Online link (Zoom, YouTube…)",
      type: "url",
      group: "when",
      hidden: ({ document }) =>
        (document as { attendance?: string })?.attendance === "inPerson" ||
        !(document as { attendance?: string })?.attendance,
      validation: (rule) => rule.uri({ scheme: ["http", "https"] }),
    }),
    defineField({
      name: "status",
      type: "string",
      group: "when",
      initialValue: "scheduled",
      description:
        "If it's cancelled or moved, change this instead of deleting the event.",
      options: {
        layout: "radio",
        list: [
          { title: "Going ahead", value: "scheduled" },
          { title: "Cancelled", value: "cancelled" },
          { title: "Postponed (new date to come)", value: "postponed" },
          { title: "Moved online", value: "movedOnline" },
          { title: "New date (rescheduled)", value: "rescheduled" },
        ],
      },
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
      name: "isFree",
      title: "Free",
      type: "boolean",
      group: "details",
      initialValue: true,
    }),
    defineField({
      name: "cost",
      type: "string",
      group: "details",
      description: 'For example "$10" or "$5 for members".',
      hidden: ({ document }) =>
        (document as { isFree?: boolean })?.isFree !== false,
    }),
    defineField({
      name: "flyer",
      title: "Flyer picture",
      type: "imageWithAlt",
      group: "details",
    }),
    { ...seoField, group: "details" },
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
