import { env } from "@maricopa-senior-living/env/client";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@maricopa-senior-living/ui/components/card";
import { cn } from "@maricopa-senior-living/ui/lib/utils";
import { getFileAsset } from "@sanity/asset-utils";
import { ExternalLinkIcon, PaperclipIcon } from "lucide-react";
import Link from "next/link";
import type { ReactNode } from "react";

import BusinessHours from "./BusinessHours";
import { CustomPortableText } from "./CustomPortableText";

const interactiveLinkClassName =
  "text-primary underline-offset-4 hover:underline focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring";

function ExternalLink({
  href,
  ariaLabel,
  children,
  className,
}: {
  href: string;
  ariaLabel: string;
  children: ReactNode;
  className?: string;
}) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noreferrer noopener"
      aria-label={ariaLabel}
      className={cn(
        "inline-flex items-center gap-1",
        interactiveLinkClassName,
        className,
      )}
    >
      {children}
      <ExternalLinkIcon className="size-4 shrink-0" aria-hidden="true" />
    </a>
  );
}

const DirectoryCard = ({ directoryItem }: { directoryItem: any }) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>
          <h2 className="font-heading text-2xl font-semibold leading-snug">
            {directoryItem.title}
          </h2>
        </CardTitle>
        {directoryItem.description && (
          <CardDescription className="prose max-w-2xl text-base leading-6">
            <CustomPortableText
              paragraphClasses="text-muted-foreground"
              value={directoryItem.description}
            />
          </CardDescription>
        )}
      </CardHeader>
      <CardContent className="border-t pt-0">
        <dl className="divide-y divide-border">
          {directoryItem.audience && (
            <div className="py-6 sm:grid sm:grid-cols-3 sm:gap-4">
              <dt className="text-sm font-medium">Audience/Eligibility</dt>
              <dd className="prose mt-1 text-sm leading-6 sm:col-span-2 sm:mt-0">
                <CustomPortableText value={directoryItem.audience} />
              </dd>
            </div>
          )}
          {directoryItem.website && (
            <div className="py-6 sm:grid sm:grid-cols-3 sm:gap-4">
              <dt className="text-sm font-medium">Website</dt>
              <dd className="mt-1 text-sm leading-6 sm:col-span-2 sm:mt-0">
                <ExternalLink
                  href={directoryItem.website}
                  ariaLabel={`${directoryItem.title} website (opens in a new tab)`}
                  className="max-w-lg items-start gap-1.5 wrap-break-word"
                >
                  <span>{directoryItem.website}</span>
                </ExternalLink>
              </dd>
            </div>
          )}
          {directoryItem.phone && (
            <div className="py-6 sm:grid sm:grid-cols-3 sm:gap-4">
              <dt className="text-sm font-medium">Phone</dt>
              <dd className="mt-1 text-sm leading-6 sm:col-span-2 sm:mt-0">
                <a
                  href={`tel:${directoryItem.phone}`}
                  aria-label={`Call ${directoryItem.phone}`}
                  className={interactiveLinkClassName}
                >
                  {directoryItem.phone}
                </a>
              </dd>
            </div>
          )}
          {directoryItem.address && (
            <div className="py-6 sm:grid sm:grid-cols-3 sm:gap-4">
              <dt className="text-sm font-medium">Location</dt>
              <dd className="mt-1 text-sm leading-6 text-muted-foreground sm:col-span-2 sm:mt-0">
                <address className="not-italic">
                  {directoryItem.address}
                </address>
              </dd>
            </div>
          )}
          {directoryItem.businessHours && (
            <div className="py-6 sm:grid sm:grid-cols-3 sm:gap-4">
              <dt className="text-sm font-medium">Hours</dt>
              <dd className="mt-1 text-sm leading-6 text-muted-foreground sm:col-span-2 sm:mt-0">
                <BusinessHours hours={directoryItem.businessHours} />
              </dd>
            </div>
          )}
          {directoryItem.notes && (
            <div className="py-6 sm:grid sm:grid-cols-3 sm:gap-4">
              <dt className="text-sm font-medium">Notes</dt>
              <dd className="prose mt-1 text-sm leading-6 sm:col-span-2 sm:mt-0">
                <CustomPortableText value={directoryItem.notes} />
              </dd>
            </div>
          )}
          {directoryItem.attachments && (
            <div className="py-6 sm:grid sm:grid-cols-3 sm:gap-4">
              <dt className="text-sm font-medium leading-6">Attachments</dt>
              <dd className="mt-2 text-sm sm:col-span-2 sm:mt-0">
                <ul
                  aria-label={`${directoryItem.title} attachments`}
                  className="divide-y divide-border rounded-md border border-border"
                >
                  {directoryItem.attachments.map((attachment: any) => {
                    const attachmentAsset = getFileAsset(attachment, {
                      dataset: env.NEXT_PUBLIC_SANITY_DATASET,
                      projectId: env.NEXT_PUBLIC_SANITY_PROJECT_ID,
                    });
                    const fileType = attachmentAsset.extension.toUpperCase();

                    return (
                      <li
                        key={attachment._key}
                        className="flex items-center justify-between gap-4 py-4 pl-4 pr-5 text-sm leading-6"
                      >
                        <div className="flex min-w-0 flex-1 items-center">
                          <PaperclipIcon
                            className="size-5 shrink-0 text-muted-foreground"
                            aria-hidden="true"
                          />
                          <div className="ml-4 flex min-w-0 flex-1 gap-2">
                            <span className="truncate font-medium">
                              {attachment.name}
                            </span>
                            <span className="shrink-0 text-muted-foreground">
                              <span className="sr-only">File type: </span>
                              {fileType}
                            </span>
                          </div>
                        </div>
                        <ExternalLink
                          href={attachmentAsset.url}
                          ariaLabel={`Download ${attachment.name} (${fileType}, opens in a new tab)`}
                          className="shrink-0 font-medium"
                        >
                          Download
                        </ExternalLink>
                      </li>
                    );
                  })}
                </ul>
              </dd>
            </div>
          )}
          {directoryItem.tags && (
            <div className="py-6 sm:grid sm:grid-cols-3 sm:gap-4">
              <dt className="text-sm font-medium leading-6">Tags</dt>
              <dd className="mt-2 text-sm sm:col-span-2 sm:mt-0">
                <ul
                  aria-label={`Tags for ${directoryItem.title}`}
                  className="flex flex-wrap gap-2"
                >
                  {directoryItem.tags.map((tag: any) => (
                    <li key={`${tag._id}_${directoryItem.title}`}>
                      <Link
                        className={cn(
                          "inline-flex min-h-6 min-w-6 items-center rounded-sm bg-muted px-3 py-1 text-base transition-all duration-150 hover:bg-red-400 hover:text-white",
                          interactiveLinkClassName,
                        )}
                        href={`/tag/${tag.slug}`}
                        prefetch={false}
                      >
                        {tag.title}
                      </Link>
                    </li>
                  ))}
                </ul>
              </dd>
            </div>
          )}
        </dl>
      </CardContent>
    </Card>
  );
};

export default DirectoryCard;
