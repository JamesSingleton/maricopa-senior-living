import Image from 'next/image'

import { baseUrl } from '@/lib/constants'
import ImageSrc from '../website_header.jpg'

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
      <div className="mx-auto max-w-3xl text-base leading-7 text-zinc-700">
        <h1 className="pt-4 text-base font-semibold leading-7 text-indigo-600">
          About Maricopa Senior Living
        </h1>
        <p className="mt-2 text-3xl font-bold tracking-tight text-zinc-900 sm:text-4xl">
          Maricopa Senior Living has been designed for the following reasons
        </p>
        <div className="prose mt-10">
          <ul role="list" className="mt-8 list-disc space-y-8 text-zinc-600">
            <li>
              To allow me to better address the topics that I include in my monthly column in the
              Senior Section of <strong className="font-semibold text-zinc-900">InMaricopa</strong>{' '}
              magazine. Space restrictions sometimes make it difficult to fully develop a topic as
              completely as I would like.
            </li>
            <li>
              I want to be able to develop a comprehensive look at aging well for my readers. There
              is so much great information that I feel needs to be available and explored. Since I
              enjoy the research, I can provide a service to those who would rather get to bed a
              little earlier at night!
            </li>
            <li>
              The reference material that I have discovered is immense and a bit overwhelming
              sometimes. I&apos;m hoping to better organize it and make it more accessible to those
              exploring the nuances of the latter third of their life.
            </li>
            <li>
              City of Maricopa residents have been asking for a comprehensive site for senior
              information for a number of years. I hope that this site helps to accomplish that
              goal.
            </li>
          </ul>
          <h2 className="text-2xl font-bold tracking-tight text-zinc-900">
            How to use the website
          </h2>
          <p>
            Use the header bar (the bar at the top of the page) to quickly access popular sites and
            great sites for research on topics that may be important to you. For example, you can
            quickly get to InMaricopa magazine, What&apos;s New Maricopa, AARP and the National
            Council on Aging (NCOA). The best link might be to the Pinal-Gila Council for Senior
            Citizens (PGCSC). The PGCSC site includes access to their excellent{' '}
            <strong className="font-semibold text-zinc-900">Resource Guide</strong> that you can
            browse online or download. It is a great place to begin your research!
          </p>

          <p>
            You can also use the search box to look for a particular term or character string. Use
            one of the popular <strong className="font-semibold text-zinc-900">Catgegory</strong>{' '}
            blocks or popular <strong className="font-semibold text-zinc-900">Tags</strong> in the
            side bar to quickly access the information highlighted by those tools.
          </p>
          <p>
            Finally, there are a couple specialized selection blocks that either take you to the{' '}
            <strong className="font-semibold text-zinc-900">
              Community/Senior Center Calendar and newsletters for the month
            </strong>{' '}
            or to{' '}
            <strong className="font-semibold text-zinc-900">
              Joan Koczor&apos;s monthly newsletter ( ..keeping you informed)
            </strong>
            .
          </p>
          <p>
            Note the{' '}
            <strong className="font-semibold text-zinc-900">
              &quot;go back to the top button&quot;
            </strong>{' '}
            in the lower right corner to get you back to the top quickly.
          </p>
          <p>
            Enjoy your exploration! There&apos;s a lot of great information currently available for
            your use. And it is going to continue to grow over time!
          </p>
        </div>
      </div>
    </div>
  )
}
