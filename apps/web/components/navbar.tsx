'use client'
import { useMemo } from 'react'
import Link from 'next/link'
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
  navigationMenuTriggerStyle,
} from '@maricopa-senior-living/ui/components/navigation-menu'

import { SanityButtons } from './elements/sanity-buttons'
import { CircleAlertIcon } from 'lucide-react'
import { cn } from '@maricopa-senior-living/ui/lib/utils'

function getColumnLayoutClass(itemCount: number) {
  if (itemCount <= 4) return 'w-80'
  if (itemCount <= 8) return 'grid grid-cols-2 gap-2 w-[500px]'
  if (itemCount <= 12) return 'grid grid-cols-3 gap-2 w-[700px]'

  return 'grid grid-cols-4 gap-2 w-[800px]'
}

function NavbarColumnLink({
  column,
}: {
  column: Extract<
    NonNullable<NonNullable<QueryNavbarDataResult>['columns']>[number],
    { type: 'link' }
  >
}) {
  return (
    <Link aria-label={`Link to ${column.name ?? column.href}`} href={column.href ?? ''} passHref>
      <NavigationMenuLink
        className={cn(navigationMenuTriggerStyle(), 'text-muted-foreground dark:text-neutral-300')}
      >
        {column.name}
      </NavigationMenuLink>
    </Link>
  )
}

export function NavbarColumn({
  column,
}: {
  column: Extract<
    NonNullable<NonNullable<QueryNavbarDataResult>['columns']>[number],
    { type: 'column' }
  >
}) {
  const layoutClass = useMemo(
    () => getColumnLayoutClass(column.links?.length ?? 0),
    [column.links?.length],
  )

  return (
    <NavigationMenuList>
      <NavigationMenuItem className="text-muted-foreground dark:text-neutral-300">
        <NavigationMenuTrigger>{column.title}</NavigationMenuTrigger>
        <NavigationMenuContent>
          <ul className={cn('p-0', layoutClass)}>
            {column.links?.map((item) => {
              return (
                <li key={item._key}>
                  <MenuItemLink
                    item={{
                      title: item.name ?? '',
                      description: item.description ?? '',
                      href: item.href ?? '',
                      target: item.openInNewTab ? '_blank' : '_self',
                      rel: item.openInNewTab ? 'noopener noreferrer' : undefined,
                      // icon: <SanityIcon icon={item.icon} className="size-5 shrink-0" />,
                    }}
                  />
                </li>
              )
            })}
          </ul>
        </NavigationMenuContent>
      </NavigationMenuItem>
    </NavigationMenuList>
  )
}

function MenuItemLink({
  item,
  setIsOpen,
}: {
  item: MenuItem
  setIsOpen?: (isOpen: boolean) => void
}) {
  return (
    <Link
      className={cn(
        'hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground flex items-center gap-4 rounded-md p-3 leading-none transition-colors outline-none select-none',
      )}
      aria-label={`Link to ${item.title ?? item.href}`}
      onClick={() => setIsOpen?.(false)}
      href={item.href ?? '/'}
      target={item.target}
      rel={item.rel}
    >
      {item.icon}
      <div className="">
        <div className="text-sm font-semibold">{item.title}</div>
        <p className="text-muted-foreground line-clamp-2 text-sm leading-snug">
          {item.description}
        </p>
      </div>
    </Link>
  )
}

export function Navbar({ navbarData, settingsData }) {
  const { columns, buttons } = navbarData
  const { logo, siteTitle } = settingsData
  return (
    <header className="bg-background/80 sticky top-0 z-40 w-full border-b backdrop-blur-sm">
      <div className="container mx-auto px-4">
        <div className="flex h-16 items-center justify-between">
          {/*Logo*/}
          <div className="flex h-10 w-40 items-center">
            <Link href="/">Maricopa Senior Living</Link>
          </div>
          <NavigationMenu viewport={false} className="hidden items-center gap-1 md:flex">
            {columns?.map((column) =>
              column.type === 'column' ? (
                <NavbarColumn key={`nav-${column._key}`} column={column} />
              ) : (
                <NavbarColumnLink key={`nav-${column._key}`} column={column} />
              ),
            )}
          </NavigationMenu>

          <div className="hidden items-center gap-4 md:flex">
            <SanityButtons
              buttonClassName="rounded-lg"
              buttons={buttons || []}
              className="flex items-center gap-2"
            />
          </div>
        </div>
      </div>
    </header>
  )
}
