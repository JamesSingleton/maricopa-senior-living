'use client'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Mail } from 'lucide-react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'

const categories = [
  { name: 'Abuse/Personal Safety', count: 14 },
  { name: 'Advanced Care Planning', count: 17 },
  { name: 'Aging in Place', count: 28 },
  { name: 'Arizona Department of Health Services (ADHS) - Seniors', count: 4 },
  { name: 'Arizona Travel', count: 32 },
  { name: 'Arts and Culture in Maricopa', count: 34 },
  { name: 'Assistance for Economically Disadvantaged, Elderly and/or Homebound', count: 28 },
  { name: 'Caregivers', count: 16 },
  { name: 'Dementia', count: 23 },
  { name: 'Emergency Preparedness', count: 19 },
  { name: 'End of Life', count: 33 },
  { name: 'Estate Planning', count: 20 },
  { name: 'Extreme Weather', count: 34 },
  { name: 'Fall Prevention', count: 20 },
  { name: 'Finances, financial services and planning', count: 24 },
  { name: 'Frauds and Scams', count: 19 },
  { name: 'Grief/Loss', count: 6 },
  { name: 'Health Insights from the Mayo Clinic', count: 18 },
  { name: 'Health and Wellness', count: 51 },
  { name: 'Healthcare Planning', count: 10 },
  { name: 'Home Care Services', count: 20 },
  { name: 'Hospice / Palliative Care', count: 9 },
  { name: 'Isolation/Loneliness', count: 10 },
  { name: 'Social Security', count: 25 },
]

const tags = [
  '2-1-1',
  'AARP',
  'ACP',
  'ADHS',
  'AHCCCS',
  'AI',
  'ALTCS',
  'Advanced Directives',
  'Aging in Place',
  "Alzheimer's Disease",
  'Arts',
  'Assisted Living',
  'Best Dogs for Seniors',
  'Burial',
  'COVID',
  'CPR',
  'Community Alerts',
  'Cooling Stations',
  'Culture',
  'DES',
  'Diabetes',
  'Dog Park',
  'Domestic Violence',
  'End-of-Life Services',
  "Farmers' Markets",
  'Feral Cats',
  'Food Assistance',
  'HLAA',
  'HUD',
  'Healthcare Provider',
  'Hearing',
  'Heart',
  'Home Checklist',
  'Home Key Box (lock box) program',
  'Housing',
  'Identity Theft',
  'Joan Koczor',
  'Legal Document Preparer',
  'Legal Help',
  'Lifelong Learning',
  'Long-Term Care',
  'MAC',
  'MET',
  'Mayo Clinic',
  'Medicaid',
  'Medical Equipment & Supplies',
  'Medicare',
  'Medicine Disposal',
  'Mesothelioma',
  'NIH',
  'Neighbors Who Care',
  'Non-Emer Med Transport (NEMT)',
  'Only in Arizona',
  'Organ Donation',
  'Pets',
  'Preparedness',
  'Retirement',
  'Ron Smith',
  'SR 347 Projects',
  'Safety',
  'Sandbags',
  'Suicide',
  'Tax Preparation',
  'Technology',
  'Veterinarian',
  'Volunteer',
  'Women',
]

const featuredArticles = [
  {
    title: "Joan's Corner - January 2025 Newsletter",
    author: 'Joan Koczor',
    excerpt:
      'Good morning and Happy New Year Everyone! The January 2025... keeping you informed newsletter is included in this email. Also included are articles about the be...',
  },
  {
    title: 'January/February 2025 Senior Programming',
    excerpt:
      "Once on the ActiveNet site, in the Burgundy bar at the top click on 'Activities' and search for 'Active Adults 55+'...",
  },
  {
    title: "Check out what's new...",
    author: 'Ron Smith',
    excerpt:
      "Recently posted: Joan Koczor's January Newsletter '... keeping you informed' has been posted to Joan's Corner for your reading enjoyment. Included with the Jan...",
  },
]

export default function Sidebar({ className }: { className?: string }) {
  const pathname = usePathname()

  return (
    <aside className={className}>
      <div className="space-y-8">
        <div>
          <h2 className="mb-2 text-xl font-semibold">Search Resources</h2>
          <div className="relative">
            <Input
              type="search"
              placeholder="Search..."
              className="w-full py-2 pl-4 pr-4 text-lg"
            />
          </div>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Categories</CardTitle>
            <CardDescription>
              Scroll through the categories below to find the information you need.
            </CardDescription>
          </CardHeader>
          <CardContent className="p-0">
            <ScrollArea className="h-[400px] pr-4">
              {categories.map((category, index) => {
                const categorySlug = category.name.toLowerCase().replace(/\s+/g, '-')
                const isActive = pathname === `/category/${categorySlug}`
                return (
                  <Link
                    key={index}
                    href={`/category/${categorySlug}`}
                    className={`block border-b px-4 py-3 text-lg last:border-b-0 hover:bg-accent ${isActive ? 'bg-accent font-semibold' : ''}`}
                  >
                    {category.name}{' '}
                    <span className="text-muted-foreground">({category.count})</span>
                  </Link>
                )
              })}
            </ScrollArea>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Tags</CardTitle>
            <CardDescription>
              Scroll through the tags below to find the information you need.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ScrollArea className="h-[300px] pr-4">
              <div className="flex flex-wrap gap-2">
                {tags.map((tag, index) => (
                  <Link
                    key={index}
                    href={`/tag/${tag.toLowerCase().replace(/\s+/g, '-')}`}
                    className="inline-flex items-center rounded-full bg-secondary px-3 py-2 text-base font-medium transition-colors hover:bg-secondary/80"
                  >
                    {tag}
                  </Link>
                ))}
              </div>
            </ScrollArea>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Featured Articles</CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            {featuredArticles.map((article, index) => (
              <Link
                key={index}
                href={`/article/${article.title.toLowerCase().replace(/\s+/g, '-')}`}
                className="block border-b p-4 last:border-0 hover:bg-accent"
              >
                <h3 className="mb-1 text-lg font-medium">{article.title}</h3>
                {article.author && (
                  <p className="mb-2 text-base text-muted-foreground">By {article.author}</p>
                )}
                <p className="line-clamp-2 text-base">{article.excerpt}</p>
              </Link>
            ))}
          </CardContent>
        </Card>

        <div className="text-center">
          <Button className="w-full text-lg" size="lg">
            <Mail className="mr-2 h-5 w-5" /> Email Us
          </Button>
        </div>
      </div>
    </aside>
  )
}
