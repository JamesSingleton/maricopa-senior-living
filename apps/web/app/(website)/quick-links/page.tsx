import { Button } from "@maricopa-senior-living/ui/components/button";
import {
  Building2,
  ChevronRight,
  CloudSun,
  Construction,
  ExternalLink,
  Globe,
  MapPin,
  Newspaper,
} from "lucide-react";
import type { Metadata } from "next";
import Link from "next/link";

import type { ExternalLinkGroup } from "@/lib/dummy-data";
import { EXTERNAL_LINK_GROUPS } from "@/lib/dummy-data";

export const metadata: Metadata = {
  title: "Community Links | Maricopa Senior Living",
  description:
    "Curated links to local Maricopa resources, city government, news, weather, national senior services, and SR 347 traffic updates.",
};

// ─── Icon Map ────────────────────────────────────────────────────────────────

const ICON_MAP: Record<string, React.ComponentType<{ className?: string }>> = {
  Building2,
  Newspaper,
  CloudSun,
  MapPin,
  Globe,
  Construction,
};

// ─── Link Group Card ──────────────────────────────────────────────────────────

function LinkGroupCard({ group }: { group: ExternalLinkGroup }) {
  const Icon = ICON_MAP[group.icon] ?? Globe;

  return (
    <section
      id={`group-${group.id}`}
      className={`rounded-xl border p-6 ${group.colorClass}`}
      aria-labelledby={`group-title-${group.id}`}
    >
      {/* Header */}
      <div className="flex items-start justify-between gap-4 mb-5">
        <div className="flex items-start gap-4">
          <div className="w-11 h-11 rounded-lg flex items-center justify-center flex-shrink-0 bg-white/60">
            <Icon className="w-5 h-5" aria-hidden="true" />
          </div>
          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <h2
                id={`group-title-${group.id}`}
                className="font-serif text-xl font-bold text-foreground"
              >
                {group.title}
              </h2>
              {group.badge && (
                <span className="inline-block bg-primary text-primary-foreground font-sans text-xs font-semibold px-2.5 py-0.5 rounded-full">
                  {group.badge}
                </span>
              )}
            </div>
            <p className="font-sans text-sm text-muted-foreground mt-1 text-pretty max-w-md">
              {group.description}
            </p>
          </div>
        </div>
        <span className="font-sans text-xs font-semibold text-muted-foreground flex-shrink-0">
          {group.links.length} link{group.links.length !== 1 ? "s" : ""}
        </span>
      </div>

      {/* Links list */}
      <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2" role="list">
        {group.links.map((link) => (
          <li key={link.url}>
            <a
              href={link.url}
              target="_blank"
              rel="noopener noreferrer"
              className="group flex items-start gap-3 p-3.5 rounded-lg bg-white/50 hover:bg-white/80 border border-white/60 hover:border-white transition-all"
              aria-label={`${link.label}${link.description ? ` — ${link.description}` : ""} (opens in new tab)`}
            >
              <ExternalLink
                className="w-4 h-4 text-current opacity-50 group-hover:opacity-100 flex-shrink-0 mt-0.5 transition-opacity"
                aria-hidden="true"
              />
              <div className="min-w-0">
                <span className="font-sans font-semibold text-sm text-foreground group-hover:text-primary transition-colors block truncate">
                  {link.label}
                </span>
                {link.description && (
                  <span className="font-sans text-xs text-muted-foreground mt-0.5 block leading-relaxed">
                    {link.description}
                  </span>
                )}
              </div>
              <ChevronRight
                className="w-4 h-4 text-muted-foreground flex-shrink-0 self-center ml-auto opacity-0 group-hover:opacity-100 group-hover:translate-x-0.5 transition-all"
                aria-hidden="true"
              />
            </a>
          </li>
        ))}
      </ul>
    </section>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function CommunityLinksPage() {
  return (
    <>
      {/* Page header */}
      <section
        className="bg-primary py-14 px-4"
        aria-label="Community links page header"
      >
        <div className="max-w-7xl mx-auto">
          <p className="font-sans text-sm font-semibold tracking-widest text-primary uppercase mb-2">
            Community Hub
          </p>
          <h1 className="font-serif text-4xl font-bold text-primary-foreground text-balance">
            Community Links
          </h1>
          <p className="font-sans text-primary-foreground/70 text-lg mt-2 max-w-xl text-pretty">
            Curated links to local government, news, weather, national
            resources, and live SR 347 traffic — everything a Maricopa senior
            needs, in one place.
          </p>
        </div>
      </section>

      {/* Quick jump nav */}
      <div className="bg-card border-b border-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <nav
            className="flex gap-1 overflow-x-auto py-3 scrollbar-none"
            aria-label="Jump to link section"
          >
            {EXTERNAL_LINK_GROUPS.map((g) => {
              const Icon = ICON_MAP[g.icon] ?? Globe;
              return (
                <a
                  key={g.id}
                  href={`#group-${g.id}`}
                  className="shrink-0 flex items-center gap-1.5 px-4 py-2 rounded-full font-sans text-sm font-semibold border border-border bg-background text-foreground hover:border-primary/30 hover:bg-secondary transition-colors"
                >
                  <Icon className="w-3.5 h-3.5 shrink-0" aria-hidden="true" />
                  {g.title}
                </a>
              );
            })}
          </nav>
        </div>
      </div>

      {/* Link groups */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        {/* Disclaimer */}
        <div className="mb-8 p-4 bg-secondary rounded-xl border border-border">
          <p className="font-sans text-sm text-muted-foreground leading-relaxed">
            <span className="font-semibold text-foreground">Note:</span> All
            external links open in a new tab. Maricopa Senior Living does not
            control or endorse the content of external websites. Links are
            provided for informational convenience and are reviewed periodically
            for accuracy.
          </p>
        </div>

        <div className="space-y-8">
          {EXTERNAL_LINK_GROUPS.map((group) => (
            <LinkGroupCard key={group.id} group={group} />
          ))}
        </div>

        {/* Footer CTA */}
        <div className="mt-12 p-8 bg-primary/80 rounded-xl text-center">
          <h2 className="font-serif text-2xl font-bold text-primary-foreground text-balance">
            Looking for Local Senior Services?
          </h2>
          <p className="font-sans text-primary-foreground/80 mt-2 max-w-md mx-auto text-pretty">
            Our Resource Directory lists 15+ locally verified providers across
            Maricopa and Pinal County.
          </p>
          <div className="flex flex-wrap justify-center gap-4 mt-6">
            <Button
              size="lg"
              render={<Link href="/resources">Browse Resources</Link>}
              nativeButton={false}
            />
            <Button
              variant="secondary"
              size="lg"
              render={<Link href="/articles">Read Articles</Link>}
              nativeButton={false}
            />
          </div>
        </div>
      </div>
    </>
  );
}
