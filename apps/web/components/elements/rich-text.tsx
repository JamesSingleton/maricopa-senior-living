import { cn } from '@maricopa-senior-living/ui/lib/utils'
import Link from 'next/link'
import { PortableText, type PortableTextReactComponents } from 'next-sanity'

import type { SanityRichTextProps } from '@/types'
import { parseChildrenToSlug } from '@/lib/utils'
import { SanityImage } from './sanity-image'

const components: Partial<PortableTextReactComponents> = {
  block: {
    h2: ({ children, value }) => {
      const slug = parseChildrenToSlug(value.children)
      return (
        <h2 className="scroll-m-20 border-b pb-2 text-3xl font-semibold first:mt-0" id={slug}>
          {children}
        </h2>
      )
    },
    h3: ({ children, value }) => {
      const slug = parseChildrenToSlug(value.children)
      return (
        <h3 className="scroll-m-20 text-2xl font-semibold" id={slug}>
          {children}
        </h3>
      )
    },
    h4: ({ children, value }) => {
      const slug = parseChildrenToSlug(value.children)
      return (
        <h4 className="scroll-m-20 text-xl font-semibold" id={slug}>
          {children}
        </h4>
      )
    },
    h5: ({ children, value }) => {
      const slug = parseChildrenToSlug(value.children)
      return (
        <h5 className="scroll-m-20 text-lg font-semibold" id={slug}>
          {children}
        </h5>
      )
    },
    h6: ({ children, value }) => {
      const slug = parseChildrenToSlug(value.children)
      return (
        <h6 className="scroll-m-20 text-base font-semibold" id={slug}>
          {children}
        </h6>
      )
    },
  },
  marks: {
    code: ({ children }) => (
      <code className="bg-opacity-5 rounded-md border border-white/10 p-1 text-sm lg:whitespace-nowrap">
        {children}
      </code>
    ),
    customLink: ({ children, value }) => {
      if (!value.href || value.href === '#') {
        return <span className="underline decoration-dotted underline-offset-2">Link Broken</span>
      }
      return (
        <Link
          aria-label={`Link to ${value?.href}`}
          className="underline decoration-dotted underline-offset-2"
          href={value.href}
          prefetch={false}
          target={value.openInNewTab ? '_blank' : '_self'}
        >
          {children}
        </Link>
      )
    },
  },
  types: {
    image: ({ value }) => {
      if (!value?.id) {
        return null
      }
      return (
        <figure className="my-4">
          <SanityImage
            className="h-auto w-full rounded-lg"
            height={900}
            image={value}
            width={1600}
          />
          {value?.caption && (
            <figcaption className="mt-2 text-center text-sm text-zinc-500 dark:text-zinc-400">
              {value.caption}
            </figcaption>
          )}
        </figure>
      )
    },
  },
  hardBreak: () => <br />,
}

export function RichText<T extends SanityRichTextProps>({
  richText,
  className,
}: {
  richText?: T | null
  className?: string
}) {
  if (!richText) {
    return null
  }

  return (
    <div
      className={cn(
        'prose prose-zinc dark:prose-invert prose-headings:scroll-m-24 prose-h2:border-b prose-h2:pb-2 prose-h2:font-semibold prose-h2:text-3xl prose-headings:text-opacity-90 prose-ol:text-opacity-80 prose-p:text-opacity-80 prose-ul:text-opacity-80 prose-a:decoration-dotted prose-h2:first:mt-0 max-w-none',
        className,
      )}
    >
      <PortableText
        components={components}
        onMissingComponent={(_, { nodeType, type }) => {
          console.warn(`Missing component: ${nodeType} for type: ${type}`)
        }}
        value={richText}
      />
    </div>
  )
}
