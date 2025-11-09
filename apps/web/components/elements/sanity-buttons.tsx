import Link from 'next/link'
import { Button } from '@maricopa-senior-living/ui/components/button'
import { cn } from '@maricopa-senior-living/ui/lib/utils'
import type { ComponentProps } from 'react'

import type { SanityButtonProps } from '@/types'

type SanityButtonsProps = {
  buttons: SanityButtonProps[] | null
  className?: string
  buttonClassName?: string
  size?: 'sm' | 'lg' | 'default' | 'icon' | null | undefined
}

function SanityButton({
  text,
  href,
  variant = 'default',
  openInNewTab,
  className,
  ...props
}: SanityButtonProps & ComponentProps<typeof Button>) {
  if (!href) {
    console.log('Link Broken', { text, href, variant, openInNewTab })
    return <Button>Link Broken</Button>
  }

  return (
    <Button variant={variant} {...props} asChild className={cn('rounded-[10px]', className)}>
      <Link
        href={href || '#'}
        target={openInNewTab ? '_blank' : '_self'}
        aria-label={`Navigate to ${text}`}
        title={`Click to visit ${text}`}
      >
        {text}
      </Link>
    </Button>
  )
}

export function SanityButtons({
  buttons,
  className,
  buttonClassName,
  size = 'default',
}: SanityButtonsProps) {
  if (!buttons?.length) return null

  return (
    <div className={cn('flex flex-col gap-4 sm:flex-row', className)}>
      {buttons.map((button) => (
        <SanityButton
          key={`button-${button._key}`}
          size={size}
          {...button}
          className={buttonClassName}
        />
      ))}
    </div>
  )
}
