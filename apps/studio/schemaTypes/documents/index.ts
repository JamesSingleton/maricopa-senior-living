import { author } from "./author";
import { category } from "./category";
import { footer } from "./footer";
import { navbar } from "./navbar";
import { page } from "./page";
import { post } from "./post";
import { service } from "./service";
import { settings } from "./settings";
import { tag } from "./tag";

export const singletons = [settings, footer, navbar];

export const documents = [
  author,
  category,
  page,
  post,
  service,
  tag,
  ...singletons,
];
