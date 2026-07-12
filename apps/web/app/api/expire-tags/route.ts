import { revalidateTag } from "next/cache";
import { type NextRequest, NextResponse } from "next/server";

import { webhookSecret } from "@/lib/sanity.api";

type ExpireTagsBody = {
  syncTags?: string[];
  tags?: string[];
};

function normalizeCacheTag(tag: string): string {
  return tag.startsWith("sanity:") ? tag : `sanity:${tag}`;
}

function authorize(request: NextRequest): boolean {
  if (!webhookSecret) {
    return false;
  }

  const headerSecret =
    request.headers.get("x-sanity-revalidate-secret") ??
    request.headers.get("authorization")?.replace(/^Bearer\s+/i, "");

  return headerSecret === webhookSecret;
}

export async function POST(request: NextRequest) {
  try {
    if (!authorize(request)) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const body = (await request.json()) as ExpireTagsBody;
    const incoming = body.syncTags ?? body.tags ?? [];

    if (!Array.isArray(incoming) || incoming.length === 0) {
      return NextResponse.json(
        { message: "Bad Request: syncTags required" },
        { status: 400 },
      );
    }

    const tags = [
      ...new Set(
        incoming.filter(
          (tag): tag is string => typeof tag === "string" && tag.length > 0,
        ),
      ),
    ].map(normalizeCacheTag);

    for (const tag of tags) {
      revalidateTag(tag, "max");
    }

    return NextResponse.json({ revalidated: tags.length, tags });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unknown error";
    console.error("[expire-tags]", message);
    return NextResponse.json({ message }, { status: 500 });
  }
}
