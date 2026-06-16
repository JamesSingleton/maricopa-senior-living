import { article } from "./article";
import { author } from "./author";
import { blog } from "./blog";
import { blogIndex } from "./blog-index";
import { category } from "./category";
import { event } from "./event";
import { footer } from "./footer";
import { home } from "./home";
import { navbar } from "./navbar";
import { page } from "./page";
import { resource } from "./resource";
import { settings } from "./settings";
import { tag } from "./tag";

export const singletons = [home, blogIndex, settings, navbar, footer];

export const documents = [
  author,
  category,
  tag,
  page,
  blog,
  article,
  event,
  resource,
  ...singletons,
];
