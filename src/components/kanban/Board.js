import tw, { css, styled } from 'twin.macro'

import PropTypes from 'prop-types'
import { BoardHeader } from './BoardHeader'
import { BoardBody } from './BoardBody'
import { CustomDragLayer } from 'components/shared'
import { TaskCtxProvider } from 'context/taskContext'
import { DndProvider } from 'react-dnd'
import { HTML5Backend } from 'react-dnd-html5-backend'

const BoardContainer = styled.div(({ isOpen }) => [
  tw`pl-6 w-screen`,
  isOpen &&
    css`
      width: calc(100vw - 260px);
      transition: width 0.5s;
    `,
])

Board.propTypes = {
  isOpen: PropTypes.bool.isRequired,
}

function Board({ isOpen }) {
  return (
    <BoardContainer isOpen={isOpen}>
      <BoardHeader></BoardHeader>
      <TaskCtxProvider>
        <DndProvider backend={HTML5Backend}>
          <CustomDragLayer />
          <BoardBody />
        </DndProvider>
      </TaskCtxProvider>
    </BoardContainer>
  )
}

export default Board
