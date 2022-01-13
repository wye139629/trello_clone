import tw, { css, styled } from 'twin.macro'

import PropTypes from 'prop-types'
import { BoardHeader } from './BoardHeader'
import { BoardBody } from './BoardBody'
import { CustomDragLayer } from 'components/shared'
import { DndProvider } from 'react-dnd'
import { HTML5Backend } from 'react-dnd-html5-backend'
import { QueryClient, QueryClientProvider } from 'react-query'

const BoardContainer = styled.div(({ isOpen }) => [
  tw`pl-6 w-screen`,
  isOpen &&
    css`
      width: calc(100vw - 260px);
    `,
])

Board.propTypes = {
  isOpen: PropTypes.bool.isRequired,
}

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
    },
  },
})

function Board({ isOpen }) {
  return (
    <BoardContainer isOpen={isOpen}>
      <BoardHeader></BoardHeader>
      <QueryClientProvider client={queryClient}>
        <DndProvider backend={HTML5Backend}>
          <CustomDragLayer />
          <BoardBody />
        </DndProvider>
      </QueryClientProvider>
    </BoardContainer>
  )
}

export default Board
