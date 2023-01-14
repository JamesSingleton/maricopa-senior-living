'use client'
import { Fragment } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import clsx from 'clsx'
import { Popover, Transition } from '@headlessui/react'
import {
  ArrowTopRightOnSquareIcon,
  Bars3Icon,
  ChartBarIcon,
  CheckCircleIcon,
  CursorArrowRaysIcon,
  PhoneIcon,
  PlayIcon,
  ShieldCheckIcon,
  Squares2X2Icon,
  XMarkIcon,
} from '@heroicons/react/24/outline'
import { ChevronDownIcon } from '@heroicons/react/20/solid'

const solutions = [
  {
    name: 'Analytics',
    description: 'Get a better understanding of where your traffic is coming from.',
    href: '#',
    icon: ChartBarIcon,
  },
  {
    name: 'Engagement',
    description: 'Speak directly to your customers in a more meaningful way.',
    href: '#',
    icon: CursorArrowRaysIcon,
  },
  {
    name: 'Security',
    description: "Your customers' data will be safe and secure.",
    href: '#',
    icon: ShieldCheckIcon,
  },
  {
    name: 'Integrations',
    description: "Connect with third-party tools that you're already using.",
    href: '#',
    icon: Squares2X2Icon,
  },
]
const callsToAction = [
  { name: 'Watch Demo', href: '#', icon: PlayIcon },
  { name: 'View All Products', href: '#', icon: CheckCircleIcon },
  { name: 'Contact Sales', href: '#', icon: PhoneIcon },
]
const cityLinks = [
  {
    name: "What's New Maricopa",
    href: 'https://maricopa-az.maps.arcgis.com/apps/MapSeries/index.html?appid=f9f29a96be60434f9b3f05332b865ded',
  },
  {
    name: 'Board and Committee Meetings',
    href: 'https://maricopa.legistar.com/Calendar.aspx',
  },
  { name: 'InMaricopa', href: 'https://www.inmaricopa.com/' },
]
const resources = [
  {
    name: 'Pinal-Gila Council for Senior Citizens',
    href: 'https://www.pgcsc.org/',
  },
  { name: 'AARP Arizona', href: 'https://states.aarp.org/arizona/' },
  { name: 'AARP', href: 'https://www.aarp.org/' },
  { name: 'National Council on Aging', href: 'https://www.ncoa.org/' },
  { name: 'National Institutes of Health', href: 'https://www.nih.gov/' },
  { name: 'CDC', href: 'https://www.cdc.gov/' },
]
const blogPosts = [
  {
    id: 1,
    name: 'Boost your conversion rate',
    href: '#',
    preview:
      'Eget ullamcorper ac ut vulputate fames nec mattis pellentesque elementum. Viverra tempor id mus.',
    imageUrl:
      'https://images.unsplash.com/photo-1558478551-1a378f63328e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=2849&q=80',
  },
  {
    id: 2,
    name: 'How to use search engine optimization to drive traffic to your site',
    href: '#',
    preview:
      'Eget ullamcorper ac ut vulputate fames nec mattis pellentesque elementum. Viverra tempor id mus.',
    imageUrl:
      'https://images.unsplash.com/photo-1486312338219-ce68d2c6f44d?ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&ixlib=rb-1.2.1&auto=format&fit=crop&w=2300&q=80',
  },
]

const Header = () => {
  return (
    <Popover className="relative bg-white">
      <div className="pointer-events-none absolute inset-0 z-30 shadow" aria-hidden="true" />
      <div className="relative z-20">
        <div className="mx-auto flex max-w-7xl items-center justify-between py-5 px-6 sm:py-4 md:justify-start md:space-x-10 lg:px-8">
          <div>
            <a href="#" className="flex">
              <span className="sr-only">Your Company</span>
              <Image
                className="h-8 w-auto sm:h-10"
                src="/images/City-of-Maricopa-Logo_Color.png"
                alt=""
                width={230}
                height={32}
              />
            </a>
          </div>
          <div className="-my-2 -mr-2 md:hidden">
            <Popover.Button className="inline-flex items-center justify-center rounded-md bg-white p-2 text-gray-400 hover:bg-gray-100 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-indigo-500">
              <span className="sr-only">Open menu</span>
              <Bars3Icon className="h-6 w-6" aria-hidden="true" />
            </Popover.Button>
          </div>
          <div className="hidden md:flex md:flex-1 md:items-center md:justify-between">
            <Popover.Group as="nav" className="flex space-x-10">
              <Link
                href="/articles"
                className="text-base font-medium text-gray-500 hover:text-gray-900"
              >
                Articles
              </Link>
              <Link
                href="/az-travel"
                className="text-base font-medium text-gray-500 hover:text-gray-900"
              >
                Arizona Travel
              </Link>
              <Popover>
                {({ open }) => (
                  <>
                    <Popover.Button
                      className={clsx(
                        open ? 'text-gray-900' : 'text-gray-500',
                        'group inline-flex items-center rounded-md bg-white text-base font-medium hover:text-gray-900 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2'
                      )}
                    >
                      <span>Aging in Place</span>
                      <ChevronDownIcon
                        className={clsx(
                          open ? 'text-gray-600' : 'text-gray-400',
                          'ml-2 h-5 w-5 group-hover:text-gray-500'
                        )}
                        aria-hidden="true"
                      />
                    </Popover.Button>

                    <Transition
                      as={Fragment}
                      enter="transition ease-out duration-200"
                      enterFrom="opacity-0 -translate-y-1"
                      enterTo="opacity-100 translate-y-0"
                      leave="transition ease-in duration-150"
                      leaveFrom="opacity-100 translate-y-0"
                      leaveTo="opacity-0 -translate-y-1"
                    >
                      <Popover.Panel className="absolute inset-x-0 top-full z-10 hidden transform bg-white shadow-lg md:block">
                        <div className="mx-auto grid max-w-7xl gap-y-6 px-4 py-6 sm:grid-cols-2 sm:gap-8 sm:px-6 sm:py-8 lg:grid-cols-4 lg:px-8 lg:py-12 xl:py-16">
                          {solutions.map((item) => (
                            <a
                              key={item.name}
                              href={item.href}
                              className="-m-3 flex flex-col justify-between rounded-lg p-3 hover:bg-gray-50"
                            >
                              <div className="flex md:h-full lg:flex-col">
                                <div className="flex-shrink-0">
                                  <span className="inline-flex h-10 w-10 items-center justify-center rounded-md bg-indigo-500 text-white sm:h-12 sm:w-12">
                                    <item.icon className="h-6 w-6" aria-hidden="true" />
                                  </span>
                                </div>
                                <div className="ml-4 md:flex md:flex-1 md:flex-col md:justify-between lg:ml-0 lg:mt-4">
                                  <div>
                                    <p className="text-base font-medium text-gray-900">
                                      {item.name}
                                    </p>
                                    <p className="mt-1 text-sm text-gray-500">{item.description}</p>
                                  </div>
                                  <p className="mt-2 text-sm font-medium text-indigo-600 lg:mt-4">
                                    Learn more
                                    <span aria-hidden="true"> &rarr;</span>
                                  </p>
                                </div>
                              </div>
                            </a>
                          ))}
                        </div>
                        <div className="bg-gray-50">
                          <div className="mx-auto max-w-7xl space-y-6 px-4 py-5 sm:flex sm:space-y-0 sm:space-x-10 sm:px-6 lg:px-8">
                            {callsToAction.map((item) => (
                              <div key={item.name} className="flow-root">
                                <a
                                  href={item.href}
                                  className="-m-3 flex items-center rounded-md p-3 text-base font-medium text-gray-900 hover:bg-gray-100"
                                >
                                  <item.icon
                                    className="h-6 w-6 flex-shrink-0 text-gray-400"
                                    aria-hidden="true"
                                  />
                                  <span className="ml-3">{item.name}</span>
                                </a>
                              </div>
                            ))}
                          </div>
                        </div>
                      </Popover.Panel>
                    </Transition>
                  </>
                )}
              </Popover>
              <Popover>
                {({ open }) => (
                  <>
                    <Popover.Button
                      className={clsx(
                        open ? 'text-gray-900' : 'text-gray-500',
                        'group inline-flex items-center rounded-md bg-white text-base font-medium hover:text-gray-900 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2'
                      )}
                    >
                      <span>More</span>
                      <ChevronDownIcon
                        className={clsx(
                          open ? 'text-gray-600' : 'text-gray-400',
                          'ml-2 h-5 w-5 group-hover:text-gray-500'
                        )}
                        aria-hidden="true"
                      />
                    </Popover.Button>

                    <Transition
                      as={Fragment}
                      enter="transition ease-out duration-200"
                      enterFrom="opacity-0 -translate-y-1"
                      enterTo="opacity-100 translate-y-0"
                      leave="transition ease-in duration-150"
                      leaveFrom="opacity-100 translate-y-0"
                      leaveTo="opacity-0 -translate-y-1"
                    >
                      <Popover.Panel className="absolute inset-x-0 top-full z-10 hidden transform shadow-lg md:block">
                        <div className="absolute inset-0 flex">
                          <div className="w-1/2 bg-white" />
                          <div className="w-1/2 bg-gray-50" />
                        </div>
                        <div className="relative mx-auto grid max-w-7xl grid-cols-1 lg:grid-cols-2">
                          <nav className="grid gap-y-10 bg-white px-4 py-8 sm:grid-cols-2 sm:gap-x-8 sm:py-12 sm:px-6 lg:px-8 xl:pr-12">
                            <div>
                              <h3 className="text-base font-medium text-gray-500">
                                City of Maricopa
                              </h3>
                              <ul role="list" className="mt-5 space-y-6">
                                {cityLinks.map((item) => (
                                  <li key={item.name} className="flow-root">
                                    <a
                                      target="_blank"
                                      href={item.href}
                                      className="-m-3 flex items-center rounded-md p-3 text-base font-medium text-gray-900 hover:bg-gray-50"
                                      rel="noreferrer"
                                    >
                                      <span className="flex items-center">
                                        {item.name}
                                        <ArrowTopRightOnSquareIcon className="ml-1.5 h-5 w-5 text-slate-400" />
                                      </span>
                                    </a>
                                  </li>
                                ))}
                              </ul>
                            </div>
                            <div>
                              <h3 className="text-base font-medium text-gray-500">Resources</h3>
                              <ul role="list" className="mt-5 space-y-6">
                                {resources.map((item) => (
                                  <li key={item.name} className="flow-root">
                                    <a
                                      target="_blank"
                                      rel="noreferrer"
                                      href={item.href}
                                      className="-m-3 flex items-center rounded-md p-3 text-base font-medium text-gray-900 hover:bg-gray-50"
                                    >
                                      <span className="flex items-center">
                                        {item.name}
                                        <ArrowTopRightOnSquareIcon className="ml-1.5 h-5 w-5 text-slate-400" />
                                      </span>
                                    </a>
                                  </li>
                                ))}
                              </ul>
                            </div>
                          </nav>
                          <div className="bg-gray-50 px-4 py-8 sm:py-12 sm:px-6 lg:px-8 xl:pl-12">
                            <div>
                              <h3 className="text-base font-medium text-gray-500">
                                Joan&apos;s Corner
                              </h3>
                              <ul role="list" className="mt-6 space-y-6">
                                {blogPosts.map((post) => (
                                  <li key={post.id} className="flow-root">
                                    <a
                                      href={post.href}
                                      className="-m-3 flex rounded-lg p-3 hover:bg-gray-100"
                                    >
                                      <div className="hidden flex-shrink-0 sm:block">
                                        <Image
                                          className="h-20 w-32 rounded-md object-cover"
                                          src={post.imageUrl}
                                          alt=""
                                          width={128}
                                          height={80}
                                        />
                                      </div>
                                      <div className="w-0 flex-1 sm:ml-8">
                                        <h4 className="truncate text-base font-medium text-gray-900">
                                          {post.name}
                                        </h4>
                                        <p className="mt-1 text-sm text-gray-500">{post.preview}</p>
                                      </div>
                                    </a>
                                  </li>
                                ))}
                              </ul>
                            </div>
                            <div className="mt-6 text-sm font-medium">
                              <a href="#" className="text-indigo-600 hover:text-indigo-500">
                                View all posts
                                <span aria-hidden="true"> &rarr;</span>
                              </a>
                            </div>
                          </div>
                        </div>
                      </Popover.Panel>
                    </Transition>
                  </>
                )}
              </Popover>
            </Popover.Group>
            <div className="flex items-center md:ml-12">
              <a href="#" className="text-base font-medium text-gray-500 hover:text-gray-900">
                Sign in
              </a>
              <a
                href="#"
                className="ml-8 inline-flex items-center justify-center rounded-md border border-transparent bg-indigo-600 px-4 py-2 text-base font-medium text-white shadow-sm hover:bg-indigo-700"
              >
                Sign up
              </a>
            </div>
          </div>
        </div>
      </div>

      <Transition
        as={Fragment}
        enter="duration-200 ease-out"
        enterFrom="opacity-0 scale-95"
        enterTo="opacity-100 scale-100"
        leave="duration-100 ease-in"
        leaveFrom="opacity-100 scale-100"
        leaveTo="opacity-0 scale-95"
      >
        <Popover.Panel
          focus
          className="absolute inset-x-0 top-0 z-30 origin-top-right transform p-2 transition md:hidden"
        >
          <div className="divide-y-2 divide-gray-50 rounded-lg bg-white shadow-lg ring-1 ring-black ring-opacity-5">
            <div className="px-5 pt-5 pb-6 sm:pb-8">
              <div className="flex items-center justify-between">
                <div>
                  <Image
                    className="h-8 w-auto"
                    src="/images/City-of-Maricopa-Logo_Color.png"
                    alt="Your Company"
                    width={230}
                    height={32}
                  />
                </div>
                <div className="-mr-2">
                  <Popover.Button className="inline-flex items-center justify-center rounded-md bg-white p-2 text-gray-400 hover:bg-gray-100 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-indigo-500">
                    <span className="sr-only">Close menu</span>
                    <XMarkIcon className="h-6 w-6" aria-hidden="true" />
                  </Popover.Button>
                </div>
              </div>
              <div className="mt-6 sm:mt-8">
                <nav>
                  <div className="grid gap-7 sm:grid-cols-2 sm:gap-y-8 sm:gap-x-4">
                    {solutions.map((item) => (
                      <a
                        key={item.name}
                        href={item.href}
                        className="-m-3 flex items-center rounded-lg p-3 hover:bg-gray-50"
                      >
                        <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-md bg-indigo-500 text-white sm:h-12 sm:w-12">
                          <item.icon className="h-6 w-6" aria-hidden="true" />
                        </div>
                        <div className="ml-4 text-base font-medium text-gray-900">{item.name}</div>
                      </a>
                    ))}
                  </div>
                  <div className="mt-8 text-base">
                    <a href="#" className="font-medium text-indigo-600 hover:text-indigo-500">
                      View all products
                      <span aria-hidden="true"> &rarr;</span>
                    </a>
                  </div>
                </nav>
              </div>
            </div>
            <div className="py-6 px-5">
              <div className="grid grid-cols-2 gap-4">
                <a
                  href="#"
                  className="rounded-md text-base font-medium text-gray-900 hover:text-gray-700"
                >
                  Pricing
                </a>
                <a
                  href="#"
                  className="rounded-md text-base font-medium text-gray-900 hover:text-gray-700"
                >
                  Docs
                </a>
                <a
                  href="#"
                  className="rounded-md text-base font-medium text-gray-900 hover:text-gray-700"
                >
                  Company
                </a>
                <a
                  href="#"
                  className="rounded-md text-base font-medium text-gray-900 hover:text-gray-700"
                >
                  Resources
                </a>
                <a
                  href="#"
                  className="rounded-md text-base font-medium text-gray-900 hover:text-gray-700"
                >
                  Blog
                </a>
                <a
                  href="#"
                  className="rounded-md text-base font-medium text-gray-900 hover:text-gray-700"
                >
                  Contact Sales
                </a>
              </div>
              <div className="mt-6">
                <a
                  href="#"
                  className="flex w-full items-center justify-center rounded-md border border-transparent bg-indigo-600 px-4 py-2 text-base font-medium text-white shadow-sm hover:bg-indigo-700"
                >
                  Sign up
                </a>
                <p className="mt-6 text-center text-base font-medium text-gray-500">
                  Existing customer?{' '}
                  <a href="#" className="text-indigo-600 hover:text-indigo-500">
                    Sign in
                  </a>
                </p>
              </div>
            </div>
          </div>
        </Popover.Panel>
      </Transition>
    </Popover>
  )
}

export default Header
