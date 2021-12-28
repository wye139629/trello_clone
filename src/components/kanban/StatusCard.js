import tw, { styled } from 'twin.macro'

import { useState, useRef } from 'react'
import { Switcher, Displayer, Editor } from '../shared'
import { AddButton } from './AddButton'
import { Icon } from 'components/shared'
import { faTimes } from 'lib/fontawsome/icons'
import PropTypes from 'prop-types'

const StatusCardWraper = styled.div`
  width: 272px;
  max-height: 100%;
  flex-shrink: 0;
`
const CardContainer = styled.div`
  width: 100%;
  max-height: 100%;
  border-radius: 4px;
  background-color: rgba(235, 236, 240);
  position: relative;
`

StatusCard.propTypes = {
  list: PropTypes.object.isRequired,
  setStatusLists: PropTypes.func.isRequired,
}

export function StatusCard({ list, setStatusLists }) {
  const { id, title: cardTitle, todos } = list
  const [isAdding, setIsAdding] = useState(false)
  const textareaRef = useRef()

  function changeCardTitle() {
    const { editor } = textareaRef.current

    if (editor.value === '') {
      editor.value = cardTitle
      updateStatusList(cardTitle)
      return
    }

    updateStatusList(editor.value)

    function updateStatusList(value) {
      setStatusLists((prev) => {
        const nextStatusList = [...prev]
        const onChangingCard = nextStatusList.find((list) => list.id === id)
        onChangingCard.title = value
        return nextStatusList
      })
    }
  }

  function addNewTodo(e) {
    e.preventDefault()
    const textareaEl = e.target.elements['todoTitle']
    const { value, style } = textareaEl

    setStatusLists((prev) => {
      const nextStatusList = [...prev]
      const onChangingCard = nextStatusList.find((list) => list.id === id)
      const nextTodos = [
        ...onChangingCard.todos,
        {
          id: Date.now(),
          title: value,
        },
      ]
      onChangingCard.todos = nextTodos
      return nextStatusList
    })

    style.height = '54px'
    e.target.reset()
  }

  return (
    <StatusCardWraper>
      <CardContainer>
        <div css={tw`min-h-[20px] px-[8px] py-[10px] cursor-pointer`}>
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
        <div
          css={tw`px-[8px] pb-[8px] space-y-[8px] overflow-y-auto max-h-[770px]`}
        >
          {todos.map((item) => (
            <div
              key={item.id}
              css={tw`px-[8px] py-[6px] text-sm cursor-pointer rounded shadow-md overflow-hidden break-words bg-white hover:bg-white/50`}
            >
              {item.title}
            </div>
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
            <AddButton text={'新增卡片'} onClick={() => setIsAdding(true)} />
          </div>
        )}
      </CardContainer>
    </StatusCardWraper>
  )
}