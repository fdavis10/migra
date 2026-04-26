import client from './client'

export async function submitLead(payload) {
  const { data } = await client.post('/leads/', payload)
  return data
}
