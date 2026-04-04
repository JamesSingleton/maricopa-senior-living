import {
  ArrowRight,
  BookOpen,
  Heart,
  Home,
  MapPin,
  Search,
} from "lucide-react";
import Link from "next/link";

const HELPFUL_LINKS = [
  {
    href: "/articles",
    label: "Health Articles",
    icon: BookOpen,
    description: "Expert guides on senior health and wellness",
  },
  {
    href: "/resources",
    label: "Community Resources",
    icon: MapPin,
    description: "Local services, support programs, and care",
  },
  {
    href: "/newsletter",
    label: "Our Newsletter",
    icon: Heart,
    description: "Monthly news from Maricopa Senior Living",
  },
  {
    href: "/search",
    label: "Search the Site",
    icon: Search,
    description: "Find anything across our entire library",
  },
];

export default function NotFound() {
  return (
    <>
      {/* Hero section */}
      <section className="flex-1 flex items-center justify-center px-4 py-20 bg-gradient-to-b from-primary/5 to-background">
        <div className="max-w-2xl w-full text-center">
          {/* Large decorative number */}
          <div
            className="relative inline-flex items-center justify-center mb-8 select-none"
            aria-hidden="true"
          >
            <span
              className="font-serif font-bold text-[160px] sm:text-[200px] leading-none text-primary/10 block"
              style={{ letterSpacing: "-0.05em" }}
            >
              404
            </span>
            {/* Centered icon overlay */}
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-20 h-20 bg-primary rounded-full flex items-center justify-center shadow-lg">
                <MapPin className="w-9 h-9 text-primary-foreground" />
              </div>
            </div>
          </div>

          <h1 className="font-serif text-3xl sm:text-4xl font-bold text-foreground text-balance leading-tight">
            Looks like this page took a wrong turn!
          </h1>

          <p className="font-sans text-muted-foreground text-lg mt-4 leading-relaxed text-pretty max-w-md mx-auto">
            We couldn&rsquo;t find the page you were looking for. It may have
            been moved, renamed, or perhaps it never existed. Let&rsquo;s get
            you back on track.
          </p>

          <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-3">
            <Link
              href="/"
              className="inline-flex items-center gap-2 bg-primary text-primary-foreground font-sans font-bold px-6 py-3.5 rounded-md hover:opacity-90 transition-opacity text-base"
            >
              <Home className="w-4 h-4" aria-hidden="true" />
              Back to Home
            </Link>
            <Link
              href="/search"
              className="inline-flex items-center gap-2 border border-border bg-card text-foreground font-sans font-semibold px-6 py-3.5 rounded-md hover:bg-secondary transition-colors text-base"
            >
              <Search className="w-4 h-4" aria-hidden="true" />
              Search the Site
            </Link>
          </div>
        </div>
      </section>

      {/* Helpful links */}
      <section
        className="bg-card border-t border-border py-12 px-4"
        aria-label="Helpful pages"
      >
        <div className="max-w-4xl mx-auto">
          <h2 className="font-serif text-xl font-bold text-foreground text-center mb-8">
            You might be looking for one of these
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {HELPFUL_LINKS.map(({ href, label, icon: Icon, description }) => (
              <Link
                key={href}
                href={href}
                className="group bg-background border border-border rounded-xl p-5 hover:border-primary/40 hover:shadow-md transition-all flex flex-col gap-3"
              >
                <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
                  <Icon className="w-5 h-5 text-primary" aria-hidden="true" />
                </div>
                <div>
                  <p className="font-sans font-bold text-foreground text-sm group-hover:text-primary transition-colors">
                    {label}
                  </p>
                  <p className="font-sans text-xs text-muted-foreground mt-0.5 leading-relaxed">
                    {description}
                  </p>
                </div>
                <ArrowRight
                  className="w-4 h-4 text-muted-foreground group-hover:text-primary group-hover:translate-x-0.5 transition-all mt-auto"
                  aria-hidden="true"
                />
              </Link>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
