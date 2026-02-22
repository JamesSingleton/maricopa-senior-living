import Link from 'next/link'
import { Calendar, User, Clock } from 'lucide-react'

import ImageComponent from './ImageComponent'
import Date from './Date'
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'

import type { Post } from '@/types/Post'

// Estimate reading time based on excerpt length (rough approximation)
function estimateReadingTime(text: string): number {
  const wordsPerMinute = 200
  const words = text.split(/\s+/).length
  return Math.max(1, Math.ceil(words / wordsPerMinute))
}

export default function ArticleCard({ post }: { post: Post }) {
  const readingTime = estimateReadingTime(post.excerpt || '')

  return (
    <Card className="flex flex-col h-full hover:shadow-lg transition-shadow">
      <CardHeader className="space-y-4 pb-4">
        {/* Category Badges */}
        {post.categories && post.categories.length > 0 && (
          <div className="flex flex-wrap gap-2">
            {post.categories.map((category: any) => (
              <Badge key={category.title} variant="default" className="text-base px-3 py-1">
                {category.title}
              </Badge>
            ))}
          </div>
        )}

        {/* Article Title */}
        <Link href={`/articles/${post.slug}`} prefetch={false} className="group">
          <h2 className="text-4xl font-bold leading-tight text-foreground group-hover:text-primary transition-colors">
            {post.title}
          </h2>
        </Link>
      </CardHeader>

      <CardContent className="flex-1 space-y-4 pb-4">
        {/* Excerpt */}
        <p className="text-lg leading-relaxed text-muted-foreground line-clamp-3">
          {post.excerpt}
        </p>

        {/* Author Info */}
        <div className="flex items-center gap-3 pt-2">
          <div className="shrink-0">
            <ImageComponent
              className="h-16 w-16 rounded-full object-cover ring-2 ring-border"
              image={post.author.image}
              alt={post.author.name}
              width={64}
              height={64}
            />
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 text-base font-semibold text-foreground">
              <User className="h-4 w-4 shrink-0" aria-hidden="true" />
              <span>{post.author.name}</span>
            </div>
            <div className="flex flex-wrap items-center gap-3 text-base text-muted-foreground">
              <div className="flex items-center gap-1">
                <Calendar className="h-4 w-4 shrink-0" aria-hidden="true" />
                <Date dateString={post.publishedAt} />
              </div>
              <div className="flex items-center gap-1">
                <Clock className="h-4 w-4 shrink-0" aria-hidden="true" />
                <span>{readingTime} min read</span>
              </div>
            </div>
          </div>
        </div>
      </CardContent>

      <CardFooter className="pt-4">
        <Link href={`/articles/${post.slug}`} prefetch={false} className="w-full">
          <Button size="lg" variant="outline" className="w-full text-lg">
            Read Article
          </Button>
        </Link>
      </CardFooter>
    </Card>
  )
}
