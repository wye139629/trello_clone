import tw from 'twin.macro'
import { useRef, useState, useEffect } from 'react'
import { Switcher, Displayer, Editor } from '../shared'
import { useMutation, useQueryClient } from 'react-query'
import { useParams } from 'react-router-dom'
import { client } from 'lib/api/client'

const Button = tw.button`rounded border-0 bg-transparent px-[14px] py-[6px] cursor-pointer hover:bg-gray-200/50 min-h-[40px]`

export function BoardHeader() {
  const { boardId } = useParams()
  const queryClient = useQueryClient()
  const boardsCache = queryClient.getQueryData('boards')

  const [kanbanTitle, setKanbanTitle] = useState(() => {
    const { title } = boardsCache.find((board) => board.id === Number(boardId))
    return title
  })

  const titleRef = useRef(kanbanTitle)

  useEffect(() => {
    const { title } = boardsCache.find((board) => board.id === Number(boardId))
    setKanbanTitle(title)
    titleRef.current = title
  }, [boardId, boardsCache])

  const { mutate: updateBoardTitle } = useMutation(
    (newBoard) =>
      client(`boards/${boardId}`, { data: newBoard, method: 'PATCH' }),
    {
      onSuccess: () => {
        queryClient.invalidateQueries('boards')
      },
      onError: () => {
        queryClient.invalidateQueries('boards')
      },
    }
  )

  return (
    <div css={tw`overflow-auto h-[52px] flex items-center px-[8px]`}>
      <Switcher>
        <Displayer>
          <Button>
            <h4
              css={tw`max-w-[250px] md:max-w-screen-md truncate text-white text-xl font-bold`}
            >
              {kanbanTitle}
            </h4>
          </Button>
        </Displayer>
        <Editor>
          <input
            css={[
              tw`text-sky-900 text-xl font-bold pl-[12px] py-[6px] min-h-[40px] focus:outline-none focus:border-sky-600 focus:border-[2px] focus:rounded`,
            ]}
            type="text"
            value={kanbanTitle}
            onChange={(e) => {
              setKanbanTitle(e.target.value)
            }}
            onBlur={(e) => {
              const { value } = e.target
              const title = value.trim()
              if (title === '') {
                setKanbanTitle(titleRef.current)
              } else {
                updateBoardTitle({ title })
              }
            }}
          />
        </Editor>
      </Switcher>
    </div>
  )
}
