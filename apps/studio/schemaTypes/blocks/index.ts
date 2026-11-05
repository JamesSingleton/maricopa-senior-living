import { BellIcon } from "@sanity/icons/Bell";
import { BlockContentIcon } from "@sanity/icons/BlockContent";
import { ThLargeIcon } from "@sanity/icons/ThLarge";
import { CalendarIcon } from "@sanity/icons/Calendar";
import { CreditCardIcon } from "@sanity/icons/CreditCard";
import { DocumentPdfIcon } from "@sanity/icons/DocumentPdf";
import { DocumentTextIcon } from "@sanity/icons/DocumentText";
import { EnvelopeIcon } from "@sanity/icons/Envelope";
import { HelpCircleIcon } from "@sanity/icons/HelpCircle";
import { HomeIcon } from "@sanity/icons/Home";
import { ImagesIcon } from "@sanity/icons/Images";
import { InfoOutlineIcon } from "@sanity/icons/InfoOutline";
import { LaunchIcon } from "@sanity/icons/Launch";
import { LinkIcon } from "@sanity/icons/Link";
import { MobileDeviceIcon } from "@sanity/icons/MobileDevice";
import { PinIcon } from "@sanity/icons/Pin";
import { PlayIcon } from "@sanity/icons/Play";
import { UsersIcon } from "@sanity/icons/Users";
import { defineArrayMember, defineField, defineType } from "sanity";

/** Optional heading shared by most blocks. */
const heading = defineField({
  name: "heading",
  type: "string",
  description: "Optional title shown above this section.",
});

const intro = defineField({
  name: "intro",
  type: "text",
  rows: 2,
  description: "Optional sentence under the heading.",
});

function block(
  name: string,
  title: string,
  icon: React.ComponentType,
  fields: ReturnType<typeof defineField>[],
  subtitle?: (value: Record<string, unknown>) => string | undefined,
) {
  return defineType({
    name,
    title,
    type: "object",
    icon,
    fields,
    preview: {
      select: {
        heading: "heading",
        text: "text",
        title: "title",
        question: "items.0.question",
        mode: "mode",
      },
      prepare: (value) => ({
        title:
          (value.heading as string) ||
          (value.title as string) ||
          (value.text as string) ||
          title,
        subtitle: subtitle?.(value) ?? title,
      }),
    },
  });
}

export const heroBlock = block("heroBlock", "Big picture with heading", HomeIcon, [
  defineField({
    name: "heading",
    type: "string",
    validation: (rule) => rule.required().max(80),
  }),
  defineField({ name: "text", type: "text", rows: 2 }),
  defineField({ name: "image", type: "imageWithAlt" }),
  defineField({
    name: "showSearch",
    title: "Show the search box",
    type: "boolean",
    initialValue: true,
  }),
  defineField({
    name: "buttons",
    type: "array",
    of: [defineArrayMember({ type: "link" })],
    validation: (rule) => rule.max(2),
  }),
]);

export const textBlock = block("textBlock", "Text", BlockContentIcon, [
  heading,
  defineField({
    name: "body",
    title: "Text",
    type: "richText",
    validation: (rule) => rule.required(),
  }),
]);

export const imageBlock = block("imageBlock", "Pictures", ImagesIcon, [
  heading,
  defineField({
    name: "images",
    title: "Pictures",
    type: "array",
    of: [defineArrayMember({ type: "imageWithAlt" })],
    validation: (rule) => rule.required().min(1).max(12),
  }),
]);

export const buttonsBlock = block("buttonsBlock", "Buttons", LaunchIcon, [
  heading,
  intro,
  defineField({
    name: "buttons",
    type: "array",
    of: [defineArrayMember({ type: "link" })],
    validation: (rule) => rule.required().min(1).max(4),
  }),
]);

export const calloutBlock = block(
  "calloutBlock",
  "Notice box",
  InfoOutlineIcon,
  [
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
    defineField({ name: "link", type: "link" }),
  ],
);

const listMode = (choices: { title: string; value: string }[]) =>
  defineField({
    name: "mode",
    title: "Which ones?",
    type: "string",
    initialValue: choices[0]?.value,
    options: { layout: "radio", list: choices },
  });

export const resourceListBlock = block(
  "resourceListBlock",
  "List of resources",
  PinIcon,
  [
    heading,
    intro,
    listMode([
      { title: "All resources in a topic", value: "topic" },
      { title: "Pick them by hand", value: "manual" },
    ]),
    defineField({
      name: "topic",
      type: "reference",
      to: [{ type: "topic" }],
      hidden: ({ parent }) => parent?.mode === "manual",
    }),
    defineField({
      name: "resources",
      type: "array",
      of: [defineArrayMember({ type: "reference", to: [{ type: "resource" }] })],
      hidden: ({ parent }) => parent?.mode !== "manual",
    }),
    defineField({
      name: "limit",
      title: "How many to show",
      type: "number",
      initialValue: 6,
      validation: (rule) => rule.min(1).max(24).integer(),
    }),
  ],
);

export const eventListBlock = block(
  "eventListBlock",
  "Upcoming events",
  CalendarIcon,
  [
    heading,
    intro,
    listMode([
      { title: "All upcoming events", value: "all" },
      { title: "Only events hosted by Maricopa Senior Living", value: "msl" },
      { title: "Events in a topic", value: "topic" },
    ]),
    defineField({
      name: "topic",
      type: "reference",
      to: [{ type: "topic" }],
      hidden: ({ parent }) => parent?.mode !== "topic",
    }),
    defineField({
      name: "limit",
      title: "How many to show",
      type: "number",
      initialValue: 5,
      validation: (rule) => rule.min(1).max(20).integer(),
    }),
  ],
);

export const articleListBlock = block(
  "articleListBlock",
  "Recent articles",
  DocumentTextIcon,
  [
    heading,
    listMode([
      { title: "Newest articles", value: "latest" },
      { title: "Joan's Corner", value: "joans-corner" },
      { title: "Articles in a topic", value: "topic" },
    ]),
    defineField({
      name: "topic",
      type: "reference",
      to: [{ type: "topic" }],
      hidden: ({ parent }) => parent?.mode !== "topic",
    }),
    defineField({
      name: "limit",
      title: "How many to show",
      type: "number",
      initialValue: 3,
      validation: (rule) => rule.min(1).max(12).integer(),
    }),
  ],
);

export const linkListBlock = block(
  "linkListBlock",
  "Helpful links",
  LinkIcon,
  [
    heading,
    intro,
    listMode([
      { title: "Newest helpful links in a topic", value: "topic" },
      { title: "Pick them by hand", value: "manual" },
    ]),
    defineField({
      name: "topic",
      type: "reference",
      to: [{ type: "topic" }],
      hidden: ({ parent }) => parent?.mode === "manual",
    }),
    defineField({
      name: "links",
      type: "array",
      of: [
        defineArrayMember({ type: "reference", to: [{ type: "helpfulLink" }] }),
      ],
      hidden: ({ parent }) => parent?.mode !== "manual",
    }),
    defineField({
      name: "limit",
      title: "How many to show",
      type: "number",
      initialValue: 6,
      validation: (rule) => rule.min(1).max(30).integer(),
    }),
  ],
);

export const quickContactsBlock = block(
  "quickContactsBlock",
  "Important phone numbers",
  MobileDeviceIcon,
  [
    heading,
    defineField({
      name: "contacts",
      type: "array",
      of: [
        defineArrayMember({
          type: "object",
          name: "quickContact",
          fields: [
            defineField({
              name: "name",
              type: "string",
              validation: (rule) => rule.required(),
            }),
            defineField({
              name: "number",
              title: "Phone number",
              type: "phoneNumber",
              validation: (rule) => rule.required(),
            }),
            defineField({ name: "note", type: "string" }),
          ],
          preview: { select: { title: "name", subtitle: "number.number" } },
        }),
      ],
      validation: (rule) => rule.required().min(1),
    }),
  ],
);

export const contactBlock = block(
  "contactBlock",
  "How to contact us",
  EnvelopeIcon,
  [
    heading,
    intro,
    defineField({
      name: "useSiteContact",
      title: "Use the contact details from Site settings",
      type: "boolean",
      initialValue: true,
    }),
    defineField({
      name: "phone",
      type: "phoneNumber",
      hidden: ({ parent }) => parent?.useSiteContact !== false,
    }),
    defineField({
      name: "email",
      type: "email",
      hidden: ({ parent }) => parent?.useSiteContact !== false,
    }),
    defineField({
      name: "address",
      type: "text",
      rows: 2,
      hidden: ({ parent }) => parent?.useSiteContact !== false,
    }),
  ],
);

export const donateBlock = block("donateBlock", "Donate", CreditCardIcon, [
  heading,
  defineField({
    name: "text",
    type: "text",
    rows: 3,
    description: "Why giving matters. The button uses the donate link in Site settings.",
  }),
]);

export const faqBlock = block(
  "faqBlock",
  "Questions & answers",
  HelpCircleIcon,
  [
    heading,
    defineField({
      name: "items",
      title: "Questions",
      type: "array",
      of: [
        defineArrayMember({
          type: "object",
          name: "faqItem",
          fields: [
            defineField({
              name: "question",
              type: "string",
              validation: (rule) => rule.required(),
            }),
            defineField({
              name: "answer",
              type: "simpleText",
              validation: (rule) => rule.required(),
            }),
          ],
          preview: { select: { title: "question" } },
        }),
      ],
      validation: (rule) => rule.required().min(1),
    }),
  ],
);

export const videoBlock = block("videoBlock", "Video", PlayIcon, [
  heading,
  defineField({
    name: "url",
    title: "YouTube address",
    type: "url",
    validation: (rule) =>
      rule.required().custom((url) =>
        !url || /youtube\.com|youtu\.be/.test(url)
          ? true
          : "Only YouTube videos are supported.",
      ),
  }),
  defineField({
    name: "caption",
    type: "string",
    description: "What the video is about (helps people who can't play it).",
    validation: (rule) => rule.required(),
  }),
]);

export const fileBlock = block("fileBlock", "File to download", DocumentPdfIcon, [
  heading,
  intro,
  defineField({
    name: "file",
    type: "file",
    validation: (rule) => rule.required(),
  }),
  defineField({
    name: "buttonLabel",
    title: "Button text",
    type: "string",
    initialValue: "View the file",
  }),
]);

export const topicsBlock = block("topicsBlock", "Topic tiles", ThLargeIcon, [
  heading,
  intro,
]);

export const whatsNewBlock = block(
  "whatsNewBlock",
  "This month's What's New",
  BellIcon,
  [
    heading,
    defineField({
      name: "buttonLabel",
      title: "Button text",
      type: "string",
      initialValue: "Read this month's What's New",
    }),
  ],
);

export const newsletterSignupBlock = block(
  "newsletterSignupBlock",
  "Newsletter sign-up",
  UsersIcon,
  [
    heading,
    defineField({
      name: "text",
      type: "text",
      rows: 2,
      initialValue:
        "Get “Keeping you informed…still” every month. It's free, quick and easy!",
    }),
    defineField({
      name: "showLatest",
      title: "Show the latest issue",
      type: "boolean",
      initialValue: true,
    }),
  ],
);

/** Every block, in the order shown in the "Add" menu. */
export const pageBlocks = [
  heroBlock,
  topicsBlock,
  whatsNewBlock,
  textBlock,
  imageBlock,
  buttonsBlock,
  calloutBlock,
  resourceListBlock,
  eventListBlock,
  articleListBlock,
  linkListBlock,
  quickContactsBlock,
  contactBlock,
  donateBlock,
  faqBlock,
  videoBlock,
  fileBlock,
  newsletterSignupBlock,
];

export const pageBuilder = defineType({
  name: "pageBuilder",
  title: "Sections",
  type: "array",
  of: pageBlocks.map((b) => defineArrayMember({ type: b.name })),
  options: {
    insertMenu: {
      filter: true,
      groups: [
        {
          name: "content",
          title: "Words & pictures",
          of: ["heroBlock", "textBlock", "imageBlock", "videoBlock", "calloutBlock", "faqBlock"],
        },
        {
          name: "lists",
          title: "Lists from the website",
          of: ["topicsBlock", "whatsNewBlock", "resourceListBlock", "eventListBlock", "articleListBlock", "linkListBlock"],
        },
        {
          name: "actions",
          title: "Buttons & contact",
          of: ["buttonsBlock", "quickContactsBlock", "contactBlock", "donateBlock", "fileBlock", "newsletterSignupBlock"],
        },
      ],
      views: [{ name: "list" }],
    },
  },
});
