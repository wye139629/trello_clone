import axios from 'axios'

const ax = axios.create({
  baseURL: process.env.API_BASE_URL,
})

export function client(
  endpoint,
  { data, headers: customHeaders, ...customConfig } = {}
) {
  return ax(endpoint, {
    method: data ? 'POST' : 'GET',
    headers: {
      'Content-Type': data ? 'application/json' : undefined,
      ...customHeaders,
    },
    data,
    ...customConfig,
  })
}
