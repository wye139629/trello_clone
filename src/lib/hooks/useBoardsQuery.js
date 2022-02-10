import { useQuery } from 'react-query'
import { fetchBoards } from 'lib/api/fetchers'

export function useBoardsQuery() {
  return useQuery({
    queryKey: 'boards',
    queryFn: fetchBoards,
  })
}
