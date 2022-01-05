import tw from 'twin.macro'

import PropTypes from 'prop-types'
import { useDrag, useDrop } from 'react-dnd'
import { getEmptyImage } from 'react-dnd-html5-backend'
import { useState, useEffect, useRef } from 'react'
import {
  Modal,
  ModalContent,
  ModalOpenBtn,
  ModalDismissBtn,
  Switcher,
  Displayer,
  Editor,
} from '../shared'

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
    <Modal>
      <ModalOpenBtn>
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
      </ModalOpenBtn>
      <ModalContent aria-label="Todo Information form">
        <TodoInfoPanel todo={todo} taskDispatch={taskDispatch} />
      </ModalContent>
    </Modal>
  )
}

TodoInfoPanel.propTypes = {
  todo: PropTypes.object.isRequired,
  taskDispatch: PropTypes.func.isRequired,
}

function TodoInfoPanel({ todo, taskDispatch }) {
  const { id, title, status } = todo
  const [editingTitle, setEditingTitle] = useState(title)

  return (
    <>
      <div>
        <div css={tw`text-sky-900`}>
          <Switcher>
            <Displayer>
              <h4 css={tw`break-words px-[10px] py-[4px]`}>{editingTitle}</h4>
            </Displayer>
            <Editor>
              <textarea
                defaultValue={title}
                css={tw`resize-none break-words px-[10px] py-[4px]`}
                onChange={(e) => setEditingTitle(e.target.value)}
                onBlur={(e) => {
                  taskDispatch({
                    type: 'EDIT_TODO',
                    payload: { todoId: id, title: e.target.value },
                  })
                }}
              />
            </Editor>
          </Switcher>
        </div>
        <span css={tw`px-[10px] text-sm text-gray-500`}>
          在「{status}」列表中
        </span>
      </div>
      <div css={tw`flex`}>
        <div css={tw`px-[10px]`}>
          <h4>描述</h4>
          <form>
            <textarea></textarea>
            <button>儲存</button>
          </form>
        </div>
        <div css={tw`ml-auto`}>
          <h4>其他</h4>
          <ModalDismissBtn>
            <button
              css={tw`text-red-500`}
              onClick={() =>
                taskDispatch({
                  type: 'REMOVE_TODO',
                  payload: { todoId: id, listId: status },
                })
              }
            >
              刪除
            </button>
          </ModalDismissBtn>
        </div>
      </div>
    </>
  )
}
