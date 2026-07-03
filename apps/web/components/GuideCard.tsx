import Link from "next/link";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@maricopa-senior-living/ui/components/card";

export interface GuideCardData {
  _id: string;
  title?: string | null;
  slug?: string | null;
  excerpt?: string | null;
  lastUpdated?: string | null;
  author?: { name?: string | null } | null;
}

export function GuideCard({ guide }: { guide: GuideCardData }) {
  if (!guide.slug) return null;

  return (
    <Card>
      <CardHeader>
        <CardTitle>
          <Link href={`/guides/${guide.slug}`} className="hover:underline">
            {guide.title}
          </Link>
        </CardTitle>
        <CardDescription className="flex flex-wrap gap-2">
          {guide.author?.name ? <span>{guide.author.name}</span> : null}
          {guide.lastUpdated ? (
            <span>Updated {guide.lastUpdated}</span>
          ) : null}
        </CardDescription>
      </CardHeader>
      {guide.excerpt ? (
        <CardContent>
          <p className="text-sm text-muted-foreground line-clamp-3">
            {guide.excerpt}
          </p>
        </CardContent>
      ) : null}
    </Card>
  );
}
