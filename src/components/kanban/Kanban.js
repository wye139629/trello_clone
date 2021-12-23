import { css } from 'twin.macro'

import SideNav from './SideNav'
import Board from './Board'
import { useState } from 'react'

const kanbanStyle = css`
  height: calc(100vh - 52px);
  display: flex;
  position: relative;
`

function Kanban() {
  const [isOpen, setIsOpen] = useState(true)
  function toggleOpen() {
    setIsOpen((prev) => !prev)
  }
  return (
    <div css={kanbanStyle}>
      <SideNav isOpen={isOpen} toggleOpen={toggleOpen}></SideNav>
      <Board isOpen={isOpen}></Board>
    </div>
  )
}

export default Kanban
