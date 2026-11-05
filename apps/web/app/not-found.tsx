import Link from "next/link";

export default function NotFound() {
  return (
    <div className="container-page py-16">
      <p className="eyebrow">Page not found</p>
      <h1 className="mt-2">Sorry, we couldn't find that page.</h1>
      <p className="mt-4 measure text-lg">
        The link may be old, or the page may have moved. You can search for what
        you need or start from the home page.
      </p>
      <form
        action="/search"
        method="get"
        role="search"
        className="mt-6 flex max-w-xl flex-col gap-2 sm:flex-row"
      >
        <label htmlFor="nf-q" className="sr-only">
          Search the website
        </label>
        <input
          id="nf-q"
          name="q"
          type="search"
          required
          className="input"
          placeholder="What are you looking for?"
        />
        <button type="submit" className="btn shrink-0">
          Search
        </button>
      </form>
      <p className="mt-6 flex flex-wrap gap-3">
        <Link href="/" className="btn btn-secondary">
          Go to the home page
        </Link>
        <Link href="/resources" className="btn btn-secondary">
          Find help by topic
        </Link>
      </p>
    </div>
  );
}
