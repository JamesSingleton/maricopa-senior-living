import { sanityFetch } from "@maricopa-senior-living/sanity/live";
import {
  ArrowRight,
  BookOpen,
  ChevronRight,
  FileText,
  FolderOpen,
  Heart,
  Newspaper,
  ShieldCheck,
  Users,
} from "lucide-react";
import type { Metadata, ResolvingMetadata } from "next";
import Image from "next/image";
import Link from "next/link";

import { baseUrl } from "@/lib/constants";
import {
  ARTICLE_CATEGORIES,
  ARTICLE_TAGS,
  ARTICLES,
  BLOGS,
  RESOURCE_CATEGORY_GROUPS,
} from "@/lib/dummy-data";

type Props = {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
};

const featuredArticles = ARTICLES.filter((a) => a.featured).slice(0, 3);
const featuredBlog = BLOGS.filter((b) => b.featured).slice(0, 2);
const recentArticles = ARTICLES.filter((a) => !a.featured).slice(0, 4);

export async function generateMetadata(
  { params, searchParams }: Props,
  parent: ResolvingMetadata,
): Promise<Metadata> {
  const previousOpenGraph = (await parent)?.openGraph;
  return {
    title: "Maricopa Senior Living - Aging Well Your Way!",
    description: "Your go to source for senior living in Maricopa, AZ",
    openGraph: {
      ...previousOpenGraph,
      title: "Maricopa Senior Living - Aging Well Your Way!",
      description: "Your go to source for senior living in Maricopa, AZ",
      locale: "en_US",
      url: baseUrl,
      siteName: "Maricopa Senior Living",
      type: "website",
    },
    alternates: {
      canonical: "/",
    },
  };
}

const HIGHLIGHTS = [
  {
    icon: BookOpen,
    title: "Articles",
    description:
      "Expert health, financial, legal, and wellness guides written for Maricopa seniors.",
    href: "/articles",
    colorBg: "bg-primary/10",
    colorText: "text-primary",
  },
  {
    icon: FileText,
    title: "Blog",
    description:
      "Organization updates, volunteer stories, board news, and community announcements.",
    href: "/blog",
    colorBg: "bg-accent/15",
    colorText: "text-accent",
  },
  {
    icon: FolderOpen,
    title: "Resource Directory",
    description:
      "823+ locally curated services across 80 categories — healthcare, legal, transport, and more.",
    href: "/resources",
    colorBg: "bg-amber-100",
    colorText: "text-amber-700",
  },
  {
    icon: Newspaper,
    title: "Newsletter",
    description:
      "Download past issues or subscribe for free quarterly community updates.",
    href: "/newsletter",
    colorBg: "bg-secondary",
    colorText: "text-foreground",
  },
];

export default async function Home() {
  return (
    <>
      <section
        aria-label="Welcome"
        className="relative min-h-[520px] lg:min-h-[580px] flex items-center"
      >
        <Image
          src="/images/hero-maricopa.jpg"
          alt="Maricopa Arizona landscape at golden hour with desert mountains"
          fill
          className="object-cover"
          priority
        />
        <div className="absolute inset-0 bg-(--brand-deep)/70" />
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
          <div className="max-w-2xl">
            <span className="inline-block bg-accent text-accent-foreground font-sans text-sm font-semibold px-4 py-1.5 rounded-full mb-5 tracking-wide">
              Maricopa, Arizona &bull; 501(c)(3) Non-Profit
            </span>
            <h1 className="font-serif text-4xl sm:text-5xl lg:text-6xl font-bold text-white leading-tight text-balance">
              Your Community.
              <br />
              Your Resources.
            </h1>
            <p className="font-sans text-white/80 text-lg mt-5 leading-relaxed max-w-xl">
              Maricopa Senior Living connects seniors and families with local
              health services, expert information, and community resources — all
              in one trusted place.
            </p>
            <div className="flex flex-wrap gap-3 mt-8">
              <Link
                href="/resources"
                className="inline-flex items-center gap-2 bg-primary text-primary-foreground font-sans font-bold px-6 py-3.5 rounded-md hover:bg-primary/90 transition-colors text-base"
              >
                Find Resources
                <ArrowRight className="w-4 h-4" aria-hidden="true" />
              </Link>
              <Link
                href="/articles"
                className="inline-flex items-center gap-2 bg-white/15 border border-white/30 text-white font-sans font-bold px-6 py-3.5 rounded-md hover:bg-white/25 transition-colors text-base"
              >
                Browse Articles
              </Link>
            </div>
          </div>
        </div>
      </section>
      <section
        className="py-10 px-4 bg-card border-b border-border"
        aria-label="Site sections"
      >
        <div className="max-w-7xl mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {HIGHLIGHTS.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="group flex items-start gap-4 p-5 rounded-xl border border-border hover:border-primary/30 hover:shadow-md transition-all duration-200 bg-card"
            >
              <div className="p-3 rounded-lg shrink-0 bg-accent text-accent-foreground">
                <item.icon className="w-5 h-5" aria-hidden="true" />
              </div>
              <div>
                <p className="font-sans font-bold text-foreground text-base group-hover:text-primary transition-colors">
                  {item.title}
                </p>
                <p className="font-sans text-muted-foreground text-sm mt-1 leading-relaxed">
                  {item.description}
                </p>
              </div>
            </Link>
          ))}
        </div>
      </section>
      {/* ── Featured Articles ── */}
      <section
        className="py-16 px-4"
        aria-labelledby="featured-articles-heading"
      >
        <div className="max-w-7xl mx-auto">
          <div className="flex items-end justify-between mb-8 gap-4">
            <div>
              <p className="font-sans text-xs font-bold uppercase tracking-widest text-primary mb-1">
                Expert Guides
              </p>
              <h2
                id="featured-articles-heading"
                className="font-serif text-3xl font-bold text-foreground"
              >
                Featured Articles
              </h2>
            </div>
            <Link
              href="/articles"
              className="shrink-0 hidden sm:inline-flex items-center gap-1.5 font-sans font-semibold text-primary hover:underline text-sm"
            >
              All Articles{" "}
              <ChevronRight className="w-4 h-4" aria-hidden="true" />
            </Link>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Large featured card */}
            {featuredArticles[0] && (
              <Link
                href={`/articles/${featuredArticles[0].id}`}
                className="lg:col-span-2 group relative rounded-xl overflow-hidden border border-border hover:shadow-lg transition-all min-h-[300px] flex flex-col"
              >
                {featuredArticles[0].image ? (
                  <Image
                    src={featuredArticles[0].image}
                    alt=""
                    fill
                    className="object-cover"
                  />
                ) : (
                  <div className="absolute inset-0 bg-gradient-to-br from-primary/20 to-primary/5" />
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-[var(--brand-deep)]/85 via-[var(--brand-deep)]/30 to-transparent" />
                <div className="relative z-10 mt-auto p-6">
                  <span className="inline-block text-xs font-semibold font-sans bg-primary text-primary-foreground px-3 py-1 rounded-full mb-3">
                    {featuredArticles[0].category}
                  </span>
                  <h3 className="font-serif font-bold text-white text-xl lg:text-2xl leading-snug text-balance group-hover:underline">
                    {featuredArticles[0].title}
                  </h3>
                  <p className="font-sans text-white/75 text-sm mt-2 leading-relaxed line-clamp-2">
                    {featuredArticles[0].excerpt}
                  </p>
                  <p className="font-sans text-white/55 text-xs mt-3">
                    {featuredArticles[0].author} &bull;{" "}
                    {featuredArticles[0].readTime} min read
                  </p>
                </div>
              </Link>
            )}

            {/* Two smaller cards stacked */}
            <div className="flex flex-col gap-6">
              {featuredArticles.slice(1, 3).map((article) => (
                <Link
                  key={article.id}
                  href={`/articles/${article.id}`}
                  className="group flex flex-col bg-card rounded-xl border border-border hover:border-primary/30 hover:shadow-md transition-all overflow-hidden"
                >
                  {article.image && (
                    <div className="relative h-36 overflow-hidden">
                      <Image
                        src={article.image}
                        alt=""
                        fill
                        className="object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                    </div>
                  )}
                  <div className="p-5">
                    <span className="inline-block text-[11px] font-semibold font-sans bg-primary/10 text-primary px-2.5 py-0.5 rounded-full mb-2">
                      {article.category}
                    </span>
                    <h3 className="font-serif font-bold text-foreground text-base leading-snug group-hover:text-primary transition-colors text-balance">
                      {article.title}
                    </h3>
                    <p className="font-sans text-muted-foreground text-xs mt-1">
                      {article.readTime} min read
                    </p>
                  </div>
                </Link>
              ))}
            </div>
          </div>

          <div className="mt-5 sm:hidden">
            <Link
              href="/articles"
              className="flex items-center gap-1.5 font-sans font-semibold text-primary hover:underline text-sm"
            >
              All Articles{" "}
              <ChevronRight className="w-4 h-4" aria-hidden="true" />
            </Link>
          </div>
        </div>
      </section>
      {/* ── Recent Articles + Sidebar ── */}
      <section
        className="py-16 px-4 bg-muted/40"
        aria-labelledby="recent-articles-heading"
      >
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-10">
          <div className="lg:col-span-2">
            <h2
              id="recent-articles-heading"
              className="font-serif text-2xl font-bold text-foreground mb-6"
            >
              More Recent Articles
            </h2>
            <div className="bg-card rounded-xl border border-border divide-y divide-border">
              {recentArticles.map((article) => (
                <Link
                  key={article.id}
                  href={`/articles/${article.id}`}
                  className="group flex items-start gap-4 p-5 hover:bg-muted/50 transition-colors"
                >
                  <div className="flex-1 min-w-0">
                    <span className="inline-block text-[11px] font-semibold font-sans bg-primary/8 text-primary px-2.5 py-0.5 rounded-full mb-1.5">
                      {article.category}
                    </span>
                    <h3 className="font-sans font-bold text-foreground text-base leading-snug group-hover:text-primary transition-colors">
                      {article.title}
                    </h3>
                    <p className="font-sans text-muted-foreground text-sm mt-1 line-clamp-2 leading-relaxed">
                      {article.excerpt}
                    </p>
                    <p className="font-sans text-muted-foreground text-xs mt-2">
                      {article.author} &bull; {article.readTime} min read
                    </p>
                  </div>
                  <ChevronRight
                    className="w-5 h-5 text-muted-foreground group-hover:text-primary transition-colors mt-1 shrink-0"
                    aria-hidden="true"
                  />
                </Link>
              ))}
            </div>
            <div className="mt-5">
              <Link
                href="/articles"
                className="inline-flex items-center gap-1.5 font-sans font-semibold text-primary hover:underline text-sm"
              >
                View all articles{" "}
                <ChevronRight className="w-4 h-4" aria-hidden="true" />
              </Link>
            </div>
          </div>

          <aside aria-label="Sidebar">
            {/* Browse by category */}
            <div className="bg-card rounded-xl border border-border p-5 mb-5">
              <h3 className="font-serif text-base font-bold text-foreground mb-3">
                Browse Article Topics
              </h3>
              <ul className="space-y-0.5">
                {ARTICLE_CATEGORIES.slice(0, 8).map((cat) => (
                  <li key={cat}>
                    <Link
                      href={`/articles?category=${encodeURIComponent(cat)}`}
                      className="flex items-center justify-between py-2 px-2.5 rounded-md font-sans text-sm text-foreground hover:bg-muted hover:text-primary transition-colors group"
                    >
                      {cat}
                      <ChevronRight
                        className="w-3.5 h-3.5 text-muted-foreground group-hover:text-primary transition-colors"
                        aria-hidden="true"
                      />
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Latest blog post */}
            {featuredBlog[0] && (
              <div className="bg-card rounded-xl border border-border p-5 mb-5">
                <div className="flex items-center gap-2 mb-3">
                  <span className="font-sans text-[10px] font-bold uppercase tracking-widest text-accent">
                    From Our Blog
                  </span>
                </div>
                <Link
                  href={`/blog/${featuredBlog[0].id}`}
                  className="group block"
                >
                  <h3 className="font-serif font-bold text-foreground text-base leading-snug group-hover:text-primary transition-colors">
                    {featuredBlog[0].title}
                  </h3>
                  <p className="font-sans text-muted-foreground text-sm mt-2 leading-relaxed line-clamp-3">
                    {featuredBlog[0].excerpt}
                  </p>
                  <p className="font-sans text-muted-foreground text-xs mt-2">
                    {featuredBlog[0].author}, {featuredBlog[0].authorRole}
                  </p>
                </Link>
                <Link
                  href="/blog"
                  className="inline-flex items-center gap-1 mt-3 font-sans text-sm font-semibold text-primary hover:underline"
                >
                  All blog posts{" "}
                  <ChevronRight className="w-3.5 h-3.5" aria-hidden="true" />
                </Link>
              </div>
            )}

            {/* Popular tags */}
            <div className="bg-card rounded-xl border border-border p-5">
              <h3 className="font-serif text-base font-bold text-foreground mb-3">
                Popular Tags
              </h3>
              <div className="flex flex-wrap gap-2">
                {ARTICLE_TAGS.slice(0, 10).map((tag) => (
                  <Link
                    key={tag}
                    href={`/articles?tag=${encodeURIComponent(tag)}`}
                    className="inline-block text-xs font-sans font-medium bg-secondary text-foreground px-2.5 py-1 rounded-md hover:bg-primary/10 hover:text-primary transition-colors border border-border"
                  >
                    {tag}
                  </Link>
                ))}
              </div>
            </div>
          </aside>
        </div>
      </section>

      {/* ── Community split banner ── */}
      <section className="overflow-hidden" aria-label="About our mission">
        <div className="grid grid-cols-1 lg:grid-cols-2 min-h-105">
          <div className="relative min-h-65 lg:min-h-0">
            <Image
              src="/images/seniors-community.jpg"
              alt="Seniors socializing in the Maricopa community"
              fill
              className="object-cover"
            />
          </div>
          <div className="bg-primary flex items-center p-8 sm:p-12 lg:p-16">
            <div>
              <p className="font-sans text-xs font-bold uppercase tracking-widest text-primary-foreground/60 mb-3">
                Our Mission
              </p>
              <h2 className="font-serif text-3xl lg:text-4xl font-bold text-primary-foreground leading-tight text-balance">
                Serving Maricopa&rsquo;s Senior Community Since 2010
              </h2>
              <p className="font-sans text-primary-foreground/80 text-base mt-4 leading-relaxed">
                As a 501(c)(3) non-profit, we believe every senior deserves
                access to quality information, verified local services, and a
                connected community. Our resources are free, locally curated,
                and updated regularly.
              </p>
              <div className="mt-6 flex flex-wrap gap-x-6 gap-y-3 text-primary-foreground/85 font-sans text-sm">
                {[
                  { icon: Heart, label: "Free to use — always" },
                  { icon: ShieldCheck, label: "Locally verified resources" },
                  { icon: Users, label: "5,000+ monthly readers" },
                ].map(({ icon: Icon, label }) => (
                  <div key={label} className="flex items-center gap-2">
                    <Icon
                      className="w-4 h-4 text-primary-foreground/60"
                      aria-hidden="true"
                    />
                    <span>{label}</span>
                  </div>
                ))}
              </div>
              <Link
                href="/about"
                className="mt-8 inline-flex items-center gap-2 bg-primary-foreground text-primary font-sans font-bold px-6 py-3 rounded-md hover:opacity-90 transition-opacity text-sm"
              >
                Learn About Us{" "}
                <ArrowRight className="w-4 h-4" aria-hidden="true" />
              </Link>
            </div>
          </div>
        </div>
      </section>
      {/* ── Resource category groups overview ── */}
      <section
        className="py-16 px-4"
        aria-labelledby="resources-overview-heading"
      >
        <div className="max-w-7xl mx-auto">
          <div className="flex items-end justify-between mb-8 gap-4">
            <div>
              <p className="font-sans text-xs font-bold uppercase tracking-widest text-primary mb-1">
                Resource Directory
              </p>
              <h2
                id="resources-overview-heading"
                className="font-serif text-3xl font-bold text-foreground"
              >
                Find the Right Resources
              </h2>
              <p className="font-sans text-muted-foreground mt-1">
                823+ locally curated resources across 10 categories
              </p>
            </div>
            <Link
              href="/resources"
              className="shrink-0 hidden sm:inline-flex items-center gap-1.5 font-sans font-semibold text-primary hover:underline text-sm"
            >
              Browse all resources{" "}
              <ChevronRight className="w-4 h-4" aria-hidden="true" />
            </Link>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
            {RESOURCE_CATEGORY_GROUPS.map((group) => (
              <Link
                key={group.id}
                href={`/resources?group=${group.id}`}
                className={`group flex flex-col items-start gap-2 p-4 rounded-xl border ${group.colorClass} hover:shadow-md transition-all duration-200`}
              >
                <p className="font-sans font-bold text-sm leading-snug">
                  {group.label}
                </p>
                <p className="font-sans text-xs opacity-70">
                  {group.resourceCount} resources
                </p>
              </Link>
            ))}
          </div>

          <div className="mt-5 sm:hidden">
            <Link
              href="/resources"
              className="inline-flex items-center gap-1.5 font-sans font-semibold text-primary hover:underline text-sm"
            >
              Browse all resources{" "}
              <ChevronRight className="w-4 h-4" aria-hidden="true" />
            </Link>
          </div>
        </div>
      </section>

      {/* ── Newsletter CTA ── */}
      <section className="py-16 px-4" aria-labelledby="newsletter-cta-heading">
        <div className="max-w-3xl mx-auto text-center">
          <div className="inline-flex items-center justify-center w-14 h-14 bg-primary/10 rounded-full mb-5">
            <Newspaper className="w-7 h-7 text-primary" aria-hidden="true" />
          </div>
          <h2
            id="newsletter-cta-heading"
            className="font-serif text-3xl font-bold text-foreground text-balance"
          >
            The Maricopa Senior Living Newsletter
          </h2>
          <p className="font-sans text-muted-foreground text-lg mt-3 leading-relaxed max-w-xl mx-auto">
            Stay informed with our free quarterly newsletter — community news,
            health tips, resource spotlights, and organizational updates.
          </p>
          <div className="mt-8 flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
            <label htmlFor="email-cta" className="sr-only">
              Your email address
            </label>
            <input
              id="email-cta"
              type="email"
              placeholder="Your email address"
              className="flex-1 rounded-md border border-border bg-card px-4 py-3 font-sans text-base text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
            />
            <Link
              href="/newsletter#subscribe"
              className="bg-primary text-primary-foreground font-sans font-bold px-6 py-3 rounded-md hover:bg-primary/90 transition-colors text-base text-center whitespace-nowrap"
            >
              Subscribe Free
            </Link>
          </div>
          <p className="font-sans text-xs text-muted-foreground mt-3">
            No spam, ever. Unsubscribe at any time.
          </p>
          <Link
            href="/newsletter"
            className="inline-flex items-center gap-1 mt-4 font-sans text-sm text-primary hover:underline"
          >
            Browse past issues{" "}
            <ChevronRight className="w-3.5 h-3.5" aria-hidden="true" />
          </Link>
        </div>
      </section>
    </>
  );
}
