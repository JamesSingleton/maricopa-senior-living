import { HomeIcon } from "@sanity/icons";
import { defineField, defineType } from "sanity";

import { pageBuilderField } from "../definitions/page-builder";

export const home = defineType({
  name: "home",
  title: "Home Page",
  type: "document",
  icon: HomeIcon,
  fields: [
    defineField({
      name: "title",
      title: "Label",
      type: "string",
      initialValue: "Home Page",
      validation: (rule) => rule.required(),
    }),
    pageBuilderField,
  ],
  preview: {
    prepare() {
      return { title: "Home Page" };
    },
  },
});
