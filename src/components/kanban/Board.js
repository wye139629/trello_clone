import tw, { css, styled } from 'twin.macro'

import PropTypes from 'prop-types'
import { BoardHeader } from './BoardHeader'
import { BoardBody } from './BoardBody'
import { TaskCtxProvider } from 'context/taskContext'

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
        <BoardBody></BoardBody>
      </TaskCtxProvider>
    </BoardContainer>
  )
}

export default Board
