import Link from "next/link";

import { ArticleCard, type ArticleCardData } from "@/components/ArticleCard";
import { CmsLink } from "@/components/CmsLink";
import { CustomPortableText } from "@/components/CustomPortableText";
import { GuideCard, type GuideCardData } from "@/components/GuideCard";
import ImageComponent from "@/components/ImageComponent";
import { ResourceCard, type ResourceCardData } from "@/components/ResourceCard";
import { buttonVariants } from "@maricopa-senior-living/ui/components/button";
import { cn } from "@maricopa-senior-living/ui/lib/utils";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@maricopa-senior-living/ui/components/card";

export type PageBuilderBlock = {
  _key: string;
  _type: string;
  [key: string]: unknown;
};

function SectionHeading({
  children,
  level = 2,
}: {
  children?: string | null;
  level?: 1 | 2;
}) {
  if (!children) return null;
  const Tag = level === 1 ? "h1" : "h2";
  return (
    <Tag className="font-serif text-3xl font-semibold tracking-tight text-foreground md:text-4xl">
      {children}
    </Tag>
  );
}

function HeroBlock({
  block,
  isFirst,
}: {
  block: PageBuilderBlock;
  isFirst: boolean;
}) {
  const heading = block.heading as string | undefined;
  const subheading = block.subheading as string | undefined;
  const image = block.image as Parameters<typeof ImageComponent>[0]["image"];
  const cta = block.cta as Parameters<typeof CmsLink>[0]["link"];

  return (
    <section className="relative overflow-hidden rounded-2xl bg-primary text-primary-foreground">
      {image ? (
        <div className="absolute inset-0 opacity-30">
          <ImageComponent
            image={image}
            alt={(image as { alt?: string })?.alt ?? ""}
            width={1200}
            height={600}
            className="h-full w-full object-cover"
          />
        </div>
      ) : null}
      <div className="relative px-6 py-12 md:px-10 md:py-16">
        <SectionHeading level={isFirst ? 1 : 2}>{heading}</SectionHeading>
        {subheading ? (
          <p className="mt-4 max-w-2xl text-lg text-primary-foreground/90">
            {subheading}
          </p>
        ) : null}
        {cta?.href ? (
          <div className="mt-8">
            <CmsLink
              link={cta}
              className={cn(buttonVariants({ size: "lg", variant: "secondary" }), "text-base")}
            />
          </div>
        ) : null}
      </div>
    </section>
  );
}

function CommunityAlertBlock({ block }: { block: PageBuilderBlock }) {
  const message = block.message as string;
  const severity = (block.severity as string) ?? "info";
  const link = block.link as Parameters<typeof CmsLink>[0]["link"];
  const tones: Record<string, string> = {
    info: "border-sky-300 bg-sky-50 text-sky-950",
    warning: "border-amber-300 bg-amber-50 text-amber-950",
    urgent: "border-red-400 bg-red-50 text-red-950",
  };

  return (
    <div
      role="status"
      className={`rounded-xl border-l-4 px-5 py-4 ${tones[severity] ?? tones.info}`}
    >
      <p className="text-base font-medium">{message}</p>
      {link?.href ? (
        <div className="mt-2">
          <CmsLink
            link={link}
            className="text-sm font-semibold underline underline-offset-2"
          />
        </div>
      ) : null}
    </div>
  );
}

export function PageBuilder({ blocks }: { blocks?: PageBuilderBlock[] | null }) {
  if (!blocks?.length) return null;

  return (
    <div className="space-y-12">
      {blocks.map((block, index) => {
        switch (block._type) {
          case "heroBlock":
            return (
              <HeroBlock key={block._key} block={block} isFirst={index === 0} />
            );
          case "richTextSection":
            return (
              <section key={block._key} className="space-y-4">
                <SectionHeading>{block.heading as string}</SectionHeading>
                <div className="prose prose-lg max-w-none prose-headings:font-serif">
                  <CustomPortableText value={(block.body as []) ?? []} />
                </div>
              </section>
            );
          case "featuredResources":
            return (
              <section key={block._key} className="space-y-6">
                <SectionHeading>{block.heading as string}</SectionHeading>
                <div className="grid gap-4 sm:grid-cols-2">
                  {((block.resources as ResourceCardData[]) ?? []).map((r) => (
                    <ResourceCard key={r._id} resource={r} />
                  ))}
                </div>
              </section>
            );
          case "featuredCategories": {
            const categories = (block.categories as []) ?? [];
            return (
              <section key={block._key} className="space-y-6">
                <SectionHeading>{block.heading as string}</SectionHeading>
                <div className="flex flex-wrap gap-3">
                  {categories.map((cat: PageBuilderBlock) => (
                    <Link
                      key={cat._id as string}
                      href={`/category/${cat.slug as string}`}
                      className="rounded-full border border-border bg-card px-4 py-2 text-sm font-medium transition-colors hover:border-primary hover:text-primary"
                      prefetch={false}
                    >
                      {cat.title as string}
                    </Link>
                  ))}
                </div>
              </section>
            );
          }
          case "featuredArticles":
            return (
              <section key={block._key} className="space-y-6">
                <SectionHeading>{block.heading as string}</SectionHeading>
                <div className="space-y-4">
                  {((block.articles as ArticleCardData[]) ?? []).map((a) => (
                    <ArticleCard key={a._id} article={a} />
                  ))}
                </div>
              </section>
            );
          case "featuredGuides":
            return (
              <section key={block._key} className="space-y-6">
                <SectionHeading>{block.heading as string}</SectionHeading>
                <div className="space-y-4">
                  {((block.guides as GuideCardData[]) ?? []).map((g) => (
                    <GuideCard key={g._id} guide={g} />
                  ))}
                </div>
              </section>
            );
          case "resourceGrid": {
            const limit = typeof block.limit === "number" ? block.limit : 6;
            const resources = ((block.resources as ResourceCardData[]) ?? []).slice(
              0,
              limit,
            );
            return (
              <section key={block._key} className="space-y-6">
                <SectionHeading>{block.heading as string}</SectionHeading>
                <div className="grid gap-4 sm:grid-cols-2">
                  {resources.map((r) => (
                    <ResourceCard key={r._id} resource={r} />
                  ))}
                </div>
              </section>
            );
          }
          case "callToAction":
            return (
              <section
                key={block._key}
                className="rounded-2xl border border-border bg-muted/50 px-6 py-10 text-center"
              >
                <SectionHeading>{block.heading as string}</SectionHeading>
                {block.body ? (
                  <p className="mx-auto mt-3 max-w-xl text-muted-foreground">
                    {block.body as string}
                  </p>
                ) : null}
                {(block.link as Parameters<typeof CmsLink>[0]["link"])?.href ? (
                  <div className="mt-6">
                    <CmsLink
                      link={block.link as Parameters<typeof CmsLink>[0]["link"]}
                      className={buttonVariants({ size: "lg" })}
                    />
                  </div>
                ) : null}
              </section>
            );
          case "faqBlock": {
            const items = (block.items as { question: string; answer: string }[]) ?? [];
            return (
              <section key={block._key} className="space-y-6">
                <SectionHeading>{block.heading as string}</SectionHeading>
                <div className="space-y-3">
                  {items.map((item) => (
                    <Card key={item.question}>
                      <CardHeader>
                        <CardTitle className="text-lg">{item.question}</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <p className="text-muted-foreground">{item.answer}</p>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </section>
            );
          }
          case "splitImage": {
            const imagePos = (block.imagePosition as string) ?? "right";
            return (
              <section
                key={block._key}
                className={`grid items-center gap-8 md:grid-cols-2 ${imagePos === "left" ? "md:[&>figure]:order-first" : ""}`}
              >
                <div className="space-y-4">
                  <SectionHeading>{block.heading as string}</SectionHeading>
                  <div className="prose max-w-none">
                    <CustomPortableText value={(block.body as []) ?? []} />
                  </div>
                </div>
                {block.image ? (
                  <figure>
                    <ImageComponent
                      image={block.image as Parameters<typeof ImageComponent>[0]["image"]}
                      alt={((block.image as { alt?: string })?.alt) ?? ""}
                      width={800}
                      height={600}
                      className="rounded-xl"
                    />
                  </figure>
                ) : null}
              </section>
            );
          }
          case "communityAlert":
            return <CommunityAlertBlock key={block._key} block={block} />;
          default:
            return null;
        }
      })}
    </div>
  );
}
