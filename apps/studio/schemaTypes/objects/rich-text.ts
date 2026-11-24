import { CalendarIcon } from "@sanity/icons/Calendar";
import { DocumentPdfIcon } from "@sanity/icons/DocumentPdf";
import { ImageIcon } from "@sanity/icons/Image";
import { InfoOutlineIcon } from "@sanity/icons/InfoOutline";
import { PinIcon } from "@sanity/icons/Pin";
import { defineArrayMember, defineField, defineType } from "sanity";

import { LINKABLE_TYPES } from "./link";

/** Text styles and marks shared by every rich-text field. */
const block = defineArrayMember({
  type: "block",
  styles: [
    { title: "Normal", value: "normal" },
    { title: "Heading", value: "h2" },
    { title: "Small heading", value: "h3" },
    { title: "Quote", value: "blockquote" },
  ],
  lists: [
    { title: "Bullets", value: "bullet" },
    { title: "Numbered", value: "number" },
  ],
  marks: {
    decorators: [
      { title: "Bold", value: "strong" },
      { title: "Italic", value: "em" },
    ],
    annotations: [
      defineArrayMember({
        name: "link",
        title: "Link to another website",
        type: "object",
        fields: [
          defineField({
            name: "href",
            title: "Website, email or phone",
            type: "url",
            description:
              "https://… for websites, mailto:name@example.com for email, tel:5205551234 for phone.",
            validation: (rule) =>
              rule
                .required()
                .uri({ scheme: ["http", "https", "mailto", "tel"] }),
          }),
        ],
      }),
      defineArrayMember({
        name: "internalLink",
        title: "Link to a page on this site",
        type: "object",
        fields: [
          defineField({
            name: "reference",
            type: "reference",
            to: LINKABLE_TYPES,
            validation: (rule) => rule.required(),
          }),
        ],
      }),
    ],
  },
});

export const imageWithAlt = defineType({
  name: "imageWithAlt",
  title: "Image",
  type: "image",
  icon: ImageIcon,
  options: { hotspot: true },
  fields: [
    defineField({
      name: "alt",
      title: "Describe the picture",
      type: "string",
      description:
        'One sentence for people who can\'t see it, e.g. "Volunteers serving lunch at the Senior Center".',
      hidden: ({ parent }) => Boolean(parent?.decorative),
      validation: (rule) =>
        rule.custom((alt, { parent }) => {
          const image = parent as
            | { asset?: unknown; decorative?: boolean }
            | undefined;
          if (!image?.asset || image.decorative || alt?.trim()) return true;
          return "Describe the picture in a sentence, or tick “This picture is decoration”.";
        }),
    }),
    defineField({
      name: "decorative",
      title: "This picture is decoration",
      type: "boolean",
      description:
        "Tick only if the picture adds nothing (a border, a pattern). Screen readers will skip it.",
      initialValue: false,
    }),
    defineField({
      name: "caption",
      type: "string",
      description: "Optional text shown under the picture.",
    }),
  ],
});

const callout = defineArrayMember({
  name: "callout",
  title: "Notice box",
  type: "object",
  icon: InfoOutlineIcon,
  fields: [
    defineField({
      name: "tone",
      type: "string",
      initialValue: "info",
      options: {
        layout: "radio",
        list: [
          { title: "Information", value: "info" },
          { title: "Important / warning", value: "warning" },
        ],
      },
    }),
    defineField({
      name: "text",
      type: "text",
      rows: 3,
      validation: (rule) => rule.required(),
    }),
  ],
  preview: {
    select: { title: "text", tone: "tone" },
    prepare: ({ title, tone }) => ({
      title,
      subtitle: tone === "warning" ? "Important notice" : "Notice",
    }),
  },
});

const eventCard = defineArrayMember({
  name: "eventCard",
  title: "Event card",
  type: "object",
  icon: CalendarIcon,
  fields: [
    defineField({
      name: "event",
      type: "reference",
      to: [{ type: "event" }],
      validation: (rule) => rule.required(),
    }),
  ],
  preview: {
    select: { title: "event.title", start: "event.start" },
    prepare: ({ title, start }) => ({
      title: title ?? "Event",
      subtitle: start ? new Date(start).toLocaleString() : "Event card",
    }),
  },
});

const resourceCard = defineArrayMember({
  name: "resourceCard",
  title: "Resource card",
  type: "object",
  icon: PinIcon,
  fields: [
    defineField({
      name: "resource",
      type: "reference",
      to: [{ type: "resource" }],
      validation: (rule) => rule.required(),
    }),
  ],
  preview: {
    select: { title: "resource.title" },
    prepare: ({ title }) => ({ title, subtitle: "Resource card" }),
  },
});

const fileAttachment = defineArrayMember({
  name: "fileAttachment",
  title: "File (PDF)",
  type: "file",
  icon: DocumentPdfIcon,
  fields: [
    defineField({
      name: "title",
      title: "What is it?",
      type: "string",
      description: 'Shown as the link text, e.g. "May 2025 newsletter".',
      validation: (rule) => rule.required(),
    }),
  ],
});

/** Full rich text: articles, pages, monthly updates, newsletter sections. */
export const richText = defineType({
  name: "richText",
  title: "Text",
  type: "array",
  of: [
    block,
    defineArrayMember({ type: "imageWithAlt" }),
    fileAttachment,
    callout,
    eventCard,
    resourceCard,
  ],
});

/** Plain paragraphs and links only: summaries, descriptions, answers. */
export const simpleText = defineType({
  name: "simpleText",
  title: "Text",
  type: "array",
  of: [
    defineArrayMember({
      ...block,
      styles: [{ title: "Normal", value: "normal" }],
    }),
  ],
});
