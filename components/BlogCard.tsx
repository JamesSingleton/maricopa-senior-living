import Link from 'next/link'
import Image from 'next/image'
import { format, parseISO } from 'date-fns'

interface Post {
  post: {
    title: string
    slug: string
    featuredImage: {
      node: {
        sourceUrl: string
      }
    }
    categories: {
      edges: {
        node: {
          name: string
          slug: string
        }
      }[]
    }
    tags: {
      edges: {
        node: {
          name: string
          slug: string
        }
      }[]
    }
    excerpt: string
    date: string
    datetime: string
    author: {
      node: {
        name: string
        avatar: {
          url: string
        }
      }
    }
  }
}

const BlogCard = ({ post }: Post) => {
  const { categories, tags } = post
  return (
    <div className="flex flex-col overflow-hidden rounded-lg shadow-lg">
      <div className="flex-shrink-0">
        <Link href={`/articles/${post.slug}`}>
          <Image
            src={post.featuredImage.node.sourceUrl}
            alt=""
            width={750}
            height={420}
            className="w-full object-cover"
          />
        </Link>
      </div>
      <div className="flex flex-1 flex-col justify-between bg-white p-4 sm:p-9">
        <div className="flex-1">
          <div className="space-y-4 font-medium sm:space-x-4">
            {/* only return categories that do not equal Uncategorized */}
            {categories.edges
              .filter((category) => category.node.name !== 'Uncategorized')
              .map((category) => (
                <Link
                  key={category.node.slug}
                  href={`/category/${category.node.slug}`}
                  className="rounded bg-neutral-200 py-0.5 px-3 transition-all duration-150 hover:bg-red-400 hover:text-white"
                >
                  {category.node.name}
                </Link>
              ))}
            {tags.edges.map((tag) => (
              <Link
                key={tag.node.slug}
                href={`/tag/${tag.node.slug}`}
                className="rounded bg-neutral-200 py-0.5 px-3 transition-all duration-150 hover:bg-red-400 hover:text-white"
              >
                {tag.node.name}
              </Link>
            ))}
          </div>
          <>
            <h2 className="mt-4 text-xl font-semibold text-neutral-900">{post.title}</h2>
            <div
              className="mt-3 text-base text-neutral-500"
              dangerouslySetInnerHTML={{ __html: post.excerpt }}
            />
          </>
        </div>
        <div className="mt-6 flex items-center">
          <div className="flex-shrink-0">
            <span className="sr-only">{post.author.node.name}</span>
            <Image
              className="h-10 w-10 rounded-full object-cover"
              src={post.author.node.avatar.url}
              alt=""
              width={40}
              height={40}
            />
          </div>
          <div className="ml-3">
            <p className="text-sm font-medium text-gray-900">{post.author.node.name}</p>
            <div className="flex space-x-1 text-sm text-gray-500">
              <time dateTime={post.date} suppressHydrationWarning>
                {format(parseISO(post.date), 'LLL d, yyyy')}
              </time>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default BlogCard
