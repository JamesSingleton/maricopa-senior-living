import type { SlugDefinition, SlugOptions } from "sanity";

export type PathnameOptions = SlugOptions & {
  i18n?: {
    enabled?: boolean;
    defaultLocaleId?: string;
  };
};

export type PathnameParams = Omit<
  SlugDefinition,
  "type" | "options" | "name"
> & {
  name?: string;
  options?: PathnameOptions;
};
