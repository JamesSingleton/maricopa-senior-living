import { author } from "./author";
import { category } from "./category";
import { home } from "./home";
import { navigation } from "./navigation";
import { page } from "./page";
import { post } from "./post";
import { service } from "./service";
import { tag } from "./tag";

export const singletons = [home, navigation];

export const documents = [
  author,
  page,
  post,
  service,
  tag,
  category,
  ...singletons,
];
