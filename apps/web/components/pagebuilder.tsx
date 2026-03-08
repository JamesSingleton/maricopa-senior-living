'use client'
import { useMemo, useCallback } from 'react'
import { env } from '@maricopa-senior-living/env/client'
import { createDataAttribute } from 'next-sanity'
import { useOptimistic } from '@sanity/visual-editing/react'
import { HeroBlock } from './sections/hero'
import { PageBuilderBlockTypes } from '@/types'

type PageBuilderBlock = NonNullable<NonNullable<QueryHomePageDataResult>['pageBuilder']>[number]

export type PageBuilderProps = {
  readonly pageBuilder?: PageBuilderBlock[]
  readonly id: string
  readonly type: string
}

type SanityDataAttributeConfig = {
  readonly id: string
  readonly type: string
  readonly path: string
}

// Strongly typed component mapping with proper component signatures
const BLOCK_COMPONENTS = {
  // cta: CTABlock,
  // faqAccordion: FaqAccordion,
  hero: HeroBlock,
  // featureCardsIcon: FeatureCardsWithIcon,
  // subscribeNewsletter: SubscribeNewsletter,
  // imageLinkCards: ImageLinkCards,
  // biome-ignore lint/suspicious/noExplicitAny: <any is used to allow for dynamic component rendering>
} as const satisfies Record<PageBuilderBlockTypes, React.ComponentType<any>>

/**
 * Helper function to create consistent Sanity data attributes
 */
function createSanityDataAttribute(config: SanityDataAttributeConfig): string {
  return createDataAttribute({
    id: config.id,
    baseUrl: env.NEXT_PUBLIC_SANITY_STUDIO_URL,
    projectId: env.NEXT_PUBLIC_SANITY_PROJECT_ID,
    dataset: env.NEXT_PUBLIC_SANITY_DATASET,
    type: config.type,
    path: config.path,
  }).toString()
}

function UnknownBlockError({ blockType, blockKey }: { blockType: string; blockKey: string }) {
  return (
    <div
      aria-label={`Unknown block type: ${blockType}`}
      className="border-muted-foreground/20 bg-muted text-muted-foreground flex items-center justify-center rounded-lg border-2 border-dashed p-8 text-center"
      key={`${blockType}-${blockKey}`}
      role="alert"
    >
      <div className="space-y-2">
        <p>Component not found for block type:</p>
        <code className="bg-background rounded px-2 py-1 font-mono text-sm">{blockType}</code>
      </div>
    </div>
  )
}

function useOptimisticPageBuilder(initialBlocks: PageBuilderBlock[], documentId: string) {
  // biome-ignore lint/suspicious/noExplicitAny: <any is used to allow for dynamic component rendering>
  return useOptimistic<PageBuilderBlock[], any>(initialBlocks, (currentBlocks, action) => {
    if (action.id === documentId && action.document?.pageBuilder) {
      return action.document.pageBuilder
    }
    return currentBlocks
  })
}

function useBlockRenderer(id: string, type: string) {
  const createBlockDataAttribute = useCallback(
    (blockKey: string) =>
      createSanityDataAttribute({
        id,
        type,
        path: `pageBuilder[_key=="${blockKey}"]`,
      }),
    [id, type],
  )

  const renderBlock = useCallback(
    (block: PageBuilderBlock, _index: number) => {
      const Component = BLOCK_COMPONENTS[block._type as keyof typeof BLOCK_COMPONENTS]

      if (!Component) {
        return (
          <UnknownBlockError
            blockKey={block._key}
            blockType={block._type}
            key={`${block._type}-${block._key}`}
          />
        )
      }

      return (
        <div
          data-sanity={createBlockDataAttribute(block._key)}
          key={`${block._type}-${block._key}`}
        >
          {/** biome-ignore lint/suspicious/noExplicitAny: <any is used to allow for dynamic component rendering> */}
          <Component {...(block as any)} />
        </div>
      )
    },
    [createBlockDataAttribute],
  )

  return { renderBlock }
}

export function PageBuilder({ pageBuilder: initialBlocks = [], id, type }: PageBuilderProps) {
  const blocks = useOptimisticPageBuilder(initialBlocks, id)
  const { renderBlock } = useBlockRenderer(id, type)
  const containerDataAttribute = useMemo(
    () => createSanityDataAttribute({ id, type, path: 'pageBuilder' }),
    [id, type],
  )

  if (!blocks.length) {
    return null
  }
  return (
    <main
      className="mx-auto flex max-w-7xl flex-col gap-16 py-16"
      data-sanity={containerDataAttribute}
    >
      {blocks.map(renderBlock)}
    </main>
  )
}
