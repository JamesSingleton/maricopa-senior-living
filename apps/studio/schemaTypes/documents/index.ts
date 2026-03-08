import { author } from './author'
import { blog } from './blog'
import { blogIndex } from './blog-index'
import { category } from './category'
import { footer } from './footer'
import { navbar } from './navbar'
import { page } from './page'
import { post } from './post'
import { service } from './service'
import { settings } from './settings'
import { tag } from './tag'

export const singletons = [blogIndex, settings, footer, navbar]

export const documents = [author, blog, category, page, post, service, tag, ...singletons]
