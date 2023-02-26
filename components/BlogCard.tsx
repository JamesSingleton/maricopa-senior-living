import Link from 'next/link'
import Image from 'next/image'

interface Post {
  post: {
    title: string
    href: string
    image: string
    category: {
      name: string
      href: string
    }

    snippet: string
    date: string
    datetime: string
    author: {
      name: string
      image: string
    }
  }
}

const BlogCard = ({ post }: Post) => {
  return (
    <div className="flex flex-col overflow-hidden rounded-lg shadow-lg">
      <div className="flex-shrink-0">
        <Link href="#">
          <Image src={post.image} alt="" width={750} height={420} className="w-full object-cover" />
        </Link>
      </div>
      <div className="flex flex-1 flex-col justify-between bg-white p-9">
        <div className="flex-1">
          <span className="text-sm font-medium text-indigo-600">
            <Link href={post.category.href} className="hover:underline">
              {post.category.name}
            </Link>
          </span>
          <Link href="#">
            <h2 className="text-xl font-semibold text-neutral-900">{post.title}</h2>
            <p className="mt-3 text-base text-neutral-500">{post.snippet}</p>
          </Link>
        </div>
        <div className="mt-6 flex items-center">
          <div className="flex-shrink-0">
            <span className="sr-only">{post.author.name}</span>
            <Image
              className="h-10 w-10 rounded-full object-cover"
              src={post.author.image}
              alt=""
              width={40}
              height={40}
            />
          </div>
          <div className="ml-3">
            <p className="text-sm font-medium text-gray-900">{post.author.name}</p>
            <div className="flex space-x-1 text-sm text-gray-500">
              <time dateTime={post.datetime}>{post.date}</time>
              <span aria-hidden="true">&middot;</span>
              <span>6 min read</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default BlogCard
