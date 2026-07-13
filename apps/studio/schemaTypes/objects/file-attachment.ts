import { DocumentPdfIcon } from "@sanity/icons/DocumentPdf";
import { defineField, defineType } from "sanity";

export const fileAttachment = defineType({
  name: "fileAttachment",
  title: "File attachment",
  type: "object",
  icon: DocumentPdfIcon,
  fields: [
    defineField({
      name: "title",
      title: "Title",
      type: "string",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "description",
      title: "Description",
      type: "text",
      rows: 2,
    }),
    defineField({
      name: "file",
      title: "File",
      type: "file",
      options: {
        accept: ".pdf,.doc,.docx,.xls,.xlsx,.txt",
      },
      validation: (rule) => rule.required(),
    }),
  ],
  preview: {
    select: {
      title: "title",
      filename: "file.asset.originalFilename",
    },
    prepare({ title, filename }) {
      return {
        title: title || "Untitled file",
        subtitle: filename,
        media: DocumentPdfIcon,
      };
    },
  },
});
