import Link from "next/link";

export interface CmsLinkData {
  label?: string | null;
  href?: string | null;
  openInNewTab?: boolean | null;
}

export function CmsLink({
  link,
  children,
  className,
}: {
  link?: CmsLinkData | null;
  children?: React.ReactNode;
  className?: string;
}) {
  if (!link?.href) return null;
  const content = children ?? link.label;
  const isRelative = link.href.startsWith("/");

  if (link.openInNewTab && !isRelative) {
    return (
      <a
        href={link.href}
        target="_blank"
        rel="noopener noreferrer"
        className={className}
      >
        {content}
      </a>
    );
  }

  if (isRelative) {
    return (
      <Link href={link.href} className={className} prefetch={false}>
        {content}
      </Link>
    );
  }

  return (
    <a href={link.href} className={className}>
      {content}
    </a>
  );
}
