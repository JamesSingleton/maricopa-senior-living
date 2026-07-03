import {
  type DynamicFetchOptions,
  getDynamicFetchOptions,
  sanityFetch,
} from "@maricopa-senior-living/sanity/live";
import {
  queryFeaturedCategories,
  queryLatestArticle,
  querySidebarTags,
} from "@maricopa-senior-living/sanity/queries";
import Link from "next/link";

import { ArticleCard } from "@/components/ArticleCard";
import SearchBar from "@/components/SearchBar";
import { LinkButton } from "@/components/LinkButton";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@maricopa-senior-living/ui/components/card";

async function fetchRightSidebarData({
  perspective,
  stega,
}: DynamicFetchOptions) {
  "use cache";
  const [categories, tags, latestArticle] = await Promise.all([
    sanityFetch({ query: queryFeaturedCategories, perspective, stega }),
    sanityFetch({ query: querySidebarTags, perspective, stega }),
    sanityFetch({ query: queryLatestArticle, perspective, stega }),
  ]);

  return {
    categories: categories.data,
    tags: tags.data,
    latestArticle: latestArticle.data,
  };
}

export async function DynamicRightSidebar() {
  const { perspective, stega } = await getDynamicFetchOptions();
  return <CachedRightSidebar perspective={perspective} stega={stega} />;
}

export async function CachedRightSidebar({
  perspective,
  stega,
}: DynamicFetchOptions) {
  "use cache";
  const { categories, tags, latestArticle } = await fetchRightSidebarData({
    perspective,
    stega,
  });

  return (
    <div className="space-y-6">
      <SearchBar />
      {latestArticle ? (
        <Card>
          <CardHeader>
            <CardTitle className="font-serif text-lg">Latest news</CardTitle>
          </CardHeader>
          <CardContent>
            <ArticleCard article={latestArticle as Parameters<typeof ArticleCard>[0]["article"]} />
          </CardContent>
        </Card>
      ) : null}
      {(categories as { _id: string; title: string; slug: string; count?: number }[])?.length ? (
        <Card>
          <CardHeader>
            <CardTitle className="font-serif text-lg">Browse by category</CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2">
              {(categories as { _id: string; title: string; slug: string; count?: number }[]).map(
                (category) => (
                  <li key={category._id}>
                    <Link
                      href={`/category/${category.slug}`}
                      className="flex items-center justify-between rounded-md px-3 py-2 text-sm font-medium transition-colors hover:bg-muted"
                      prefetch={false}
                    >
                      <span>{category.title}</span>
                      {category.count != null ? (
                        <span className="text-muted-foreground">{category.count}</span>
                      ) : null}
                    </Link>
                  </li>
                ),
              )}
            </ul>
          </CardContent>
        </Card>
      ) : null}
      {(tags as { _id: string; title: string; slug: string }[])?.length ? (
        <Card>
          <CardHeader>
            <CardTitle className="font-serif text-lg">Popular tags</CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="flex flex-wrap gap-2">
              {(tags as { _id: string; title: string; slug: string }[]).map((tag) => (
                <li key={tag._id}>
                  <Link
                    href={`/tags/${tag.slug}`}
                    className="rounded-full bg-muted px-3 py-1 text-sm hover:bg-primary hover:text-primary-foreground"
                    prefetch={false}
                  >
                    {tag.title}
                  </Link>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
      ) : null}
      <Card>
        <CardHeader>
          <CardTitle className="font-serif text-lg">Support this site</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <p className="text-sm text-muted-foreground">
            Help keep local senior resources free for the community.
          </p>
          <div className="flex flex-col gap-2">
            <LinkButton
              href="https://www.paypal.com/donate?hosted_button_id=VDPMC329ZC5ZE"
              external
            >
              Donate
            </LinkButton>
            <LinkButton href="mailto:ron@maricopaseniorliving.org" variant="outline">
              Email us
            </LinkButton>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

export function RightSidebarFallback() {
  return (
    <div className="space-y-6" aria-busy>
      {Array.from({ length: 3 }).map((_, index) => (
        <div key={index} className="h-40 animate-pulse rounded-xl bg-muted" />
      ))}
    </div>
  );
}
