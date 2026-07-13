import { CogIcon } from "@sanity/icons/Cog";
import { defineField, defineType } from "sanity";

export const settings = defineType({
  name: "settings",
  title: "Site settings",
  type: "document",
  icon: CogIcon,
  groups: [
    { name: "site", title: "Site", default: true },
    { name: "contact", title: "Contact" },
    { name: "seo", title: "Default SEO" },
  ],
  fields: [
    defineField({
      name: "siteTitle",
      title: "Site title",
      type: "string",
      group: "site",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "siteDescription",
      title: "Site description",
      type: "text",
      rows: 3,
      group: "site",
    }),
    defineField({
      name: "logo",
      title: "Logo",
      type: "image",
      group: "site",
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
      name: "footerBlurb",
      title: "Footer blurb",
      type: "text",
      rows: 3,
      group: "site",
      description: "Short text shown in the site footer.",
    }),
    defineField({
      name: "phone",
      title: "Phone",
      type: "string",
      group: "contact",
    }),
    defineField({
      name: "email",
      title: "Email",
      type: "string",
      group: "contact",
      validation: (rule) => rule.email(),
    }),
    defineField({
      name: "address",
      title: "Address",
      type: "text",
      rows: 3,
      group: "contact",
    }),
    defineField({
      name: "seo",
      title: "Default SEO",
      type: "seo",
      group: "seo",
      description: "Fallback metadata when a page does not set its own SEO.",
    }),
  ],
  preview: {
    prepare() {
      return {
        title: "Site settings",
        media: CogIcon,
      };
    },
  },
});
