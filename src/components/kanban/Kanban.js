import SideNav from './SideNav'
import Board from './Board'
import { css } from 'twin.macro'

const kanbanStyle = css`
  height: calc(100vh - 52px);
  display: flex;
`

function Kanban() {
  return (
    <div css={kanbanStyle}>
      <SideNav></SideNav>
      <Board></Board>
    </div>
  )
}

export default Kanban
