import { defineField, defineType } from "sanity";

export const contactInfo = defineType({
  name: "contactInfo",
  title: "Contact Information",
  type: "object",
  fields: [
    defineField({
      name: "phone",
      title: "Phone",
      type: "string",
      description: "Include area code — seniors often call directly from this number.",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "email",
      title: "Email",
      type: "string",
      validation: (rule) => rule.email(),
    }),
    defineField({
      name: "website",
      title: "Website",
      type: "url",
    }),
    defineField({
      name: "streetAddress",
      title: "Street Address",
      type: "string",
    }),
    defineField({
      name: "city",
      title: "City",
      type: "string",
      initialValue: "Maricopa",
    }),
    defineField({
      name: "state",
      title: "State",
      type: "string",
      initialValue: "AZ",
    }),
    defineField({
      name: "zip",
      title: "ZIP Code",
      type: "string",
    }),
  ],
});
