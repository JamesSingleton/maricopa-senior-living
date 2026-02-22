import Link from 'next/link'
import { Phone, Globe, MapPin, Clock, FileText, Tag } from 'lucide-react'
import { getFileAsset } from '@sanity/asset-utils'

import { dataset, projectId } from '@/lib/sanity.api'
import BusinessHours from './BusinessHours'
import { CustomPortableText } from './CustomPortableText'
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion'

function convertBytes(bytes: number): string {
  const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB']
  if (bytes === 0) {
    return '0 Bytes'
  }
  const i = Math.floor(Math.log(bytes) / Math.log(1024))
  return parseFloat((bytes / Math.pow(1024, i)).toFixed(2)) + ' ' + sizes[i]
}

const DirectoryCard = ({ directoryItem }: { directoryItem: any }) => {
  return (
    <Card className="w-full">
      <CardHeader className="space-y-4">
        <div className="flex items-start justify-between gap-4">
          <CardTitle className="text-3xl font-bold leading-tight">
            {directoryItem.title}
          </CardTitle>
          {directoryItem.tags && directoryItem.tags.length > 0 && (
            <Badge variant="secondary" className="shrink-0">
              <Tag className="mr-1 h-4 w-4" aria-hidden="true" />
              {directoryItem.tags[0].title}
            </Badge>
          )}
        </div>
        
        {directoryItem.description && (
          <div className="text-lg leading-relaxed text-muted-foreground">
            <CustomPortableText
              paragraphClasses="text-lg leading-relaxed"
              value={directoryItem.description}
            />
          </div>
        )}
      </CardHeader>

      <CardContent className="space-y-6">
        {/* Key Contact Information - Always Visible */}
        <div className="space-y-4">
          {directoryItem.phone && (
            <div className="flex items-center gap-3">
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-lg bg-primary/10">
                <Phone className="h-6 w-6 text-primary" aria-hidden="true" />
              </div>
              <div className="flex-1">
                <div className="text-sm font-semibold text-muted-foreground">Phone</div>
                <a
                  href={`tel:${directoryItem.phone}`}
                  className="text-xl font-semibold text-foreground hover:text-primary transition-colors focus-visible:outline-none focus-visible:ring-3 focus-visible:ring-ring rounded"
                >
                  {directoryItem.phone}
                </a>
              </div>
            </div>
          )}

          {directoryItem.website && (
            <div className="flex items-center gap-3">
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-lg bg-primary/10">
                <Globe className="h-6 w-6 text-primary" aria-hidden="true" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="text-sm font-semibold text-muted-foreground">Website</div>
                <a
                  href={directoryItem.website}
                  target="_blank"
                  rel="noreferrer noopener"
                  className="text-xl font-semibold text-foreground hover:text-primary transition-colors truncate block focus-visible:outline-none focus-visible:ring-3 focus-visible:ring-ring rounded"
                >
                  Visit Website
                  <span className="sr-only"> (opens in new tab)</span>
                </a>
              </div>
            </div>
          )}

          {directoryItem.address && (
            <div className="flex items-center gap-3">
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-lg bg-primary/10">
                <MapPin className="h-6 w-6 text-primary" aria-hidden="true" />
              </div>
              <div className="flex-1">
                <div className="text-sm font-semibold text-muted-foreground">Location</div>
                <div className="text-xl font-semibold text-foreground">
                  {directoryItem.address}
                </div>
              </div>
            </div>
          )}

          {directoryItem.businessHours && (
            <div className="flex items-start gap-3">
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-lg bg-primary/10">
                <Clock className="h-6 w-6 text-primary" aria-hidden="true" />
              </div>
              <div className="flex-1">
                <div className="text-sm font-semibold text-muted-foreground">Hours</div>
                <div className="text-lg">
                  <BusinessHours hours={directoryItem.businessHours} />
                </div>
              </div>
            </div>
          )}
        </div>

        <Separator />

        {/* Collapsible Additional Details */}
        <Accordion type="multiple" className="w-full">
          {directoryItem.audience && (
            <AccordionItem value="audience">
              <AccordionTrigger className="text-xl">
                Audience & Eligibility
              </AccordionTrigger>
              <AccordionContent>
                <div className="prose prose-senior max-w-none text-lg">
                  <CustomPortableText value={directoryItem.audience} />
                </div>
              </AccordionContent>
            </AccordionItem>
          )}

          {directoryItem.notes && (
            <AccordionItem value="notes">
              <AccordionTrigger className="text-xl">
                Additional Information
              </AccordionTrigger>
              <AccordionContent>
                <div className="prose prose-senior max-w-none text-lg">
                  <CustomPortableText value={directoryItem.notes} />
                </div>
              </AccordionContent>
            </AccordionItem>
          )}

          {directoryItem.attachments && directoryItem.attachments.length > 0 && (
            <AccordionItem value="attachments">
              <AccordionTrigger className="text-xl">
                <span className="flex items-center gap-2">
                  <FileText className="h-5 w-5" aria-hidden="true" />
                  Attachments ({directoryItem.attachments.length})
                </span>
              </AccordionTrigger>
              <AccordionContent>
                <ul className="space-y-3">
                  {directoryItem.attachments.map((attachment: any) => {
                    const attachmentAsset = getFileAsset(attachment, { dataset, projectId })
                    return (
                      <li
                        key={attachment._key}
                        className="flex items-center justify-between rounded-lg border-2 border-border p-4"
                      >
                        <div className="flex items-center gap-3 flex-1 min-w-0">
                          <FileText className="h-6 w-6 shrink-0 text-muted-foreground" aria-hidden="true" />
                          <div className="min-w-0 flex-1">
                            <div className="truncate text-lg font-semibold">
                              {attachment.name}
                            </div>
                            <div className="text-base text-muted-foreground">
                              {attachmentAsset.extension.toUpperCase()}
                            </div>
                          </div>
                        </div>
                        <Button asChild variant="outline" size="default" className="ml-4 shrink-0">
                          <a
                            href={attachmentAsset.url}
                            target="_blank"
                            rel="noreferrer noopener"
                          >
                            Download
                          </a>
                        </Button>
                      </li>
                    )
                  })}
                </ul>
              </AccordionContent>
            </AccordionItem>
          )}
        </Accordion>

        {/* Tags */}
        {directoryItem.tags && directoryItem.tags.length > 1 && (
          <div>
            <div className="mb-3 text-sm font-semibold text-muted-foreground">Related Topics</div>
            <div className="flex flex-wrap gap-2">
              {directoryItem.tags.map((tag: any, index: number) => (
                <Link
                  key={`${tag._id}_${directoryItem.title}_${index}`}
                  href={`/tag/${tag.slug}`}
                  prefetch={false}
                >
                  <Badge variant="outline" className="cursor-pointer hover:bg-accent text-base px-3 py-1">
                    {tag.title}
                  </Badge>
                </Link>
              ))}
            </div>
          </div>
        )}
      </CardContent>

      <CardFooter className="flex flex-wrap gap-3">
        {directoryItem.phone && (
          <Button asChild size="lg" variant="default">
            <a href={`tel:${directoryItem.phone}`}>
              <Phone className="mr-2 h-5 w-5" aria-hidden="true" />
              Call Now
            </a>
          </Button>
        )}
        {directoryItem.website && (
          <Button asChild size="lg" variant="secondary">
            <a href={directoryItem.website} target="_blank" rel="noreferrer noopener">
              <Globe className="mr-2 h-5 w-5" aria-hidden="true" />
              Visit Website
              <span className="sr-only"> (opens in new tab)</span>
            </a>
          </Button>
        )}
        {directoryItem.address && (
          <Button asChild size="lg" variant="outline">
            <a
              href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(directoryItem.address)}`}
              target="_blank"
              rel="noreferrer noopener"
            >
              <MapPin className="mr-2 h-5 w-5" aria-hidden="true" />
              Get Directions
              <span className="sr-only"> (opens in new tab)</span>
            </a>
          </Button>
        )}
      </CardFooter>
    </Card>
  )
}

export default DirectoryCard
