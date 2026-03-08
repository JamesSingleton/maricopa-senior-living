'use client'

import { Input } from '@maricopa-senior-living/ui/components'
import { cn } from '@maricopa-senior-living/ui/lib/utils'
import { Search, X } from 'lucide-react'

export function SearchInput({
  className,
  placeholder,
  value,
  onChange,
  onClear,
}: {
  className?: string
  placeholder: string
  value: string
  onChange: (value: string) => void
  onClear: () => void
}) {
  return (
    <div className={cn('mx-auto w-full max-w-lg', className)}>
      <div className="relative">
        <label className="sr-only" htmlFor="blog-search-input">
          {placeholder}
        </label>

        <div className="relative">
          <Search
            aria-hidden="true"
            className="text-muted-foreground pointer-events-none absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2"
          />

          <Input
            className="h-12 pr-10 pl-10 text-base"
            id="blog-search-input"
            onChange={(e) => onChange(e.target.value)}
            placeholder={placeholder}
            value={value}
          />

          {value && (
            <button
              aria-label="Clear search"
              className="text-muted-foreground hover:text-foreground focus:ring-ring absolute top-1/2 right-3 -translate-y-1/2 rounded-sm p-1 transition-colors focus:ring-2 focus:ring-offset-2 focus:outline-none"
              onClick={onClear}
              type="button"
            >
              <X className="h-4 w-4" />
            </button>
          )}
        </div>
      </div>
    </div>
  )
}
