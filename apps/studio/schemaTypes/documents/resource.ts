import { BookIcon } from "@sanity/icons";
import { defineField, defineType } from "sanity";

import { createRadioListLayout } from "../../utils/helper";
import {
  requiredCategoriesField,
  seoFields,
  seoGroup,
  slugField,
} from "../shared";

export const resource = defineType({
  name: "resource",
  title: "Resource",
  type: "document",
  icon: BookIcon,
  fieldsets: [
    {
      name: "source",
      title: "Source Attribution",
      options: { collapsible: true, collapsed: false },
    },
  ],
  groups: [
    { name: "content", title: "Content", default: true },
    { name: "contact", title: "Contact Info" },
    { name: "source", title: "Source" },
    seoGroup,
  ],
  fields: [
    defineField({
      name: "title",
      title: "Title",
      type: "string",
      group: "content",
      description:
        'Title of what you want to show up, for example "F.O.R. Maricopa"',
      validation: (rule) => rule.required(),
    }),
    { ...slugField({ source: "title" }), group: "content" },
    defineField({
      name: "resourceType",
      title: "Resource Type",
      type: "string",
      group: "content",
      options: createRadioListLayout([
        { title: "Business", value: "business" },
        { title: "Local Program", value: "program" },
        { title: "External Article Link", value: "externalArticle" },
      ]),
      initialValue: "business",
      validation: (rule) => rule.required(),
    }),
    { ...requiredCategoriesField, group: "content" },
    defineField({
      name: "tags",
      title: "Tags",
      type: "array",
      of: [{ type: "reference", to: [{ type: "tag" }] }],
      group: "content",
    }),
    defineField({
      name: "description",
      title: "Description",
      type: "blockContent",
      group: "content",
    }),
    defineField({
      name: "audience",
      title: "Audience / Eligibility",
      type: "blockContent",
      group: "content",
      hidden: ({ parent }) => parent?.resourceType === "externalArticle",
    }),
    defineField({
      name: "website",
      title: "Website",
      type: "url",
      group: "contact",
      hidden: ({ parent }) => parent?.resourceType === "externalArticle",
    }),
    defineField({
      name: "phone",
      title: "Phone Number",
      type: "string",
      group: "contact",
      hidden: ({ parent }) => parent?.resourceType === "externalArticle",
    }),
    defineField({
      name: "address",
      title: "Address",
      type: "string",
      group: "contact",
      hidden: ({ parent }) => parent?.resourceType === "externalArticle",
    }),
    defineField({
      name: "businessHours",
      title: "Business Hours",
      type: "array",
      group: "contact",
      of: [{ type: "dayAndTime" }],
      hidden: ({ parent }) => parent?.resourceType === "externalArticle",
    }),
    defineField({
      name: "notes",
      title: "Notes",
      type: "blockContent",
      group: "content",
      hidden: ({ parent }) => parent?.resourceType === "externalArticle",
    }),
    defineField({
      name: "attachments",
      title: "Attachments",
      type: "array",
      group: "content",
      hidden: ({ parent }) => parent?.resourceType === "externalArticle",
      of: [
        {
          type: "file",
          fields: [
            defineField({
              name: "name",
              title: "Name",
              type: "string",
              validation: (rule) => rule.required(),
            }),
          ],
        },
      ],
    }),
    defineField({
      name: "sourceName",
      title: "Source Name",
      type: "string",
      group: "source",
      fieldset: "source",
      hidden: ({ parent }) => parent?.resourceType !== "externalArticle",
      validation: (rule) =>
        rule.custom((value, { parent }) => {
          if (
            (parent as { resourceType?: string })?.resourceType ===
              "externalArticle" &&
            !value
          ) {
            return "Source name is required for external article links.";
          }
          return true;
        }),
    }),
    defineField({
      name: "sourceUrl",
      title: "Source URL",
      type: "url",
      group: "source",
      fieldset: "source",
      hidden: ({ parent }) => parent?.resourceType !== "externalArticle",
      validation: (rule) =>
        rule.custom((value, { parent }) => {
          if (
            (parent as { resourceType?: string })?.resourceType ===
              "externalArticle" &&
            !value
          ) {
            return "Source URL is required for external article links.";
          }
          return true;
        }),
    }),
    defineField({
      name: "summary",
      title: "Summary",
      type: "blockContent",
      group: "source",
      hidden: ({ parent }) => parent?.resourceType !== "externalArticle",
    }),
    ...seoFields,
  ],
  preview: {
    select: {
      title: "title",
      resourceType: "resourceType",
    },
    prepare({ title, resourceType }) {
      const labels: Record<string, string> = {
        business: "Business",
        program: "Local Program",
        externalArticle: "External Article",
      };
      return {
        title,
        subtitle: labels[resourceType ?? "business"] ?? resourceType,
      };
    },
  },
});
