"use client";

import {
  Button,
  buttonVariants,
} from "@maricopa-senior-living/ui/components/button";
import { cn } from "@maricopa-senior-living/ui/lib/utils";
import {
  ArrowRight,
  Calendar,
  CheckCircle,
  Download,
  FileText,
  Heart,
  Mail,
} from "lucide-react";
import dynamic from "next/dynamic";
import Image from "next/image";
import { Suspense, useState } from "react";

import { NEWSLETTERS } from "@/lib/dummy-data";

// const PdfViewer = dynamic(() => import('@/components/pdf-viewer'), { ssr: false })

const DONATE_URL =
  "https://www.paypal.com/donate?hosted_button_id=VDPMC329ZC5ZE";

const seasonColors: Record<string, string> = {
  Spring: "bg-green-100 text-green-800",
  Summer: "bg-amber-100 text-amber-800",
  Fall: "bg-orange-100 text-orange-800",
  Winter: "bg-blue-100 text-blue-800",
};

function NewsletterCard({
  newsletter,
  onView,
}: {
  newsletter: (typeof NEWSLETTERS)[0];
  onView: (newsletter: (typeof NEWSLETTERS)[0]) => void;
}) {
  return (
    <div className="bg-card rounded-xl border border-border overflow-hidden hover:border-primary/30 hover:shadow-md transition-all group">
      {/* Header strip */}
      <div className="bg-primary/8 border-b border-border px-5 py-3 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <FileText className="w-4 h-4 text-primary" aria-hidden="true" />
          <span className="font-sans text-sm font-bold text-foreground">
            {newsletter.season} {newsletter.year}
          </span>
        </div>
        <span
          className={`text-xs font-semibold font-sans px-2.5 py-0.5 rounded-full ${
            seasonColors[newsletter.season] || "bg-secondary text-foreground"
          }`}
        >
          {newsletter.season}
        </span>
      </div>

      <div className="p-5">
        <h3 className="font-serif text-lg font-bold text-foreground leading-snug">
          {newsletter.title}
        </h3>
        <p className="font-sans text-muted-foreground text-sm mt-2 leading-relaxed">
          {newsletter.description}
        </p>

        <div className="mt-5 flex flex-wrap gap-3">
          <Button
            onClick={() => onView(newsletter)}
            className="inline-flex items-center gap-2 bg-primary text-primary-foreground font-sans font-bold px-4 py-2.5 rounded-md hover:opacity-90 transition-opacity text-sm"
            aria-label={`View ${newsletter.title} inline`}
          >
            <FileText className="w-4 h-4" aria-hidden="true" />
            View Newsletter
          </Button>
          <a
            href={newsletter.pdfUrl}
            download
            className={cn(
              "inline-flex items-center gap-2 border border-border bg-secondary text-foreground font-sans font-semibold px-4 py-2.5 rounded-md hover:bg-muted transition-colors text-sm",
              buttonVariants({
                variant: "link",
              }),
            )}
            aria-label={`Download ${newsletter.title} PDF`}
          >
            <Download className="w-4 h-4 text-primary" aria-hidden="true" />
            Download
          </a>
        </div>
      </div>
    </div>
  );
}

export default function NewsletterPage() {
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [selectedYear, setSelectedYear] = useState<number | null>(null);
  const [viewingNewsletter, setViewingNewsletter] = useState<
    (typeof NEWSLETTERS)[0] | null
  >(null);

  const years = [...new Set(NEWSLETTERS.map((n) => n.year))].sort(
    (a, b) => b - a,
  );
  const filtered = selectedYear
    ? NEWSLETTERS.filter((n) => n.year === selectedYear)
    : NEWSLETTERS;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (email) setSubmitted(true);
  };

  return (
    <>
      {/* Inline PDF viewer — full-screen overlay */}
      {/* {viewingNewsletter && (
        <Suspense fallback={null}>
          <PdfViewer
            url={viewingNewsletter.pdfUrl}
            title={viewingNewsletter.title}
            onClose={() => setViewingNewsletter(null)}
          />
        </Suspense>
      )} */}

      <section
        className="relative min-h-[360px] flex items-center"
        aria-label="Newsletter page header"
      >
        <Image
          src="/images/newsletter.jpg"
          alt="Seniors reading a community newsletter"
          fill
          className="object-cover"
          priority
        />
        <div className="absolute inset-0 bg-(--brand-deep)/70" />
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <span className="inline-block bg-accent text-accent-foreground font-sans text-sm font-semibold px-4 py-1.5 rounded-full mb-4">
            Monthly Publication
          </span>
          <h1 className="font-serif text-4xl sm:text-5xl font-bold text-white leading-tight text-balance max-w-2xl">
            The Maricopa Senior Living Newsletter
          </h1>
          <p className="font-sans text-white/80 text-lg mt-4 max-w-xl text-pretty leading-relaxed">
            Our free monthly newsletter keeps you connected to the Maricopa
            senior community — local news, health tips, event announcements, and
            resource spotlights.
          </p>
        </div>
      </section>

      {/* Donate banner */}
      <div className="bg-accent text-accent-foreground py-4 px-4">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <Heart className="w-5 h-5 shrink-0" aria-hidden="true" />
            <p className="font-sans text-sm font-semibold text-center sm:text-left">
              Help us keep this newsletter free — your donation makes a
              difference.
            </p>
          </div>
          <a
            href={DONATE_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="shrink-0 inline-flex items-center gap-2 bg-accent-foreground text-accent font-sans font-bold px-5 py-2.5 rounded-md hover:opacity-90 transition-opacity text-sm whitespace-nowrap"
            aria-label="Donate to Maricopa Senior Living via PayPal"
          >
            <Heart className="w-4 h-4" aria-hidden="true" />
            Donate Now
          </a>
        </div>
      </div>

      {/* Two-column: archive + subscribe */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
          {/* Archive */}
          <div className="lg:col-span-2">
            <div className="flex items-center justify-between mb-6 flex-wrap gap-4">
              <div>
                <h2 className="font-serif text-2xl font-bold text-foreground">
                  Past Issues
                </h2>
                <p className="font-sans text-muted-foreground text-sm mt-1">
                  View or download any of our past newsletters.
                </p>
              </div>

              {/* Year filter */}
              <div className="flex items-center gap-2">
                <Calendar
                  className="w-4 h-4 text-muted-foreground"
                  aria-hidden="true"
                />
                <div
                  className="flex gap-1.5 flex-wrap"
                  role="group"
                  aria-label="Filter by year"
                >
                  <Button
                    onClick={() => setSelectedYear(null)}
                    className={`px-3 py-1.5 rounded-full font-sans text-sm font-semibold border transition-colors ${
                      !selectedYear
                        ? "bg-primary text-primary-foreground border-primary"
                        : "bg-card border-border text-foreground hover:border-primary/30"
                    }`}
                    aria-pressed={!selectedYear}
                  >
                    All
                  </Button>
                  {years.map((year) => (
                    <Button
                      key={year}
                      onClick={() =>
                        setSelectedYear(selectedYear === year ? null : year)
                      }
                      className={`px-3 py-1.5 rounded-full font-sans text-sm font-semibold border transition-colors ${
                        selectedYear === year
                          ? "bg-primary text-primary-foreground border-primary"
                          : "bg-card border-border text-foreground hover:border-primary/30"
                      }`}
                      aria-pressed={selectedYear === year}
                    >
                      {year}
                    </Button>
                  ))}
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              {filtered.map((newsletter) => (
                <NewsletterCard
                  key={newsletter.id}
                  newsletter={newsletter}
                  onView={setViewingNewsletter}
                />
              ))}
            </div>
          </div>

          {/* Subscribe sidebar */}
          <aside id="subscribe" aria-label="Subscribe to newsletter">
            <div className="bg-(--brand-deep) rounded-xl p-7 sticky top-28">
              <div className="w-12 h-12 bg-accent/20 rounded-full flex items-center justify-center mb-5">
                <Mail className="w-6 h-6 text-accent" aria-hidden="true" />
              </div>
              <h2 className="font-serif text-2xl font-bold text-(--brand-cream) leading-snug">
                Subscribe for Free
              </h2>
              <p className="font-sans text-(--brand-cream)/70 text-sm mt-2 leading-relaxed">
                Get each new issue delivered to your inbox the first week of
                every month. No spam — unsubscribe anytime.
              </p>

              {submitted ? (
                <div className="mt-7 p-5 bg-accent/20 rounded-lg flex items-start gap-3">
                  <CheckCircle
                    className="w-6 h-6 text-accent shrink-0 mt-0.5"
                    aria-hidden="true"
                  />
                  <div>
                    <p className="font-sans font-bold text-(--brand-cream) text-base">
                      You&rsquo;re subscribed!
                    </p>
                    <p className="font-sans text-(--brand-cream)/70 text-sm mt-1">
                      Thank you, {name || "friend"}! You&rsquo;ll receive our
                      next newsletter at {email}.
                    </p>
                  </div>
                </div>
              ) : (
                <form
                  onSubmit={handleSubmit}
                  className="mt-7 space-y-4"
                  noValidate
                >
                  <div>
                    <label
                      htmlFor="sub-name"
                      className="block font-sans text-sm font-semibold text-(--brand-cream)/80 mb-1.5"
                    >
                      Your Name
                    </label>
                    <input
                      id="sub-name"
                      type="text"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="First and last name"
                      className="w-full rounded-md border border-(--brand-cream)/20 bg-white/10 text-(--brand-cream) placeholder:text-(--brand-cream)/40 px-4 py-3 font-sans text-base focus:outline-none focus:ring-2 focus:ring-accent"
                      autoComplete="name"
                    />
                  </div>
                  <div>
                    <label
                      htmlFor="sub-email"
                      className="block font-sans text-sm font-semibold text-(--brand-cream)/80 mb-1.5"
                    >
                      Email Address <span className="text-accent">*</span>
                    </label>
                    <input
                      id="sub-email"
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="your@email.com"
                      required
                      className="w-full rounded-md border border-(--brand-cream)/20 bg-white/10 text-(--brand-cream) placeholder:text-(--brand-cream)/40 px-4 py-3 font-sans text-base focus:outline-none focus:ring-2 focus:ring-accent"
                      autoComplete="email"
                      aria-required="true"
                    />
                  </div>
                  <button
                    type="submit"
                    className="w-full inline-flex items-center justify-center gap-2 bg-accent text-accent-foreground font-sans font-bold px-6 py-3.5 rounded-md hover:opacity-90 transition-opacity text-base"
                  >
                    Subscribe Now
                    <ArrowRight className="w-4 h-4" aria-hidden="true" />
                  </button>
                  <p className="font-sans text-xs text-(--brand-cream)/50 text-center">
                    Your information is kept private and never shared.
                  </p>
                </form>
              )}

              {/* Benefits */}
              <ul className="mt-6 space-y-2.5">
                {[
                  "Free — always",
                  "Local Maricopa news",
                  "Health & wellness tips",
                  "Event announcements",
                  "Resource spotlights",
                ].map((item) => (
                  <li
                    key={item}
                    className="flex items-center gap-2 font-sans text-sm text-(--brand-cream)/70"
                  >
                    <CheckCircle
                      className="w-4 h-4 text-accent shrink-0"
                      aria-hidden="true"
                    />
                    {item}
                  </li>
                ))}
              </ul>

              {/* Donate CTA in sidebar */}
              <div className="mt-7 pt-6 border-t border-(--brand-cream)/1">
                <a
                  href={DONATE_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full inline-flex items-center justify-center gap-2 border border-accent text-accent font-sans font-bold px-5 py-3 rounded-md hover:bg-accent/10 transition-colors text-sm"
                  aria-label="Donate to Maricopa Senior Living"
                >
                  <Heart className="w-4 h-4" aria-hidden="true" />
                  Support Us — Donate
                </a>
              </div>
            </div>
          </aside>
        </div>
      </section>
    </>
  );
}
