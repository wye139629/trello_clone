import { server, rest } from 'mocks/server'
import { client } from 'lib/api/client'

beforeAll(() => server.listen({ onUnhandledRequest: 'error' }))
afterAll(() => server.close())
afterEach(() => server.resetHandlers())

const API_URL = 'http://localhost:3000/api/v1'
const MOCK_ENDPOINT = '/mock_endpoint'

test('use GET method when call clientFn with endpoint', async () => {
  const mockResult = { mock: 'result' }

  server.use(
    rest.get(`${API_URL}${MOCK_ENDPOINT}`, (req, res, ctx) => {
      return res(ctx.status(200), ctx.json(mockResult))
    })
  )

  const res = await client(MOCK_ENDPOINT)

  expect(res.data).toStrictEqual(mockResult)
})

test('use POST method to call clientFn with provided data', async () => {
  server.use(
    rest.post(`${API_URL}${MOCK_ENDPOINT}`, (req, res, ctx) => {
      return res(ctx.json(req.body))
    })
  )

  const data = { post: 'a' }
  const res = await client(MOCK_ENDPOINT, { data })

  expect(res.data).toStrictEqual(data)
})

test('allow config to override', async () => {
  let request
  const MOCK_API_URL = 'http://localhost:1000/api/v2'

  server.use(
    rest.get(`${MOCK_API_URL}${MOCK_ENDPOINT}`, (req, res, ctx) => {
      request = req
      return res(ctx.status(200))
    })
  )
  const customConfig = {
    baseURL: MOCK_API_URL,
    headers: {
      'X-Requested-With': 'XMLHttpRequest',
    },
  }

  await client(MOCK_ENDPOINT, customConfig)

  expect(request.url.href).toBe(`${customConfig.baseURL}${MOCK_ENDPOINT}`)
  expect(request.headers.get('X-Requested-With')).toBe(
    customConfig.headers['X-Requested-With']
  )
})
