import client from './client.js'
import { SITE_STATIC } from '../config/siteStatic.js'

export async function getSiteContact() {
  try {
    const { data } = await client.get('/site/contact/')
    return data
  } catch {
    return SITE_STATIC
  }
}
