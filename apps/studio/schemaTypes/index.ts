import { pageBlocks, pageBuilder } from "./blocks";
import { article } from "./documents/article";
import { author } from "./documents/author";
import { event } from "./documents/event";
import { helpfulLink } from "./documents/helpful-link";
import { monthlyUpdate } from "./documents/monthly-update";
import { newsletterEdition } from "./documents/newsletter-edition";
import { resource } from "./documents/resource";
import { home, navigation, page, redirect, settings } from "./documents/site";
import { topic } from "./documents/topic";
import { openingHours, phoneNumber } from "./objects/contact";
import { link } from "./objects/link";
import { imageWithAlt, richText, simpleText } from "./objects/rich-text";
import { postalAddress, seo } from "./objects/seo";

export const schemaTypes = [
  // Content Ron creates
  monthlyUpdate,
  event,
  resource,
  helpfulLink,
  article,
  newsletterEdition,
  page,
  author,
  // Structure (admin)
  topic,
  home,
  settings,
  navigation,
  redirect,
  // Shared objects
  link,
  richText,
  simpleText,
  imageWithAlt,
  seo,
  postalAddress,
  phoneNumber,
  openingHours,
  pageBuilder,
  ...pageBlocks,
];
