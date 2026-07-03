import { HomeIcon } from "@sanity/icons";
import { defineField, defineType } from "sanity";
import { pageBuilderField } from "../objects/page-builder";
import { seoField } from "../objects/seo";

export const homePage = defineType({
  name: "homePage",
  title: "Home Page",
  type: "document",
  icon: HomeIcon,
  description: "The homepage at /. Build with page builder sections.",
  fields: [
    defineField({
      name: "title",
      title: "Internal Title",
      type: "string",
      initialValue: "Home",
      validation: (rule) => rule.required(),
    }),
    pageBuilderField,
    seoField,
  ],
  preview: {
    prepare() {
      return { title: "Home Page", subtitle: "/" };
    },
  },
});
