import { defineField, defineType } from "sanity";

import { createSlug, isUnique } from "../../utils/slug";

export const author = defineType({
  name: "author",
  title: "Author",
  type: "document",
  fields: [
    defineField({
      name: "name",
      title: "Name",
      type: "string",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "slug",
      title: "Slug",
      type: "slug",
      options: {
        source: "name",
        slugify: createSlug,
        maxLength: 96,
        isUnique,
      },
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "image",
      title: "Image",
      type: "image",
      options: {
        hotspot: true,
      },
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "bio",
      title: "Bio",
      type: "array",
      of: [
        {
          title: "Block",
          type: "block",
          styles: [{ title: "Normal", value: "normal" }],
          lists: [],
        },
      ],
    }),
    defineField({
      name: "position",
      title: "Position / Title",
      type: "string",
      description: 'Job title or role, e.g. "Executive Director"',
    }),
  ],
  preview: {
    select: {
      title: "name",
      media: "image",
    },
  },
});
