import { styled } from 'twin.macro'

import Navbar from 'components/nav/Navbar'
import SideNav from 'components/kanban/SideNav'
import Board from 'components/kanban/Board'
import { Spinner } from 'components/shared'
import { useState } from 'react'
import { useQuery } from 'react-query'
import { client } from 'lib/api/client'
import { colorTypes } from 'lib/data/colors'
import { useParams } from 'react-router-dom'

const KanBan = styled.main`
  height: calc(100vh - 52px);
  display: flex;
  position: relative;
`

function KanbanScreen() {
  const [isOpen, setIsOpen] = useState(true)
  const { boardId } = useParams()
  const { isLoading, data: boards } = useQuery({
    queryKey: 'boards',
    queryFn: () =>
      client('boards').then((res) => {
        return res.data
      }),
  })

  if (isLoading) return <Spinner />
  const board = boards.find((board) => board.id === Number(boardId))

  function toggleOpen() {
    setIsOpen((prev) => !prev)
  }
  return (
    <div css={colorTypes[board.color]}>
      <Navbar />
      <KanBan>
        <SideNav isOpen={isOpen} toggleOpen={toggleOpen} />
        <Board isOpen={isOpen} />
      </KanBan>
    </div>
  )
}

export default KanbanScreen
