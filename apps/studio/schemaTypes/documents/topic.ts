import { TagIcon } from "@sanity/icons/Tag";
import { defineField, defineType } from "sanity";

import { adminOnly } from "../../lib/access";
import { slugField } from "../../utils/slug";

/** The icons the website knows how to draw for a topic tile. */
export const TOPIC_ICONS = [
  "heart-pulse",
  "brain",
  "hand-heart",
  "house",
  "piggy-bank",
  "scale",
  "flower",
  "shield-check",
  "sun",
  "utensils",
  "bus",
  "users",
  "medal",
  "paw-print",
];

/**
 * A fixed, admin-managed list (14 at launch). Ron picks from it; he can't add
 * to it, which is what keeps it from growing back to 81 categories.
 */
export const topic = defineType({
  name: "topic",
  type: "document",
  icon: TagIcon,
  readOnly: adminOnly,
  fields: [
    defineField({
      name: "title",
      type: "string",
      validation: (rule) => rule.required(),
    }),
    slugField(),
    defineField({
      name: "description",
      type: "text",
      rows: 2,
      description: "One sentence shown on the topic page and its tile.",
      validation: (rule) => rule.required().max(200),
    }),
    defineField({
      name: "icon",
      type: "string",
      options: { list: TOPIC_ICONS },
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "order",
      title: "Sort order",
      type: "number",
      description: "Lower numbers show first.",
      validation: (rule) => rule.required().integer().min(0),
    }),
    defineField({
      name: "legacyCategories",
      title: "Old category and tag names",
      type: "array",
      of: [{ type: "string" }],
      description:
        "Old website categories/tags folded into this topic. Used for redirects.",
      options: { layout: "tags" },
    }),
  ],
  orderings: [
    {
      title: "Sort order",
      name: "order",
      by: [{ field: "order", direction: "asc" }],
    },
  ],
  preview: { select: { title: "title", subtitle: "description" } },
});
