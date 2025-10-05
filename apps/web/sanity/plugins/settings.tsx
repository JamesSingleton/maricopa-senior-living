import { type DocumentDefinition } from 'sanity'
import { type StructureResolver } from 'sanity/structure'

export const singletonPlugin = (types: string[]) => {
  return {
    name: 'singletonPlugin',
    document: {
      // Hide 'Singletons (such as Home)' from new document options
      // https://user-images.githubusercontent.com/81981/195728798-e0c6cf7e-d442-4e58-af3a-8cd99d7fcc28.png
      newDocumentOptions: (prev: any, { creationContext }: any) => {
        if (creationContext.type === 'global') {
          return prev.filter((templateItem: any) => !types.includes(templateItem.templateId))
        }

        return prev
      },
      // Removes the "duplicate" action on the Singletons (such as Home)
      actions: (prev: any, { schemaType }: any) => {
        if (types.includes(schemaType)) {
          return prev.filter(({ action }: any) => action !== 'duplicate')
        }

        return prev
      },
    },
  }
}

const hiddenIds = ['assist.instruction.context', 'media.tag', 'sanity.videoAsset']

export const pageStructure = (typeDefArray: DocumentDefinition[]): StructureResolver => {
  return (S) => {
    // Goes through all of the singletons that were provided and translates them into something the
    // Desktool can understand
    const singletonItems = typeDefArray.map((typeDef) => {
      return S.listItem()
        .title(typeDef.title!)
        .icon(typeDef.icon)
        .child(S.editor().id(typeDef.name).schemaType(typeDef.name).documentId(typeDef.name))
    })

    // The default root list items (except custom ones)
    const defaultListItems = S.documentTypeListItems().filter((listItem) => {
      const id = listItem.getId()
      return (
        !typeDefArray.find((singleton) => singleton.name === id) &&
        id !== undefined &&
        !hiddenIds.includes(id)
      )
    })

    return S.list()
      .title('Content')
      .items([...defaultListItems, S.divider(), ...singletonItems])
  }
}
