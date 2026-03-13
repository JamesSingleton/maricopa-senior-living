import type { MetadataRoute } from "next";

import { baseUrl } from "@/lib/constants";

export default async function sitemap(): Promise<
  Promise<Promise<MetadataRoute.Sitemap>>
> {
  const routesMap = ["", "/articles"].map((route) => ({
    url: `${baseUrl}${route}`,
    lastModified: new Date().toISOString(),
  }));

  return [...routesMap];
}
