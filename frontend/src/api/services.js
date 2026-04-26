import client from './client'

export async function getServices(params) {
  const { data } = await client.get('/services/', { params })
  return data
}

export async function getService(slug) {
  const { data } = await client.get(`/services/${slug}/`)
  return data
}
