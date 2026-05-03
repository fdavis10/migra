import client from './client'

export async function getPromotions() {
  const { data } = await client.get('/promotions/')
  return data
}

export async function getPromotion(id) {
  const { data } = await client.get(`/promotions/${id}/`)
  return data
}
