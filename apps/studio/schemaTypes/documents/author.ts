import { UserIcon } from "@sanity/icons/User";
import { defineField, defineType } from "sanity";

import { slugField } from "../../utils/slug";

export const author = defineType({
  name: "author",
  title: "Writer",
  type: "document",
  icon: UserIcon,
  fields: [
    defineField({
      name: "name",
      type: "string",
      validation: (rule) => rule.required(),
    }),
    slugField({ source: "name", prefix: "/writers" }),
    defineField({ name: "image", title: "Photo", type: "imageWithAlt" }),
    defineField({
      name: "bio",
      type: "text",
      rows: 3,
      description: "A sentence or two about this writer.",
    }),
    defineField({
      name: "tribute",
      title: "In memory",
      type: "text",
      rows: 3,
      description:
        "For writers who have passed away. Shown at the top of their page.",
    }),
  ],
  preview: { select: { title: "name", media: "image" } },
});
