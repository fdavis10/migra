import client from './client'

export async function getGuarantees() {
  const { data } = await client.get('/guarantees/')
  return data
}
