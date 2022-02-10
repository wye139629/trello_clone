import { useCallback } from 'react'
import { useQuery, useQueryClient } from 'react-query'
import { fetchBoards, fetchBoard } from 'lib/api/fetchers'

export function useBoardsQuery() {
  return useQuery({
    queryKey: 'boards',
    queryFn: fetchBoards,
  })
}

export function usePrefetchboard(id) {
  const queryClient = useQueryClient()

  return useCallback(async () => {
    await queryClient.prefetchQuery(['board', id], fetchBoard(id))
  }, [id, queryClient])
}
