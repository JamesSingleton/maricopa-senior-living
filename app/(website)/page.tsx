import Image from 'next/image'

import { baseUrl } from '@/lib/constants'
import ImageSrc from './website_header.jpg'

import type { Metadata, ResolvingMetadata } from 'next'

type Props = {
  params: { id: string }
  searchParams: { [key: string]: string | string[] | undefined }
}

export async function generateMetadata(
  { params, searchParams }: Props,
  parent: ResolvingMetadata
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
  return (
    <div className="rounded-md bg-white px-8 py-8 shadow-lg lg:px-4 lg:py-4">
      <Image alt="Maricopa Senior Living" src={ImageSrc} />
      <div className="prose prose-zinc mx-auto pt-8 lg:pt-4">
        <h1>Welcome to Maricopa Senior Living!</h1>
        <p>
          The wild horses of Maricopa seem to be a favorite of our seniors. So, it seemed reasonable
          to incorporate them into our logo. They represent a spirit of freedom and lifestyle that
          we all may envy! A freedom that many of us may be aspiring to in the later part of our own
          lives.
        </p>
        <p>
          <span className="text-2xl font-bold">Maricopa Senior Living</span> is primarily a
          directory or content management style website. It hasn&apos;t been designed to be flashy.
          Instead, we hope that you find it easy to navigate and read. Its intent is to provide
          access to some of the best resources available in one location so that you can find
          answers to questions that you might have about senior living. In this latter third of our
          lives, we are exposed to many new opportunities or challenges that we may have little or
          no experience with. There are a number of articles included that will help you explore and
          analyze solutions to these new opportunities and challenges. The content will continue to
          grow!
        </p>
        <p>
          Also included are some links that will help you stay in touch with local news stories,
          weather and what&apos;s happening in the City. Links to the City&apos;s web page will help
          you stay up to date with scheduled meetings of the City Council, Planning &amp; Zoning
          Commission and other City committees. You can check What&apos;s New in City development
          projects and zoning public meeting notices. Information on important transportation
          happenings and pending legislative activities will be easy to follow.
        </p>
        <p>
          <b>Local links</b> will give you access to the Hospice of the Valley and Arizona AARP
          sites. Additional links provide quick access to the Arizona Department of Economic
          Security or the Community Action Human Resource Agency (CAHRA). The <b>National links</b>{' '}
          connect to some of the best resource sites available to seniors in the country to help
          keep you informed. For enjoyment, check out the included information on{' '}
          <b>Arizona Travel</b> or care for your pets. We think that we have a good start!
        </p>
        <h2>Navigating the website</h2>
        <p>
          Use the header bar (the bar at the top of the page) to quickly access popular sites and
          other useful sites for research on topics that may be important to you. For example, you
          can quickly get to <b>InMaricopa</b> Magazine, the City&apos;s{' '}
          <b>What&apos;s New Maricopa</b>, AARP and the National Council on Aging (NCOA). One of the
          best local links might be the Pinal-Gila Council for Senior Citizens (PGCSC) site. The
          PGCSC site includes access to their excellent <b>Resource Guide</b>that you can browse
          online or even download. It is a great place to begin your research on any topic related
          to seniors. For access to important contact information when you are in a hurry click on
          Quick Contact.
        </p>
        <p>
          You can also use the search box to look for a particular term or character string. Use one
          of the popular <b>Category</b> blocks or <b>Tags</b> in the side bar to quickly access the
          information highlighted by those tools.
        </p>
        <p>
          Finally, there are several specialized selection blocks that can take you to the{' '}
          <b>Community/Senior Center</b> Calendar and newsletters for the month, Joan Koczor&apos;s
          excellent monthly newsletter (<b>...keeping you informed</b>) and{' '}
          <b>Ron&apos;s Ramblings</b> to highlight important new information as it occurs.
        </p>
        <p>
          Use the go back to the top arrow in the lower right corner to get you back to the top
          quickly. The more you play with it, the easier it will become. We&apos;ve incorporated
          some ADA (Americans with Disabilities Act) tools to improve accessibility. The website
          should be compatible with multiple platforms including tablets and smart phones. Feel free
          to drop me a{' '}
          <a
            className="text-indigo-500 hover:text-indigo-600"
            href="mailto:ron@maricopaseniorliving.org"
          >
            email
          </a>{' '}
          with suggestions, corrections and new ideas. Your assistance is greatly appreciated in
          trying to get this site launched and, more importantly, useful to the intended users.
        </p>
        <p>
          Enjoy your exploration! There&apos;s a lot of great information currently available for
          your use. And it is going to continue to grow over time!
        </p>
      </div>
    </div>
  )
}
