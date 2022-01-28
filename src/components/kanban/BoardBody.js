import tw, { css, styled } from 'twin.macro'

import { useLayoutEffect, useRef, useState } from 'react'
import { StatusCard } from './StatusCard'
import { Icon, Spinner } from 'components/shared'
import { faPlus, faTimes } from 'lib/fontawsome/icons'
import { useClickOutSide } from 'lib/hooks'
import { useMutation, useQuery, useQueryClient } from 'react-query'
import { useParams } from 'react-router-dom'
import { client } from 'lib/api/client'
import { v4 as uuidv4 } from 'uuid'

const ContentContainer = styled.div(() => [
  css`
    height: calc(100vh - 104px);
  `,
  tw`flex p-[10px] items-start space-x-[8px] overflow-x-auto overflow-y-hidden`,
])

export function BoardBody() {
  const [isOpen, setIsOpen] = useState(false)
  const boardContentRef = useRef()
  const addListFormRef = useRef()
  const { boardId } = useParams()
  useClickOutSide(addListFormRef, () => setIsOpen(false))
  const { isLoading, data: boardData } = useQuery({
    queryKey: ['board', boardId],
    queryFn: () => client(`boards/${boardId}`).then((res) => res.data),
  })
  const queryClient = useQueryClient()
  const boardCache = queryClient.getQueryData(['board', boardId])

  const { mutate } = useMutation(
    (newList) => client('lists', { data: newList }),
    {
      onMutate: (newList) => {
        const optimisticList = { id: uuidv4(), title: newList.title, todos: [] }

        queryClient.setQueryData(['board', boardId], (old) => {
          return { ...old, lists: [...old.lists, optimisticList] }
        })

        return { optimisticList }
      },
      onSuccess: (result, newList, context) => {
        queryClient.setQueryData(['board', boardId], (old) => {
          const lists = old.lists.map((list) =>
            list.id === context.optimisticList.id ? result.data : list
          )

          return { ...old, lists }
        })
      },
      onError: (error, newList, context) => {
        queryClient.setQueryData(['board', boardId], (old) => {
          const lists = old.lists.filter(
            (list) => list.id !== context.optimisticList.id
          )

          return { ...old, lists }
        })
      },
    }
  )

  useLayoutEffect(() => {
    if (!isOpen) return

    const { current: boardContentEl } = boardContentRef
    boardContentEl.scrollLeft = boardContentEl.scrollWidth
  }, [isOpen, boardCache])

  function addNewList(e) {
    e.preventDefault()
    const value = e.target.elements['listTitle'].value
    const title = value.trim()
    if (title === '') return

    mutate({ title, board_id: boardId })

    e.target.reset()
  }

  if (isLoading) {
    return <Spinner />
  }

  return (
    <ContentContainer ref={boardContentRef}>
      {boardData.lists.map((list, idx) => (
        <StatusCard key={list.id} list={list} index={idx} />
      ))}
      {isOpen ? (
        <form
          css={[
            css`
              flex-shrink: 0;
            `,
            tw`space-y-[4px] bg-listGray w-[270px] p-[4px] rounded-[4px] self-start`,
          ]}
          ref={addListFormRef}
          onSubmit={addNewList}
        >
          <input
            name="listTitle"
            css={tw`w-full px-[8px] py-[6px] border-sky-600 border-2 rounded-sm text-sm focus:outline-none`}
            type="text"
            placeholder="為列表輸入標題..."
            autoFocus
          />
          <div css={tw`flex items-center space-x-4`}>
            <button
              css={tw`bg-sky-600 text-white text-sm px-[12px] py-[6px] rounded`}
            >
              新增列表
            </button>
            <Icon
              name={faTimes}
              css={tw`cursor-pointer text-gray-500 text-xl`}
              onClick={() => setIsOpen(false)}
            />
          </div>
        </form>
      ) : (
        <button
          css={[
            tw`w-[270px] text-sm text-sky-900 space-x-[10px] pl-[20px] py-[10px] self-start rounded bg-gray-300/50 hover:bg-gray-500/50 text-left`,
            css`
              flex-shrink: 0;
            `,
          ]}
          onClick={() => setIsOpen(true)}
        >
          <Icon name={faPlus} />
          <span>新增其他列表</span>
        </button>
      )}
    </ContentContainer>
  )
}
