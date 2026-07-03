import Link from "next/link";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@maricopa-senior-living/ui/components/card";

import DateComponent from "@/components/Date";

export interface ArticleCardData {
  _id: string;
  title?: string | null;
  slug?: string | null;
  excerpt?: string | null;
  publishedAt?: string | null;
  contentSource?: string | null;
  author?: { name?: string | null } | null;
}

export function ArticleCard({ article }: { article: ArticleCardData }) {
  if (!article.slug) return null;

  return (
    <Card>
      <CardHeader>
        <CardTitle>
          <Link href={`/articles/${article.slug}`} className="hover:underline">
            {article.title}
          </Link>
        </CardTitle>
        <CardDescription className="flex flex-wrap gap-2">
          {article.author?.name ? <span>{article.author.name}</span> : null}
          {article.publishedAt ? (
            <DateComponent dateString={article.publishedAt} />
          ) : null}
          {article.contentSource === "syndicated" ? (
            <span className="rounded bg-amber-100 px-2 py-0.5 text-xs text-amber-800">
              Syndicated
            </span>
          ) : null}
        </CardDescription>
      </CardHeader>
      {article.excerpt ? (
        <CardContent>
          <p className="text-sm text-muted-foreground line-clamp-3">
            {article.excerpt}
          </p>
        </CardContent>
      ) : null}
    </Card>
  );
}
