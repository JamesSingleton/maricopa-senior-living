import Link from "next/link";

import { buttonVariants } from "@maricopa-senior-living/ui/components/button";
import { cn } from "@maricopa-senior-living/ui/lib/utils";

export function LinkButton({
  href,
  className,
  variant = "default",
  size = "default",
  children,
  external,
}: {
  href: string;
  className?: string;
  variant?: "default" | "outline" | "secondary" | "ghost" | "destructive" | "link";
  size?: "default" | "xs" | "sm" | "lg" | "icon" | "icon-xs" | "icon-sm" | "icon-lg";
  children: React.ReactNode;
  external?: boolean;
}) {
  const classes = cn(buttonVariants({ variant, size }), className);
  if (external) {
    return (
      <a href={href} className={classes} target="_blank" rel="noopener noreferrer">
        {children}
      </a>
    );
  }
  return (
    <Link href={href} className={classes} prefetch={false}>
      {children}
    </Link>
  );
}
