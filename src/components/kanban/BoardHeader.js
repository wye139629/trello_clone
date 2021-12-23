import tw from 'twin.macro'
import { useState } from 'react'
import { Switcher, Displayer, Editor } from '../shared'

const Button = tw.button`rounded border-0 bg-transparent py-[6px] px-[10px] cursor-pointer hover:bg-gray-200/50`

export function BoardHeader() {
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
