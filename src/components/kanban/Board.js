import { css } from 'twin.macro'

const BoardStyle = css`
  background-color: rgba(0, 0, 0, 0.6);
  width: calc(100vw - 260px);
`

function BoardHeader() {
  return <div></div>
}

function BoardBody() {
  return <div></div>
}

function Board() {
  return (
    <div css={BoardStyle}>
      <BoardHeader></BoardHeader>
      <BoardBody></BoardBody>
    </div>
  )
}

export default Board
