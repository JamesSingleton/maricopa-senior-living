import { PinIcon } from "@sanity/icons/Pin";
import { defineArrayMember, defineField, defineType } from "sanity";

import { howToField } from "../../components/HowTo";
import { slugField } from "../../utils/slug";
import {
  needsReviewField,
  summaryField,
  topicsField,
  warnIfDuplicate,
} from "../shared";

/**
 * A real organization or service someone can contact. Outside articles and
 * websites with no way to reach a person are Helpful links instead.
 */
export const resource = defineType({
  name: "resource",
  type: "document",
  icon: PinIcon,
  groups: [
    { name: "basics", title: "Basics", default: true },
    { name: "contact", title: "How to reach them" },
    { name: "details", title: "More details" },
  ],
  fields: [
    {
      ...howToField("howTo", [
        "A resource is an organization or service people can call or visit — for example a food bank, a clinic or a transportation program.",
        "If it's just an article or a website to read, add a Helpful link instead.",
      ]),
      group: "basics",
    },
    defineField({
      name: "title",
      title: "Name",
      type: "string",
      group: "basics",
      validation: (rule) => [
        rule.required(),
        rule.custom(warnIfDuplicate("title")).warning(),
      ],
    }),
    { ...slugField({ prefix: "/resources" }), group: "basics" },
    { ...summaryField(), group: "basics" },
    { ...topicsField(), group: "basics" },
    defineField({
      name: "serviceArea",
      title: "Who it serves",
      type: "string",
      group: "basics",
      initialValue: "maricopa",
      options: {
        layout: "radio",
        list: [
          { title: "City of Maricopa", value: "maricopa" },
          { title: "Pinal County", value: "pinal" },
          { title: "Arizona", value: "arizona" },
          { title: "Anywhere (national)", value: "national" },
        ],
      },
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "isGovernment",
      title: "Government office or program",
      type: "boolean",
      group: "basics",
      initialValue: false,
    }),
    defineField({
      name: "phones",
      title: "Phone numbers",
      type: "array",
      group: "contact",
      description: "Add each number separately so the website can call it.",
      of: [defineArrayMember({ type: "phoneNumber" })],
    }),
    defineField({
      name: "email",
      type: "email",
      group: "contact",
    }),
    defineField({
      name: "website",
      type: "url",
      group: "contact",
      validation: (rule) => [
        rule.uri({ scheme: ["http", "https"] }),
        rule.custom(warnIfDuplicate("website")).warning(),
      ],
    }),
    defineField({
      name: "address",
      title: "Street address",
      type: "text",
      rows: 2,
      group: "contact",
    }),
    defineField({
      name: "hours",
      title: "Opening hours",
      type: "array",
      group: "contact",
      description: 'Days you leave out are shown as "Closed".',
      of: [defineArrayMember({ type: "openingHours" })],
    }),
    defineField({
      name: "hoursNote",
      title: "Note about hours",
      type: "string",
      group: "contact",
      description: 'For example "By appointment" or "Closed on holidays".',
    }),
    defineField({
      name: "description",
      title: "More about this resource",
      type: "simpleText",
      group: "details",
    }),
    defineField({
      name: "eligibility",
      title: "Who can use it",
      type: "text",
      rows: 3,
      group: "details",
      description: 'For example "Age 60+ living in Pinal County".',
    }),
    defineField({
      name: "cost",
      type: "string",
      group: "details",
      description: 'For example "Free", "Sliding scale", "$5 per ride".',
    }),
    defineField({
      name: "attachments",
      title: "Forms or brochures (PDF)",
      type: "array",
      group: "details",
      of: [
        defineArrayMember({
          type: "file",
          options: { accept: "application/pdf" },
          fields: [
            defineField({
              name: "title",
              type: "string",
              validation: (rule) => rule.required(),
            }),
          ],
        }),
      ],
    }),
    defineField({
      name: "lastVerified",
      title: "Last checked",
      type: "date",
      group: "details",
      description:
        "When you last confirmed the phone number and details are right.",
    }),
    { ...needsReviewField, group: "details" },
    defineField({
      name: "legacyId",
      type: "string",
      group: "details",
      readOnly: true,
      hidden: true,
    }),
  ],
  validation: (rule) =>
    rule.custom((doc) => {
      const d = doc as {
        phones?: unknown[];
        email?: string;
        website?: string;
        address?: string;
      };
      return d?.phones?.length || d?.email || d?.website || d?.address
        ? true
        : "Add at least one way to reach them: a phone number, email, website or address.";
    }),
  preview: {
    select: {
      title: "title",
      phone: "phones.0.number",
      review: "needsReview",
    },
    prepare: ({ title, phone, review }) => ({
      title,
      subtitle: [review ? "Needs review" : null, phone]
        .filter(Boolean)
        .join(" · "),
    }),
  },
});
