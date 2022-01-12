import tw from 'twin.macro'

import PropTypes from 'prop-types'
import { useDrag, useDrop } from 'react-dnd'
import { getEmptyImage } from 'react-dnd-html5-backend'
import { useEffect, useRef } from 'react'
import { Modal, ModalContent, ModalOpenBtn } from '../shared'
import { TodoInfoPanel } from './TodoInfoPanel'

TodoItem.propTypes = {
  todo: PropTypes.object.isRequired,
  index: PropTypes.number,
}

export function TodoItem({ todo, index }) {
  const { title, isDragging } = todo
  const todoRef = useRef()
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
      // const dragType =
      //   item.status === todo.status
      //     ? 'DRAG_TODO_TO_SAME_LIST'
      //     : 'DRAG_TODO_TO_OTHER_LIST'

      if (dragId === hoverId) return

      const hoverBoundingRect = todoRef.current?.getBoundingClientRect()
      const hoverMiddleY =
        (hoverBoundingRect.bottom - hoverBoundingRect.top) / 2
      const clientOffset = monitor.getClientOffset()
      const hoverClientY = clientOffset.y - hoverBoundingRect.top

      if (dragIndex < hoverIndex && hoverClientY < hoverMiddleY) return
      if (dragIndex > hoverIndex && hoverClientY > hoverMiddleY) return

      // taskDispatch({
      //   type: dragType,
      //   payload: { dragTodo: item, hoverTodo: todo },
      // })

      item.index = hoverIndex
      item.status = todo.status
    },
  })

  const [{ isDragging: isDragStart }, drag, preview] = useDrag(
    () => ({
      type: 'todo',
      item: () => {
        return { ...todo, index }
      },
      collect: (monitor) => ({
        isDragging: !!monitor.isDragging(),
      }),
      end() {
        // taskDispatch({
        //   type: 'TOGGLE_TODO_DRAGGING',
        //   payload: { todoId: item.id, isDragging: false },
        // })
      },
    }),
    [index, todo]
  )

  useEffect(() => {
    preview(getEmptyImage(), { captureDraggingState: true })
  }, [preview])

  useEffect(() => {
    if (!isDragStart) return

    // taskDispatch({
    //   type: 'TOGGLE_TODO_DRAGGING',
    //   payload: { todoId: todo.id, isDragging: true },
    // })
  }, [isDragStart])

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
