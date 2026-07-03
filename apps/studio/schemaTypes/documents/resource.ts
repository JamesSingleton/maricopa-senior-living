import { PinIcon } from "@sanity/icons";
import { defineField, defineType } from "sanity";

import { isUniqueSlug } from "../../utils/validation";
import { seoField } from "../objects/seo";

export const resource = defineType({
  name: "resource",
  title: "Resource",
  type: "document",
  icon: PinIcon,
  description:
    "Local services, organizations, and programs seniors can contact. Phone number is required — most users call directly.",
  fields: [
    defineField({
      name: "title",
      title: "Name",
      type: "string",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "slug",
      title: "Slug",
      type: "slug",
      options: { source: "title", maxLength: 96 },
      validation: (rule) =>
        rule.required().custom(async (slug, context) => {
          if (!slug?.current) return "Slug is required";
          const unique = await isUniqueSlug(slug.current, context);
          return unique || "Slug is already in use";
        }),
    }),
    defineField({
      name: "description",
      title: "Description",
      type: "text",
      rows: 4,
      description:
        "Brief overview shown in listings and at the top of the detail page.",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "body",
      title: "Full Details",
      type: "blockContent",
      description: "Extended information about services, eligibility, etc.",
    }),
    defineField({
      name: "image",
      title: "Image",
      type: "image",
      options: { hotspot: true },
      fields: [
        defineField({
          name: "alt",
          title: "Alt Text",
          type: "string",
        }),
      ],
    }),
    defineField({
      name: "contact",
      title: "Contact Information",
      type: "contactInfo",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "hours",
      title: "Business Hours",
      type: "businessHours",
    }),
    defineField({
      name: "category",
      title: "Category",
      type: "reference",
      to: [{ type: "category" }],
      validation: (rule) => rule.required(),
      description:
        "Primary category — determines where this resource appears in navigation.",
    }),
    defineField({
      name: "tags",
      title: "Tags",
      type: "array",
      of: [
        {
          type: "reference",
          to: [{ type: "tag" }],
          options: { disableNew: true },
        },
      ],
      description:
        "Select existing tags only — search before adding. Do not create new tags here.",
    }),
    defineField({
      name: "lastVerified",
      title: "Last Verified",
      type: "date",
      description: "When contact info was last confirmed accurate.",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "featured",
      title: "Featured",
      type: "boolean",
      initialValue: false,
      description: "Show in featured resource blocks.",
    }),
    seoField,
  ],
  preview: {
    select: {
      title: "title",
      category: "category.title",
      phone: "contact.phone",
      media: "image",
    },
    prepare({ title, category, phone, media }) {
      return {
        title,
        subtitle: [category, phone].filter(Boolean).join(" · "),
        media,
      };
    },
  },
});
