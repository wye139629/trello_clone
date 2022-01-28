import Navbar from 'components/nav/Navbar'
import { NavLink } from 'react-router-dom'
import { useQuery } from 'react-query'
import { client } from 'lib/api/client'
import { Spinner } from 'components/shared'

export function WorkSpaceScreen() {
  const { isLoading, data: boards } = useQuery({
    queryKey: 'boards',
    queryFn: () =>
      client('boards').then((res) => {
        return res.data
      }),
  })

  if (isLoading) return <Spinner />

  return (
    <>
      <Navbar />
      <main>
        {boards.map((board) => (
          <NavLink key={board.id} to={`/board/${board.id}`}>
            <h3>{board.title}</h3>
          </NavLink>
        ))}
      </main>
    </>
  )
}
