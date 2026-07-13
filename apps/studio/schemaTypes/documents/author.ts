import { UserIcon } from "@sanity/icons/User";
import { defineField, defineType } from "sanity";

import { createSlug, isUnique } from "../../utils/slug";

export const author = defineType({
  name: "author",
  title: "Author",
  type: "document",
  icon: UserIcon,
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
      options: { hotspot: true },
      fields: [
        defineField({
          name: "alt",
          title: "Alternative text",
          type: "string",
        }),
      ],
    }),
    defineField({
      name: "bio",
      title: "Bio",
      type: "portableText",
    }),
  ],
  preview: {
    select: {
      title: "name",
      media: "image",
    },
  },
});
