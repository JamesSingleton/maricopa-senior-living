import { blockContent } from "./definitions/block-content";
import { dayAndTime } from "./definitions/day-and-time";
import { timeValue } from "./definitions/time-value";
import {
  callToAction,
  communityAlert,
  faqBlock,
  featuredArticles,
  featuredCategories,
  featuredGuides,
  featuredResources,
  heroBlock,
  resourceGrid,
  richTextSection,
  splitImage,
} from "./blocks";
import { article } from "./documents/article";
import { author } from "./documents/author";
import { category } from "./documents/category";
import { guide } from "./documents/guide";
import { page } from "./documents/page";
import { resource } from "./documents/resource";
import { tag } from "./documents/tag";
import { businessHours } from "./objects/business-hours";
import { contactInfo } from "./objects/contact-info";
import { howToStep } from "./objects/how-to-step";
import { link } from "./objects/link";
import { pageBuilder } from "./objects/page-builder";
import { seo } from "./objects/seo";
import { syndication } from "./objects/syndication";
import { homePage } from "./singletons/home-page";
import { mainNavigation } from "./singletons/main-navigation";
import { siteFooter } from "./singletons/site-footer";
import { siteSettings } from "./singletons/site-settings";

export type SchemaType = (typeof schemaTypes)[number]["name"];
export type SingletonType =
  | "siteSettings"
  | "homePage"
  | "mainNavigation"
  | "siteFooter";

export const schemaTypes = [
  // Definitions (legacy location — portable text, time)
  blockContent,
  dayAndTime,
  timeValue,

  // Objects
  seo,
  link,
  contactInfo,
  syndication,
  howToStep,
  businessHours,
  pageBuilder,

  // Page builder blocks
  heroBlock,
  richTextSection,
  featuredResources,
  featuredCategories,
  featuredArticles,
  featuredGuides,
  resourceGrid,
  callToAction,
  faqBlock,
  splitImage,
  communityAlert,

  // Documents
  resource,
  article,
  guide,
  category,
  tag,
  author,
  page,

  // Singletons
  siteSettings,
  homePage,
  mainNavigation,
  siteFooter,
];
