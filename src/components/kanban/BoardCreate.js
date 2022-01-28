import tw from 'twin.macro'

import { colors } from 'lib/data/colors'
import { faCheck } from 'lib/fontawsome/icons'
import { Icon, Spinner, useModalState } from 'components/shared'
import { useState } from 'react'
import { useMutation, useQueryClient } from 'react-query'
import { client } from 'lib/api/client'
import { v4 as uuidv4 } from 'uuid'
import { useNavigate } from 'react-router-dom'
import PropTypes from 'prop-types'

ColorItem.propTypes = {
  title: PropTypes.string.isRequired,
  colorStyle: PropTypes.object,
  isSelected: PropTypes.bool.isRequired,
  onClick: PropTypes.func.isRequired,
}

function ColorItem({ title, colorStyle, isSelected, onClick }) {
  return (
    <li css={[tw`w-[80px] h-[64px] rounded-md`, colorStyle]}>
      <button
        title={title}
        css={[
          tw`block rounded-md w-full h-full hover:bg-black/20 text-white`,
          isSelected && tw`bg-black/20`,
        ]}
        onClick={onClick}
      >
        {isSelected ? <Icon name={faCheck} /> : null}
      </button>
    </li>
  )
}

export function BoardCreate() {
  const [kanbanColor, setKanbanColor] = useState('Red')
  const [kanbanTitle, setKanbanTitle] = useState('')
  const navigateTo = useNavigate()
  const [, setIsOpen] = useModalState()
  const queryClient = useQueryClient()
  const { mutate: createBoard, isLoading } = useMutation(
    (newBoard) => client('boards', { data: { board: newBoard } }),
    {
      onMutate: (newBoard) => {
        const optimisticBoard = { id: uuidv4(), ...newBoard }

        queryClient.setQueryData('boards', (old) => {
          return [...old, optimisticBoard]
        })

        return { optimisticBoard }
      },
      onSuccess: (result, newBoard, context) => {
        queryClient.setQueryData('boards', (old) => {
          return old.map((board) =>
            board.id === context.optimisticBoard.id ? result.data : board
          )
        })
        setIsOpen(false)
        navigateTo(`/board/${result.data.id}`)
      },
      onError: (error, newList, context) => {
        queryClient.setQueryData('boards', (old) => {
          return old.filter((board) => board.id !== context.optimisticBoard.id)
        })
      },
    }
  )
  const isEmpty = kanbanTitle === ''

  function onClickHandler(e) {
    setKanbanColor(e.target.title)
  }

  function onSubmitHandler(e) {
    e.preventDefault()
    const { kanbanTitle } = e.target.elements
    if (kanbanTitle === '') return
    createBoard({ title: kanbanTitle.value, color: kanbanColor })
  }

  return (
    <div css={tw`h-full`}>
      <h4 css={tw`text-center py-[10px] border-b mb-[10px]`}>建立看板</h4>
      <div css={tw`flex flex-col space-y-[25px]`}>
        <div>
          <h5 css={tw`py-[10px]`}>背景</h5>
          <ul css={tw`flex space-x-[10px]`}>
            {colors.map(({ title, color }) => (
              <ColorItem
                key={title}
                title={title}
                colorStyle={color}
                isSelected={title === kanbanColor}
                onClick={onClickHandler}
              />
            ))}
          </ul>
        </div>
        <form onSubmit={onSubmitHandler}>
          <div css={tw`flex flex-col space-y-[10px] mb-[40px]`}>
            <label htmlFor="kanbanTitle">看板名稱 (必填)</label>
            <input
              id="kanbanTitle"
              type="text"
              value={kanbanTitle}
              onChange={(e) => setKanbanTitle(e.target.value)}
              css={tw`border-2 border-rose-600 focus:outline-none focus:border-2 focus:border-sky-500 rounded px-[10px] py-[6px]`}
              autoFocus
            />
          </div>
          <button
            css={[
              tw`rounded py-[8px] bg-sky-700 text-white w-full`,
              isEmpty && tw`pointer-events-none bg-gray-300`,
            ]}
          >
            {isLoading ? <Spinner /> : '建立 '}
          </button>
        </form>
      </div>
    </div>
  )
}
