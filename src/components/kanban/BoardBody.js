import tw, { css, styled } from 'twin.macro'

import { useLayoutEffect, useRef, useState } from 'react'
import { StatusCard } from './StatusCard'
import { Icon } from 'components/shared'
import { faPlus, faTimes } from 'lib/fontawsome/icons'
import { useClickOutSide } from 'lib/hooks/useClickOutSide'
import { useMutation, useQuery, useQueryClient } from 'react-query'
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
  useClickOutSide(addListFormRef, () => setIsOpen(false))
  const { isLoading } = useQuery({
    queryKey: 'lists',
    queryFn: () =>
      client('lists').then((res) => {
        return res.data
      }),
  })
  const queryClient = useQueryClient()
  const listsCache = queryClient.getQueryData('lists')

  const { mutate } = useMutation(
    (newList) => client('lists', { data: newList }),
    {
      onMutate: (newList) => {
        const optimisticList = { id: uuidv4(), title: newList.title, todos: [] }

        queryClient.setQueryData('lists', (old) => [...old, optimisticList])

        return { optimisticList }
      },
      onSuccess: (result, newList, context) => {
        queryClient.setQueryData('lists', (old) =>
          old.map((list) =>
            list.id === context.optimisticList.id ? result.data : list
          )
        )
      },
      onError: (error, newList, context) => {
        queryClient.setQueryData('lists', (old) =>
          old.filter((list) => list.id !== context.optimisticList.id)
        )
      },
    }
  )

  useLayoutEffect(() => {
    if (!isOpen) return

    const { current: boardContentEl } = boardContentRef
    boardContentEl.scrollLeft = boardContentEl.scrollWidth
  }, [isOpen, listsCache])

  function addNewList(e) {
    e.preventDefault()
    const value = e.target.elements['listTitle'].value
    if (value === '') return

    mutate({ title: value })

    e.target.reset()
  }

  if (isLoading) {
    return <div>loading...</div>
  }

  return (
    <ContentContainer ref={boardContentRef}>
      {listsCache.map((list, idx) => (
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
            tw`w-[270px] text-sm text-sky-900 space-x-[10px] pl-[20px] py-[10px] self-start rounded bg-gray-500/20 hover:bg-gray-500/50 text-left`,
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
