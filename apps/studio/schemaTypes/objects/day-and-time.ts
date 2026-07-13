import { defineField, defineType } from "sanity";

const days = [
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
  "Sunday",
];

export const dayAndTime = defineType({
  name: "dayAndTime",
  title: "Day and time",
  type: "object",
  validation: (rule) =>
    rule.custom((value) => {
      const dayAndTimeValue = value as
        | { day?: string; opensAt?: string; closesAt?: string }
        | undefined;
      if (!dayAndTimeValue?.day) return "Select a day";
      if (!dayAndTimeValue.opensAt) return "Choose when it opens";
      if (!dayAndTimeValue.closesAt) return "Choose when it closes";
      if (dayAndTimeValue.opensAt >= dayAndTimeValue.closesAt) {
        return `Open time must be before close time on ${dayAndTimeValue.day}`;
      }
      return true;
    }),
  fields: [
    defineField({
      name: "day",
      title: "Day",
      type: "string",
      options: { list: days },
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "opensAt",
      title: "Opens at",
      type: "timeValue",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "closesAt",
      title: "Closes at",
      type: "timeValue",
      validation: (rule) => rule.required(),
    }),
  ],
  preview: {
    select: {
      day: "day",
      opensAt: "opensAt",
      closesAt: "closesAt",
    },
    prepare({ day, opensAt, closesAt }) {
      return {
        title: day || "Day",
        subtitle: opensAt && closesAt ? `${opensAt} – ${closesAt}` : undefined,
      };
    },
  },
});
