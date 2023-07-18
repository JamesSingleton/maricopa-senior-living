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
      <figure>
        <Image alt="Maricopa Senior Living" src={ImageSrc} />
        <figcaption className="mt-4 text-left text-sm italic text-zinc-500">
          The wild horses, roaming free on Gila River Indian Community (GRIC) tribal lands, are a
          favorite of Maricopa residents, young and old. They remind us that the spirit of freedom
          is ageless, and that we can each have the lifestyle we aspire to with a little help, good
          information and a plan.
        </figcaption>
      </figure>
      <div className="prose prose-zinc mx-auto pt-8 lg:pt-4">
        <h1>Welcome to Maricopa Senior Living!</h1>
        <p>
          Maricopa Senior Living is first and foremost a directory of resources and information. The
          intent is to provide answers to your questions about your lifestyle, whether it&apos;s the
          one you currently have or the one you want to achieve. The website is designed to be
          user-friendly, easy to navigate and read. And, it&apos;s all in <b>one location!</b> Help
          is a click away!
        </p>
        <p>
          As seniors, our needs, challenges, and experiences change. Challenges come and go. This
          site contains articles and information for you to explore as possible solutions. The
          content will continually grow, providing resources for whatever topic you seek.
        </p>
        <h2>Navigating the website</h2>
        <p>
          Use the <b>header bar</b> (at the top of the page) to quickly access useful sites for
          research on topics that may be of importance to you. These links can help you to stay
          informed and aware of events and local activities.
        </p>
        <h3>The City of Maricopa website links</h3>
        <ul>
          <li>Provide easy access to the City website.</li>
          <li>
            Access to information about <b>What&apos;s New</b> in City Development projects.
          </li>
          <li>
            Dates, times, agendas, supporting documents and locations for City Council meetings,
            citizen-based boards and committees and information on public hearings regarding zoning
            changes.
          </li>
          <li>
            Other links will help to keep you up to date on pending legislation, transportation
            news, events and other current news affecting our city.
          </li>
        </ul>
        <h3>InMaricopa links</h3>
        <ul>
          <li>Access to local news and stories impacting the City.</li>
          <li>
            Access to the <b>New Resident and Visitor Guide</b>.
          </li>
          <li>
            Access to the <b>Senior Section</b> articles.
          </li>
          <li>Traffic information and cameras.</li>
        </ul>
        <h3>Weather links</h3>
        <ul>
          <li>Interesting information about current weather, forecasts and weather safety.</li>
        </ul>
        <h3>Local links</h3>
        <ul>
          <li>
            Agencies and organizations offering programs and services for Maricopa, like the
            Pinal-Gila Council for Senior Citizens, Hospice of the Valley, AARP, the Arizona
            Department of Economic Security, The Community Action Human Resource Agency (CAHRA), and
            more.
          </li>
        </ul>
        <h3>Quick Contacts</h3>
        <ul>
          <li>
            Handy lists of numbers for emergency contacts, local medical resources, abuse and
            personal safety hotlines and houses of worship.
          </li>
        </ul>
        <h3>On the right side of the page</h3>
        <ul>
          <li>
            <b>Search box</b> - allows you to enter your own search information.
          </li>
          <li>
            <b>Categories and Tags</b> that provide quick access to topics of popular interest. For
            fun, check out the Arizona Travel category or the Pets tab.
          </li>
          <li>
            <b>Special Selection Blocks</b>
            <ul>
              <li>
                <b>Joan&apos;s Corner</b> - Joan Koczor&apos;s familiar monthly newsletter (…keeping
                you informed). Joan is a long-time local advocate for seniors and her popular
                newsletter provides very useful and interesting information.
              </li>
              <li>
                <b>City of Maricopa Community/Senior Center Monthly Calendar and Newsletter</b> -
                all the publications regarding senior programming for the current month. The
                calendar and newsletter can be viewed or downloaded.
              </li>
              <li>
                <b>What&apos;s New!</b> - a current article or information being highlighted.
              </li>
            </ul>
          </li>
          <li>
            <b>ADA (Americans with Disabilities Act) Accessibility Tool</b> along the right-hand
            edge of the screen - look for an icon of a small person with outstretched arms. This is
            the icon for an accessibility tool that can allow you to modify the look of the screen
            in front of you for improved accessibility. Just click on the icon to see the available
            menu options.
          </li>
          <li>
            <b>The UP arrow</b> - in the lower right corner takes you to the top of the page.
          </li>
        </ul>
        <p>
          This website should be compatible with multiple platforms including desktops, tablets and
          smart phones.
        </p>
        <p>
          We encourage feedback and suggestions! Feel free to{' '}
          <a
            className="text-indigo-600 hover:text-indigo-700"
            href="mailto:ron@maricopaseniorliving.org"
          >
            email
          </a>{' '}
          any ideas, comments, suggestions or challenges you discover. Feel free to let us know if
          there&apos;s something you&apos;d like to see included. Your feedback is appreciated. We
          thank you for taking the time to check our site out!
        </p>
      </div>
    </div>
  )
}
