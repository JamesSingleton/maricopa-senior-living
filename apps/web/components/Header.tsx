'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { usePathname, useSearchParams, useRouter } from 'next/navigation'
import { Menu, Search, X } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet'
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
  navigationMenuTriggerStyle,
} from '@/components/ui/navigation-menu'
import { cn } from '@/lib/utils'

const Header = ({ menu }: { menu: any }) => {
  const pathname = usePathname()
  const searchParams = useSearchParams()
  const router = useRouter()
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const [showSearch, setShowSearch] = useState(false)

  useEffect(() => {
    setMobileMenuOpen(false)
  }, [pathname, searchParams])

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    if (searchQuery.trim()) {
      router.push(`/search?q=${encodeURIComponent(searchQuery)}`)
      setSearchQuery('')
      setShowSearch(false)
    }
  }

  return (
    <>
      {/* Skip to content link */}
      <a href="#main-content" className="skip-link">
        Skip to main content
      </a>

      <header className="sticky top-0 z-50 w-full border-b-2 border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <nav className="container mx-auto flex h-20 items-center justify-between px-6 lg:px-8" aria-label="Main navigation">
          {/* Logo */}
          <div className="flex items-center">
            <Link 
              href="/" 
              className="text-2xl font-bold text-foreground hover:text-primary transition-colors focus-visible:outline-none focus-visible:ring-3 focus-visible:ring-ring focus-visible:ring-offset-2 rounded-lg px-2 py-1" 
              prefetch={false}
            >
              <span className="sr-only">Maricopa Senior Living - </span>Home
            </Link>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex lg:items-center lg:gap-4">
            <NavigationMenu>
              <NavigationMenuList>
                <NavigationMenuItem>
                  <Link href="/" legacyBehavior passHref>
                    <NavigationMenuLink className={navigationMenuTriggerStyle()}>
                      Home
                    </NavigationMenuLink>
                  </Link>
                </NavigationMenuItem>

                {menu.map((item: any) => {
                  if (item.link.reference) {
                    const href = `${item.link.reference._type === 'page' ? '' : `/${item.link.reference._type}`}/${item.link.reference.slug}`
                    return (
                      <NavigationMenuItem key={item._key}>
                        <Link href={href} legacyBehavior passHref>
                          <NavigationMenuLink className={navigationMenuTriggerStyle()}>
                            {item.link.reference.title}
                          </NavigationMenuLink>
                        </Link>
                      </NavigationMenuItem>
                    )
                  }

                  if (item.children && item.children.length > 0) {
                    return (
                      <NavigationMenuItem key={item._key}>
                        <NavigationMenuTrigger>{item.link.text}</NavigationMenuTrigger>
                        <NavigationMenuContent>
                          <ul className="grid w-[400px] gap-3 p-4">
                            {item.children.map((child: any) => (
                              <li key={child._key}>
                                <NavigationMenuLink asChild>
                                  <a
                                    href={child.link.url}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className={cn(
                                      "block select-none space-y-1 rounded-lg p-4 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground",
                                    )}
                                  >
                                    <div className="text-lg font-semibold leading-none">
                                      {child.link.text}
                                      <span className="sr-only"> (opens in new tab)</span>
                                    </div>
                                  </a>
                                </NavigationMenuLink>
                              </li>
                            ))}
                          </ul>
                        </NavigationMenuContent>
                      </NavigationMenuItem>
                    )
                  }

                  return null
                })}

                <NavigationMenuItem>
                  <Link href="/blog" legacyBehavior passHref>
                    <NavigationMenuLink className={navigationMenuTriggerStyle()}>
                      Blog
                    </NavigationMenuLink>
                  </Link>
                </NavigationMenuItem>

                <NavigationMenuItem>
                  <Link href="/newsletters" legacyBehavior passHref>
                    <NavigationMenuLink className={navigationMenuTriggerStyle()}>
                      Newsletters
                    </NavigationMenuLink>
                  </Link>
                </NavigationMenuItem>
              </NavigationMenuList>
            </NavigationMenu>

            {/* Search Toggle Button (Desktop) */}
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setShowSearch(!showSearch)}
              aria-label="Toggle search"
              className="ml-2"
            >
              {showSearch ? <X className="h-6 w-6" /> : <Search className="h-6 w-6" />}
            </Button>

            {/* Newsletter CTA */}
            <Link href="/newsletters">
              <Button variant="default" size="default" className="ml-2">
                Subscribe
              </Button>
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <div className="flex items-center gap-2 lg:hidden">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setShowSearch(!showSearch)}
              aria-label="Toggle search"
            >
              {showSearch ? <X className="h-6 w-6" /> : <Search className="h-6 w-6" />}
            </Button>

            <Sheet open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon" aria-label="Open main menu">
                  <Menu className="h-8 w-8" />
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="w-[300px] sm:w-[400px]">
                <SheetHeader>
                  <SheetTitle className="text-left text-2xl">Menu</SheetTitle>
                </SheetHeader>
                <div className="mt-8 flex flex-col space-y-3">
                  <Link
                    href="/"
                    className="rounded-lg px-4 py-3 text-xl font-semibold hover:bg-accent hover:text-accent-foreground transition-colors"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    Home
                  </Link>

                  {menu.map((item: any) => {
                    if (item.link.reference) {
                      const href = `${item.link.reference._type === 'page' ? '' : `/${item.link.reference._type}`}/${item.link.reference.slug}`
                      return (
                        <Link
                          key={item._key}
                          href={href}
                          className="rounded-lg px-4 py-3 text-xl font-semibold hover:bg-accent hover:text-accent-foreground transition-colors"
                          onClick={() => setMobileMenuOpen(false)}
                        >
                          {item.link.reference.title}
                        </Link>
                      )
                    }

                    if (item.children && item.children.length > 0) {
                      return (
                        <div key={item._key} className="space-y-2">
                          <div className="px-4 py-2 text-xl font-bold text-muted-foreground">
                            {item.link.text}
                          </div>
                          {item.children.map((child: any) => (
                            <a
                              key={child._key}
                              href={child.link.url}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="block rounded-lg px-4 py-3 pl-8 text-lg font-semibold hover:bg-accent hover:text-accent-foreground transition-colors"
                              onClick={() => setMobileMenuOpen(false)}
                            >
                              {child.link.text}
                              <span className="sr-only"> (opens in new tab)</span>
                            </a>
                          ))}
                        </div>
                      )
                    }

                    return null
                  })}

                  <Link
                    href="/blog"
                    className="rounded-lg px-4 py-3 text-xl font-semibold hover:bg-accent hover:text-accent-foreground transition-colors"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    Blog
                  </Link>

                  <Link
                    href="/newsletters"
                    className="rounded-lg px-4 py-3 text-xl font-semibold hover:bg-accent hover:text-accent-foreground transition-colors"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    Newsletters
                  </Link>

                  <div className="pt-4">
                    <Link href="/newsletters" onClick={() => setMobileMenuOpen(false)}>
                      <Button variant="default" size="lg" className="w-full">
                        Subscribe to Newsletter
                      </Button>
                    </Link>
                  </div>
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </nav>

        {/* Search Bar (Expandable) */}
        {showSearch && (
          <div className="border-t-2 border-border bg-background/95 backdrop-blur">
            <div className="container mx-auto px-6 py-4 lg:px-8">
              <form onSubmit={handleSearch} className="flex gap-2">
                <Input
                  type="search"
                  placeholder="Search articles and services..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="flex-1 text-lg"
                  aria-label="Search"
                  autoFocus
                />
                <Button type="submit" size="lg">
                  <Search className="h-5 w-5 mr-2" />
                  Search
                </Button>
              </form>
            </div>
          </div>
        )}
      </header>
    </>
  )
}

export default Header
