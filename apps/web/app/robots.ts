import type { MetadataRoute } from "next";

import { baseUrl } from "@/lib/constants";

/**
 * Everything public is open to search engines and to AI assistants
 * (ChatGPT, Claude, Perplexity, Google's AI answers), so they can cite this
 * guide when seniors ask about local help. Print views and the API are not.
 */
const PRIVATE = ["/api/", "/resources/print", "/newsletter/*/print"];

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      { userAgent: "*", allow: "/", disallow: PRIVATE },
      {
        userAgent: [
          "GPTBot",
          "OAI-SearchBot",
          "ChatGPT-User",
          "ClaudeBot",
          "Claude-User",
          "Claude-SearchBot",
          "PerplexityBot",
          "Google-Extended",
          "Applebot-Extended",
        ],
        allow: "/",
        disallow: PRIVATE,
      },
    ],
    sitemap: `${baseUrl}/sitemap.xml`,
    host: baseUrl,
  };
}
