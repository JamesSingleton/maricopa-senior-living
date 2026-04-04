import { ArrowRight, HandHeart, Heart, Mail, MapPin } from "lucide-react";
import Link from "next/link";

const DONATE_URL =
  "https://www.paypal.com/donate?hosted_button_id=VDPMC329ZC5ZE";

const QUICK_LINKS = [
  { href: "/", label: "Home" },
  { href: "/articles", label: "Articles" },
  { href: "/blog", label: "Blog" },
  { href: "/resources", label: "Resources" },
  { href: "/newsletter", label: "Newsletter" },
  { href: "/quick-links", label: "Community Links" },
  { href: "/about", label: "About" },
  { href: "/search", label: "Search" },
];

const ARTICLE_TOPICS = [
  {
    label: "Health & Wellness",
    href: "/articles?category=Health+%26+Wellness",
  },
  {
    label: "Financial Planning",
    href: "/articles?category=Financial+Planning",
  },
  { label: "Legal & Estate", href: "/articles?category=Legal+%26+Estate" },
  { label: "Caregiving", href: "/articles?category=Caregiving" },
  { label: "Mental Health", href: "/articles?category=Mental+Health" },
  {
    label: "Exercise & Fitness",
    href: "/articles?category=Exercise+%26+Fitness",
  },
];

const RESOURCE_GROUPS = [
  { label: "Health & Medical", href: "/resources?group=health-medical" },
  {
    label: "Financial & Benefits",
    href: "/resources?group=financial-benefits",
  },
  { label: "Transportation", href: "/resources?group=transportation-mobility" },
  { label: "Legal & Advocacy", href: "/resources?group=legal-advocacy" },
  { label: "Caregiving & Family", href: "/resources?group=caregiving-family" },
  { label: "Veterans Services", href: "/resources?group=veterans-services" },
];

export default function SiteFooter() {
  return (
    <footer className="bg-primary/95">
      {/* Donate strip */}
      <div className="bg-accent py-8 px-4">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-start sm:items-center justify-between gap-5">
          <div className="flex items-start gap-4">
            <div className="w-10 h-10 bg-accent-foreground/10 rounded-full flex items-center justify-center shrink-0">
              <HandHeart
                className="w-5 h-5 text-accent-foreground"
                aria-hidden="true"
              />
            </div>
            <div>
              <h2 className="font-serif text-xl font-bold text-accent-foreground text-balance">
                Support Our Mission
              </h2>
              <p className="font-sans text-accent-foreground/80 mt-0.5 text-sm">
                Your donation helps us provide free resources and services to
                Maricopa seniors.
              </p>
            </div>
          </div>
          <a
            href={DONATE_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="shrink-0 inline-flex items-center gap-2 bg-accent-foreground text-accent font-sans font-bold px-6 py-3 rounded-md hover:opacity-90 transition-opacity text-sm whitespace-nowrap"
            aria-label="Donate to Maricopa Senior Living via PayPal"
          >
            <Heart className="w-4 h-4" aria-hidden="true" />
            Donate Now
          </a>
        </div>
      </div>

      {/* Newsletter strip */}
      <div className="bg-primary py-10 px-4">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-start sm:items-center justify-between gap-5">
          <div>
            <h2 className="font-serif text-2xl font-bold text-primary-foreground text-balance">
              Stay Connected with Our Community
            </h2>
            <p className="font-sans text-primary-foreground/80 mt-1 text-base">
              Subscribe to our quarterly newsletter for local news and
              resources.
            </p>
          </div>
          <Link
            href="/newsletter#subscribe"
            className="shrink-0 inline-flex items-center gap-2 bg-primary-foreground text-primary font-sans font-bold px-6 py-3 rounded-md hover:opacity-90 transition-opacity text-sm"
          >
            Subscribe Now
            <ArrowRight className="w-4 h-4" aria-hidden="true" />
          </Link>
        </div>
      </div>

      {/* Main footer grid */}
      <div className="py-14 px-4">
        <div className="max-w-7xl mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10">
          {/* Brand column */}
          <div className="sm:col-span-2 lg:col-span-1">
            <div className="mb-4">
              <span className="font-serif text-2xl font-bold block leading-tight text-primary-foreground">
                Maricopa
              </span>
              <span className="font-sans text-xs font-semibold uppercase tracking-[0.2em] text-primary-foreground/55">
                Senior Living
              </span>
            </div>
            <p className="font-sans text-primary-foreground/65 text-sm leading-relaxed">
              A 501(c)(3) non-profit organization connecting Maricopa seniors
              and families with local services, information, and community since
              2010.
            </p>
            <div className="mt-5 flex flex-col gap-2.5 text-sm">
              <a
                href="mailto:info@maricopaseniorliving.org"
                className="flex items-center gap-2 text-primary-foreground/65 hover:text-primary-foreground transition-colors"
              >
                <Mail
                  className="w-4 h-4 text-accent shrink-0"
                  aria-hidden="true"
                />
                info@maricopaseniorliving.org
              </a>
              <span className="flex items-center gap-2 text-primary-foreground/65">
                <MapPin
                  className="w-4 h-4 text-accent shrink-0"
                  aria-hidden="true"
                />
                Maricopa, AZ 85138
              </span>
            </div>
          </div>

          {/* Quick links */}
          <div>
            <h3 className="font-sans font-bold uppercase tracking-widest text-[10px] text-accent mb-4">
              Quick Links
            </h3>
            <ul className="flex flex-col gap-2">
              {QUICK_LINKS.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="font-sans text-sm text-primary-foreground/65 hover:text-primary-foreground transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Article topics */}
          <div>
            <h3 className="font-sans font-bold uppercase tracking-widest text-[10px] text-accent mb-4">
              Article Topics
            </h3>
            <ul className="flex flex-col gap-2">
              {ARTICLE_TOPICS.map((item) => (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    className="font-sans text-sm text-primary-foreground/65 hover:text-primary-foreground transition-colors"
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Resource categories */}
          <div>
            <h3 className="font-sans font-bold uppercase tracking-widest text-[10px] text-accent mb-4">
              Resource Categories
            </h3>
            <ul className="flex flex-col gap-2">
              {RESOURCE_GROUPS.map((item) => (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    className="font-sans text-sm text-primary-foreground/65 hover:text-primary-foreground transition-colors"
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      {/* Bottom bar */}
      <div className="border-t border-primary-foreground/10 py-5 px-4">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex flex-col sm:flex-row items-center gap-2 text-xs text-primary-foreground/55 font-sans text-center sm:text-left">
            <span>© 2026 Maricopa Senior Living. All rights reserved.</span>
            <span className="hidden sm:inline">&bull;</span>
            <span className="flex items-center gap-1">
              Registered 501(c)(3) Non-Profit
              <Heart
                className="w-3 h-3 text-accent/70 inline-block"
                aria-hidden="true"
              />
              EIN: 86-XXXXXXX
            </span>
          </div>
          <div className="flex flex-wrap gap-5 text-xs text-primary-foreground/55 font-sans">
            <Link
              href="/about"
              className="hover:text-primary-foreground/70 transition-colors"
            >
              Privacy Policy
            </Link>
            <Link
              href="/about"
              className="hover:text-primary-foreground/70 transition-colors"
            >
              Accessibility
            </Link>
            <Link
              href="/about"
              className="hover:text-primary-foreground/70 transition-colors"
            >
              Contact
            </Link>
            <a
              href={DONATE_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1 text-accent/70 hover:text-accent transition-colors font-semibold"
              aria-label="Donate via PayPal"
            >
              <Heart className="w-3 h-3" aria-hidden="true" />
              Donate
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
