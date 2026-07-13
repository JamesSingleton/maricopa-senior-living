import { DocumentPdfIcon } from "@sanity/icons/DocumentPdf";
import { ImageIcon } from "@sanity/icons/Image";
import type { ReactNode } from "react";
import { defineArrayMember, defineField, defineType } from "sanity";

const _HighlightDecorator = (props: { children?: ReactNode }) => (
  <span style={{ backgroundColor: "yellow" }}>{props.children}</span>
);

/**
 * Portable Text for article/guide bodies and rich-text blocks.
 *
 * Note: setting `styles`, `lists`, or `marks.decorators` replaces Sanity's
 * block defaults for that section (they do not merge). Only override when
 * you need a different set.
 */
export const portableText = defineType({
  name: "portableText",
  title: "Rich text",
  type: "array",
  of: [
    defineArrayMember({
      type: "block",
      // Override defaults to omit h1 (document title is the h1) and h5/h6.
      styles: [
        { title: "Normal", value: "normal" },
        { title: "Heading 2", value: "h2" },
        { title: "Heading 3", value: "h3" },
        { title: "Heading 4", value: "h4" },
        { title: "Heading 5", value: "h5" },
        { title: "Heading 6", value: "h6" },
        { title: "Quote", value: "blockquote" },
      ],
      // lists omitted — Sanity defaults to bullet + number
      marks: {
        annotations: [
          {
            name: "link",
            type: "object",
            title: "Link",
            fields: [
              defineField({
                name: "href",
                title: "URL",
                type: "url",
                validation: (rule) =>
                  rule.uri({
                    scheme: ["http", "https", "mailto", "tel"],
                  }),
              }),
              defineField({
                name: "openInNewTab",
                title: "Open in new tab",
                type: "boolean",
                initialValue: false,
              }),
            ],
          },
        ],
      },
    }),
    defineArrayMember({
      type: "image",
      icon: ImageIcon,
      options: { hotspot: true },
      fields: [
        defineField({
          name: "alt",
          title: "Alternative text",
          type: "string",
          validation: (rule) => rule.required(),
        }),
        defineField({
          name: "caption",
          title: "Caption",
          type: "string",
        }),
      ],
    }),
    defineArrayMember({
      type: "file",
      name: "attachment",
      icon: DocumentPdfIcon,
      fields: [
        defineField({
          name: "description",
          title: "Description",
          type: "string",
          validation: (rule) => rule.required(),
        }),
      ],
    }),
  ],
});
