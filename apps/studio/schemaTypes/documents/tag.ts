import { TagsIcon } from "@sanity/icons/Tags";
import { defineField, defineType } from "sanity";

import { createSlug, isUnique } from "../../utils/slug";
import {
  uniqueTitleAcrossTaxonomy,
  uniqueTitleWithinType,
} from "../../utils/uniqueness";

export const tag = defineType({
  name: "tag",
  title: "Tag",
  type: "document",
  icon: TagsIcon,
  fields: [
    defineField({
      name: "title",
      title: "Title",
      type: "string",
      validation: (rule) =>
        rule
          .required()
          .custom(uniqueTitleWithinType("tag"))
          .custom(uniqueTitleAcrossTaxonomy("category")),
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
  ],
  preview: {
    select: {
      title: "title",
    },
  },
});
