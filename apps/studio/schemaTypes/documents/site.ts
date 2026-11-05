import { CogIcon } from "@sanity/icons/Cog";
import { DocumentIcon } from "@sanity/icons/Document";
import { HomeIcon } from "@sanity/icons/Home";
import { MenuIcon } from "@sanity/icons/Menu";
import { TransferIcon } from "@sanity/icons/Transfer";
import { defineArrayMember, defineField, defineType } from "sanity";

import { withHowTo } from "../../components/HowTo";
import { adminOnly } from "../../lib/access";
import { slugField } from "../../utils/slug";

/** Pages built from sections: About us (/about), Donate, Quick Links… */
export const page = defineType({
  name: "page",
  type: "document",
  icon: DocumentIcon,
  components: {
    input: withHowTo([
      "Build a page from sections: click “Add item” and choose what you need — text, pictures, a list of resources, phone numbers, a donate button…",
      "The “About us” page uses the web address “about”. Link to your other nonprofit pages (Donate, Contact…) from it with a Buttons section.",
    ]),
  },
  fields: [
    defineField({
      name: "title",
      type: "string",
      validation: (rule) => rule.required().max(80),
    }),
    slugField({ reserved: true }),
    defineField({
      name: "description",
      title: "Short description",
      type: "text",
      rows: 2,
      description: "Shown in search engines and when the page is shared.",
      validation: (rule) => rule.max(200),
    }),
    defineField({
      name: "sections",
      type: "pageBuilder",
      validation: (rule) => rule.required().min(1),
    }),
  ],
  preview: {
    select: { title: "title", slug: "slug.current" },
    prepare: ({ title, slug }) => ({ title, subtitle: `/${slug ?? ""}` }),
  },
});

export const home = defineType({
  name: "home",
  title: "Home page",
  type: "document",
  icon: HomeIcon,
  components: {
    input: withHowTo([
      "These sections make up the home page, top to bottom. Drag them to reorder.",
    ]),
  },
  fields: [
    defineField({
      name: "title",
      type: "string",
      initialValue: "Home",
      hidden: true,
    }),
    defineField({
      name: "sections",
      type: "pageBuilder",
      validation: (rule) => rule.required().min(1),
    }),
  ],
  preview: { prepare: () => ({ title: "Home page" }) },
});

export const settings = defineType({
  name: "settings",
  title: "Site settings",
  type: "document",
  icon: CogIcon,
  readOnly: adminOnly,
  groups: [
    { name: "site", title: "Site", default: true },
    { name: "contact", title: "Contact & donate" },
    { name: "newsletter", title: "Newsletter" },
  ],
  fields: [
    defineField({
      name: "siteTitle",
      type: "string",
      group: "site",
      initialValue: "Maricopa Senior Living",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "tagline",
      type: "string",
      group: "site",
      initialValue: "A directory of resources to help you age your way!",
    }),
    defineField({
      name: "description",
      type: "text",
      rows: 2,
      group: "site",
      description: "Shown in search engines.",
    }),
    defineField({
      name: "heroImage",
      title: "Main picture",
      type: "imageWithAlt",
      group: "site",
      description: "The wild horses photo used at the top of the site.",
    }),
    defineField({
      name: "contactEmail",
      type: "email",
      group: "contact",
    }),
    defineField({
      name: "contactPhone",
      type: "phoneNumber",
      group: "contact",
    }),
    defineField({
      name: "mailingAddress",
      type: "text",
      rows: 2,
      group: "contact",
      description:
        "Required in newsletter emails by law (CAN-SPAM). A PO box is fine.",
    }),
    defineField({
      name: "donateUrl",
      title: "Donate link",
      type: "url",
      group: "contact",
    }),
    defineField({
      name: "nonprofitStatement",
      type: "string",
      group: "contact",
      initialValue: "Maricopa Senior Living is an Arizona 501(c)(3) nonprofit.",
    }),
    defineField({
      name: "newsletterTitle",
      type: "string",
      group: "newsletter",
      initialValue: "Keeping you informed…still",
    }),
    defineField({
      name: "newsletterDedication",
      type: "string",
      group: "newsletter",
      description:
        'Optional line shown with the newsletter, e.g. "Founded by Joan Koczor as Keeping you informed".',
    }),
    defineField({
      name: "subscribeInstructions",
      type: "text",
      rows: 2,
      group: "newsletter",
      initialValue:
        "Subscribe today! It's free, quick & easy. Email your name to rondsmithaz@msn.com.",
    }),
  ],
  preview: { prepare: () => ({ title: "Site settings" }) },
});

export const navigation = defineType({
  name: "navigation",
  title: "Menus",
  type: "document",
  icon: MenuIcon,
  readOnly: adminOnly,
  fields: [
    defineField({
      name: "main",
      title: "Main menu",
      type: "array",
      description: "Up to 6 links. No drop-downs, so they're easy to use.",
      of: [defineArrayMember({ type: "link" })],
      validation: (rule) => rule.max(6),
    }),
    defineField({
      name: "footer",
      title: "Footer links",
      type: "array",
      of: [defineArrayMember({ type: "link" })],
      validation: (rule) => rule.max(12),
    }),
  ],
  preview: { prepare: () => ({ title: "Menus" }) },
});

/** Old web addresses that should send visitors somewhere new. */
export const redirect = defineType({
  name: "redirect",
  type: "document",
  icon: TransferIcon,
  readOnly: adminOnly,
  fields: [
    defineField({
      name: "source",
      title: "Old address",
      type: "string",
      description: "Starts with /, e.g. /category/pets",
      validation: (rule) =>
        rule
          .required()
          .custom((value) =>
            value?.startsWith("/") ? true : "Must start with /",
          ),
    }),
    defineField({
      name: "destination",
      title: "New address",
      type: "string",
      description: "Starts with / or https://",
      validation: (rule) =>
        rule
          .required()
          .custom((value) =>
            value?.startsWith("/") || value?.startsWith("https://")
              ? true
              : "Must start with / or https://",
          ),
    }),
    defineField({
      name: "permanent",
      type: "boolean",
      initialValue: true,
    }),
  ],
  preview: {
    select: { title: "source", subtitle: "destination" },
  },
});
