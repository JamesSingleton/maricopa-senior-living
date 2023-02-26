'use client'

import { Fragment, useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { Dialog, Popover, Tab, Transition } from '@headlessui/react'
import {
  Bars3Icon,
  MagnifyingGlassIcon,
  XMarkIcon,
  ArrowTopRightOnSquareIcon,
} from '@heroicons/react/24/outline'
import { ChevronDownIcon } from '@heroicons/react/20/solid'
import clsx from 'clsx'

import Logo from './City-of-Maricopa-Logo_Color.png'
import { navigation } from '@/lib/constants'

const NavLink = (item: { name: string; href: string; external?: boolean | undefined }) => {
  if (item.external) {
    return (
      <a
        href={item.href}
        target="_blank"
        rel="noopener noreferrer"
        className="flex items-center text-neutral-500 hover:text-neutral-800"
      >
        <span>{item.name}</span>
        <ArrowTopRightOnSquareIcon className="ml-3 h-5 w-5" />
      </a>
    )
  }

  return (
    <Link href={item.href} className="text-neutral-500 hover:text-neutral-800">
      {item.name}
    </Link>
  )
}

export default function Header() {
  const [open, setOpen] = useState(false)

  const firstDropdown = navigation.categories[0]
  const secondDropdown = navigation.categories[1]

  return (
    <>
      {/* Mobile menu */}
      <Transition.Root show={open} as={Fragment}>
        <Dialog as="div" className="relative z-40 lg:hidden" onClose={setOpen}>
          <Transition.Child
            as={Fragment}
            enter="transition-opacity ease-linear duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="transition-opacity ease-linear duration-300"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <div className="fixed inset-0 bg-black bg-opacity-25" />
          </Transition.Child>

          <div className="fixed inset-0 z-40 flex">
            <Transition.Child
              as={Fragment}
              enter="transition ease-in-out duration-300 transform"
              enterFrom="-translate-x-full"
              enterTo="translate-x-0"
              leave="transition ease-in-out duration-300 transform"
              leaveFrom="translate-x-0"
              leaveTo="-translate-x-full"
            >
              <Dialog.Panel className="relative flex w-full max-w-xs flex-col overflow-y-auto bg-white pb-12 shadow-xl">
                <div className="flex px-4 pt-5 pb-2">
                  <button
                    type="button"
                    className="-m-2 inline-flex items-center justify-center rounded-md p-2 text-neutral-400"
                    onClick={() => setOpen(false)}
                  >
                    <span className="sr-only">Close menu</span>
                    <XMarkIcon className="h-6 w-6" aria-hidden="true" />
                  </button>
                </div>

                {/* Links */}
                <Tab.Group as="div" className="mt-2">
                  <div className="border-b border-gray-200">
                    <Tab.List className="-mb-px flex space-x-8 px-4">
                      {navigation.categories.map((category) => (
                        <Tab
                          key={category.name}
                          className={({ selected }) =>
                            clsx(
                              selected
                                ? 'border-indigo-600 text-indigo-600'
                                : 'border-transparent text-neutral-900',
                              'flex-1 whitespace-nowrap border-b-2 py-4 px-1 text-base font-medium'
                            )
                          }
                        >
                          {category.name}
                        </Tab>
                      ))}
                    </Tab.List>
                  </div>
                  <Tab.Panels as={Fragment}>
                    <Tab.Panel key={firstDropdown.name} className="space-y-12 px-4 pt-10 pb-6">
                      <div className="grid grid-cols-1 items-start gap-y-10 gap-x-6">
                        <div className="grid grid-cols-1 gap-y-10 gap-x-6">
                          <div>
                            <p
                              id="mobile-featured-heading"
                              className="font-medium text-neutral-900"
                            >
                              HomeFit Guide
                            </p>
                            <ul
                              role="list"
                              aria-labelledby="mobile-featured-heading-${categoryIdx}"
                              className="mt-6 space-y-6"
                            >
                              {firstDropdown.homeFitGuide?.map((item) => (
                                <li key={item.name} className="flex">
                                  <NavLink {...item} />
                                </li>
                              ))}
                            </ul>
                          </div>
                          <div>
                            <p
                              id="mobile-categories-heading"
                              className="font-medium text-neutral-900"
                            >
                              Safety Devices
                            </p>
                            <ul
                              role="list"
                              aria-labelledby="mobile-categories-heading"
                              className="mt-6 space-y-6"
                            >
                              {firstDropdown.safetyDevices?.map((item) => (
                                <li key={item.name} className="flex">
                                  <NavLink {...item} />
                                </li>
                              ))}
                            </ul>
                          </div>
                        </div>
                      </div>
                    </Tab.Panel>
                    <Tab.Panel key={secondDropdown.name} className="space-y-12 px-4 pt-10 pb-6">
                      <div className="grid grid-cols-1 items-start gap-y-10 gap-x-6">
                        <div className="grid grid-cols-1 gap-y-10 gap-x-6">
                          <div>
                            <p
                              id="mobile-city-of-maricopa-heading"
                              className="font-medium text-neutral-900"
                            >
                              City of Maricopa
                            </p>
                            <ul
                              role="list"
                              aria-labelledby="mobile-city-of-maricopa-heading"
                              className="mt-6 space-y-6"
                            >
                              {secondDropdown.maricopa?.map((item) => (
                                <li key={item.name} className="flex">
                                  <NavLink {...item} />
                                </li>
                              ))}
                            </ul>
                          </div>
                          <div>
                            <p
                              id="mobile-categories-heading"
                              className="font-medium text-neutral-900"
                            >
                              InMaricopa
                            </p>
                            <ul
                              role="list"
                              aria-labelledby="mobile-categories-heading"
                              className="mt-6 space-y-6"
                            >
                              {secondDropdown.inMaricopa?.map((item) => (
                                <li key={item.name} className="flex">
                                  <NavLink {...item} />
                                </li>
                              ))}
                            </ul>
                          </div>
                        </div>
                        <div className="grid grid-cols-1 gap-y-10 gap-x-6">
                          <div>
                            <p
                              id="mobile-collection-heading"
                              className="font-medium text-neutral-900"
                            >
                              AARP
                            </p>
                            <ul
                              role="list"
                              aria-labelledby="mobile-collection-heading"
                              className="mt-6 space-y-6"
                            >
                              {secondDropdown.aarp?.map((item) => (
                                <li key={item.name} className="flex">
                                  <NavLink {...item} />
                                </li>
                              ))}
                            </ul>
                          </div>

                          <div>
                            <p id="mobile-brand-heading" className="font-medium text-neutral-900">
                              Other Resources
                            </p>
                            <ul
                              role="list"
                              aria-labelledby="mobile-brand-heading"
                              className="mt-6 space-y-6"
                            >
                              {secondDropdown.resources?.map((item) => (
                                <li key={item.name} className="flex">
                                  <NavLink {...item} />
                                </li>
                              ))}
                            </ul>
                          </div>
                        </div>
                      </div>
                    </Tab.Panel>
                  </Tab.Panels>
                </Tab.Group>

                <div className="space-y-6 border-t border-gray-200 py-6 px-4">
                  {navigation.pages.map((page) => (
                    <div key={page.name} className="flow-root">
                      <a href={page.href} className="-m-2 block p-2 font-medium text-neutral-900">
                        {page.name}
                      </a>
                    </div>
                  ))}
                </div>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </Dialog>
      </Transition.Root>

      <header className="relative">
        <nav aria-label="Top Navigation">
          <div className="bg-white">
            <div className="container">
              <div className="border-b border-gray-200">
                <div className="flex h-16 items-center justify-between">
                  {/* Logo (lg+) */}
                  <div className="hidden lg:flex lg:items-center">
                    <Link href="/">
                      <span className="sr-only">Maricopa Senior Living</span>
                      <Image className="h-8 w-auto" src={Logo} alt="" />
                    </Link>
                  </div>

                  <div className="hidden h-full lg:flex">
                    {/* Mega menus */}
                    <Popover.Group className="ml-8">
                      <div className="flex h-full justify-center space-x-8">
                        {navigation.pages.map((page) => (
                          <Link
                            key={page.name}
                            href={page.href}
                            className="flex items-center text-base font-medium text-neutral-700 hover:text-neutral-800"
                          >
                            {page.name}
                          </Link>
                        ))}
                        <Popover key={firstDropdown.name} className="flex">
                          {({ open }) => (
                            <>
                              <div className="relative flex">
                                <Popover.Button
                                  className={clsx(
                                    open
                                      ? 'border-indigo-600 text-indigo-600'
                                      : 'border-transparent text-neutral-700 hover:text-neutral-800',
                                    'relative z-10 -mb-px flex items-center border-b-2 pt-px text-base font-medium transition-colors duration-200 ease-out'
                                  )}
                                >
                                  <span>{firstDropdown.name}</span>
                                  <ChevronDownIcon
                                    className={clsx(
                                      open ? 'text-neutral-600' : 'text-neutral-400',
                                      'ml-2 h-5 w-5 group-hover:text-neutral-500'
                                    )}
                                    aria-hidden="true"
                                  />
                                </Popover.Button>
                              </div>

                              <Transition
                                as={Fragment}
                                enter="transition ease-out duration-200"
                                enterFrom="opacity-0"
                                enterTo="opacity-100"
                                leave="transition ease-in duration-150"
                                leaveFrom="opacity-100"
                                leaveTo="opacity-0"
                              >
                                <Popover.Panel className="absolute inset-x-0 top-full z-10 text-neutral-500 sm:text-base">
                                  {/* Presentational element used to render the bottom shadow, if we put the shadow on the actual panel it pokes out the top, so we use this shorter element to hide the top of the shadow */}
                                  <div
                                    className="absolute inset-0 top-1/2 bg-white shadow"
                                    aria-hidden="true"
                                  />

                                  <div className="relative bg-white">
                                    <div className="mx-auto max-w-7xl px-8">
                                      <div className="grid grid-cols-2 items-start gap-y-10 gap-x-8 pt-10 pb-12">
                                        <div className="grid grid-cols-2 gap-y-10 gap-x-8">
                                          <div>
                                            <p
                                              id="desktop-featured-heading"
                                              className="font-medium text-neutral-900"
                                            >
                                              HomeFit Guide
                                            </p>
                                            <ul
                                              role="list"
                                              aria-labelledby="desktop-featured-heading"
                                              className="mt-6 space-y-6 sm:mt-4 sm:space-y-4"
                                            >
                                              {firstDropdown.homeFitGuide?.map((item) => (
                                                <li key={item.name} className="flex">
                                                  <NavLink {...item} />
                                                </li>
                                              ))}
                                            </ul>
                                          </div>
                                          <div>
                                            <p
                                              id="desktop-categories-heading"
                                              className="font-medium text-neutral-900"
                                            >
                                              Safety Devices
                                            </p>
                                            <ul
                                              role="list"
                                              aria-labelledby="desktop-categories-heading"
                                              className="mt-6 space-y-6 sm:mt-4 sm:space-y-4"
                                            >
                                              {firstDropdown.safetyDevices?.map((item) => (
                                                <li key={item.name} className="flex">
                                                  <NavLink {...item} />
                                                </li>
                                              ))}
                                            </ul>
                                          </div>
                                        </div>
                                      </div>
                                    </div>
                                  </div>
                                </Popover.Panel>
                              </Transition>
                            </>
                          )}
                        </Popover>
                        <Popover key={secondDropdown.name} className="flex">
                          {({ open }) => (
                            <>
                              <div className="relative flex">
                                <Popover.Button
                                  className={clsx(
                                    open
                                      ? 'border-indigo-600 text-indigo-600'
                                      : 'border-transparent text-neutral-700 hover:text-neutral-800',
                                    'relative z-10 -mb-px flex items-center border-b-2 pt-px text-base font-medium transition-colors duration-200 ease-out'
                                  )}
                                >
                                  <span>{secondDropdown.name}</span>
                                  <ChevronDownIcon
                                    className={clsx(
                                      open ? 'text-neutral-600' : 'text-neutral-400',
                                      'ml-2 h-5 w-5 group-hover:text-neutral-500'
                                    )}
                                    aria-hidden="true"
                                  />
                                </Popover.Button>
                              </div>

                              <Transition
                                as={Fragment}
                                enter="transition ease-out duration-200"
                                enterFrom="opacity-0"
                                enterTo="opacity-100"
                                leave="transition ease-in duration-150"
                                leaveFrom="opacity-100"
                                leaveTo="opacity-0"
                              >
                                <Popover.Panel className="absolute inset-x-0 top-full z-10 text-neutral-500 sm:text-base">
                                  {/* Presentational element used to render the bottom shadow, if we put the shadow on the actual panel it pokes out the top, so we use this shorter element to hide the top of the shadow */}
                                  <div
                                    className="absolute inset-0 top-1/2 bg-white shadow"
                                    aria-hidden="true"
                                  />

                                  <div className="relative bg-white">
                                    <div className="mx-auto max-w-7xl px-8">
                                      <div className="grid grid-cols-2 items-start gap-y-10 gap-x-8 pt-10 pb-12">
                                        <div className="grid grid-cols-2 gap-y-10 gap-x-8">
                                          <div>
                                            <p
                                              id="desktop-featured-heading"
                                              className="font-medium text-neutral-900"
                                            >
                                              Maricopa
                                            </p>
                                            <ul
                                              role="list"
                                              aria-labelledby="desktop-featured-heading"
                                              className="mt-6 space-y-6 sm:mt-4 sm:space-y-4"
                                            >
                                              {secondDropdown.maricopa?.map((item) => (
                                                <li key={item.name} className="flex">
                                                  <NavLink {...item} />
                                                </li>
                                              ))}
                                            </ul>
                                          </div>
                                          <div>
                                            <p
                                              id="desktop-categories-heading"
                                              className="font-medium text-neutral-900"
                                            >
                                              InMaricopa
                                            </p>
                                            <ul
                                              role="list"
                                              aria-labelledby="desktop-categories-heading"
                                              className="mt-6 space-y-6 sm:mt-4 sm:space-y-4"
                                            >
                                              {secondDropdown.inMaricopa?.map((item) => (
                                                <li key={item.name} className="flex">
                                                  <NavLink {...item} />
                                                </li>
                                              ))}
                                            </ul>
                                          </div>
                                        </div>
                                        <div className="grid grid-cols-2 gap-y-10 gap-x-8">
                                          <div>
                                            <p
                                              id="desktop-collection-heading"
                                              className="font-medium text-neutral-900"
                                            >
                                              AARP
                                            </p>
                                            <ul
                                              role="list"
                                              aria-labelledby="desktop-collection-heading"
                                              className="mt-6 space-y-6 sm:mt-4 sm:space-y-4"
                                            >
                                              {secondDropdown.aarp?.map((item) => (
                                                <li key={item.name} className="flex">
                                                  <NavLink {...item} />
                                                </li>
                                              ))}
                                            </ul>
                                          </div>

                                          <div>
                                            <p
                                              id="desktop-brand-heading"
                                              className="font-medium text-neutral-900"
                                            >
                                              Other Resources
                                            </p>
                                            <ul
                                              role="list"
                                              aria-labelledby="desktop-brand-heading"
                                              className="mt-6 space-y-6 sm:mt-4 sm:space-y-4"
                                            >
                                              {secondDropdown.resources?.map((item) => (
                                                <li key={item.name} className="flex">
                                                  <NavLink {...item} />
                                                </li>
                                              ))}
                                            </ul>
                                          </div>
                                        </div>
                                      </div>
                                    </div>
                                  </div>
                                </Popover.Panel>
                              </Transition>
                            </>
                          )}
                        </Popover>
                      </div>
                    </Popover.Group>
                  </div>

                  {/* Mobile menu and search (lg-) */}
                  <div className="flex flex-1 items-center lg:hidden">
                    <button
                      type="button"
                      className="-ml-2 rounded-md bg-white p-2 text-neutral-400"
                      onClick={() => setOpen(true)}
                    >
                      <span className="sr-only">Open menu</span>
                      <Bars3Icon className="h-6 w-6" aria-hidden="true" />
                    </button>
                  </div>

                  {/* Logo (lg-) */}
                  <Link href="/" className="lg:hidden">
                    <span className="sr-only">Your Company</span>
                    <Image src={Logo} alt="" className="h-8 w-auto" />
                  </Link>

                  <div className="flex flex-1 items-center justify-end">
                    <div className="flex items-center lg:ml-8">
                      <div className="flex space-x-8">
                        <div className="flex">
                          <a href="#" className="-m-2 p-2 text-neutral-400 hover:text-neutral-500">
                            <span className="sr-only">Search</span>
                            <MagnifyingGlassIcon className="h-6 w-6" aria-hidden="true" />
                          </a>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </nav>
      </header>
    </>
  )
}
