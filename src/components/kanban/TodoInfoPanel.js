import tw from 'twin.macro'
import PropTypes from 'prop-types'
import { useState } from 'react'
import { ModalDismissBtn, Switcher, Displayer, Editor } from '../shared'

TodoInfoPanel.propTypes = {
  todo: PropTypes.object.isRequired,
  taskDispatch: PropTypes.func.isRequired,
}

export function TodoInfoPanel({ todo, taskDispatch }) {
  const { id, title, status, description } = todo
  const [editingTitle, setEditingTitle] = useState(title)

  function saveDescritpion(e) {
    e.preventDefault()
    const description = e.target.elements['todoDescirption'].value

    taskDispatch({
      type: 'EDIT_TODO',
      payload: { todo: { ...todo, description } },
    })
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
                onBlur={(e) => {
                  taskDispatch({
                    type: 'EDIT_TODO',
                    payload: { todo: { ...todo, title: e.target.value } },
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
                taskDispatch({
                  type: 'REMOVE_TODO',
                  payload: { todoId: id, listId: status },
                })
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
