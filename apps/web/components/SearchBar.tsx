"use client";
import { MagnifyingGlassIcon } from "@heroicons/react/20/solid";
import { useRef } from "react";

const SearchBar = () => {
  const inputRef = useRef<HTMLInputElement>(null);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const input = inputRef.current;
    if (input?.value) {
      window.location.href = `/search?q=${input.value}`;
    }
  };

  return (
    <form onSubmit={handleSearch}>
      <div className="relative flex items-center rounded-md bg-white py-1 pl-3 shadow-sm">
        <div className="flex flex-1 items-center justify-center px-2 py-4">
          <div className="w-full max-w-lg lg:max-w-xs">
            <label htmlFor="search" className="sr-only">
              Search
            </label>
            <div className="relative">
              <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                <MagnifyingGlassIcon
                  className="h-5 w-5 text-zinc-400"
                  aria-hidden="true"
                />
              </div>
              <input
                ref={inputRef}
                id="search"
                name="search"
                className="block w-full rounded-md border border-zinc-300 bg-white py-2 pl-10 pr-3 leading-5 placeholder-zinc-500 focus:border-indigo-500 focus:placeholder-zinc-400 focus:outline-hidden focus:ring-1 focus:ring-indigo-500 sm:text-sm"
                placeholder="Search"
                type="search"
              />
            </div>
          </div>
        </div>
      </div>
    </form>
  );
};

export default SearchBar;
