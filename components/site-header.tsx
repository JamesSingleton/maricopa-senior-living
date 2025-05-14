'use client'

import * as React from 'react'
import Link from 'next/link'
import { Menu } from 'lucide-react'
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
} from '@/components/ui/navigation-menu'
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet'

const cityLinks = [
  { title: 'City Website', href: '#' },
  { title: "What's New", href: '#' },
  { title: 'City Council', href: '#' },
]

const localLinks = [
  { title: 'Senior Centers', href: '#' },
  { title: 'Healthcare Services', href: '#' },
  { title: 'Transportation', href: '#' },
]

const nationalLinks = [
  { title: 'Medicare', href: '#' },
  { title: 'Social Security', href: '#' },
  { title: 'Veterans Affairs', href: '#' },
]

export default function Header() {
  return (
    <header className="border-b bg-white">
      <div className="container mx-auto px-4">
        <div className="flex h-16 items-center justify-between">
          <Link href="/" className="text-2xl font-bold">
            Maricopa Senior Living
          </Link>

          <NavigationMenu className="hidden lg:flex">
            <NavigationMenuList>
              <NavigationMenuItem>
                <NavigationMenuTrigger>City of Maricopa</NavigationMenuTrigger>
                <NavigationMenuContent>
                  <ul className="grid w-48 gap-1 p-2">
                    {cityLinks.map((link) => (
                      <li key={link.title}>
                        <NavigationMenuLink asChild>
                          <Link
                            href={link.href}
                            className="block select-none rounded-md p-2 text-sm leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground"
                          >
                            {link.title}
                          </Link>
                        </NavigationMenuLink>
                      </li>
                    ))}
                  </ul>
                </NavigationMenuContent>
              </NavigationMenuItem>

              <NavigationMenuItem>
                <NavigationMenuTrigger>Local Links</NavigationMenuTrigger>
                <NavigationMenuContent>
                  <ul className="grid w-48 gap-1 p-2">
                    {localLinks.map((link) => (
                      <li key={link.title}>
                        <NavigationMenuLink asChild>
                          <Link
                            href={link.href}
                            className="block select-none rounded-md p-2 text-sm leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground"
                          >
                            {link.title}
                          </Link>
                        </NavigationMenuLink>
                      </li>
                    ))}
                  </ul>
                </NavigationMenuContent>
              </NavigationMenuItem>

              <NavigationMenuItem>
                <NavigationMenuTrigger>National Links</NavigationMenuTrigger>
                <NavigationMenuContent>
                  <ul className="grid w-48 gap-1 p-2">
                    {nationalLinks.map((link) => (
                      <li key={link.title}>
                        <NavigationMenuLink asChild>
                          <Link
                            href={link.href}
                            className="block select-none rounded-md p-2 text-sm leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground"
                          >
                            {link.title}
                          </Link>
                        </NavigationMenuLink>
                      </li>
                    ))}
                  </ul>
                </NavigationMenuContent>
              </NavigationMenuItem>

              <NavigationMenuItem>
                <Link href="/weather" legacyBehavior passHref>
                  <NavigationMenuLink className="group inline-flex h-10 w-max items-center justify-center rounded-md bg-background px-4 py-2 text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground focus:outline-none disabled:pointer-events-none disabled:opacity-50 data-[active]:bg-accent/50 data-[state=open]:bg-accent/50">
                    Weather
                  </NavigationMenuLink>
                </Link>
              </NavigationMenuItem>
            </NavigationMenuList>
          </NavigationMenu>

          <Sheet>
            <SheetTrigger asChild className="lg:hidden">
              <button className="p-2">
                <Menu className="h-6 w-6" />
                <span className="sr-only">Toggle menu</span>
              </button>
            </SheetTrigger>
            <SheetContent side="right" className="w-[300px] sm:w-[400px]">
              <nav className="flex flex-col gap-4">
                <div className="space-y-4 border-b pb-4">
                  <h2 className="text-lg font-semibold">City of Maricopa</h2>
                  {cityLinks.map((link) => (
                    <Link
                      key={link.title}
                      href={link.href}
                      className="block px-2 py-1 text-lg hover:text-primary"
                    >
                      {link.title}
                    </Link>
                  ))}
                </div>
                <div className="space-y-4 border-b pb-4">
                  <h2 className="text-lg font-semibold">Local Links</h2>
                  {localLinks.map((link) => (
                    <Link
                      key={link.title}
                      href={link.href}
                      className="block px-2 py-1 text-lg hover:text-primary"
                    >
                      {link.title}
                    </Link>
                  ))}
                </div>
                <div className="space-y-4 border-b pb-4">
                  <h2 className="text-lg font-semibold">National Links</h2>
                  {nationalLinks.map((link) => (
                    <Link
                      key={link.title}
                      href={link.href}
                      className="block px-2 py-1 text-lg hover:text-primary"
                    >
                      {link.title}
                    </Link>
                  ))}
                </div>
                <Link href="/weather" className="text-lg hover:text-primary">
                  Weather
                </Link>
              </nav>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  )
}
