import { rest } from 'msw'
import { v4 as uuidv4 } from 'uuid'

const API_URL = 'http://localhost:3000/api/v1'
const userId = uuidv4()
const [boardId1, boardId2, boardId3] = new Array(3).fill(uuidv4())

export const handlers = [
  rest.get(`${API_URL}/auth`, (_, res, ctx) => {
    return res(
      ctx.status(200),
      ctx.json({
        id: userId,
        email: 'willmock@gamil.com',
      })
    )
  }),

  rest.get(`${API_URL}/boards`, (_, res, ctx) => {
    return res(
      ctx.status(200),
      ctx.json([
        {
          id: boardId1,
          title: 'mock1',
          user_id: userId,
          color: 'Red',
        },
        {
          id: boardId2,
          title: 'mock2',
          user_id: userId,
          color: 'Cyan',
        },
        {
          id: boardId3,
          title: 'mock3',
          user_id: 2,
          color: 'Lime',
        },
      ])
    )
  }),
]
