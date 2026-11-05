import { LinkIcon } from "@sanity/icons/Link";
import { defineField, defineType } from "sanity";

import { howToField } from "../../components/HowTo";
import {
  needsReviewField,
  summaryField,
  topicsField,
  warnIfDuplicate,
} from "../shared";

/**
 * An outside article or website worth reading. Deliberately has no body:
 * we link to the original and say why it's useful, instead of copying it.
 */
export const helpfulLink = defineType({
  name: "helpfulLink",
  title: "Helpful link",
  type: "document",
  icon: LinkIcon,
  fields: [
    howToField("howTo", [
      "Use this for a good article or website from somewhere else (AARP, Mayo Clinic, the City, and so on).",
      "Don't paste the whole article — write a sentence or two about why it's helpful. Visitors click through to read it.",
    ]),
    defineField({
      name: "title",
      type: "string",
      validation: (rule) => [
        rule.required(),
        rule.custom(warnIfDuplicate("title")).warning(),
      ],
    }),
    defineField({
      name: "url",
      title: "Web address",
      type: "url",
      validation: (rule) => [
        rule.required().uri({ scheme: ["http", "https"] }),
        rule.custom(warnIfDuplicate("url")).warning(),
      ],
    }),
    defineField({
      name: "source",
      type: "string",
      description:
        'Who published it, e.g. "AARP", "Mayo Clinic", "InMaricopa".',
      validation: (rule) => rule.required(),
    }),
    summaryField({ max: 400 }),
    topicsField(),
    defineField({
      name: "publishedAt",
      title: "Date added",
      type: "date",
      initialValue: () => new Date().toISOString().slice(0, 10),
    }),
    needsReviewField,
    defineField({
      name: "legacyId",
      type: "string",
      readOnly: true,
      hidden: true,
    }),
  ],
  orderings: [
    {
      title: "Newest first",
      name: "newest",
      by: [{ field: "publishedAt", direction: "desc" }],
    },
  ],
  preview: {
    select: { title: "title", source: "source", review: "needsReview" },
    prepare: ({ title, source, review }) => ({
      title,
      subtitle: [review ? "Needs review" : null, source]
        .filter(Boolean)
        .join(" · "),
    }),
  },
});
