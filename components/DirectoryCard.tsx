import Link from 'next/link'

import { dataset, projectId } from '@/lib/sanity.api'
import { PaperClipIcon } from '@heroicons/react/20/solid'
import { ArrowTopRightOnSquareIcon } from '@heroicons/react/24/outline'
import { buildFileUrl } from '@sanity/asset-utils'
import BusinessHours from './BusinessHours'
import { CustomPortableText } from './CustomPortableText'

function convertBytes(bytes: number): string {
  const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB']
  if (bytes === 0) {
    return '0 Bytes'
  }
  const i = Math.floor(Math.log(bytes) / Math.log(1024))
  return parseFloat((bytes / Math.pow(1024, i)).toFixed(2)) + ' ' + sizes[i]
}

const DirectoryCard = ({ directoryItem }: { directoryItem: any }) => (
  <div className="overflow-hidden bg-white shadow sm:rounded-lg">
    <div className="prose px-4 py-6 sm:px-6">
      <h2 className="text-2xl font-semibold leading-7 text-zinc-900">{directoryItem.title}</h2>
      {directoryItem.description && (
        <CustomPortableText
          paragraphClasses="mt-1 max-w-2xl text-sm leading-6 text-zinc-500"
          value={directoryItem.description}
        />
      )}
    </div>
    <div className="border-t border-zinc-100">
      <dl className="divide-y divide-zinc-100">
        {directoryItem.audience && (
          <div className="px-4 py-6 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
            <dt className="text-sm font-medium text-zinc-900">Audience/Eligibility</dt>
            <dd className="prose mt-1 text-sm leading-6 text-zinc-700 sm:col-span-2 sm:mt-0">
              <CustomPortableText value={directoryItem.audience} />
            </dd>
          </div>
        )}
        {directoryItem.website && (
          <div className="px-4 py-6 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
            <dt className="text-sm font-medium text-zinc-900">Website</dt>
            <dd className="mt-1 text-sm leading-6 text-zinc-700 sm:col-span-2 sm:mt-0">
              <a
                href={directoryItem.website}
                target="_blank"
                className="flex items-center text-indigo-600 hover:text-indigo-500"
                rel="noreferrer noopener"
              >
                <span>{directoryItem.website}</span>
                <ArrowTopRightOnSquareIcon
                  className="h-4 w-4 pl-1"
                  aria-label="(opens in a new tab)"
                />
              </a>
            </dd>
          </div>
        )}
        {directoryItem.phone && (
          <div className="px-4 py-6 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
            <dt className="text-sm font-medium text-zinc-900">Phone</dt>
            <dd className="mt-1 text-sm leading-6 text-zinc-700 sm:col-span-2 sm:mt-0">
              <a
                href={`tel:${directoryItem.phone}`}
                className="text-indigo-600 hover:text-indigo-500"
              >
                {directoryItem.phone}
              </a>
            </dd>
          </div>
        )}
        {directoryItem.address && (
          <div className="px-4 py-6 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
            <dt className="text-sm font-medium text-zinc-900">Location</dt>
            <dd className="mt-1 text-sm leading-6 text-zinc-700 sm:col-span-2 sm:mt-0">
              {directoryItem.address}
            </dd>
          </div>
        )}
        {directoryItem.businessHours && (
          <div className="px-4 py-6 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
            <dt className="text-sm font-medium text-zinc-900">Hours</dt>
            <dd className="mt-1 text-sm leading-6 text-zinc-700 sm:col-span-2 sm:mt-0">
              <BusinessHours hours={directoryItem.businessHours} />
            </dd>
          </div>
        )}
        {directoryItem.notes && (
          <div className="px-4 py-6 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
            <dt className="text-sm font-medium text-zinc-900">Notes</dt>
            <dd className="prose mt-1 text-sm leading-6 text-zinc-700 sm:col-span-2 sm:mt-0">
              <CustomPortableText value={directoryItem.notes} />
            </dd>
          </div>
        )}
        {directoryItem.attachments && (
          <div className="px-4 py-6 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
            <dt className="text-sm font-medium leading-6 text-zinc-900">Attachments</dt>
            <dd className="mt-2 text-sm text-zinc-900 sm:col-span-2 sm:mt-0">
              <ul
                role="list"
                className="divide-y divide-zinc-100 rounded-md border border-zinc-200"
              >
                {directoryItem.attachments.map((attachment: any) => (
                  <li
                    key={attachment._key}
                    className="flex items-center justify-between py-4 pl-4 pr-5 text-sm leading-6"
                  >
                    <div className="flex w-0 flex-1 items-center">
                      <PaperClipIcon
                        className="h-5 w-5 flex-shrink-0 text-zinc-400"
                        aria-hidden="true"
                      />
                      <div className="ml-4 flex min-w-0 flex-1 gap-2">
                        <span className="truncate font-medium">{attachment.name}</span>
                        <span className="flex-shrink-0 text-zinc-400">
                          {convertBytes(attachment.documentSize)}
                        </span>
                      </div>
                    </div>
                    <div className="ml-4 flex-shrink-0">
                      <a
                        href={`${buildFileUrl(attachment, { dataset, projectId })}?dl=${
                          attachment.name
                        }`}
                        className="font-medium text-indigo-600 hover:text-indigo-500"
                      >
                        Download
                      </a>
                    </div>
                  </li>
                ))}
              </ul>
            </dd>
          </div>
        )}
        {directoryItem.tags && (
          <div className="px-4 py-6 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
            <dt className="text-sm font-medium leading-6 text-zinc-900">Tags</dt>
            <dd className="mt-2 text-sm text-zinc-900 sm:col-span-2 sm:mt-0">
              <ul className="flex flex-wrap gap-2">
                {directoryItem.tags.map((tag: any, index: number) => (
                  <li key={`${tag._id}_${directoryItem.title}_${index}`}>
                    <Link
                      className="space-x-4 rounded bg-zinc-200 px-3 py-1 text-base transition-all duration-150 hover:bg-red-400 hover:text-white"
                      href={`/tag/${tag.slug}`}
                    >
                      {tag.title}
                    </Link>
                  </li>
                ))}
              </ul>
            </dd>
          </div>
        )}
      </dl>
    </div>
  </div>
)

export default DirectoryCard
