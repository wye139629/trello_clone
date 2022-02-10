import { client } from './client'

export const fetchBoards = () => client('/boards').then((res) => res.data)

export const fetchBoard = (id) => () =>
  client(`boards/${id}`).then((res) => res.data)
