import { CogIcon } from "@sanity/icons";
import { defineField, defineType } from "sanity";
import { seoField } from "../objects/seo";

export const siteSettings = defineType({
  name: "siteSettings",
  title: "Site Settings",
  type: "document",
  icon: CogIcon,
  description: "Global site configuration — title, description, and default SEO.",
  fields: [
    defineField({
      name: "title",
      title: "Site Title",
      type: "string",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "description",
      title: "Site Description",
      type: "text",
      rows: 3,
      description: "Default description for search engines.",
    }),
    defineField({
      name: "logo",
      title: "Logo",
      type: "image",
      options: { hotspot: true },
    }),
    defineField({
      name: "favicon",
      title: "Favicon",
      type: "image",
    }),
    defineField({
      name: "ogImage",
      title: "Default Social Image",
      type: "image",
      description: "Default Open Graph image (1200×630).",
    }),
    defineField({
      name: "contactEmail",
      title: "Contact Email",
      type: "string",
      validation: (rule) => rule.email(),
    }),
    defineField({
      name: "contactPhone",
      title: "Contact Phone",
      type: "string",
    }),
    seoField,
  ],
  preview: {
    prepare() {
      return { title: "Site Settings" };
    },
  },
});
