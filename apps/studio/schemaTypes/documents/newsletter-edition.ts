import { CalendarIcon } from "@sanity/icons/Calendar";
import { DocumentTextIcon } from "@sanity/icons/DocumentText";
import { EnvelopeIcon } from "@sanity/icons/Envelope";
import { FaceHappyIcon } from "@sanity/icons/FaceHappy";
import { ImagesIcon } from "@sanity/icons/Images";
import { defineArrayMember, defineField, defineType, getPublishedId } from "sanity";

import { howToField } from "../../components/HowTo";
import { monthLabel, monthOptions } from "../../lib/months";

const comingUpSection = defineArrayMember({
  name: "comingUpSection",
  title: "What's Coming Up (events table)",
  type: "object",
  icon: CalendarIcon,
  fields: [
    defineField({
      name: "heading",
      type: "string",
      initialValue: "What's Coming Up?",
    }),
    defineField({
      name: "includeEvents",
      title: "Fill in this month's events automatically",
      type: "boolean",
      initialValue: true,
      description:
        "Lists every event on the website for this month. Hide any you don't want below.",
    }),
    defineField({
      name: "hiddenEvents",
      title: "Leave these events out",
      type: "array",
      of: [defineArrayMember({ type: "reference", to: [{ type: "event" }] })],
      hidden: ({ parent }) => parent?.includeEvents === false,
    }),
    defineField({
      name: "extraRows",
      title: "Extra rows",
      type: "array",
      description: "Things to list that aren't events on the website.",
      of: [
        defineArrayMember({
          type: "object",
          name: "row",
          fields: [
            defineField({
              name: "when",
              type: "string",
              description: 'e.g. "Tues., 11/3 – 7am-7pm"',
              validation: (rule) => rule.required(),
            }),
            defineField({
              name: "what",
              type: "string",
              validation: (rule) => rule.required(),
            }),
            defineField({ name: "where", type: "string" }),
          ],
          preview: { select: { title: "what", subtitle: "when" } },
        }),
      ],
    }),
  ],
  preview: {
    select: { title: "heading" },
    prepare: ({ title }) => ({ title, subtitle: "Events table" }),
  },
});

const storySection = defineArrayMember({
  name: "storySection",
  title: "Story or notice",
  type: "object",
  icon: DocumentTextIcon,
  fields: [
    defineField({
      name: "heading",
      type: "string",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "article",
      title: "Use an article from the website",
      type: "reference",
      to: [{ type: "article" }],
      description: "Optional. Leave empty to write it here instead.",
    }),
    defineField({
      name: "byline",
      title: "Written by",
      type: "string",
      hidden: ({ parent }) => Boolean(parent?.article),
    }),
    defineField({
      name: "body",
      type: "richText",
      hidden: ({ parent }) => Boolean(parent?.article),
    }),
    defineField({ name: "image", type: "imageWithAlt" }),
  ],
  preview: {
    select: { title: "heading", article: "article.title", media: "image" },
    prepare: ({ title, article, media }) => ({
      title,
      subtitle: article ? `Article: ${article}` : "Story",
      media,
    }),
  },
});

const flyerSection = defineArrayMember({
  name: "flyerSection",
  title: "Flyer or calendar pages",
  type: "object",
  icon: ImagesIcon,
  fields: [
    defineField({
      name: "heading",
      type: "string",
      description: 'e.g. "Community Center Calendar"',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "pages",
      title: "Pictures",
      type: "array",
      description:
        "Each picture prints as its own page. Photos and scans are shrunk automatically so the PDF stays small.",
      of: [defineArrayMember({ type: "imageWithAlt" })],
      validation: (rule) => rule.required().min(1),
    }),
  ],
  preview: {
    select: { title: "heading", media: "pages.0" },
    prepare: ({ title, media }) => ({ title, subtitle: "Flyers", media }),
  },
});

const funSection = defineArrayMember({
  name: "funSection",
  title: "Humor or fun page",
  type: "object",
  icon: FaceHappyIcon,
  fields: [
    defineField({
      name: "heading",
      type: "string",
      validation: (rule) => rule.required(),
    }),
    defineField({ name: "body", type: "richText" }),
  ],
  preview: {
    select: { title: "heading" },
    prepare: ({ title }) => ({ title, subtitle: "Fun page" }),
  },
});

/**
 * "Keeping you informed…still" — built here, section by section. The website
 * turns it into the web edition and a small printable PDF.
 */
export const newsletterEdition = defineType({
  name: "newsletterEdition",
  title: "Newsletter",
  type: "document",
  icon: EnvelopeIcon,
  fields: [
    howToField("howTo", [
      "Build this month's “Keeping you informed…still” here. Add sections in the order you want them; the table of contents is made for you.",
      "When it's ready, publish it and click “Download PDF” on the newsletter page to attach to your email.",
    ]),
    defineField({
      name: "month",
      type: "string",
      options: { list: monthOptions() },
      validation: (rule) =>
        rule.required().custom(async (month, context) => {
          if (!month) return true;
          const id = getPublishedId(context.document?._id ?? "");
          const client = context.getClient({ apiVersion: "2025-02-19" });
          const taken = await client.fetch<boolean>(
            'defined(*[_type == "newsletterEdition" && month == $month && !(_id in [$id, "drafts." + $id])][0]._id)',
            { month, id },
          );
          return taken
            ? `There is already a newsletter for ${monthLabel(month)}.`
            : true;
        }),
    }),
    defineField({
      name: "coverImage",
      title: "Cover picture",
      type: "imageWithAlt",
    }),
    defineField({
      name: "coverMessage",
      title: "Cover message",
      type: "string",
      description: 'Optional, e.g. "Wishing you a blessed Thanksgiving".',
    }),
    defineField({
      name: "sections",
      type: "array",
      of: [comingUpSection, storySection, flyerSection, funSection],
      validation: (rule) => rule.required().min(1),
    }),
    defineField({
      name: "uploadedPdf",
      title: "Or upload a finished PDF",
      type: "file",
      options: { accept: "application/pdf" },
      description:
        "Only if you made this month's newsletter somewhere else. The website will offer this file instead of making one.",
    }),
  ],
  orderings: [
    {
      title: "Newest first",
      name: "monthDesc",
      by: [{ field: "month", direction: "desc" }],
    },
  ],
  preview: {
    select: { month: "month", media: "coverImage" },
    prepare: ({ month, media }) => ({
      title: `Keeping you informed…still — ${monthLabel(month)}`,
      media,
    }),
  },
});
