import {
  type DynamicFetchOptions,
  getDynamicFetchOptions,
  sanityFetch,
} from "@maricopa-senior-living/sanity/live";
import {
  highlightedCategories,
  highlightedTags,
  rightSidebarNewsletterQuery,
  rightSidebarNonProfitQuery,
  rightSidebarSeniorCenterQuery,
  rightSidebarWhatsNewQuery,
} from "@maricopa-senior-living/sanity/queries";
import { buttonVariants } from "@maricopa-senior-living/ui/components/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@maricopa-senior-living/ui/components/card";
import { ChevronRightIcon, CircleDollarSignIcon, MailIcon } from "lucide-react";
import Link from "next/link";

import DateComponent from "@/components/Date";
import SearchBar from "@/components/SearchBar";
import { CustomPortableText } from "./CustomPortableText";
import { SanityImage } from "./sanity-image";

export async function DynamicRightSidebar() {
  const { perspective, stega } = await getDynamicFetchOptions();
  return <CachedRightSidebar perspective={perspective} stega={stega} />;
}

/** Composes independently cached sidebar regions to limit invalidation fan-out. */
export async function CachedRightSidebar({
  perspective,
  stega,
}: DynamicFetchOptions) {
  return (
    <>
      <SearchBar />
      <CachedSidebarNonProfit perspective={perspective} stega={stega} />
      <CachedSidebarWhatsNew perspective={perspective} stega={stega} />
      <CachedSidebarSeniorCenter perspective={perspective} stega={stega} />
      <CachedSidebarNewsletter perspective={perspective} stega={stega} />
      <CachedSidebarCategories perspective={perspective} stega={stega} />
      <CachedSidebarTags perspective={perspective} stega={stega} />
      <SupportFeedbackCard />
    </>
  );
}

async function CachedSidebarNonProfit({
  perspective,
  stega,
}: DynamicFetchOptions) {
  "use cache";
  const { data: nonProfit } = await sanityFetch({
    query: rightSidebarNonProfitQuery,
    perspective,
    stega,
  });

  if (!nonProfit) return null;

  return (
    <Card>
      <CardHeader>
        <CardTitle className="font-bold lg:text-2xl">
          {nonProfit.title}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <CustomPortableText value={nonProfit.description} />
      </CardContent>
      <CardFooter>
        <Link
          href={`/category/${nonProfit.slug}`}
          prefetch={false}
          className={buttonVariants()}
        >
          View More
        </Link>
      </CardFooter>
    </Card>
  );
}

async function CachedSidebarWhatsNew({
  perspective,
  stega,
}: DynamicFetchOptions) {
  "use cache";
  const { data: whatsNew } = await sanityFetch({
    query: rightSidebarWhatsNewQuery,
    perspective,
    stega,
  });

  if (!whatsNew) return null;

  return (
    <Card>
      <CardHeader>
        <CardTitle className="font-bold lg:text-2xl">What's New!</CardTitle>
      </CardHeader>
      <CardContent>
        <article>
          <Link href={`/articles/${whatsNew.slug}`} prefetch={false}>
            <div className="flex items-center gap-x-4 text-xs">
              <DateComponent
                dateString={whatsNew.publishedAt}
                className="text-zinc-500"
              />
            </div>
            <div className="group relative">
              <h3 className="mt-3 text-lg leading-6 font-semibold text-zinc-900 group-hover:text-zinc-600">
                {whatsNew.title}
              </h3>
              <p className="mt-5 line-clamp-3 text-sm leading-6 text-zinc-600">
                {whatsNew.excerpt}
              </p>
            </div>
            <div className="relative mt-8 flex items-center gap-x-4">
              <SanityImage
                image={whatsNew.author.image}
                alt={`${whatsNew.author.name} avatar`}
                className="h-10 w-10 rounded-full bg-zinc-50"
                width={40}
                height={40}
              />
              <div className="text-sm leading-6">
                <p className="font-semibold text-zinc-900">
                  {whatsNew.author.name}
                </p>
              </div>
            </div>
          </Link>
        </article>
      </CardContent>
    </Card>
  );
}

async function CachedSidebarSeniorCenter({
  perspective,
  stega,
}: DynamicFetchOptions) {
  "use cache";
  const { data: seniorCenterNewsletters } = await sanityFetch({
    query: rightSidebarSeniorCenterQuery,
    perspective,
    stega,
  });

  return (
    <Card>
      <CardHeader>
        <CardTitle className="font-bold lg:text-2xl">
          Community/Senior Center Calendar
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="divide-y divide-zinc-200">
          {seniorCenterNewsletters?.map((seniorCenterNewsletter: any) => (
            <article
              key={seniorCenterNewsletter._id}
              className="flex max-w-xl flex-col items-start justify-between"
            >
              <Link
                href={`/articles/${seniorCenterNewsletter.slug}`}
                prefetch={false}
              >
                <div className="flex items-center gap-x-4 text-xs">
                  <DateComponent
                    dateString={seniorCenterNewsletter.publishedAt}
                    className="text-zinc-500"
                  />
                </div>
                <div className="group relative">
                  <h3 className="mt-3 text-lg leading-6 font-semibold text-zinc-900 group-hover:text-zinc-600">
                    {seniorCenterNewsletter.title}
                  </h3>
                  <p className="mt-5 line-clamp-3 text-sm leading-6 text-zinc-600">
                    {seniorCenterNewsletter.excerpt}
                  </p>
                </div>
              </Link>
            </article>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}

async function CachedSidebarNewsletter({
  perspective,
  stega,
}: DynamicFetchOptions) {
  "use cache";
  const { data: newsletter } = await sanityFetch({
    query: rightSidebarNewsletterQuery,
    perspective,
    stega,
  });

  if (!newsletter) return null;

  return (
    <Card>
      <CardHeader>
        <CardTitle className="font-bold lg:text-2xl">
          <span className="italic">Keeping you informed...still</span>{" "}
          Newsletter
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="divide-y divide-zinc-200">
          <article className="flex max-w-xl flex-col items-start justify-between">
            <Link href={`/articles/${newsletter.slug}`} prefetch={false}>
              <div className="flex items-center gap-x-4 text-xs">
                <DateComponent
                  dateString={newsletter.publishedAt}
                  className="text-zinc-500"
                />
              </div>
              <div className="group relative">
                <h3 className="mt-3 text-lg leading-6 font-semibold text-zinc-900 group-hover:text-zinc-600">
                  {newsletter.title}
                </h3>
                <p className="mt-5 line-clamp-3 text-sm leading-6 text-zinc-600">
                  {newsletter.excerpt}
                </p>
              </div>
            </Link>
          </article>
        </div>
      </CardContent>
    </Card>
  );
}

async function CachedSidebarCategories({
  perspective,
  stega,
}: DynamicFetchOptions) {
  "use cache";
  const { data: categories } = await sanityFetch({
    query: highlightedCategories,
    perspective,
    stega,
  });

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-xl font-bold lg:text-2xl">
          Categories
        </CardTitle>
      </CardHeader>
      <CardContent>
        <ul className="space-y-4">
          {categories?.map((category: any) => (
            <li key={category._id} className="block">
              <Link
                href={`/category/${category.slug}`}
                className="flex justify-between rounded-sm bg-zinc-200 px-5 py-4 transition-all duration-150 hover:bg-red-400 hover:text-white"
                prefetch={false}
              >
                <span className="text-lg font-medium">{category.title}</span>
                <ChevronRightIcon className="h-6 w-6" />
              </Link>
            </li>
          ))}
        </ul>
      </CardContent>
    </Card>
  );
}

async function CachedSidebarTags({ perspective, stega }: DynamicFetchOptions) {
  "use cache";
  const { data: tags } = await sanityFetch({
    query: highlightedTags,
    perspective,
    stega,
  });

  return (
    <Card>
      <CardHeader>
        <CardTitle className="font-bold lg:text-2xl">Tags</CardTitle>
      </CardHeader>
      <CardContent>
        <ul className="flex flex-wrap">
          {tags?.map((tag: any) => (
            <li className="mr-2 pb-2" key={tag._id}>
              <Link
                title={tag.title}
                href={`/tag/${tag.slug}`}
                className="space-x-4 rounded-sm bg-zinc-200 px-3 py-1 text-base transition-all duration-150 hover:bg-red-400 hover:text-white"
                prefetch={false}
              >
                {tag.title}
              </Link>
            </li>
          ))}
        </ul>
      </CardContent>
    </Card>
  );
}

function SupportFeedbackCard() {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="font-bold lg:text-2xl">
          Support & Feedback
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4 space-x-4 text-center">
          <Link
            href="https://www.paypal.com/donate?hosted_button_id=VDPMC329ZC5ZE"
            className={buttonVariants()}
            target="_blank"
            rel="noopener noreferrer"
          >
            <CircleDollarSignIcon
              className="-ml-0.5 h-5 w-5"
              aria-hidden="true"
            />
            Donate
          </Link>
          <a
            href="mailto:ron@maricopaseniorliving.org"
            className={buttonVariants()}
          >
            <MailIcon className="-ml-0.5 h-5 w-5" aria-hidden="true" />
            Email Us!
          </a>
          <p>This site is owned and managed by Ron Smith</p>
        </div>
      </CardContent>
    </Card>
  );
}

export function RightSidebarFallback() {
  return (
    <div className="flex flex-col gap-8" aria-busy>
      {Array.from({ length: 3 }).map((_, index) => (
        <Card key={index}>
          <CardContent>
            <div className="h-48 animate-pulse rounded-md bg-zinc-200" />
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
