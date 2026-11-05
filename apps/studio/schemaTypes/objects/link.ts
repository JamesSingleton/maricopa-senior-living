import { LinkIcon } from "@sanity/icons/Link";
import { defineField, defineType } from "sanity";

/** Every document type a link can point at on this site. */
export const LINKABLE_TYPES = [
  { type: "page" },
  { type: "article" },
  { type: "resource" },
  { type: "event" },
  { type: "topic" },
  { type: "monthlyUpdate" },
  { type: "newsletterEdition" },
];

/** Fixed sections of the website (routes, not documents). */
export const SITE_SECTIONS = [
  { title: "Find Help (resources)", value: "/resources" },
  { title: "Topics", value: "/topics" },
  { title: "What's New", value: "/whats-new" },
  { title: "Events calendar", value: "/events" },
  { title: "Newsletter", value: "/newsletter" },
  { title: "Articles", value: "/articles" },
  { title: "Helpful links", value: "/links" },
  { title: "About Maricopa Senior Living", value: "/about" },
  { title: "Search", value: "/search" },
];

/**
 * A link that is either a page on this site (picked from a list, so it never
 * breaks when a web address changes) or another website / phone / email.
 */
export const link = defineType({
  name: "link",
  title: "Link",
  type: "object",
  icon: LinkIcon,
  fields: [
    defineField({
      name: "label",
      title: "Button or link text",
      type: "string",
      description: 'What people click, e.g. "See upcoming events".',
      validation: (rule) => rule.required().max(60),
    }),
    defineField({
      name: "kind",
      title: "Where does it go?",
      type: "string",
      initialValue: "internal",
      options: {
        layout: "radio",
        list: [
          { title: "A page on this website", value: "internal" },
          { title: "A section of this website", value: "section" },
          { title: "Another website", value: "external" },
          { title: "A phone number", value: "phone" },
          { title: "An email address", value: "email" },
        ],
      },
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "reference",
      title: "Page on this website",
      type: "reference",
      to: LINKABLE_TYPES,
      hidden: ({ parent }) => parent?.kind !== "internal",
      validation: (rule) =>
        rule.custom((value, { parent }) =>
          (parent as { kind?: string })?.kind === "internal" && !value
            ? "Pick the page this link goes to."
            : true,
        ),
    }),
    defineField({
      name: "section",
      title: "Section",
      type: "string",
      options: { list: SITE_SECTIONS },
      hidden: ({ parent }) => parent?.kind !== "section",
      validation: (rule) =>
        rule.custom((value, { parent }) =>
          (parent as { kind?: string })?.kind === "section" && !value
            ? "Pick a section."
            : true,
        ),
    }),
    defineField({
      name: "url",
      title: "Website address",
      type: "url",
      description: "Starts with https://",
      hidden: ({ parent }) => parent?.kind !== "external",
      validation: (rule) =>
        rule.uri({ scheme: ["http", "https"] }).custom((value, { parent }) =>
          (parent as { kind?: string })?.kind === "external" && !value
            ? "Paste the website address."
            : true,
        ),
    }),
    defineField({
      name: "phone",
      title: "Phone number",
      type: "string",
      description: "For example 520-568-3673",
      hidden: ({ parent }) => parent?.kind !== "phone",
      validation: (rule) =>
        rule.custom((value, { parent }) => {
          if ((parent as { kind?: string })?.kind !== "phone") return true;
          return value && value.replace(/\D/g, "").length >= 10
            ? true
            : "Enter the full 10-digit phone number.";
        }),
    }),
    defineField({
      name: "email",
      title: "Email address",
      type: "email",
      hidden: ({ parent }) => parent?.kind !== "email",
    }),
  ],
  preview: {
    select: {
      label: "label",
      kind: "kind",
      ref: "reference.title",
      section: "section",
      url: "url",
      phone: "phone",
      email: "email",
    },
    prepare: ({ label, kind, ref, section, url, phone, email }) => ({
      title: label,
      subtitle:
        { internal: ref, section, external: url, phone, email }[
          kind as string
        ] ?? "",
    }),
  },
});
