import { DocumentPdfIcon, ImageIcon } from "@sanity/icons";
import type { JSXElementConstructor, ReactElement, ReactPortal } from "react";
import { defineArrayMember, defineField, defineType } from "sanity";

interface DecartorProps {
  children:
    | string
    | number
    | boolean
    | ReactElement<any, string | JSXElementConstructor<any>>
    | ReactPortal
    | null
    | undefined;
}

const HighlightIcon = () => <span style={{ fontWeight: "bold" }}>H</span>;
const HighlightDecorator = (props: DecartorProps) => (
  <span style={{ backgroundColor: "yellow" }}>{props.children}</span>
);

const SuperscriptIcon = () => (
  <span style={{ fontSize: "0.8em" }}>
    x<sup>2</sup>
  </span>
);
const SuperscriptDecorator = (props: DecartorProps) => (
  <sup>{props.children}</sup>
);

const SubscriptIcon = () => (
  <span style={{ fontSize: "0.8em" }}>
    x<sub>2</sub>
  </span>
);
const SubscriptDecorator = (props: DecartorProps) => (
  <sub>{props.children}</sub>
);

export const blockContent = defineType({
  title: "Block Content",
  name: "blockContent",
  type: "array",
  of: [
    defineArrayMember({
      title: "Block",
      type: "block",
      // Marks let you mark up inline text in the block editor.
      marks: {
        // Decorators usually describe a single property – e.g. a typographic
        // preference or highlighting by editors.
        decorators: [
          { title: "Strong", value: "strong" },
          { title: "Emphasis", value: "em" },
          { title: "Code", value: "code" },
          { title: "Underline", value: "underline" },
          { title: "Strike", value: "strike-through" },
          {
            title: "Highlight",
            value: "highlight",
            icon: HighlightIcon,
            component: HighlightDecorator,
          },
          {
            title: "Sub",
            value: "sub",
            icon: SubscriptIcon,
            component: SubscriptDecorator,
          },
          {
            title: "Super",
            value: "sup",
            icon: SuperscriptIcon,
            component: SuperscriptDecorator,
          },
        ],
        // Annotations can be any object structure – e.g. a link or a footnote.
        annotations: [
          {
            title: "URL",
            name: "link",
            type: "object",
            fields: [
              {
                title: "URL",
                name: "href",
                type: "url",
                validation: (rule) =>
                  rule.uri({
                    scheme: ["http", "https", "mailto", "tel"],
                  }),
              },
            ],
          },
        ],
      },
    }),
    // You can add additional types here. Note that you can't use
    // primitive types such as 'string' and 'number' in the same array
    // as a block type.
    defineArrayMember({
      type: "image",
      options: { hotspot: true },
      icon: ImageIcon,
      fields: [
        defineField({
          name: "alt",
          title: "Alt Text",
          type: "string",
          description: "Alternative text for screen readers.",
          validation: (rule) => rule.required(),
        }),
      ],
      validation: (rule) => rule.required().assetRequired(),
    }),
    defineArrayMember({
      type: "file",
      icon: DocumentPdfIcon,
      name: "attachment",
      fields: [
        defineField({
          name: "description",
          title: "Description",
          type: "string",
          description:
            "Description of the document. Will be displayed in the post.",
          validation: (rule) => rule.required(),
        }),
      ],
      validation: (rule) => rule.required().assetRequired(),
    }),
  ],
});
