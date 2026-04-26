import client from './client'

export async function getReviews() {
  const { data } = await client.get('/reviews/')
  return data
}
