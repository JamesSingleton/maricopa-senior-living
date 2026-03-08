import Image from 'next/image'
import Link from 'next/link'
import { ArrowRight, Heart, Users, BookOpen, Calendar } from 'lucide-react'
import { Button } from '@maricopa-senior-living/ui/components/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@maricopa-senior-living/ui/components/card'

import { baseUrl } from '@/lib/constants'
import ImageComponent from '@/components/ImageComponent'

import type { Metadata, ResolvingMetadata } from 'next'
import { CustomPortableText } from '@/components/CustomPortableText'
import { sanityFetch } from '@/lib/sanity/live'

type Props = {
  params: Promise<{ id: string }>
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}

async function fetchHomePageData() {
  return await sanityFetch({
    query: `*[_type == 'home'][0]`,
  })
}

export async function generateMetadata(
  { params, searchParams }: Props,
  parent: ResolvingMetadata,
): Promise<Metadata> {
  const previousOpenGraph = (await parent)?.openGraph
  return {
    title: 'Maricopa Senior Living - Aging Well Your Way!',
    description: 'Your go to source for senior living in Maricopa, AZ',
    openGraph: {
      ...previousOpenGraph,
      title: 'Maricopa Senior Living - Aging Well Your Way!',
      description: 'Your go to source for senior living in Maricopa, AZ',
      locale: 'en_US',
      url: baseUrl,
      siteName: 'Maricopa Senior Living',
      type: 'website',
    },
    alternates: {
      canonical: '/',
    },
  }
}

export default async function Home() {
  const { data: homePageData } = await fetchHomePageData()
  return (
    <div className="flex flex-col">
      {/* Hero Section */}
      <section className="from-primary/5 via-background to-accent/5 relative w-full bg-gradient-to-br">
        <div className="container mx-auto px-4 py-16 md:py-24">
          <div className="grid grid-cols-1 items-center gap-12 lg:grid-cols-2">
            <div className="space-y-6">
              <h1 className="text-foreground text-4xl leading-tight font-bold text-balance md:text-5xl lg:text-6xl">
                {'Supporting Seniors in Maricopa, AZ'}
              </h1>
              <p className="text-muted-foreground text-lg leading-relaxed text-pretty md:text-xl">
                {
                  'Maricopa Senior Living is a 501(c)(3) non-profit organization dedicated to providing resources, support, and community for residents aged 55 and older.'
                }
              </p>
              <div className="flex flex-col gap-4 sm:flex-row">
                <Button asChild size="lg" className="px-8 py-6 text-lg">
                  <Link href="/articles">
                    {'Explore Resources'}
                    <ArrowRight className="ml-2 h-5 w-5" aria-hidden="true" />
                  </Link>
                </Button>
                <Button
                  asChild
                  variant="outline"
                  size="lg"
                  className="bg-transparent px-8 py-6 text-lg"
                >
                  <Link href="/about">{'Learn About Us'}</Link>
                </Button>
              </div>
            </div>
            <div className="relative h-[400px] overflow-hidden rounded-lg shadow-2xl lg:h-[500px]">
              <Image
                src="/images/senior-community.jpg"
                alt="Diverse group of happy seniors engaged in community activities"
                fill
                className="object-cover"
                priority
              />
            </div>
          </div>
        </div>
      </section>

      {/* Mission Statement */}
      <section className="bg-primary text-primary-foreground w-full py-12">
        <div className="container mx-auto px-4 text-center">
          <p className="mx-auto max-w-4xl text-xl leading-relaxed font-medium text-balance md:text-2xl">
            {
              'Our mission is to enhance the quality of life for seniors in Maricopa by providing accessible resources, fostering community connections, and supporting healthy, independent living.'
            }
          </p>
        </div>
      </section>

      {/* Features/Services */}
      <section className="bg-background w-full py-16 md:py-24">
        <div className="container mx-auto px-4">
          <div className="mb-12 text-center">
            <h2 className="text-foreground mb-4 text-3xl font-bold text-balance md:text-4xl">
              {'How We Serve Our Community'}
            </h2>
            <p className="text-muted-foreground mx-auto max-w-2xl text-lg leading-relaxed text-pretty">
              {
                'We offer a wide range of programs and resources designed specifically for seniors in Maricopa, AZ.'
              }
            </p>
          </div>

          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
            <Card className="hover:border-primary border-2 transition-colors">
              <CardHeader>
                <div className="bg-primary/10 mb-4 flex h-12 w-12 items-center justify-center rounded-lg">
                  <Heart className="text-primary h-6 w-6" aria-hidden="true" />
                </div>
                <CardTitle className="text-xl">{'Health & Wellness'}</CardTitle>
                <CardDescription className="text-base leading-relaxed">
                  {'Access resources for maintaining physical and mental health'}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Link
                  href="/category/health-wellness"
                  className="text-primary hover:text-primary/80 inline-flex items-center gap-1 font-medium transition-colors"
                >
                  {'Learn more'}
                  <ArrowRight className="h-4 w-4" aria-hidden="true" />
                </Link>
              </CardContent>
            </Card>

            <Card className="hover:border-primary border-2 transition-colors">
              <CardHeader>
                <div className="bg-accent/10 mb-4 flex h-12 w-12 items-center justify-center rounded-lg">
                  <Calendar className="text-accent h-6 w-6" aria-hidden="true" />
                </div>
                <CardTitle className="text-xl">{'Activities & Events'}</CardTitle>
                <CardDescription className="text-base leading-relaxed">
                  {'Join social activities and community events'}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Link
                  href="/category/activities"
                  className="text-primary hover:text-primary/80 inline-flex items-center gap-1 font-medium transition-colors"
                >
                  {'Learn more'}
                  <ArrowRight className="h-4 w-4" aria-hidden="true" />
                </Link>
              </CardContent>
            </Card>

            <Card className="hover:border-primary border-2 transition-colors">
              <CardHeader>
                <div className="bg-primary/10 mb-4 flex h-12 w-12 items-center justify-center rounded-lg">
                  <BookOpen className="text-primary h-6 w-6" aria-hidden="true" />
                </div>
                <CardTitle className="text-xl">{'Educational Resources'}</CardTitle>
                <CardDescription className="text-base leading-relaxed">
                  {'Browse articles and guides on senior living topics'}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Link
                  href="/articles"
                  className="text-primary hover:text-primary/80 inline-flex items-center gap-1 font-medium transition-colors"
                >
                  {'Learn more'}
                  <ArrowRight className="h-4 w-4" aria-hidden="true" />
                </Link>
              </CardContent>
            </Card>

            <Card className="hover:border-primary border-2 transition-colors">
              <CardHeader>
                <div className="bg-accent/10 mb-4 flex h-12 w-12 items-center justify-center rounded-lg">
                  <Users className="text-accent h-6 w-6" aria-hidden="true" />
                </div>
                <CardTitle className="text-xl">{'Community Support'}</CardTitle>
                <CardDescription className="text-base leading-relaxed">
                  {'Connect with others and find local support services'}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Link
                  href="/category/community-events"
                  className="text-primary hover:text-primary/80 inline-flex items-center gap-1 font-medium transition-colors"
                >
                  {'Learn more'}
                  <ArrowRight className="h-4 w-4" aria-hidden="true" />
                </Link>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Featured Content Section */}
      <section className="bg-muted/30 w-full py-16 md:py-24">
        <div className="container mx-auto px-4">
          <div className="mb-12 text-center">
            <h2 className="text-foreground mb-4 text-3xl font-bold text-balance md:text-4xl">
              {'Featured Resources'}
            </h2>
            <p className="text-muted-foreground mx-auto max-w-2xl text-lg leading-relaxed text-pretty">
              {'Discover our most popular articles and guides for seniors in Maricopa'}
            </p>
          </div>

          <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
            <Card className="overflow-hidden transition-shadow hover:shadow-lg">
              <div className="relative h-48">
                <Image
                  src="/images/health-wellness.jpg"
                  alt="Senior practicing wellness activities"
                  fill
                  className="object-cover"
                />
              </div>
              <CardHeader>
                <CardTitle className="text-xl">{'Staying Active After 55'}</CardTitle>
                <CardDescription className="text-base leading-relaxed">
                  {
                    'Discover the best exercises and activities to maintain your health and mobility'
                  }
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Link
                  href="/articles/staying-active-after-55"
                  className="text-primary hover:text-primary/80 inline-flex items-center gap-1 font-medium transition-colors"
                >
                  {'Read article'}
                  <ArrowRight className="h-4 w-4" aria-hidden="true" />
                </Link>
              </CardContent>
            </Card>

            <Card className="overflow-hidden transition-shadow hover:shadow-lg">
              <div className="relative h-48">
                <Image
                  src="/images/activities.jpg"
                  alt="Seniors engaged in group activities"
                  fill
                  className="object-cover"
                />
              </div>
              <CardHeader>
                <CardTitle className="text-xl">{'Community Activities Guide'}</CardTitle>
                <CardDescription className="text-base leading-relaxed">
                  {'Find local events and activities perfect for making new friends'}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Link
                  href="/articles/community-activities-guide"
                  className="text-primary hover:text-primary/80 inline-flex items-center gap-1 font-medium transition-colors"
                >
                  {'Read article'}
                  <ArrowRight className="h-4 w-4" aria-hidden="true" />
                </Link>
              </CardContent>
            </Card>

            <Card className="overflow-hidden transition-shadow hover:shadow-lg">
              <div className="relative h-48">
                <Image
                  src="/images/community.jpg"
                  alt="Beautiful Maricopa Arizona community"
                  fill
                  className="object-cover"
                />
              </div>
              <CardHeader>
                <CardTitle className="text-xl">{'Living in Maricopa'}</CardTitle>
                <CardDescription className="text-base leading-relaxed">
                  {'Everything you need to know about senior living in Maricopa, AZ'}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Link
                  href="/articles/living-in-maricopa"
                  className="text-primary hover:text-primary/80 inline-flex items-center gap-1 font-medium transition-colors"
                >
                  {'Read article'}
                  <ArrowRight className="h-4 w-4" aria-hidden="true" />
                </Link>
              </CardContent>
            </Card>
          </div>

          <div className="mt-12 text-center">
            <Button
              asChild
              size="lg"
              variant="outline"
              className="bg-transparent px-8 py-6 text-lg"
            >
              <Link href="/articles">
                {'View All Articles'}
                <ArrowRight className="ml-2 h-5 w-5" aria-hidden="true" />
              </Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Community Resources */}
      <section className="bg-muted/30 w-full py-16 md:py-20">
        <div className="container mx-auto px-4">
          <div className="mb-12 text-center">
            <h2 className="text-foreground mb-4 text-3xl font-bold text-balance md:text-4xl">
              {'Local Services & Organizations'}
            </h2>
            <p className="text-muted-foreground mx-auto max-w-3xl text-lg leading-relaxed text-pretty md:text-xl">
              {
                'Explore healthcare providers, senior centers, transportation services, and more resources available in Maricopa'
              }
            </p>
          </div>

          <div className="mb-8 grid gap-6 md:grid-cols-2 lg:grid-cols-4">
            <Link href="/resources?category=Healthcare" className="block">
              <Card className="h-full text-center transition-shadow hover:shadow-lg">
                <CardHeader>
                  <div className="mb-2 text-4xl" aria-hidden="true">
                    🏥
                  </div>
                  <CardTitle className="text-xl">{'Healthcare'}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground text-sm">
                    {'Medical facilities, clinics, and health programs'}
                  </p>
                </CardContent>
              </Card>
            </Link>

            <Link href="/resources?category=Food & Nutrition" className="block">
              <Card className="h-full text-center transition-shadow hover:shadow-lg">
                <CardHeader>
                  <div className="mb-2 text-4xl" aria-hidden="true">
                    🍽️
                  </div>
                  <CardTitle className="text-xl">{'Food & Nutrition'}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground text-sm">
                    {'Meal programs and nutrition services'}
                  </p>
                </CardContent>
              </Card>
            </Link>

            <Link href="/resources?category=Transportation" className="block">
              <Card className="h-full text-center transition-shadow hover:shadow-lg">
                <CardHeader>
                  <div className="mb-2 text-4xl" aria-hidden="true">
                    🚌
                  </div>
                  <CardTitle className="text-xl">{'Transportation'}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground text-sm">
                    {'Public transit and senior transport options'}
                  </p>
                </CardContent>
              </Card>
            </Link>

            <Link href="/resources?category=Legal Services" className="block">
              <Card className="h-full text-center transition-shadow hover:shadow-lg">
                <CardHeader>
                  <div className="mb-2 text-4xl" aria-hidden="true">
                    ⚖️
                  </div>
                  <CardTitle className="text-xl">{'Legal Services'}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground text-sm">
                    {'Legal aid and assistance programs'}
                  </p>
                </CardContent>
              </Card>
            </Link>
          </div>

          <div className="text-center">
            <Button asChild size="lg" className="px-8 py-6 text-lg">
              <Link href="/resources">
                {'Browse All Resources'}
                <ArrowRight className="ml-2 h-5 w-5" aria-hidden="true" />
              </Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="from-primary/10 via-background to-accent/10 w-full bg-gradient-to-br py-16 md:py-24">
        <div className="container mx-auto px-4 text-center">
          <div className="mx-auto max-w-3xl space-y-6">
            <h2 className="text-foreground text-3xl font-bold text-balance md:text-4xl">
              {'Get Involved With Our Community'}
            </h2>
            <p className="text-muted-foreground text-lg leading-relaxed text-pretty md:text-xl">
              {
                "Whether you're looking for resources, want to attend an event, or simply have questions, we're here to help."
              }
            </p>
            <div className="flex flex-col justify-center gap-4 sm:flex-row">
              <Button asChild size="lg" className="px-8 py-6 text-lg">
                <Link href="/contact">
                  {'Contact Us'}
                  <ArrowRight className="ml-2 h-5 w-5" aria-hidden="true" />
                </Link>
              </Button>
              <Button
                asChild
                variant="outline"
                size="lg"
                className="bg-transparent px-8 py-6 text-lg"
              >
                <Link href="/blog">{'Read Our Blog'}</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
