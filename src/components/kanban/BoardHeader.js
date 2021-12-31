import tw from 'twin.macro'
import { useRef, useState } from 'react'
import { Switcher, Displayer, Editor } from '../shared'

const Button = tw.button`rounded border-0 bg-transparent py-[6px] px-[10px] cursor-pointer hover:bg-gray-200/50 min-h-[40px]`

export function BoardHeader() {
  const [kanbanTitle, setKanbanTitle] = useState('Trello-clone')
  const titleRef = useRef(kanbanTitle)

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
              tw`text-sky-900 text-xl font-extrabold px-[8px] py-[6px] min-h-[40px] focus:outline-none focus:border-sky-600 focus:border-[2px] focus:rounded`,
            ]}
            type="text"
            value={kanbanTitle}
            onChange={(e) => {
              setKanbanTitle(e.target.value)
            }}
            onBlur={(e) => {
              if (e.target.value === '') {
                setKanbanTitle(titleRef.current)
              }
            }}
          />
        </Editor>
      </Switcher>
    </div>
  )
}
