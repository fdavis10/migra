import client from './client'

export async function getFAQ() {
  const { data } = await client.get('/faq/')
  return data
}
