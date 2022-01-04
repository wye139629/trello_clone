import tw from 'twin.macro'

import PropTypes from 'prop-types'
import { useDrag, useDrop } from 'react-dnd'
import { getEmptyImage } from 'react-dnd-html5-backend'
import { useEffect, useRef } from 'react'

TodoItem.propTypes = {
  todo: PropTypes.object.isRequired,
  taskDispatch: PropTypes.func.isRequired,
}

export function TodoItem({ todo, taskDispatch }) {
  const todoRef = useRef()
  const [{ handlerId }, drop] = useDrop(
    {
      accept: 'todo',
      collect(monitor) {
        return {
          handlerId: monitor.getHandlerId(),
        }
      },

      hover(item) {
        if (!todoRef.current) return

        const dragId = item.id
        const hoverId = todo.id
        if (dragId === hoverId) return

        if (item.status === todo.status) {
          taskDispatch({
            type: 'DRAG_TODO_TO_SAME_LIST',
            payload: { dragTodo: item, hoverTodo: todo },
          })
        } else {
          taskDispatch({
            type: 'DRAG_TODO_TO_OTHER_LIST',
            payload: { dragTodo: item, hoverTodo: todo },
          })

          item.status = todo.status
        }
      },
    },
    [todo]
  )

  const [{ isDragging }, drag, preview] = useDrag(
    () => ({
      type: 'todo',
      item: () => {
        return { ...todo }
      },
      collect: (monitor) => ({
        isDragging: !!monitor.isDragging(),
      }),
      end(item) {
        taskDispatch({
          type: 'TOGGLE_TODO_DRAGGING',
          payload: { todoId: item.id, isDragging: false },
        })
      },
    }),
    [todo]
  )
  const { title, isDragging: isTodoDragging } = todo

  useEffect(() => {
    preview(getEmptyImage(), { captureDraggingState: true })
  }, [preview])

  useEffect(() => {
    if (!isDragging) return

    taskDispatch({
      type: 'TOGGLE_TODO_DRAGGING',
      payload: { todoId: todo.id, isDragging: true },
    })
  }, [isDragging])

  drag(todoRef)
  drop(todoRef)
  return (
    <div
      ref={todoRef}
      css={[
        tw`px-[8px] py-[6px] text-sm cursor-pointer rounded shadow-md overflow-hidden break-words bg-white hover:bg-white/50`,
        isTodoDragging ? tw`!bg-gray-300 !text-gray-300` : '',
      ]}
      data-handler-id={handlerId}
    >
      {title}
    </div>
  )
}
