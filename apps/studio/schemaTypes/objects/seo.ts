import { EarthGlobeIcon } from "@sanity/icons/EarthGlobe";
import { PinIcon } from "@sanity/icons/Pin";
import { defineField, defineType } from "sanity";

/**
 * Optional overrides for search engines and link previews. Everything here
 * falls back to the document's own title, summary and picture, so Ron never
 * has to fill it in.
 */
export const seo = defineType({
  name: "seo",
  title: "Search & sharing",
  type: "object",
  icon: EarthGlobeIcon,
  options: { collapsible: true, collapsed: true },
  description:
    "Optional. Only fill this in to change how the page looks in Google or when shared. Otherwise the title, summary and main picture are used.",
  fields: [
    defineField({
      name: "title",
      title: "Title in search results",
      type: "string",
      description: "Up to 60 characters.",
      validation: (rule) =>
        rule
          .max(60)
          .warning("Google cuts titles off after about 60 characters."),
    }),
    defineField({
      name: "description",
      title: "Description in search results",
      type: "text",
      rows: 3,
      description: "One or two sentences, up to 160 characters.",
      validation: (rule) =>
        rule
          .max(160)
          .warning("Google cuts descriptions off after about 160 characters."),
    }),
    defineField({
      name: "image",
      title: "Picture when shared",
      type: "image",
      description:
        "Shown when someone shares the link (Facebook, email). Wide pictures work best.",
      options: { hotspot: true },
    }),
    defineField({
      name: "noIndex",
      title: "Hide from search engines",
      type: "boolean",
      description: "Rarely needed — for example a page only for volunteers.",
      initialValue: false,
    }),
  ],
});

/**
 * A street address split into parts, so the website can mark it up for
 * search engines and build reliable map links.
 */
export const postalAddress = defineType({
  name: "postalAddress",
  title: "Address",
  type: "object",
  icon: PinIcon,
  fields: [
    defineField({
      name: "street",
      title: "Street",
      type: "string",
      description: 'For example "41600 W Smith-Enke Rd, Bldg 15"',
    }),
    defineField({
      name: "city",
      type: "string",
      initialValue: "Maricopa",
    }),
    defineField({
      name: "state",
      type: "string",
      initialValue: "AZ",
      validation: (rule) =>
        rule.custom((value) =>
          !value || /^[A-Z]{2}$/.test(value)
            ? true
            : "Use the two-letter state, e.g. AZ.",
        ),
    }),
    defineField({
      name: "zip",
      title: "ZIP code",
      type: "string",
      validation: (rule) =>
        rule.custom((value) =>
          !value || /^\d{5}(-\d{4})?$/.test(value)
            ? true
            : "Use a 5-digit ZIP code.",
        ),
    }),
    defineField({
      name: "note",
      type: "string",
      description:
        'Optional, e.g. "Inside the Library, Room B" or "Mailing address only".',
    }),
  ],
  preview: {
    select: { street: "street", city: "city", state: "state", zip: "zip" },
    prepare: ({ street, city, state, zip }) => ({
      title: street || "Address",
      subtitle: [city, [state, zip].filter(Boolean).join(" ")]
        .filter(Boolean)
        .join(", "),
    }),
  },
});

/** Shared field: optional search & sharing overrides. */
export const seoField = defineField({
  name: "seo",
  title: "Search & sharing",
  type: "seo",
});
