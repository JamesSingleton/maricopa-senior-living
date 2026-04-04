"use client";

import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetTitle,
  SheetTrigger,
} from "@maricopa-senior-living/ui/components/sheet";
import { Filter, X } from "lucide-react";

interface FilterSheetProps {
  /** Number of active filters — shows a count badge when > 0 */
  activeFilterCount: number;
  sheetTitle: string;
  sheetDescription: string;
  hasFilters: boolean;
  onClear: () => void;
  /** The filter panel content (FilterSidebar) rendered inside the drawer */
  children: React.ReactNode;
}

export default function FilterSheet({
  activeFilterCount,
  sheetTitle,
  sheetDescription,
  hasFilters,
  onClear,
  children,
}: FilterSheetProps) {
  return (
    <Sheet>
      <SheetTrigger>
        <button
          type="button"
          className="lg:hidden inline-flex items-center gap-2 px-4 py-2.5 rounded-md border border-border bg-card font-sans text-sm font-semibold text-foreground hover:bg-muted transition-colors"
          aria-label={`Open filters${activeFilterCount > 0 ? ` (${activeFilterCount} active)` : ""}`}
        >
          <Filter className="w-4 h-4 text-primary" aria-hidden="true" />
          Filters
          {activeFilterCount > 0 && (
            <span
              className="w-5 h-5 rounded-full bg-primary text-primary-foreground text-xs font-bold flex items-center justify-center"
              aria-hidden="true"
            >
              {activeFilterCount}
            </span>
          )}
        </button>
      </SheetTrigger>

      <SheetContent
        side="left"
        className="w-[300px] sm:w-[340px] p-0 flex flex-col bg-background"
      >
        {/* Header */}
        <div className="bg-primary text-primary-foreground px-5 py-4 flex items-center justify-between shrink-0">
          <SheetTitle className="font-serif text-lg font-bold text-primary-foreground">
            {sheetTitle}
          </SheetTitle>
          <SheetDescription className="sr-only">
            {sheetDescription}
          </SheetDescription>
          <SheetClose>
            <button
              type="button"
              className="p-2 rounded-md hover:bg-primary-foreground/15 transition-colors"
              aria-label="Close filters"
            >
              <X className="w-4 h-4" aria-hidden="true" />
            </button>
          </SheetClose>
        </div>

        {/* Scrollable filter content — flex container to support FilterSidebar's internal layout */}
        <div className="flex-1 overflow-hidden flex flex-col min-h-0 p-5">
          {children}
        </div>

        {/* Footer — clear & close */}
        {hasFilters && (
          <div className="border-t border-border px-5 py-4 shrink-0">
            <SheetClose asChild>
              <button
                type="button"
                onClick={onClear}
                className="w-full py-2.5 rounded-md bg-primary text-primary-foreground font-sans text-sm font-semibold hover:opacity-90 transition-opacity"
              >
                Clear All &amp; Close
              </button>
            </SheetClose>
          </div>
        )}
      </SheetContent>
    </Sheet>
  );
}
