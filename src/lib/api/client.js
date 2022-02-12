import axios from 'axios'

const LOCAL_API_URL = 'http://localhost:3000/api/v1'
const PRODUCTION_API_URL = process.env.API_BASE_URL

const envType = {
  development: LOCAL_API_URL,
  test: LOCAL_API_URL,
  production: PRODUCTION_API_URL,
}

const BASE_URL = envType[process.env.NODE_ENV]

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
