const DirectoryCard = ({ directoryItem }: { directoryItem: any }) => (
  <div className="overflow-hidden bg-white shadow sm:rounded-lg">
    <div className="px-4 py-6 sm:px-6">
      <h2 className="text-2xl font-semibold leading-7 text-gray-900">{directoryItem.title}</h2>
      <p className="mt-1 max-w-2xl text-sm leading-6 text-gray-500">{directoryItem.description}</p>
    </div>
    <div className="border-t border-gray-100">
      <dl className="divide-y divide-gray-100">
        {directoryItem.audience && (
          <div className="px-4 py-6 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
            <dt className="text-sm font-medium text-gray-900">Audience/Eligibility</dt>
            <dd className="mt-1 text-sm leading-6 text-gray-700 sm:col-span-2 sm:mt-0">
              {directoryItem.audience}
            </dd>
          </div>
        )}
        {directoryItem.website && (
          <div className="px-4 py-6 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
            <dt className="text-sm font-medium text-gray-900">Website</dt>
            <dd className="mt-1 text-sm leading-6 text-gray-700 sm:col-span-2 sm:mt-0">
              <a
                href={directoryItem.website}
                target="_blank"
                className="text-indigo-600 hover:text-indigo-500"
                rel="noreferrer noopener"
              >
                {directoryItem.website}
              </a>
            </dd>
          </div>
        )}
        {directoryItem.phone && (
          <div className="px-4 py-6 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
            <dt className="text-sm font-medium text-gray-900">Phone</dt>
            <dd className="mt-1 text-sm leading-6 text-gray-700 sm:col-span-2 sm:mt-0">
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
            <dt className="text-sm font-medium text-gray-900">Location</dt>
            <dd className="mt-1 text-sm leading-6 text-gray-700 sm:col-span-2 sm:mt-0">
              {directoryItem.address}
            </dd>
          </div>
        )}
        {directoryItem.notes && (
          <div className="px-4 py-6 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
            <dt className="text-sm font-medium text-gray-900">Notes</dt>
            <dd className="mt-1 text-sm leading-6 text-gray-700 sm:col-span-2 sm:mt-0">
              {directoryItem.notes}
            </dd>
          </div>
        )}
      </dl>
    </div>
  </div>
)

export default DirectoryCard
