import { ClockIcon } from "@sanity/icons/Clock";
import { defineField, defineType } from "sanity";

/**
 * One labeled phone number. Each number is its own entry so the website can
 * make a working "Call" button — the old single text box held several
 * numbers and labels and dialed nonsense.
 */
export const phoneNumber = defineType({
  name: "phoneNumber",
  title: "Phone number",
  type: "object",
  fields: [
    defineField({
      name: "label",
      type: "string",
      description:
        'Optional, e.g. "Main office", "After hours", "Non-emergency".',
    }),
    defineField({
      name: "number",
      type: "string",
      description: "For example 520-568-3673. Add an extension like: ext. 12",
      validation: (rule) =>
        rule.required().custom((value) => {
          const [main = ""] = (value ?? "").split(/ext|x/i);
          const digits = main.replace(/\D/g, "");
          if (digits.length === 3) return true; // 211, 311, 911
          return digits.length === 10 ||
            (digits.length === 11 && digits.startsWith("1"))
            ? true
            : "Enter one full phone number with area code. Add more numbers as separate entries.";
        }),
    }),
  ],
  preview: {
    select: { title: "number", subtitle: "label" },
  },
});

const TIMES = Array.from({ length: 48 }, (_, index) => {
  const hours = Math.floor(index / 2);
  const minutes = index % 2 ? "30" : "00";
  const value = `${String(hours).padStart(2, "0")}:${minutes}`;
  const hour12 = hours % 12 === 0 ? 12 : hours % 12;
  return { title: `${hour12}:${minutes} ${hours < 12 ? "AM" : "PM"}`, value };
});

const DAYS = [
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
  "Sunday",
];

/** Opening hours for one day. Days not listed are shown as "Closed". */
export const openingHours = defineType({
  name: "openingHours",
  title: "Opening hours",
  type: "object",
  icon: ClockIcon,
  fields: [
    defineField({
      name: "day",
      type: "string",
      options: { list: DAYS },
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "opens",
      type: "string",
      options: { list: TIMES },
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "closes",
      type: "string",
      options: { list: TIMES },
      validation: (rule) =>
        rule.required().custom((closes, { parent }) => {
          const opens = (parent as { opens?: string })?.opens;
          return opens && closes && closes <= opens
            ? "Closing time must be after opening time."
            : true;
        }),
    }),
  ],
  preview: {
    select: { day: "day", opens: "opens", closes: "closes" },
    prepare: ({ day, opens, closes }) => ({
      title: day,
      subtitle: [opens, closes].filter(Boolean).join(" – "),
    }),
  },
});
