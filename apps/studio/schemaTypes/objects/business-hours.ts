import { defineField, defineType } from "sanity";

export const businessHours = defineType({
  name: "businessHours",
  title: "Business Hours",
  type: "array",
  of: [{ type: "dayAndTime" }],
  description: "Operating hours for this resource.",
});
