import tw, { css, styled } from 'twin.macro'

import '@reach/menu-button/styles.css'
import { useState, useLayoutEffect, useEffect, useRef } from 'react'
import { Switcher, Displayer, Editor } from '../shared'
import { AddButton } from './AddButton'
import { Icon } from 'components/shared'
import { faTimes, faEllipsisH } from 'lib/fontawsome/icons'
import { TodoItem } from './TodoItem'
import PropTypes from 'prop-types'
import { useDrag, useDrop } from 'react-dnd'
import { getEmptyImage } from 'react-dnd-html5-backend'
import {
  Menu,
  MenuList as ReachMenuList,
  MenuButton,
  MenuItem as ReachMenuItem,
} from '@reach/menu-button'

const MenuList = tw(ReachMenuList)`w-[300px]`
const MenuItem = tw(ReachMenuItem)`hover:bg-red-500`

const StatusCardWraper = styled.div`
  width: 272px;
  max-height: 100%;
  flex-shrink: 0;
  border-radius: 4px;
  ${({ isDragging }) => isDragging && tw`!bg-black/30`}
`
const CardContainer = styled.div`
  width: 100%;
  max-height: 100%;
  border-radius: 4px;
  background-color: rgba(235, 236, 240);
  ${({ isDragging }) => isDragging && tw`opacity-0`}
`

StatusCard.propTypes = {
  list: PropTypes.object.isRequired,
  todos: PropTypes.object.isRequired,
  taskDispatch: PropTypes.func.isRequired,
}

export function StatusCard({ list, todos, taskDispatch }) {
  const [, drop] = useDrop(
    () => ({
      accept: 'todo',
      hover(item) {
        if (item.status === list.id) return
        if (list.todoIds.length > 0) return

        taskDispatch({
          type: 'DROP_TODO_TO_EMPETY',
          payload: { todo: item, targetListId: list.id },
        })
        item.status = list.id
      },
      collect: (monitor) => {
        return {
          isOver: !!monitor.isOver(),
        }
      },
    }),
    [list]
  )

  const [, listDrop] = useDrop(
    () => ({
      accept: 'list',
      collect(monitor) {
        return {
          handlerId: monitor.getHandlerId(),
        }
      },

      hover(item) {
        if (!cardListRef.current) return

        const dragId = item.list.id
        const hoverId = list.id
        if (dragId === hoverId) return

        taskDispatch({
          type: 'DRAG_LIST',
          payload: { dragList: item.list, hoverList: list },
        })
      },
    }),
    [list]
  )

  const [{ isDragging }, drag, preview] = useDrag(
    () => ({
      type: 'list',
      item: () => {
        return { list: { ...list }, todos: { ...todos } }
      },
      collect: (monitor) => ({
        isDragging: !!monitor.isDragging(),
      }),
    }),
    [list]
  )
  const { id, title: cardTitle, todoIds } = list
  const [isAdding, setIsAdding] = useState(false)
  const textareaRef = useRef()
  const cardListRef = useRef()
  const todosWrapperRef = useRef()

  useEffect(() => {
    preview(getEmptyImage(), { captureDraggingState: true })
  }, [preview])

  useLayoutEffect(() => {
    if (!isAdding) return

    const { current: box } = todosWrapperRef
    box.scrollTop = box.scrollHeight
  }, [todos, isAdding])

  function changeCardTitle() {
    const { editor } = textareaRef.current

    if (editor.value === '') {
      editor.value = cardTitle
      return updateStatusList(cardTitle)
    }

    updateStatusList(editor.value)

    function updateStatusList(value) {
      taskDispatch({ type: 'EDIT_LIST_TITLE', payload: { id, title: value } })
    }
  }

  function addNewTodo(e) {
    e.preventDefault()
    const textareaEl = e.target.elements['todoTitle']
    const { value, style } = textareaEl

    taskDispatch({
      type: 'ADD_TODO',
      payload: {
        listId: id,
        todo: {
          id: `todo-${Date.now()}`,
          title: value,
          status: id,
          description: '',
          isDraging: false,
        },
      },
    })

    style.height = '54px'
    e.target.reset()
  }

  drop(todosWrapperRef)
  drag(cardListRef)
  listDrop(cardListRef)

  return (
    <StatusCardWraper ref={cardListRef} isDragging={isDragging}>
      <CardContainer isDragging={isDragging}>
        <div css={tw`flex items-center px-[8px] space-x-[6px]`}>
          <div css={tw`min-h-[20px] py-[10px] cursor-pointer w-full`}>
            <Switcher>
              <Displayer>
                <h4
                  css={tw`min-h-[20px] text-sm text-sky-900 font-bold px-[8px]break-words`}
                >
                  {cardTitle}
                </h4>
              </Displayer>
              <Editor>
                <textarea
                  name="listTitle"
                  css={[
                    tw`min-h-[28px] text-sm text-sky-900 font-bold  overflow-hidden focus:border-black mt-[-4px] px-[8px] py-[2px]
                  focus:outline-none focus:border-sky-600 focus:border-2 focus:rounded resize-none break-words`,
                  ]}
                  defaultValue={cardTitle}
                  ref={textareaRef}
                  onBlur={changeCardTitle}
                />
              </Editor>
            </Switcher>
          </div>
          <Menu>
            <MenuButton>
              <Icon
                name={faEllipsisH}
                size="xs"
                css={tw`cursor-pointer hover:bg-gray-200 px-[8px] py-[6px] rounded text-gray-500`}
              />
            </MenuButton>
            <MenuList>
              <div css={tw`px-[10px] mb-[10px] relative`}>
                <h4 css={tw`text-center border-b pb-[8px]`}>列表動作</h4>
              </div>
              <MenuItem
                onSelect={() => {
                  alert(`Are you sure you want to remove ${id} and the tasks ?`)
                  taskDispatch({ type: 'REMOVE_LIST', payload: { listId: id } })
                }}
              >
                刪除
              </MenuItem>
            </MenuList>
          </Menu>
        </div>
        <div
          ref={todosWrapperRef}
          css={[
            tw`px-[8px] pb-[8px] space-y-[8px] overflow-y-auto`,
            css`
              max-height: calc(100vh - 204px);
            `,
          ]}
        >
          {todoIds.map((todoId, idx) => (
            <TodoItem
              key={todoId}
              todo={todos[todoId]}
              idx={idx}
              taskDispatch={taskDispatch}
            />
          ))}
          {isAdding ? (
            <form onSubmit={addNewTodo}>
              <div
                css={tw`px-[8px] py-[6px] mb-[8px] bg-white rounded shadow-md`}
              >
                <textarea
                  name="todoTitle"
                  placeholder="為這張卡片輸入標題..."
                  css={tw`min-h-[54px] max-h-[164px] w-full text-sm resize-none break-words focus:outline-none`}
                  onChange={(e) => {
                    if (e.target.scrollHeight > 164) return
                    e.target.style.height = 'auto'
                    e.target.style.height = `${e.target.scrollHeight}px`
                  }}
                  onKeyDown={(e) => {
                    if (e.keyCode === 13) return e.preventDefault()
                  }}
                  autoFocus
                />
              </div>
              <div css={tw`flex items-center space-x-4`}>
                <button
                  css={tw`bg-sky-600 text-white text-sm px-[12px] py-[6px] rounded`}
                  type="submit"
                >
                  新增卡片
                </button>
                <Icon
                  name={faTimes}
                  css={tw`cursor-pointer text-gray-500 text-xl`}
                  onClick={() => setIsAdding(false)}
                />
              </div>
            </form>
          ) : null}
        </div>
        {isAdding ? null : (
          <div css={tw`px-[8px] pb-[8px]`}>
            <AddButton text="新增卡片" onClick={() => setIsAdding(true)} />
          </div>
        )}
      </CardContainer>
    </StatusCardWraper>
  )
}
