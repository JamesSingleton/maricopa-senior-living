import { ArrowRight } from "lucide-react";
import Link from "next/link";

export type TopicTile = {
  _id: string;
  title: string | null;
  slug: string | null;
  description?: string | null;
  icon?: string | null;
  resourceCount?: number | null;
};

/**
 * The topics as a numbered directory: wide rows with a big number, the
 * name, a plain description and how many places there are to call. One
 * list, used on the home page and on "Find help", so the way in always
 * looks the same.
 */
export function TopicTiles({ topics }: { topics: TopicTile[] }) {
  return (
    <ol className="index grid gap-x-12 md:grid-cols-2">
      {topics.map((topic) => (
        <li key={topic._id}>
          <Link href={`/topics/${topic.slug}`} className="index-row">
            <span className="flex flex-col gap-1">
              <span className="index-title">{topic.title}</span>
              {topic.description ? (
                <span className="muted text-base leading-snug">
                  {topic.description}
                </span>
              ) : null}
              {topic.resourceCount ? (
                <span className="mt-1 text-base font-bold">
                  {topic.resourceCount} places to call
                </span>
              ) : null}
            </span>
            <ArrowRight className="mt-1 size-7" aria-hidden="true" />
          </Link>
        </li>
      ))}
    </ol>
  );
}
