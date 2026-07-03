import { defineField, defineType } from "sanity";

export const heroBlock = defineType({
  name: "heroBlock",
  title: "Hero",
  type: "object",
  fields: [
    defineField({
      name: "heading",
      title: "Heading",
      type: "string",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "subheading",
      title: "Subheading",
      type: "text",
      rows: 2,
    }),
    defineField({
      name: "image",
      title: "Background Image",
      type: "image",
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
    defineField({
      name: "cta",
      title: "Call to Action",
      type: "link",
    }),
  ],
  preview: {
    select: { title: "heading" },
    prepare({ title }) {
      return { title: title || "Hero", subtitle: "Hero Section" };
    },
  },
});

export const richTextSection = defineType({
  name: "richTextSection",
  title: "Rich Text Section",
  type: "object",
  fields: [
    defineField({
      name: "heading",
      title: "Heading",
      type: "string",
    }),
    defineField({
      name: "body",
      title: "Body",
      type: "blockContent",
    }),
  ],
  preview: {
    select: { title: "heading" },
    prepare({ title }) {
      return { title: title || "Rich Text", subtitle: "Rich Text Section" };
    },
  },
});

export const featuredResources = defineType({
  name: "featuredResources",
  title: "Featured Resources",
  type: "object",
  fields: [
    defineField({
      name: "heading",
      title: "Heading",
      type: "string",
      initialValue: "Featured Resources",
    }),
    defineField({
      name: "resources",
      title: "Resources",
      type: "array",
      of: [{ type: "reference", to: [{ type: "resource" }] }],
      validation: (rule) => rule.max(6),
    }),
  ],
  preview: {
    select: { title: "heading" },
    prepare({ title }) {
      return { title: title || "Featured Resources", subtitle: "Featured Resources" };
    },
  },
});

export const featuredCategories = defineType({
  name: "featuredCategories",
  title: "Featured Categories",
  type: "object",
  fields: [
    defineField({
      name: "heading",
      title: "Heading",
      type: "string",
      initialValue: "Browse by Category",
    }),
    defineField({
      name: "categories",
      title: "Categories",
      type: "array",
      of: [{ type: "reference", to: [{ type: "category" }] }],
      validation: (rule) => rule.max(8),
    }),
  ],
  preview: {
    select: { title: "heading" },
    prepare({ title }) {
      return { title: title || "Featured Categories", subtitle: "Featured Categories" };
    },
  },
});

export const featuredArticles = defineType({
  name: "featuredArticles",
  title: "Featured Articles",
  type: "object",
  fields: [
    defineField({
      name: "heading",
      title: "Heading",
      type: "string",
      initialValue: "Latest News",
    }),
    defineField({
      name: "articles",
      title: "Articles",
      type: "array",
      of: [{ type: "reference", to: [{ type: "article" }] }],
      validation: (rule) => rule.max(6),
    }),
  ],
  preview: {
    select: { title: "heading" },
    prepare({ title }) {
      return { title: title || "Featured Articles", subtitle: "Featured Articles" };
    },
  },
});

export const featuredGuides = defineType({
  name: "featuredGuides",
  title: "Featured Guides",
  type: "object",
  fields: [
    defineField({
      name: "heading",
      title: "Heading",
      type: "string",
      initialValue: "Helpful Guides",
    }),
    defineField({
      name: "guides",
      title: "Guides",
      type: "array",
      of: [{ type: "reference", to: [{ type: "guide" }] }],
      validation: (rule) => rule.max(6),
    }),
  ],
  preview: {
    select: { title: "heading" },
    prepare({ title }) {
      return { title: title || "Featured Guides", subtitle: "Featured Guides" };
    },
  },
});

export const resourceGrid = defineType({
  name: "resourceGrid",
  title: "Resource Grid",
  type: "object",
  fields: [
    defineField({
      name: "heading",
      title: "Heading",
      type: "string",
      initialValue: "Local Resources",
    }),
    defineField({
      name: "category",
      title: "Filter by Category",
      type: "reference",
      to: [{ type: "category" }],
      description: "Optional — show resources from this category only.",
    }),
    defineField({
      name: "limit",
      title: "Number of Resources",
      type: "number",
      initialValue: 6,
      validation: (rule) => rule.min(1).max(24),
    }),
  ],
  preview: {
    select: { title: "heading", category: "category.title" },
    prepare({ title, category }) {
      return {
        title: title || "Resource Grid",
        subtitle: category ? `Category: ${category}` : "All resources",
      };
    },
  },
});

export const callToAction = defineType({
  name: "callToAction",
  title: "Call to Action",
  type: "object",
  fields: [
    defineField({
      name: "heading",
      title: "Heading",
      type: "string",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "body",
      title: "Body",
      type: "text",
      rows: 3,
    }),
    defineField({
      name: "link",
      title: "Button Link",
      type: "link",
      validation: (rule) => rule.required(),
    }),
  ],
  preview: {
    select: { title: "heading" },
    prepare({ title }) {
      return { title: title || "Call to Action", subtitle: "CTA" };
    },
  },
});

export const faqBlock = defineType({
  name: "faqBlock",
  title: "FAQ",
  type: "object",
  fields: [
    defineField({
      name: "heading",
      title: "Heading",
      type: "string",
      initialValue: "Frequently Asked Questions",
    }),
    defineField({
      name: "items",
      title: "Questions",
      type: "array",
      of: [
        {
          type: "object",
          fields: [
            defineField({
              name: "question",
              title: "Question",
              type: "string",
              validation: (rule) => rule.required(),
            }),
            defineField({
              name: "answer",
              title: "Answer",
              type: "text",
              rows: 3,
              validation: (rule) => rule.required(),
            }),
          ],
          preview: {
            select: { title: "question" },
          },
        },
      ],
    }),
  ],
  preview: {
    select: { title: "heading" },
    prepare({ title }) {
      return { title: title || "FAQ", subtitle: "FAQ Block" };
    },
  },
});

export const splitImage = defineType({
  name: "splitImage",
  title: "Split Image",
  type: "object",
  fields: [
    defineField({
      name: "heading",
      title: "Heading",
      type: "string",
    }),
    defineField({
      name: "body",
      title: "Body",
      type: "blockContent",
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
          validation: (rule) => rule.required(),
        }),
      ],
    }),
    defineField({
      name: "imagePosition",
      title: "Image Position",
      type: "string",
      options: {
        list: [
          { title: "Left", value: "left" },
          { title: "Right", value: "right" },
        ],
        layout: "radio",
      },
      initialValue: "right",
    }),
  ],
  preview: {
    select: { title: "heading" },
    prepare({ title }) {
      return { title: title || "Split Image", subtitle: "Split Image" };
    },
  },
});

export const communityAlert = defineType({
  name: "communityAlert",
  title: "Community Alert",
  type: "object",
  fields: [
    defineField({
      name: "message",
      title: "Alert Message",
      type: "text",
      rows: 2,
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "severity",
      title: "Severity",
      type: "string",
      options: {
        list: [
          { title: "Info", value: "info" },
          { title: "Warning", value: "warning" },
          { title: "Urgent", value: "urgent" },
        ],
        layout: "radio",
      },
      initialValue: "info",
    }),
    defineField({
      name: "link",
      title: "Learn More Link",
      type: "link",
    }),
    defineField({
      name: "expiresAt",
      title: "Expires At",
      type: "datetime",
      description: "Alert will stop showing after this date.",
    }),
  ],
  preview: {
    select: { title: "message", severity: "severity" },
    prepare({ title, severity }) {
      return {
        title: title?.slice(0, 60) || "Community Alert",
        subtitle: severity ? `Alert (${severity})` : "Community Alert",
      };
    },
  },
});
