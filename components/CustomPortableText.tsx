import Image from 'next/image'
import {
  PortableText,
  PortableTextComponents,
  PortableTextMarkComponentProps,
} from '@portabletext/react'
import { PortableTextBlock } from 'sanity'
import { getImageDimensions, buildFileUrl } from '@sanity/asset-utils'

import { urlForImage } from '@/lib/sanity.image'
import { dataset, projectId } from '@/lib/sanity.api'

const ImageComponent = ({ value }: { value: any }) => {
  const { width, height } = getImageDimensions(value)
  return (
    <Image
      src={urlForImage(value).fit('min').auto('format').url()}
      alt={value.alt || ' '}
      width={width}
      height={height}
    />
  )
}

export function CustomPortableText({
  paragraphClasses,
  value,
}: {
  paragraphClasses?: string
  value: PortableTextBlock[]
}) {
  const components: PortableTextComponents = {
    block: {
      normal: ({ children }) => {
        return <p className={paragraphClasses}>{children}</p>
      },
    },
    marks: {
      link: ({ value, children }: PortableTextMarkComponentProps) => {
        return (
          <a href={value?.href} rel="noreferrer noopener" target="_blank">
            {children}
          </a>
        )
      },
      highlight: ({ children }) => {
        return <mark>{children}</mark>
      },
      sup: ({ children }) => {
        return <sup>{children}</sup>
      },
      sub: ({ children }) => {
        return <sub>{children}</sub>
      },
    },
    types: {
      image: ImageComponent,
      attachment: ({ value }: { value: any }) => {
        const { documentUrl, description } = value
        return (
          <a href={documentUrl} target="_blank" rel="noopener noreferrer">
            {description}
          </a>
        )
      },
    },
  }

  return <PortableText components={components} value={value} />
}
