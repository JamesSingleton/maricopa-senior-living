import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
} from "@maricopa-senior-living/ui/components/card";
import Link from "next/link";

import type { Post } from "@/types/Post";
import DateComponent from "./Date";
import ImageComponent from "./ImageComponent";

const articleLinkClassName =
  "block rounded-xl focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring";

export default function ArticleCard({ post }: { post: Post }) {
  return (
    <article>
      <Card className="transition-[box-shadow,ring] hover:ring-foreground/20">
        <Link
          href={`/articles/${post.slug}`}
          prefetch={false}
          aria-label={`Read article: ${post.title}`}
          className={articleLinkClassName}
        >
          <CardHeader>
            <div className="flex flex-col gap-1">
              {post.categories.map((category: any) => (
                <span
                  key={category.title}
                  className="text-xs font-semibold uppercase tracking-wider text-muted-foreground"
                >
                  {category.title}
                </span>
              ))}
            </div>
            <h2 className="font-heading text-3xl font-bold leading-snug text-foreground">
              {post.title}
            </h2>
          </CardHeader>
          <CardContent className="flex flex-col gap-6">
            <CardDescription className="text-base leading-6">
              {post.excerpt}
            </CardDescription>
            <div className="flex items-center gap-3">
              <ImageComponent
                className="size-10 rounded-full object-cover"
                image={post.author.image}
                alt={post.author.name}
                width={40}
                height={40}
              />
              <div>
                <p className="text-sm font-medium">{post.author.name}</p>
                <div className="flex gap-1 text-sm text-muted-foreground">
                  <DateComponent dateString={post.publishedAt} />
                </div>
              </div>
            </div>
          </CardContent>
        </Link>
      </Card>
    </article>
  );
}
