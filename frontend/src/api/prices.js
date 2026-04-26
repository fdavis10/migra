import client from './client'

export async function getPrices(params) {
  const { data } = await client.get('/prices/', { params })
  return data
}
