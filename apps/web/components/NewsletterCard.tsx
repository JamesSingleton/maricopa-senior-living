import Link from 'next/link'
import { Calendar, Mail, FileText } from 'lucide-react'

import ImageComponent from './ImageComponent'
import Date from './Date'
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'

interface NewsletterCardProps {
  newsletter: {
    _id: string
    title: string
    slug: string
    excerpt: string
    publishedAt: string
    mainImage?: any
    author?: {
      name: string
      image: any
    }
    featured?: boolean
  }
}

export default function NewsletterCard({ newsletter }: NewsletterCardProps) {
  return (
    <Card className="flex flex-col h-full hover:shadow-lg transition-shadow border-l-4 border-l-accent">
      <CardHeader className="space-y-4 pb-4">
        {/* Featured Badge */}
        {newsletter.featured && (
          <Badge variant="default" className="text-base px-3 py-1 w-fit bg-accent text-accent-foreground">
            <Mail className="mr-1 h-4 w-4" aria-hidden="true" />
            Featured Newsletter
          </Badge>
        )}

        {/* Newsletter Title */}
        <Link href={`/newsletters/${newsletter.slug}`} prefetch={false} className="group">
          <h2 className="text-4xl font-bold leading-tight text-foreground group-hover:text-primary transition-colors">
            {newsletter.title}
          </h2>
        </Link>
      </CardHeader>

      <CardContent className="flex-1 space-y-4 pb-4">
        {/* Featured Image (if available) */}
        {newsletter.mainImage && (
          <div className="relative aspect-video w-full overflow-hidden rounded-lg">
            <ImageComponent
              className="h-full w-full object-cover"
              image={newsletter.mainImage}
              alt={newsletter.title}
              width={600}
              height={338}
            />
          </div>
        )}

        {/* Excerpt */}
        <p className="text-lg leading-relaxed text-muted-foreground line-clamp-3">
          {newsletter.excerpt}
        </p>

        {/* Publication Date & Author */}
        <div className="flex flex-wrap items-center gap-4 pt-2 text-base text-muted-foreground">
          <div className="flex items-center gap-2">
            <Calendar className="h-5 w-5 shrink-0" aria-hidden="true" />
            <Date dateString={newsletter.publishedAt} />
          </div>
          
          {newsletter.author && (
            <div className="flex items-center gap-2">
              {newsletter.author.image && (
                <ImageComponent
                  className="h-8 w-8 rounded-full object-cover"
                  image={newsletter.author.image}
                  alt={newsletter.author.name}
                  width={32}
                  height={32}
                />
              )}
              <span className="font-semibold">{newsletter.author.name}</span>
            </div>
          )}
        </div>
      </CardContent>

      <CardFooter className="pt-4">
        <Link href={`/newsletters/${newsletter.slug}`} prefetch={false} className="w-full">
          <Button size="lg" variant="default" className="w-full text-lg">
            <FileText className="mr-2 h-5 w-5" aria-hidden="true" />
            Read Newsletter
          </Button>
        </Link>
      </CardFooter>
    </Card>
  )
}
