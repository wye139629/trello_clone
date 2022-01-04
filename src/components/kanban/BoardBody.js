import tw, { css, styled } from 'twin.macro'

import { useState } from 'react'
import { StatusCard } from './StatusCard'
import { Icon } from 'components/shared'
import { faPlus, faTimes } from 'lib/fontawsome/icons'
import { useTaskReducer } from 'context/taskContext'
import { DndProvider } from 'react-dnd'
import { HTML5Backend } from 'react-dnd-html5-backend'
import CustomDragLayer from '../shared/CustomDragLayer'

const ContentContainer = styled.div(() => [
  css`
    height: calc(100% - 52px);
    display: flex;
    padding: 0 10px;
    overflow: auto;
    align-items: start;
  `,
  tw`space-x-[8px]`,
])

export function BoardBody() {
  const [isOpen, setIsOpen] = useState(false)
  const [taskState, taskDispatch] = useTaskReducer()
  const { lists, listOrder, todos } = taskState

  function addNewList(e) {
    e.preventDefault()
    const value = e.target.elements['listTitle'].value
    if (value === '') return

    taskDispatch({
      type: 'ADD_LIST',
      payload: { id: `list-${Date.now()}`, title: value, todoIds: [] },
    })

    e.target.reset()
  }

  return (
    <DndProvider backend={HTML5Backend}>
      <CustomDragLayer />
      <ContentContainer>
        {listOrder.map((listId) => (
          <StatusCard
            key={listId}
            list={lists[listId]}
            todos={todos}
            taskDispatch={taskDispatch}
          />
        ))}
        {isOpen ? (
          <form
            css={[
              css`
                background-color: rgba(235, 236, 240);
                align-self: start;
                width: 270px;
                padding: 4px;
                border-radius: 4px;
                flex-shrink: 0;
              `,
              tw`space-y-[4px]`,
            ]}
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
    </DndProvider>
  )
}
