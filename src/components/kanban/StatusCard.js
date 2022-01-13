import tw, { css, styled } from 'twin.macro'
import '@reach/menu-button/styles.css'

import { useState, useLayoutEffect, useEffect, useRef } from 'react'
import { Switcher, Displayer, Editor } from '../shared'
import { AddButton } from './AddButton'
import { Icon } from 'components/shared'
import { faTimes, faEllipsisH } from 'lib/fontawsome/icons'
import { useClickOutSide } from 'lib/hooks/useClickOutSide'
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
import { useMutation, useQueryClient } from 'react-query'
import { client } from 'lib/api/client'
import { v4 as uuidv4 } from 'uuid'

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
  index: PropTypes.number,
}

export function StatusCard({ list, index }) {
  const { id, title: cardTitle, todos } = list
  const [isAdding, setIsAdding] = useState(false)
  const addTodoBtnRef = useRef()
  const textareaRef = useRef()
  const listRef = useRef()
  const todosWrapperRef = useRef()
  const addTodoFormRef = useRef()
  const queryClient = useQueryClient()

  useClickOutSide(addTodoFormRef, () => setIsAdding(false))

  const { mutate } = useMutation(
    (updates) =>
      client(`lists/${updates.id}`, { data: updates, method: 'PATCH' }),
    {
      onMutate: (newList) => {
        const previous = queryClient.getQueryData('lists')

        queryClient.setQueryData('lists', (old) =>
          old.map((oldList) =>
            oldList.id === newList.id ? { ...oldList, ...newList } : oldList
          )
        )
        return () => {
          queryClient.setQueryData('lists', previous)
        }
      },
      onSuccess: (result, newList) => {
        queryClient.setQueryData('lists', (old) =>
          old.map((list) =>
            list.id === newList.id ? { ...list, ...result.data } : list
          )
        )
      },
      onError: (error, data, onMutateRecover) => {
        alert('Sorry something went wrong, please try again later')
        onMutateRecover()
      },
    }
  )

  const { mutate: deleteMutate } = useMutation(
    (destroy) => client(`lists/${destroy.id}`, { method: 'DELETE' }),
    {
      onMutate: (destroy) => {
        const previous = queryClient.getQueryData('lists')

        queryClient.setQueryData('lists', (old) =>
          old.filter((oldList) => oldList.id !== destroy.id)
        )

        return () => {
          queryClient.setQueryData('lists', previous)
        }
      },
      onError: (error, destroy, onMutateRecover) => {
        alert('Sorry something went wrong, please try again later')
        onMutateRecover()
      },
    }
  )

  const { mutate: addTodoMutate } = useMutation(
    (newTodo) => client('tasks', { data: newTodo }),
    {
      onMutate: ({ title, list_id: listId, description }) => {
        const previous = queryClient.getQueryData('lists')

        const optimisticTodo = { title, listId, description, id: uuidv4() }
        const targetList = previous.find((list) => list.id === listId)
        const optimisticList = {
          ...targetList,
          todos: [...targetList.todos, optimisticTodo],
        }

        queryClient.setQueryData('lists', (old) => {
          return old.map((list) => (list.id === listId ? optimisticList : list))
        })

        return {
          onMutateRecover: () => {
            queryClient.setQueryData('lists', previous)
          },
          optimisticList,
          optimisticTodo,
        }
      },
      onSuccess: (result, newTodo, context) => {
        const { optimisticList, optimisticTodo } = context

        queryClient.setQueryData('lists', (old) =>
          old.map((list) =>
            list.id === optimisticList.id
              ? {
                  ...list,
                  todos: list.todos.map((todo) =>
                    todo.id === optimisticTodo.id ? result.data : todo
                  ),
                }
              : list
          )
        )
      },
      onError: (error, destroy, onMutateRecover) => {
        alert('Sorry something went wrong, please try again later')
        onMutateRecover()
      },
    }
  )

  const [, drop] = useDrop(
    () => ({
      accept: 'todo',
      hover(item) {
        if (item.status === list.id) return
        if (list.todos.length > 0) return

        const previous = queryClient.getQueryData('lists')
        const originList = previous.find(
          (oldList) => oldList.id === item.listId
        )

        const nextTodos = originList.todos.filter((todo) => todo.id !== item.id)
        const targetList = previous.find((oldList) => oldList.id === list.id)
        const nextTargetTodos = [
          ...targetList.todos,
          { ...item, listId: targetList.id },
        ]
        const nextOriginList = { ...originList, todos: nextTodos }
        const nextTargetList = { ...targetList, todos: nextTargetTodos }

        queryClient.setQueryData('lists', (old) =>
          old.map((oldList) => {
            if (oldList.id === item.listId) return nextOriginList
            if (oldList.id === list.id) return nextTargetList
            return oldList
          })
        )

        item.listId = targetList.id
      },
    }),
    [todos]
  )

  const [{ handlerId }, listDrop] = useDrop(
    () => ({
      accept: 'list',
      collect(monitor) {
        return {
          handlerId: monitor.getHandlerId(),
        }
      },
      hover(item) {
        if (!listRef.current) return
        const { list: draggingList } = item

        const dragId = draggingList.id
        const hoverId = list.id
        if (dragId === hoverId) return

        const oldLists = queryClient.getQueryData('lists')
        const newList = oldLists.filter((list) => list.id !== dragId)
        newList.splice(index, 0, item.list)

        queryClient.setQueryData('lists', newList)
      },
    }),
    [list, index]
  )

  const [{ isDragging }, drag, preview] = useDrag(
    () => ({
      type: 'list',
      item: () => {
        return { list: { ...list, index }, todos: { ...todos } }
      },
      collect: (monitor) => ({
        isDragging: monitor.isDragging(),
      }),
      end: (item) => {
        const lists = queryClient.getQueryData('lists')
        const targetIndex = lists.findIndex((list) => list.id === item.list.id)
        if (item.list.index === targetIndex) return

        let targetPos
        const previous = lists[targetIndex - 1]
        const next = lists[targetIndex + 1]
        if (previous && next) {
          targetPos = (next.pos - previous.pos) * 0.5 + previous.pos
        }

        if (!previous) {
          targetPos = next ? next.pos * 0.5 : 0
        }

        if (!next) {
          targetPos = previous ? previous.pos + 50000 : 0
        }

        mutate({ id: item.list.id, position: targetPos })
      },
    }),
    [list, todos, index]
  )

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
      mutate({ id, title: value })
    }
  }

  function deleteList() {
    alert(`Are you sure you want to remove ${cardTitle} list and the tasks ?`)
    deleteMutate({ id })
  }

  function addNewTodo(e) {
    e.preventDefault()
    const textareaEl = e.target.elements['todoTitle']
    const { value, style } = textareaEl

    addTodoMutate({ title: value, description: '', list_id: id })

    style.height = '54px'
    e.target.reset()
  }

  drop(todosWrapperRef)
  drag(listRef)
  listDrop(listRef)

  return (
    <StatusCardWraper
      ref={listRef}
      isDragging={isDragging}
      data-handler-id={handlerId}
    >
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
              <MenuItem onSelect={deleteList}>刪除</MenuItem>
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
          {todos.map((todo, idx) => (
            <TodoItem
              key={todo.id}
              index={idx}
              todo={todo}
              // taskDispatch={taskDispatch}
            />
          ))}
          {isAdding ? (
            <form ref={addTodoFormRef} onSubmit={addNewTodo}>
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
                    if (e.keyCode === 13) {
                      e.preventDefault()
                      addTodoBtnRef.current.click()
                    }
                  }}
                  autoFocus
                />
              </div>
              <div css={tw`flex items-center space-x-4`}>
                <button
                  css={tw`bg-sky-600 text-white text-sm px-[12px] py-[6px] rounded`}
                  ref={addTodoBtnRef}
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
