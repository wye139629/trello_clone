import tw, { css } from 'twin.macro'
import { useState } from 'react'
import { Switcher, Displayer, Editor } from '../shared'

const BoardStyle = css`
  width: calc(100vw - 260px);
`
const Button = tw.button`rounded border-0 bg-transparent py-[6px] px-[10px] cursor-pointer hover:bg-gray-200/50`

function BoardHeader() {
  const [kanbanTitle, setKanbanTitle] = useState('Trello-clone')

  return (
    <div css={tw`h-[52px] flex items-center px-[8px]`}>
      <Switcher>
        <Displayer>
          <Button>
            <h4 css={tw`text-sky-900 text-xl font-extrabold`}>{kanbanTitle}</h4>
          </Button>
        </Displayer>
        <Editor>
          <input
            css={[
              tw`text-sky-900 text-xl font-extrabold px-[10px] py-[6px] focus:border-black`,
            ]}
            type="text"
            value={kanbanTitle}
            onChange={(e) => setKanbanTitle(e.target.value)}
          />
        </Editor>
      </Switcher>
    </div>
  )
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
