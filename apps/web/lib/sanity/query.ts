import { defineQuery } from 'next-sanity'

const imageFields = /* groq */ `
  "id": asset._ref,
  "preview": asset->metadata.lqip,
  hotspot {
    x,
    y
  },
  crop {
    bottom,
    left,
    right,
    top
  }
`

const buttonsFragment = /* groq */ `
  buttons[]{
    text,
    variant,
    _key,
    _type,
    "openInNewTab": url.openInNewTab,
    "href": select(
      url.type == "internal" => url.internal->slug.current,
      url.type == "external" => url.external,
      url.href
    ),
  }
`

export const queryNavbarData = defineQuery(`
  *[_type == "navbar" && _id == "navbar"][0]{
    _id,
    columns[]{
      _key,
      _type == "navbarColumn" => {
        "type": "column",
        title,
        links[]{
          _key,
          name,
          icon,
          description,
          "openInNewTab": url.openInNewTab,
          "href": select(
            url.type == "internal" => url.internal->slug.current,
            url.type == "external" => url.external,
            url.href
          )
        }
      },
      _type == "navbarLink" => {
        "type": "link",
        name,
        description,
        "openInNewTab": url.openInNewTab,
        "href": select(
          url.type == "internal" => url.internal->slug.current,
          url.type == "external" => url.external,
          url.href
        )
      }
    },
    ${buttonsFragment},
  }
`)

export const queryGlobalSeoSettings = defineQuery(`
  *[_type == "settings"][0]{
    _id,
    _type,
    siteTitle,
    logo {
      ${imageFields}
    },
    siteDescription,
    socialLinks{
      linkedin,
      facebook,
      twitter,
      instagram,
      youtube
    }
  }
`)

export const querySettingsData = defineQuery(`
  *[_type == "settings"][0]{
    _id,
    _type,
    siteTitle,
    siteDescription,
    "logo": logo.asset->url + "?w=80&h=40&dpr=3&fit=max",
    "socialLinks": socialLinks,
    "contactEmail": contactEmail,
  }
`)
