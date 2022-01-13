import tw from 'twin.macro'
import PropTypes from 'prop-types'
import { useState } from 'react'
import { ModalDismissBtn, Switcher, Displayer, Editor } from '../shared'
import { useMutation, useQueryClient } from 'react-query'
import { client } from 'lib/api/client'

TodoInfoPanel.propTypes = {
  todo: PropTypes.object.isRequired,
}

export function TodoInfoPanel({ todo }) {
  const { id, title, listId, description } = todo
  const [editingTitle, setEditingTitle] = useState(title)
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

  const { mutate: deleteTodoMutate } = useMutation(
    (destroy) => client(`tasks/${destroy.id}`, { method: 'DELETE' }),
    {
      onMutate: (destroy) => {
        const previous = queryClient.getQueryData('lists')
        const targetList = previous.find((list) => list.id === destroy.list_id)
        const nextTodos = targetList.todos.filter((todo) => todo.id !== id)

        queryClient.setQueryData('lists', (old) =>
          old.map((list) =>
            list.id === destroy.list_id
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
              <h4 css={tw`break-words px-[10px] py-[4px] text-lg`}>
                {editingTitle}
              </h4>
            </Displayer>
            <Editor>
              <textarea
                defaultValue={title}
                css={tw`resize-none break-words text-lg px-[10px] py-[4px]`}
                onChange={(e) => setEditingTitle(e.target.value)}
                onBlur={(e) =>
                  updateTodoMutate({
                    id,
                    title: e.target.value,
                    list_id: listId,
                  })
                }
              />
            </Editor>
          </Switcher>
        </div>
        <span css={tw`px-[10px] text-sm text-gray-500`}>
          在「{listId}」列表中
        </span>
      </div>
      <div css={tw`flex`}>
        <div css={tw`px-[10px] w-4/5 space-y-3`}>
          <h4>描述</h4>
          <form onSubmit={saveDescritpion}>
            <textarea
              defaultValue={description}
              name="todoDescirption"
              css={tw`border-sky-600 border-2 rounded resize-none break-words text-sm w-full min-h-[100px] px-[10px] py-[6px] focus:outline-none`}
              placeholder="新增更詳細的描述..."
            ></textarea>
            <button
              css={tw`bg-sky-600 text-white rounded px-[12px] py-[6px] text-[14px]`}
            >
              儲存
            </button>
          </form>
        </div>
        <div css={tw`w-1/6 mx-auto space-y-3`}>
          <h4>其他</h4>
          <ModalDismissBtn>
            <button
              css={tw`bg-red-700 text-white text-[14px] w-full rounded px-[12px] py-[6px]`}
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
