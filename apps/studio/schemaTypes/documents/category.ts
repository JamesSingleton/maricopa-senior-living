import { TagIcon } from "@sanity/icons/Tag";
import { defineField, defineType } from "sanity";

import { createSlug, isUnique } from "../../utils/slug";
import {
  uniqueTitleAcrossTaxonomy,
  uniqueTitleWithinType,
} from "../../utils/uniqueness";

export const category = defineType({
  name: "category",
  title: "Category",
  type: "document",
  icon: TagIcon,
  fields: [
    defineField({
      name: "title",
      title: "Title",
      type: "string",
      validation: (rule) =>
        rule
          .required()
          .custom(uniqueTitleWithinType("category"))
          .custom(uniqueTitleAcrossTaxonomy("tag")),
    }),
    defineField({
      name: "slug",
      title: "Slug",
      type: "slug",
      options: {
        source: "title",
        slugify: createSlug,
        maxLength: 96,
        isUnique,
      },
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "description",
      title: "Description",
      type: "text",
      rows: 3,
      description: "Short description shown on category listing pages.",
    }),
    defineField({
      name: "seo",
      title: "SEO",
      type: "seo",
    }),
  ],
  preview: {
    select: {
      title: "title",
      subtitle: "description",
    },
  },
});
