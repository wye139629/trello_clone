import tw from 'twin.macro'

import PropTypes from 'prop-types'
import { useState, useRef, useEffect } from 'react'
import {
  ModalDismissBtn,
  Switcher,
  Displayer,
  Editor,
  Spinner,
  Message,
} from '../shared'
import { useMutation, useQueryClient } from 'react-query'
import { client } from 'lib/api/client'
import { useParams } from 'react-router-dom'

TodoInfoPanel.propTypes = {
  todo: PropTypes.object.isRequired,
}

export function TodoInfoPanel({ todo }) {
  const { id, title, listId, listTitle, description } = todo
  const [editingTitle, setEditingTitle] = useState(title)
  const titleRef = useRef(title)
  const queryClient = useQueryClient()
  const { boardId } = useParams()

  useEffect(() => {
    titleRef.current = title
  }, [title])

  const {
    mutate: updateTodoMutate,
    isError,
    isLoading,
    isSuccess,
  } = useMutation(
    (updates) =>
      client(`tasks/${updates.id}`, { method: 'PATCH', data: updates }),
    {
      onMutate: (updates) => {
        const previous = queryClient.getQueryData(['board', boardId])
        const targetList = previous.lists.find(
          (list) => list.id === updates.list_id
        )
        const nextTodos = targetList.todos.map((todo) =>
          todo.id === id ? { ...todo, ...updates } : todo
        )

        queryClient.setQueryData(['board', boardId], (old) => {
          const nextLists = old.lists.map((list) =>
            list.id === updates.list_id
              ? { ...targetList, todos: nextTodos }
              : list
          )
          return { ...old, lists: nextLists }
        })

        return () => {
          queryClient.setQueryData(['board', boardId], previous)
        }
      },
      onError: (err, updates, onMutateRecover) => {
        onMutateRecover()
      },
    }
  )

  const { mutate: deleteTodoMutate } = useMutation(
    (destroy) => client(`tasks/${destroy.id}`, { method: 'DELETE' }),
    {
      onMutate: (destroy) => {
        const previous = queryClient.getQueryData(['board', boardId])
        const targetList = previous.lists.find(
          (list) => list.id === destroy.list_id
        )
        const nextTodos = targetList.todos.filter((todo) => todo.id !== id)

        queryClient.setQueryData(['board', boardId], (old) => {
          const nextLists = old.lists.map((list) =>
            list.id === destroy.list_id
              ? { ...targetList, todos: nextTodos }
              : list
          )

          return { ...old, lists: nextLists }
        })

        return () => {
          queryClient.setQueryData(['board', boardId], previous)
        }
      },
      onError: (err, updates, onMutateRecover) => {
        onMutateRecover()
      },
    }
  )

  function saveDescritpion(e) {
    e.preventDefault()
    const description = e.target.elements['todoDescirption'].value

    updateTodoMutate({ id, description, list_id: listId })
  }

  return (
    <div css={tw`space-y-[30px]`}>
      <div>
        <div css={tw`text-sky-900`}>
          <Switcher>
            <Displayer>
              <h4 css={tw`min-h-[36px] break-words px-[10px] py-[4px] text-lg`}>
                {editingTitle}
              </h4>
            </Displayer>
            <Editor>
              <textarea
                value={editingTitle}
                css={tw`min-h-[36px] resize-none break-words text-lg px-[10px] py-[4px]`}
                onChange={(e) => setEditingTitle(e.target.value)}
                onBlur={(e) => {
                  const { value } = e.target
                  const title = value.trim()
                  if (title === '') {
                    setEditingTitle(titleRef.current)
                  } else {
                    updateTodoMutate({
                      id,
                      title,
                      list_id: listId,
                    })
                  }
                }}
              />
            </Editor>
          </Switcher>
        </div>
        <span css={tw`px-[10px] text-sm text-gray-500`}>
          在「{listTitle}」列表中
        </span>
      </div>
      <div css={tw`md:flex`}>
        <div css={tw`px-[10px] md:w-4/5 space-y-3`}>
          <h4>描述</h4>
          <form onSubmit={saveDescritpion}>
            <textarea
              defaultValue={description}
              name="todoDescirption"
              css={tw`border-sky-600 border-2 rounded resize-none break-words text-sm w-full min-h-[100px] px-[10px] py-[6px] focus:outline-none`}
              placeholder="新增更詳細的描述..."
            ></textarea>
            <div css={tw`flex items-center space-x-[10px]`}>
              <button
                css={[
                  tw`w-[52px] h-[33px] bg-sky-600 text-white rounded px-[12px] py-[6px] text-[14px]`,
                  isLoading && tw`text-black pointer-events-none bg-gray-300 `,
                ]}
              >
                {isLoading ? <Spinner /> : '儲存'}
              </button>
              {isSuccess && <Message message="儲存成功!" type="success" />}
              {isError && (
                <Message message="儲存失敗, 請稍候再試!" type="error" />
              )}
            </div>
          </form>
        </div>
        <div css={tw`p-[10px] md:p-0 md:w-1/6 md:mx-auto space-y-3`}>
          <h4>其他</h4>
          <ModalDismissBtn>
            <button
              css={tw`bg-red-700 text-white text-[14px] min-w-[52px] md:w-full rounded px-[12px] py-[6px]`}
              onClick={() => {
                alert('Are you sure want to delete this todo?')
                deleteTodoMutate({ id, list_id: listId })
              }}
            >
              刪除
            </button>
          </ModalDismissBtn>
        </div>
      </div>
    </div>
  )
}
