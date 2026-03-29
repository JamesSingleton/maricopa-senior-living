import { Button } from "@maricopa-senior-living/ui/components/button";
import {
  Card,
  CardContent,
  CardHeader,
} from "@maricopa-senior-living/ui/components/card";
import { cn } from "@maricopa-senior-living/ui/lib/utils";
import { Check, ExternalLink, MapPin, Phone } from "lucide-react";

import type { Resource } from "@/lib/dummy-data";
import { RESOURCE_CATEGORY_GROUPS } from "@/lib/dummy-data";

export default function ResourceCard({
  resource,
  selectedTags,
  onTagClick,
}: {
  resource: Resource;
  selectedTags: string[];
  onTagClick: (tag: string) => void;
}) {
  const noteLinks = Array.isArray(resource.notes) ? resource.notes : null;
  const noteText = typeof resource.notes === "string" ? resource.notes : null;
  const hasNotes = noteLinks || noteText;

  const group = RESOURCE_CATEGORY_GROUPS.find(
    (g) => g.id === resource.categoryGroupId,
  );

  return (
    <Card
      id={`resource-${resource.id}`}
      className="rounded-xl border border-border bg-card shadow-sm"
      aria-labelledby={`resource-name-${resource.id}`}
    >
      <CardHeader className="pb-0 pt-5 px-5 sm:px-6">
        {/* Group / category breadcrumb */}
        <p className="font-sans text-xs text-muted-foreground mb-2">
          {group && (
            <span
              className={cn(
                "inline-block font-medium px-2 py-0.5 rounded text-[11px] mr-2",
                group.badgeClass,
              )}
            >
              {group.label}
            </span>
          )}
          {resource.category}
        </p>

        {/* Title */}
        <h3
          id={`resource-name-${resource.id}`}
          className="font-serif font-bold text-foreground text-xl lg:text-2xl leading-snug"
        >
          {resource.name}
        </h3>
      </CardHeader>
      <CardContent className="pt-3 px-5 sm:px-6 pb-5 sm:pb-6">
        {/* Description */}
        <p className="font-sans text-base text-foreground leading-relaxed mb-5">
          {resource.description}
        </p>

        {/* Detail rows */}
        <dl className="divide-y divide-border border border-border rounded-lg overflow-hidden text-sm">
          {resource.phone && (
            <div className="grid grid-cols-[110px_1fr] sm:grid-cols-[160px_1fr]">
              <dt className="px-4 py-3 font-sans font-semibold text-muted-foreground bg-muted/40 flex items-center gap-1.5">
                <Phone className="w-3.5 h-3.5 shrink-0" aria-hidden="true" />
                Phone
              </dt>
              <dd className="px-4 py-3 font-sans text-foreground">
                <a
                  href={`tel:${resource.phone.replace(/\D/g, "")}`}
                  className="text-primary hover:underline font-semibold"
                  aria-label={`Call ${resource.name} at ${resource.phone}`}
                >
                  {resource.phone}
                </a>
              </dd>
            </div>
          )}

          {resource.website && (
            <div className="grid grid-cols-[110px_1fr] sm:grid-cols-[160px_1fr]">
              <dt className="px-4 py-3 font-sans font-semibold text-muted-foreground bg-muted/40 flex items-center gap-1.5">
                <ExternalLink
                  className="w-3.5 h-3.5 shrink-0"
                  aria-hidden="true"
                />
                Website
              </dt>
              <dd className="px-4 py-3 font-sans text-foreground break-all">
                <a
                  href={resource.website}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-primary hover:underline inline-flex items-start gap-1"
                  aria-label={`Visit ${resource.name} website (opens in new tab)`}
                >
                  <span className="break-all">{resource.website}</span>
                  <ExternalLink
                    className="w-3 h-3 shrink-0 mt-0.5"
                    aria-hidden="true"
                  />
                </a>
              </dd>
            </div>
          )}

          {resource.address && (
            <div className="grid grid-cols-[110px_1fr] sm:grid-cols-[160px_1fr]">
              <dt className="px-4 py-3 font-sans font-semibold text-muted-foreground bg-muted/40 flex items-start gap-1.5">
                <MapPin
                  className="w-3.5 h-3.5 mt-0.5 shrink-0"
                  aria-hidden="true"
                />
                Location
              </dt>
              <dd className="px-4 py-3 font-sans text-foreground">
                {resource.address}
                {resource.hours && (
                  <span className="block text-muted-foreground mt-0.5">
                    {resource.hours}
                  </span>
                )}
              </dd>
            </div>
          )}

          {resource.eligibility && (
            <div className="grid grid-cols-[110px_1fr] sm:grid-cols-[160px_1fr]">
              <dt className="px-4 py-3 font-sans font-semibold text-muted-foreground bg-muted/40 flex items-center">
                Eligibility
              </dt>
              <dd className="px-4 py-3 font-sans text-foreground">
                {resource.eligibility}
              </dd>
            </div>
          )}

          {hasNotes && (
            <div className="grid grid-cols-[110px_1fr] sm:grid-cols-[160px_1fr]">
              <dt className="px-4 py-3 font-sans font-semibold text-muted-foreground bg-muted/40 flex items-start">
                Notes
              </dt>
              <dd className="px-4 py-3 font-sans text-foreground">
                {noteText && <p className="leading-relaxed">{noteText}</p>}
                {noteLinks && (
                  <ul className="space-y-1">
                    {noteLinks.map((n, i) => (
                      <li key={i}>
                        {n.url ? (
                          <a
                            href={n.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-primary hover:underline"
                          >
                            {n.label}
                          </a>
                        ) : (
                          <span>{n.label}</span>
                        )}
                      </li>
                    ))}
                  </ul>
                )}
              </dd>
            </div>
          )}

          {resource.tags.length > 0 && (
            <div className="grid grid-cols-[110px_1fr] sm:grid-cols-[160px_1fr]">
              <dt className="px-4 py-3 font-sans font-semibold text-muted-foreground bg-muted/40 flex items-start">
                Tags
              </dt>
              <dd className="px-4 py-3">
                <div className="flex flex-wrap gap-2">
                  {resource.tags.map((tag) => {
                    const isSelected = selectedTags.includes(tag);
                    return (
                      <Button
                        key={tag}
                        onClick={() => onTagClick(tag)}
                        className={cn(
                          "inline-flex items-center gap-1 text-xs font-sans font-medium px-2.5 py-1 rounded-md border transition-colors",
                          isSelected
                            ? "bg-primary text-primary-foreground border-primary"
                            : "bg-secondary text-foreground border-border hover:border-primary/40 hover:bg-primary/5",
                        )}
                        aria-pressed={isSelected}
                        aria-label={`${isSelected ? "Remove" : "Add"} filter: ${tag}`}
                      >
                        {isSelected && (
                          <Check
                            className="w-3 h-3 shrink-0"
                            aria-hidden="true"
                          />
                        )}
                        {tag}
                      </Button>
                    );
                  })}
                </div>
              </dd>
            </div>
          )}
        </dl>
      </CardContent>
    </Card>
  );
}
