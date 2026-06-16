import { defineField } from "sanity";

import { createSlug, isUnique } from "../../utils/slug";

type SlugFieldOptions = {
  source?: string;
  title?: string;
  description?: string;
};

export const slugField = (options: SlugFieldOptions = {}) =>
  defineField({
    name: "slug",
    title: options.title ?? "Web Address",
    type: "slug",
    description:
      options.description ??
      "This is the last part of the link people see. It's usually created automatically from the title — only change it if you know what you're doing.",
    options: {
      source: options.source ?? "title",
      slugify: createSlug,
      maxLength: 96,
      isUnique,
    },
    validation: (rule) => rule.required(),
  });
