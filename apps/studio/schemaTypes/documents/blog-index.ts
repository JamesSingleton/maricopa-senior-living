import { BookIcon } from "@sanity/icons";
import { defineField, defineType } from "sanity";

import { createRadioListLayout } from "../../utils/helper";
import { pageBuilderField } from "../definitions/page-builder";
import { slugField } from "../shared";

export const blogIndex = defineType({
  name: "blogIndex",
  title: "Blog Main Page",
  type: "document",
  icon: BookIcon,
  fields: [
    defineField({
      name: "title",
      title: "Title",
      type: "string",
      validation: (rule) => rule.required(),
    }),
    slugField({ source: "title" }),
    defineField({
      name: "description",
      title: "Description",
      type: "text",
      rows: 3,
    }),
    defineField({
      name: "displayFeaturedBlogs",
      title: "Show Featured Blog Posts?",
      type: "string",
      options: createRadioListLayout([
        { title: "Yes", value: "yes" },
        { title: "No", value: "no" },
      ]),
      initialValue: "no",
    }),
    defineField({
      name: "featuredBlogsCount",
      title: "Number of Featured Posts",
      type: "number",
      hidden: ({ parent }) => parent?.displayFeaturedBlogs !== "yes",
      validation: (rule) =>
        rule.custom((value, { parent }) => {
          if (
            (parent as { displayFeaturedBlogs?: string })
              ?.displayFeaturedBlogs === "yes" &&
            (value === undefined || value < 1)
          ) {
            return "Enter how many featured posts to show.";
          }
          return true;
        }),
    }),
    pageBuilderField,
  ],
  preview: {
    prepare() {
      return { title: "Blog Main Page" };
    },
  },
});
