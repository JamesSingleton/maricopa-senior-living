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
      <div className="flex flex-1 flex-col justify-between bg-white p-9">
        <div className="flex-1">
          <span className="text-sm font-medium text-indigo-600">
            {categories.edges[0]?.node.name !== 'Uncategorized'
              ? categories.edges[0]?.node.name
              : null}
            {tags.edges[0]?.node.name !== 'Uncategorized' ? tags.edges[0]?.node.name : null}
          </span>
          <>
            <h2 className="text-xl font-semibold text-neutral-900">{post.title}</h2>
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
