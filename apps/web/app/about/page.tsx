import type { Metadata } from "next";

import { pageMetadata, renderCmsPage } from "@/lib/cms-page";

/** "About us" is an ordinary Studio page with the web address "about". */
export function generateMetadata(): Promise<Metadata> {
  return pageMetadata("about");
}

export default function AboutPage() {
  return renderCmsPage("about");
}
