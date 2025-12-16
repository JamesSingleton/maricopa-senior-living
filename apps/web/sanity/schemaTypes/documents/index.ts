import { author } from './author'
import { page } from './page'
import { post } from './post'
import { service } from './service'
import { tag } from './tag'
import { home } from './home'
import { navigation } from './navigation'
import { category } from './category'

export const singletons = [home, navigation]

export const documents = [author, page, post, service, tag, category, ...singletons]
