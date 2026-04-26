import client from './client'

export async function getPromotions() {
  const { data } = await client.get('/promotions/')
  return data
}
