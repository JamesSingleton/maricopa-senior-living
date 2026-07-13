import { revalidateTag } from "next/cache";
import type { NextRequest } from "next/server";

import { webhookSecret } from "@/lib/sanity.api";

type ExpireTagsBody = {
  secret?: string;
  syncTags?: string[];
  tags?: string[];
};

export async function POST(request: NextRequest) {
  if (!webhookSecret) {
    console.error(
      "SANITY_REVALIDATE_SECRET (or SANITY_WEBHOOK_SECRET) is required",
    );
    return Response.json({ error: "Unexpected error" }, { status: 500 });
  }

  let secret: string | null =
    request.headers.get("x-sanity-revalidate-secret") ??
    request.headers.get("authorization")?.replace(/^Bearer\s+/i, "") ??
    null;
  let tags: string[] = [];

  try {
    const body = (await request.json()) as ExpireTagsBody;
    if (!secret && body.secret) secret = body.secret;
    if (Array.isArray(body.tags)) tags = body.tags;
    else if (Array.isArray(body.syncTags)) tags = body.syncTags;
  } catch {
    // no valid JSON body
  }

  if (secret !== webhookSecret) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }

  if (tags.length === 0) {
    return Response.json({ error: "No tags provided" }, { status: 400 });
  }

  console.info("Expiring tags from expirator service", tags);

  for (const tag of tags) {
    if (typeof tag !== "string" || tag.length === 0) continue;
    const cacheKey = tag.startsWith("sanity:") ? tag : `sanity:${tag}`;
    // Hard-expire so waitFor="function" Live events only fire after cache is busted.
    revalidateTag(cacheKey, { expire: 0 });
  }

  return Response.json({
    service: process.env.VERCEL_PROJECT_PRODUCTION_URL,
    tags,
  });
}
