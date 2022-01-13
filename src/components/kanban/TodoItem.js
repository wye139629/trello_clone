import tw from 'twin.macro'

import PropTypes from 'prop-types'
import { useDrag, useDrop } from 'react-dnd'
import { getEmptyImage } from 'react-dnd-html5-backend'
import { useEffect, useRef } from 'react'
import { Modal, ModalContent, ModalOpenBtn } from '../shared'
import { TodoInfoPanel } from './TodoInfoPanel'
import { useMutation, useQueryClient } from 'react-query'
import { client } from 'lib/api/client'

TodoItem.propTypes = {
  todo: PropTypes.object.isRequired,
  index: PropTypes.number,
}

export function TodoItem({ todo, index }) {
  const { title, id } = todo
  const todoRef = useRef()
  const queryClient = useQueryClient()

  const { mutate: updateTodoMutate } = useMutation(
    (updates) =>
      client(`tasks/${updates.id}`, { method: 'PATCH', data: updates }),
    {
      onMutate: (updates) => {
        const previous = queryClient.getQueryData('lists')
        const targetList = previous.find((list) => list.id === updates.list_id)
        const nextTodos = targetList.todos.map((todo) =>
          todo.id === id ? { ...todo, ...updates } : todo
        )

        queryClient.setQueryData('lists', (old) =>
          old.map((list) =>
            list.id === updates.list_id
              ? { ...targetList, todos: nextTodos }
              : list
          )
        )

        return () => {
          queryClient.setQueryData('lists', previous)
        }
      },
      onError: (err, updates, onMutateRecover) => {
        onMutateRecover()
      },
    }
  )

  const [{ handlerId }, drop] = useDrop({
    accept: 'todo',
    collect(monitor) {
      return {
        handlerId: monitor.getHandlerId(),
      }
    },

    hover(item, monitor) {
      if (!todoRef.current) return

      const dragId = item.id
      const hoverId = todo.id
      const dragIndex = item.index
      const hoverIndex = index
      const isToSameList = item.listId === todo.listId

      if (dragId === hoverId) return

      const hoverBoundingRect = todoRef.current?.getBoundingClientRect()
      const hoverMiddleY =
        (hoverBoundingRect.bottom - hoverBoundingRect.top) / 2
      const clientOffset = monitor.getClientOffset()
      const hoverClientY = clientOffset.y - hoverBoundingRect.top

      if (dragIndex < hoverIndex && hoverClientY < hoverMiddleY) return
      if (dragIndex > hoverIndex && hoverClientY > hoverMiddleY) return

      const previous = queryClient.getQueryData('lists')
      const originList = previous.find((list) => list.id === item.listId)

      if (isToSameList) {
        const nextTodos = originList.todos.filter((todo) => todo.id !== dragId)
        nextTodos.splice(hoverIndex, 0, item)
        const nextList = { ...originList, todos: nextTodos }
        queryClient.setQueryData('lists', (old) =>
          old.map((list) => (list.id === item.listId ? nextList : list))
        )
      } else {
        const nextTodos = originList.todos.filter((todo) => todo.id !== dragId)
        const targetList = previous.find((list) => list.id === todo.listId)
        const nextTargetTodos = [...targetList.todos]
        nextTargetTodos.splice(hoverIndex, 0, {
          ...item,
          listId: targetList.id,
        })
        const nextOriginList = { ...originList, todos: nextTodos }
        const nextTargetList = { ...targetList, todos: nextTargetTodos }

        queryClient.setQueryData('lists', (old) =>
          old.map((list) => {
            if (list.id === item.listId) return nextOriginList
            if (list.id === todo.listId) return nextTargetList
            return list
          })
        )
      }

      item.index = hoverIndex
      item.listId = todo.listId
    },
  })

  const [{ isDragging }, drag, preview] = useDrag(
    () => ({
      type: 'todo',
      item: () => {
        return { ...todo, index }
      },
      collect: (monitor) => ({
        isDragging: !!monitor.isDragging(),
      }),
      isDragging: (monitor) => {
        return todo.id === monitor.getItem().id
      },
      end(item) {
        console.log('mutate')
        const lists = queryClient.getQueryData('lists')
        const targetList = lists.find((list) => list.id === item.listId)
        const targetTodos = targetList.todos
        const targetIndex = targetTodos.findIndex((todo) => todo.id === item.id)
        let targetPos
        const previous = targetTodos[targetIndex - 1]
        const next = targetTodos[targetIndex + 1]

        if (previous && next) {
          targetPos = (next.pos - previous.pos) * 0.5 + previous.pos
        }

        if (!previous) {
          targetPos = next ? next.pos * 0.5 : 0
        }

        if (!next) {
          targetPos = previous ? previous.pos + 50000 : 0
        }

        if (!previous && !next) {
          targetPos = item.pos
        }

        updateTodoMutate({
          id: item.id,
          list_id: item.listId,
          position: targetPos,
        })
      },
    }),
    [todo, index]
  )

  useEffect(() => {
    preview(getEmptyImage(), { captureDraggingState: true })
  }, [preview])

  drag(todoRef)
  drop(todoRef)

  return (
    <Modal>
      <ModalOpenBtn>
        <div
          ref={todoRef}
          css={[
            tw`px-[8px] py-[6px] text-sm cursor-pointer rounded shadow-md overflow-hidden break-words bg-white hover:bg-white/50`,
            isDragging ? tw`!bg-gray-300 !text-gray-300` : '',
          ]}
          data-handler-id={handlerId}
        >
          {title}
        </div>
      </ModalOpenBtn>
      <ModalContent aria-label="Todo Information form">
        <TodoInfoPanel todo={todo} />
      </ModalContent>
    </Modal>
  )
}
