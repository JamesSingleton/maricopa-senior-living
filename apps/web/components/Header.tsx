"use client";

import { Dialog, Disclosure, Popover, Transition } from "@headlessui/react";
import { ChevronDownIcon } from "@heroicons/react/20/solid";
import {
  ArrowTopRightOnSquareIcon,
  Bars3Icon,
  XMarkIcon,
} from "@heroicons/react/24/outline";
import clsx from "clsx";
import Link from "next/link";
import { usePathname, useSearchParams } from "next/navigation";
import { Fragment, useEffect, useState } from "react";

const Header = ({ menu }: { menu: any }) => {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    setMobileMenuOpen(false);
  }, [pathname, searchParams]);

  return (
    <header className="bg-white">
      <nav
        className="container mx-auto flex items-center justify-between p-6 lg:px-8"
        aria-label="Global"
      >
        <div className="flex items-center gap-x-12">
          <Link href="/" className="text-xl font-bold" prefetch={false}>
            Maricopa Senior Living
          </Link>
          <Popover.Group className="hidden lg:flex lg:gap-x-12">
            {menu.map((item: any) => {
              if (item.link.reference) {
                return (
                  <Link
                    key={item._key}
                    href={`${
                      item.link.reference._type === "page"
                        ? ""
                        : `/${item.link.reference._type}`
                    }/${item.link.reference.slug}`}
                    className="text-base font-semibold leading-6 text-zinc-900"
                    prefetch={false}
                  >
                    {item.link.reference.title}
                  </Link>
                );
              }

              return (
                <Popover className="relative" key={item._key}>
                  <Popover.Button className="flex items-center gap-x-1 text-base font-semibold leading-6 text-zinc-900">
                    {item.link.text}
                    <ChevronDownIcon
                      className="h-5 w-5 flex-none text-zinc-400"
                      aria-hidden="true"
                    />
                  </Popover.Button>

                  <Transition
                    as={Fragment}
                    enter="transition ease-out duration-200"
                    enterFrom="opacity-0 translate-y-1"
                    enterTo="opacity-100 translate-y-0"
                    leave="transition ease-in duration-150"
                    leaveFrom="opacity-100 translate-y-0"
                    leaveTo="opacity-0 translate-y-1"
                  >
                    <Popover.Panel className="absolute -left-8 top-full z-10 mt-3 w-screen max-w-sm rounded-xl bg-white p-2 shadow-lg ring-1 ring-zinc-900/5">
                      {({ close }) => {
                        return item.children.map((child: any) => (
                          <a
                            target="_blank"
                            rel="noopener noreferrer"
                            key={child._key}
                            href={child.link.url}
                            onClick={() => close()}
                            className="flex items-center rounded-lg px-3 py-2 text-base font-semibold leading-6 text-zinc-900 hover:bg-zinc-100"
                          >
                            <span>{child.link.text}</span>
                            <ArrowTopRightOnSquareIcon
                              className="h-5 w-5 pl-1"
                              aria-label="(opens in a new tab)"
                            />
                          </a>
                        ));
                      }}
                    </Popover.Panel>
                  </Transition>
                </Popover>
              );
            })}
          </Popover.Group>
        </div>
        <div className="flex lg:hidden">
          <button
            type="button"
            className="-m-2.5 inline-flex items-center justify-center rounded-md p-2.5 text-gray-700"
            onClick={() => setMobileMenuOpen(true)}
          >
            <span className="sr-only">Open main menu</span>
            <Bars3Icon className="h-6 w-6" aria-hidden="true" />
          </button>
        </div>
      </nav>
      <Dialog
        as="div"
        className="lg:hidden"
        open={mobileMenuOpen}
        onClose={setMobileMenuOpen}
      >
        <div className="fixed inset-0 z-10" />
        <Dialog.Panel className="fixed inset-y-0 right-0 z-10 w-full overflow-y-auto bg-white px-6 py-6 sm:max-w-sm sm:ring-1 sm:ring-zinc-900/10">
          <div className="flex items-center justify-between">
            <Link href="/" className="text-xl font-bold" prefetch={false}>
              Maricopa Senior Living
            </Link>
            <button
              type="button"
              className="-m-2.5 rounded-md p-2.5 text-zinc-700"
              onClick={() => setMobileMenuOpen(false)}
            >
              <span className="sr-only">Close menu</span>
              <XMarkIcon className="h-6 w-6" aria-hidden="true" />
            </button>
          </div>
          <div className="mt-6 flow-root">
            <div className="-my-6 divide-y divide-zinc-500/10">
              <div className="space-y-2 py-6">
                {menu.map((item: any) => {
                  if (item.link.reference) {
                    return (
                      <Link
                        key={item._key}
                        href={`${
                          item.link.reference._type === "page"
                            ? ""
                            : `/${item.link.reference._type}`
                        }/${item.link.reference.slug}`}
                        className="-mx-3 block rounded-lg px-3 py-2 text-base font-semibold leading-7 text-zinc-900 hover:bg-zinc-50"
                        prefetch={false}
                      >
                        {item.link.reference.title}
                      </Link>
                    );
                  }

                  return (
                    <Disclosure as="div" className="-mx-3" key={item._key}>
                      {({ open }) => (
                        <>
                          <Disclosure.Button className="flex w-full items-center justify-between rounded-lg py-2 pl-3 pr-3.5 text-base font-semibold leading-7 hover:bg-zinc-50">
                            {item.link.text}
                            <ChevronDownIcon
                              className={clsx(
                                open ? "rotate-180" : "",
                                "h-5 w-5 flex-none",
                              )}
                              aria-hidden="true"
                            />
                          </Disclosure.Button>
                          <Disclosure.Panel className="mt-2 space-y-2">
                            {item.children.map((child: any) => (
                              <Disclosure.Button
                                key={child._key}
                                href={child.link.url}
                                target="_blank"
                                rel="noopener noreferrer"
                                as="a"
                                className="flex items-center rounded-lg py-2 pl-6 pr-3 text-base font-semibold leading-7 text-zinc-900 hover:bg-zinc-100"
                              >
                                <span>{child.link.text}</span>
                                <ArrowTopRightOnSquareIcon
                                  className="h-4 w-4 pl-1"
                                  aria-label="(opens in a new tab)"
                                />
                              </Disclosure.Button>
                            ))}
                          </Disclosure.Panel>
                        </>
                      )}
                    </Disclosure>
                  );
                })}
              </div>
            </div>
          </div>
        </Dialog.Panel>
      </Dialog>
    </header>
  );
};

export default Header;
