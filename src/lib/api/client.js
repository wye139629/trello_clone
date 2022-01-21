import axios from 'axios'

const BASE_URL =
  process.env.DEV_MODE === 'enabled'
    ? 'http://localhost:3000/api/v1/'
    : process.env.API_BASE_URL

const ax = axios.create({
  baseURL: BASE_URL,
  withCredentials: true,
})

ax.defaults.xsrfCookieName = 'CSRF-TOKEN'
ax.defaults.xsrfHeaderName = 'X-CSRF-Token'

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
