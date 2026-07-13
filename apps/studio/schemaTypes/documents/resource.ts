import { CaseIcon } from "@sanity/icons/Case";
import { DocumentIcon } from "@sanity/icons/Document";
import { defineArrayMember, defineField, defineType } from "sanity";

import { createRadioListLayout } from "../../utils/helper";
import { createSlug, isUnique } from "../../utils/slug";

export const resource = defineType({
  name: "resource",
  title: "Resource",
  type: "document",
  icon: CaseIcon,
  groups: [
    { name: "content", title: "Content", default: true },
    { name: "directory", title: "Directory details" },
    { name: "guide", title: "Guide details" },
    { name: "seo", title: "SEO" },
  ],
  fields: [
    defineField({
      name: "kind",
      title: "Resource kind",
      type: "string",
      group: "content",
      options: createRadioListLayout([
        { title: "Directory listing", value: "directory" },
        { title: "Guide / toolkit", value: "guide" },
      ]),
      initialValue: "directory",
      validation: (rule) => rule.required(),
      description:
        "Directory listings are organizations and programs people can contact. Guides are toolkits, PDFs, and how-tos.",
    }),
    defineField({
      name: "title",
      title: "Title",
      type: "string",
      group: "content",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "slug",
      title: "Slug",
      type: "slug",
      group: "content",
      options: {
        source: "title",
        slugify: createSlug,
        maxLength: 96,
        isUnique,
      },
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "summary",
      title: "Summary",
      type: "text",
      rows: 3,
      group: "content",
      description: "Short summary for cards and search results.",
      validation: (rule) => rule.max(280).warning("Keep under 280 characters"),
    }),
    defineField({
      name: "image",
      title: "Image",
      type: "image",
      group: "content",
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
      name: "categories",
      title: "Categories",
      type: "array",
      group: "content",
      of: [
        defineArrayMember({ type: "reference", to: [{ type: "category" }] }),
      ],
      validation: (rule) => rule.min(1).error("Add at least one category"),
    }),
    defineField({
      name: "tags",
      title: "Tags",
      type: "array",
      group: "content",
      of: [defineArrayMember({ type: "reference", to: [{ type: "tag" }] })],
    }),

    // Directory fields
    defineField({
      name: "website",
      title: "Website",
      type: "url",
      group: "directory",
      hidden: ({ document }) => document?.kind !== "directory",
      validation: (rule) => rule.uri({ scheme: ["http", "https"] }),
    }),
    defineField({
      name: "phone",
      title: "Phone number",
      type: "string",
      group: "directory",
      hidden: ({ document }) => document?.kind !== "directory",
    }),
    defineField({
      name: "email",
      title: "Email",
      type: "string",
      group: "directory",
      hidden: ({ document }) => document?.kind !== "directory",
      validation: (rule) => rule.email(),
    }),
    defineField({
      name: "address",
      title: "Address",
      type: "text",
      rows: 2,
      group: "directory",
      hidden: ({ document }) => document?.kind !== "directory",
    }),
    defineField({
      name: "businessHours",
      title: "Business hours",
      type: "array",
      group: "directory",
      of: [defineArrayMember({ type: "dayAndTime" })],
      hidden: ({ document }) => document?.kind !== "directory",
      description: "Skip days they are closed.",
    }),
    defineField({
      name: "eligibility",
      title: "Audience / eligibility",
      type: "portableText",
      group: "directory",
      hidden: ({ document }) => document?.kind !== "directory",
      description: "Who this program or organization serves.",
    }),
    defineField({
      name: "directoryDescription",
      title: "Description",
      type: "portableText",
      group: "directory",
      hidden: ({ document }) => document?.kind !== "directory",
    }),
    defineField({
      name: "notes",
      title: "Notes",
      type: "portableText",
      group: "directory",
      hidden: ({ document }) => document?.kind !== "directory",
      description:
        "Extra details for visitors (appointments, languages, etc.).",
    }),

    // Guide fields
    defineField({
      name: "body",
      title: "Body",
      type: "portableText",
      group: "guide",
      hidden: ({ document }) => document?.kind !== "guide",
    }),
    defineField({
      name: "attachments",
      title: "File attachments",
      type: "array",
      group: "guide",
      of: [defineArrayMember({ type: "fileAttachment" })],
      hidden: ({ document }) => document?.kind !== "guide",
    }),
    defineField({
      name: "externalLinks",
      title: "External links",
      type: "array",
      group: "guide",
      of: [defineArrayMember({ type: "externalLink" })],
      hidden: ({ document }) => document?.kind !== "guide",
    }),

    defineField({
      name: "seo",
      title: "SEO",
      type: "seo",
      group: "seo",
    }),
  ],
  preview: {
    select: {
      title: "title",
      kind: "kind",
      media: "image",
    },
    prepare({ title, kind, media }) {
      return {
        title: title || "Untitled resource",
        subtitle: kind === "guide" ? "Guide / toolkit" : "Directory listing",
        media: media ?? (kind === "guide" ? DocumentIcon : CaseIcon),
      };
    },
  },
});
