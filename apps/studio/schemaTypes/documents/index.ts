import { article } from "./article";
import { author } from "./author";
import { category } from "./category";
import { homePage } from "./home-page";
import { navigation } from "./navigation";
import { page } from "./page";
import { resource } from "./resource";
import { settings } from "./settings";
import { tag } from "./tag";

export const documents = [
  homePage,
  page,
  resource,
  article,
  category,
  tag,
  author,
  settings,
  navigation,
];

export const singletons = [homePage, settings, navigation];
