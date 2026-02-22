import Link from 'next/link'
import { Mail, Phone, MapPin, Facebook, Youtube } from 'lucide-react'
import { Separator } from '@/components/ui/separator'
import { Badge } from '@/components/ui/badge'
import NewsletterSignup from '@/components/NewsletterSignup'

interface FooterProps {
  _key: string
  url: string
  text: string
  reference: {
    _id: string
    _type: string
    slug: string
    title: string
  }
}

export default function Footer({ menu }: { menu: FooterProps[] }) {
  const currentYear = new Date().getFullYear()

  // Quick links organized by section
  const servicesLinks = [
    { title: 'Browse Services', href: '/services' },
    { title: 'Healthcare', href: '/category/healthcare' },
    { title: 'Housing', href: '/category/housing' },
    { title: 'Transportation', href: '/category/transportation' },
  ]

  const resourcesLinks = [
    { title: 'Blog', href: '/blog' },
    { title: 'Newsletters', href: '/newsletters' },
    { title: "What's New", href: '/category/whats-new' },
    { title: 'Local Resources', href: '/tag/local-resources' },
  ]

  const aboutLinks = [
    { title: 'About Us', href: '/about' },
    { title: 'Contact', href: '/contact' },
    { title: 'Support Our Mission', href: '/category/maricopa-senior-living-an-arizona-501-c3-nonprofit' },
  ]

  return (
    <footer className="bg-muted/30 border-t-2 border-border">
      <div className="container mx-auto px-6 py-12 lg:px-8">
        {/* Newsletter Signup Section */}
        <div className="mb-12">
          <NewsletterSignup />
        </div>

        <Separator className="my-12" />

        {/* Main Footer Content */}
        <div className="grid gap-12 md:grid-cols-2 lg:grid-cols-4">
          {/* About Section */}
          <div>
            <h3 className="mb-6 text-2xl font-bold text-foreground">
              Maricopa Senior Living
            </h3>
            <p className="mb-6 text-lg text-muted-foreground leading-relaxed">
              Supporting seniors in Maricopa, Arizona with resources, services, and community connections.
            </p>
            
            {/* Contact Info */}
            <div className="space-y-3">
              <a 
                href="mailto:info@maricopaseniorliving.org" 
                className="flex items-center gap-3 text-lg text-foreground hover:text-primary transition-colors"
              >
                <Mail className="h-5 w-5 shrink-0" aria-hidden="true" />
                <span>info@maricopaseniorliving.org</span>
              </a>
              <a 
                href="tel:+15555551234" 
                className="flex items-center gap-3 text-lg text-foreground hover:text-primary transition-colors"
              >
                <Phone className="h-5 w-5 shrink-0" aria-hidden="true" />
                <span>(555) 555-1234</span>
              </a>
              <div className="flex items-start gap-3 text-lg text-foreground">
                <MapPin className="h-5 w-5 shrink-0 mt-1" aria-hidden="true" />
                <span>Maricopa, Arizona</span>
              </div>
            </div>
          </div>

          {/* Services Links */}
          <div>
            <h3 className="mb-6 text-2xl font-bold text-foreground">Services</h3>
            <ul className="space-y-3">
              {servicesLinks.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-lg text-muted-foreground hover:text-primary hover:underline transition-colors"
                  >
                    {link.title}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Resources Links */}
          <div>
            <h3 className="mb-6 text-2xl font-bold text-foreground">Resources</h3>
            <ul className="space-y-3">
              {resourcesLinks.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-lg text-muted-foreground hover:text-primary hover:underline transition-colors"
                  >
                    {link.title}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* About & Connect */}
          <div>
            <h3 className="mb-6 text-2xl font-bold text-foreground">About & Connect</h3>
            <ul className="mb-6 space-y-3">
              {aboutLinks.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-lg text-muted-foreground hover:text-primary hover:underline transition-colors"
                  >
                    {link.title}
                  </Link>
                </li>
              ))}
            </ul>

            {/* Social Media */}
            <div className="mt-6">
              <h4 className="mb-3 text-xl font-semibold text-foreground">Follow Us</h4>
              <div className="flex gap-3">
                <a
                  href="https://facebook.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary text-primary-foreground hover:bg-primary/90 transition-colors"
                  aria-label="Follow us on Facebook"
                >
                  <Facebook className="h-6 w-6" aria-hidden="true" />
                </a>
                <a
                  href="https://youtube.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary text-primary-foreground hover:bg-primary/90 transition-colors"
                  aria-label="Follow us on YouTube"
                >
                  <Youtube className="h-6 w-6" aria-hidden="true" />
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* Popular Categories */}
        <div className="mt-12">
          <h3 className="mb-4 text-2xl font-bold text-foreground">Popular Topics</h3>
          <div className="flex flex-wrap gap-3">
            <Link href="/category/healthcare">
              <Badge variant="secondary" className="text-base px-4 py-2 cursor-pointer hover:bg-secondary/80">
                Healthcare
              </Badge>
            </Link>
            <Link href="/category/housing">
              <Badge variant="secondary" className="text-base px-4 py-2 cursor-pointer hover:bg-secondary/80">
                Housing
              </Badge>
            </Link>
            <Link href="/category/transportation">
              <Badge variant="secondary" className="text-base px-4 py-2 cursor-pointer hover:bg-secondary/80">
                Transportation
              </Badge>
            </Link>
            <Link href="/category/nutrition">
              <Badge variant="secondary" className="text-base px-4 py-2 cursor-pointer hover:bg-secondary/80">
                Nutrition
              </Badge>
            </Link>
            <Link href="/tag/local-resources">
              <Badge variant="secondary" className="text-base px-4 py-2 cursor-pointer hover:bg-secondary/80">
                Local Resources
              </Badge>
            </Link>
          </div>
        </div>

        <Separator className="my-8" />

        {/* Bottom Bar */}
        <div className="flex flex-col items-center justify-between gap-6 text-center md:flex-row md:text-left">
          <p className="text-lg text-muted-foreground">
            &copy; {currentYear} Maricopa Senior Living. All rights reserved.
          </p>
          
          <div className="flex flex-wrap justify-center gap-6 text-lg">
            <Link href="/privacy" className="text-muted-foreground hover:text-primary hover:underline transition-colors">
              Privacy Policy
            </Link>
            <Link href="/terms" className="text-muted-foreground hover:text-primary hover:underline transition-colors">
              Terms of Service
            </Link>
            <Link href="/accessibility" className="text-muted-foreground hover:text-primary hover:underline transition-colors">
              Accessibility
            </Link>
          </div>
          
          <p className="text-lg text-muted-foreground">
            Built by{' '}
            <a
              className="text-primary hover:underline font-semibold"
              target="_blank"
              rel="noopener noreferrer"
              href="https://www.jamessingleton.me"
            >
              James Singleton
            </a>
          </p>
        </div>
      </div>
    </footer>
  )
}
