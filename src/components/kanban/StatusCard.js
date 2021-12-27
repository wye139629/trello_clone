import tw, { styled } from 'twin.macro'

import { useRef } from 'react'
import { Switcher, Displayer, Editor } from '../shared'
import PropTypes from 'prop-types'

const StatusCardWraper = styled.div`
  width: 272px;
  max-height: 100%;
  flex-shrink: 0;
`
const CardContainer = styled.div`
  width: 100%;
  border-radius: 4px;
  background-color: rgba(235, 236, 240);
`

StatusCard.propTypes = {
  id: PropTypes.number.isRequired,
  cardTitle: PropTypes.string.isRequired,
  setStatusLists: PropTypes.func.isRequired,
}

export function StatusCard({ id, cardTitle, setStatusLists }) {
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
                css={[
                  tw`min-h-[28px] text-sm text-sky-900 font-bold  overflow-hidden focus:border-black mt-[-4px] px-[8px] py-[2px]
                  focus:outline-none focus:border-sky-600 focus:border-2 focus:rounded resize-none break-words`,
                ]}
                type="text"
                defaultValue={cardTitle}
                ref={textareaRef}
                onBlur={changeCardTitle}
              />
            </Editor>
          </Switcher>
        </div>
      </CardContainer>
    </StatusCardWraper>
  )
}
