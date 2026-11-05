import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
} from "@maricopa-senior-living/ui/components/card";
import Link from "next/link";

import type { Post } from "@/types/Post";
import DateComponent from "./Date";
import { SanityImage } from "./sanity-image";

const articleLinkClassName =
  "block rounded-xl focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring";

export default function ArticleCard({ post }: { post: Post }) {
  const categories = (post.categories ?? []).filter(
    (category): category is NonNullable<typeof category> => Boolean(category),
  );

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
            {categories.length > 0 ? (
              <div className="flex flex-col gap-1">
                {categories.map((category) => (
                  <span
                    key={category._id}
                    className="text-sm font-semibold uppercase tracking-wider text-muted-foreground"
                  >
                    {category.title}
                  </span>
                ))}
              </div>
            ) : null}
            <h2 className="font-heading text-3xl font-bold leading-snug text-foreground">
              {post.title}
            </h2>
          </CardHeader>
          <CardContent className="flex flex-col gap-6">
            {post.excerpt ? (
              <CardDescription className="text-lg leading-7">
                {post.excerpt}
              </CardDescription>
            ) : null}
            <div className="flex items-center gap-3">
              {post.author?.image ? (
                <SanityImage
                  className="size-10 rounded-full object-cover"
                  image={post.author.image}
                  alt=""
                  width={40}
                  height={40}
                />
              ) : null}
              <div>
                {post.author?.name ? (
                  <p className="text-base font-medium">{post.author.name}</p>
                ) : null}
                <div className="flex gap-1 text-base text-muted-foreground">
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
