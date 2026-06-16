import { CalendarIcon } from "@sanity/icons";
import { defineArrayMember, defineField, defineType } from "sanity";

import { createRadioListLayout } from "../../utils/helper";
import {
  publishableFields,
  seoFields,
  seoGroup,
  slugField,
  taxonomyFields,
} from "../shared";

export const event = defineType({
  name: "event",
  title: "Event",
  type: "document",
  icon: CalendarIcon,
  groups: [
    { name: "content", title: "Content", default: true },
    { name: "schedule", title: "Schedule & Location" },
    seoGroup,
  ],
  fields: [
    defineField({
      name: "title",
      title: "Title",
      type: "string",
      group: "content",
      validation: (rule) => rule.required(),
    }),
    slugField({ source: "title" }),
    defineField({
      name: "summary",
      title: "Summary",
      type: "text",
      rows: 2,
      group: "content",
      description: "Short summary for event cards and listings.",
    }),
    defineField({
      name: "description",
      title: "Description",
      type: "blockContent",
      group: "content",
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
          title: "Alt Text",
          type: "string",
          validation: (rule) => rule.required(),
        }),
      ],
    }),
    ...taxonomyFields.map((field) => ({ ...field, group: "content" })),
    ...publishableFields.map((field) => ({ ...field, group: "content" })),
    defineField({
      name: "startDateTime",
      title: "Start Date & Time",
      type: "datetime",
      group: "schedule",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "endDateTime",
      title: "End Date & Time",
      type: "datetime",
      group: "schedule",
    }),
    defineField({
      name: "locationType",
      title: "Location Type",
      type: "string",
      group: "schedule",
      options: createRadioListLayout([
        { title: "In Person", value: "inPerson" },
        { title: "Virtual", value: "virtual" },
        { title: "Hybrid", value: "hybrid" },
      ]),
      initialValue: "inPerson",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "address",
      title: "Address",
      type: "string",
      group: "schedule",
      hidden: ({ parent }) => parent?.locationType === "virtual",
    }),
    defineField({
      name: "virtualUrl",
      title: "Virtual Event URL",
      type: "url",
      group: "schedule",
      hidden: ({ parent }) => parent?.locationType === "inPerson",
    }),
    defineField({
      name: "registrationUrl",
      title: "Registration URL",
      type: "url",
      group: "schedule",
    }),
    defineField({
      name: "relatedResources",
      title: "Related Resources",
      type: "array",
      group: "content",
      of: [
        defineArrayMember({ type: "reference", to: [{ type: "resource" }] }),
      ],
    }),
    defineField({
      name: "recapBlog",
      title: "Event Recap Blog Post",
      type: "reference",
      to: [{ type: "blog" }],
      group: "content",
      description: "Optional link to a blog post recapping this event.",
    }),
    ...seoFields,
  ],
  preview: {
    select: {
      title: "title",
      start: "startDateTime",
      media: "image",
    },
    prepare({ title, start, media }) {
      return {
        title,
        subtitle: start ? new Date(start).toLocaleDateString() : "No date set",
        media,
      };
    },
  },
});
