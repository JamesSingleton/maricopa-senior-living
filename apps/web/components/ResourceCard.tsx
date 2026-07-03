import Link from "next/link";

import { LinkButton } from "@/components/LinkButton";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@maricopa-senior-living/ui/components/card";

export interface ResourceCardData {
  _id: string;
  title?: string | null;
  slug?: string | null;
  description?: string | null;
  contact?: { phone?: string | null } | null;
  category?: { title?: string | null; slug?: string | null } | null;
}

export function ResourceCard({ resource }: { resource: ResourceCardData }) {
  if (!resource.slug) return null;

  return (
    <Card>
      <CardHeader>
        <CardTitle>
          <Link href={`/resources/${resource.slug}`} className="hover:underline">
            {resource.title}
          </Link>
        </CardTitle>
        {resource.category?.title ? (
          <CardDescription>
            <Link
              href={`/category/${resource.category.slug}`}
              className="hover:underline"
            >
              {resource.category.title}
            </Link>
          </CardDescription>
        ) : null}
      </CardHeader>
      <CardContent className="space-y-3">
        {resource.description ? (
          <p className="text-sm text-muted-foreground line-clamp-3">
            {resource.description}
          </p>
        ) : null}
        {resource.contact?.phone ? (
          <LinkButton
            href={`tel:${resource.contact.phone.replace(/\D/g, "")}`}
            size="sm"
            className="bg-accent text-accent-foreground hover:bg-accent/90"
          >
            {resource.contact.phone}
          </LinkButton>
        ) : null}
      </CardContent>
    </Card>
  );
}
