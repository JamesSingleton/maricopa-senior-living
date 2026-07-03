import {
  parseAsArrayOf,
  parseAsInteger,
  parseAsString,
  createSearchParamsCache,
} from "nuqs/server";

export const searchParamsParsers = {
  q: parseAsString.withDefault(""),
  tags: parseAsArrayOf(parseAsString).withDefault([]),
  categories: parseAsArrayOf(parseAsString).withDefault([]),
  page: parseAsInteger.withDefault(1),
};

export const searchParamsCache = createSearchParamsCache(searchParamsParsers);

export const PAGE_SIZE = 12;
