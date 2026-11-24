import { UserIcon } from "@sanity/icons/User";
import { defineArrayMember, defineField, defineType } from "sanity";

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
    defineField({
      name: "role",
      type: "string",
      description:
        'For example "Founder, Maricopa Senior Living" or "Columnist".',
    }),
    defineField({
      name: "credentials",
      type: "string",
      description:
        'Professional letters or training, e.g. "CDP — Certified Dementia Practitioner".',
    }),
    defineField({ name: "image", title: "Photo", type: "imageWithAlt" }),
    defineField({
      name: "bio",
      type: "text",
      rows: 3,
      description: "A sentence or two about this writer.",
    }),
    defineField({
      name: "profiles",
      title: "Profile links",
      type: "array",
      description:
        "Optional pages about this writer elsewhere (LinkedIn, a business website).",
      of: [defineArrayMember({ type: "url" })],
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
