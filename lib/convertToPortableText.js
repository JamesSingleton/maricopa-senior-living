/* eslint-disable no-console */
import { uuid } from '@sanity/uuid'
import { sanityClient } from './sanity.client'

const token =
  'skun2GGvXpIsubiTkd0Q2m6Xk19ddqxryGmT5vg0swaiVLlagbdpud9BIBbJ9EBU2xOUtZznTAxlbGMAoQluNtVOsoSbHdey4DoilUuBygcMtJNzDMGkSERZVnO5M47nCeL1Qzkx2hb7v4zy0DRtlXN6IbVWKaoUZFnDm0EHgm6iqbMUf0ry'
// length(description) returns null if description isn't a (Portable Text) array
const fetchDocuments = () =>
  sanityClient(token).fetch(
    `*[_type == 'category' && title == "Isolation/Loneliness"][0...100] {_id, _rev, description}`
  )

const buildPatches = (docs) =>
  docs.map((doc) => ({
    id: doc._id,
    patch: {
      set: {
        description: [
          {
            _key: uuid(),
            style: 'normal',
            _type: 'block',
            children: [
              {
                _key: uuid(),
                _type: 'span',
                marks: [],
                text: doc.description,
              },
            ],
            markDefs: [],
          },
        ],
      },
      // this will cause the migration to fail if any of the documents has been
      // modified since it was fetched.
      ifRevisionID: doc._rev,
    },
  }))

const createTransaction = (patches) =>
  patches.reduce((tx, patch) => tx.patch(patch.id, patch.patch), sanityClient(token).transaction())

const commitTransaction = (tx) => tx.commit()

const migrateNextBatch = async () => {
  const documents = await fetchDocuments()
  console.log('documents', documents)
  console.log(documents[0].description)
  // const patches = buildPatches(documents)
  // if (patches.length === 0) {
  //   console.log('No more documents to migrate!')
  //   return null
  // }
  // console.log(
  //   `Migrating batch:\n %s`,
  //   patches.map((patch) => `${patch.id} => ${JSON.stringify(patch.patch)}`).join('\n')
  // )
  // const transaction = createTransaction(patches)
  // await commitTransaction(transaction)
  // return migrateNextBatch()
}

migrateNextBatch().catch((err) => {
  console.error(err)
  process.exit(1)
})
