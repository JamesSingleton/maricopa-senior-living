import { callToAction } from "./call-to-action";
import { faq } from "./faq";
import { featuredArticles } from "./featured-articles";
import { featuredBlogPosts } from "./featured-blog-posts";
import { featuredEvents } from "./featured-events";
import { featuredResources } from "./featured-resources";
import { hero } from "./hero";
import { richTextBlock } from "./rich-text-block";
import { splitImage } from "./split-image";

export const blocks = [
  hero,
  richTextBlock,
  splitImage,
  featuredResources,
  featuredEvents,
  featuredBlogPosts,
  featuredArticles,
  callToAction,
  faq,
];

export {
  callToAction,
  faq,
  featuredArticles,
  featuredBlogPosts,
  featuredEvents,
  featuredResources,
  hero,
  richTextBlock,
  splitImage,
};
