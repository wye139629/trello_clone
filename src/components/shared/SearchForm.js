import tw from 'twin.macro'
import Icon from './Icon'
import { faSearch, faTimes } from 'lib/fontawsome/icons'
import { useState } from 'react'

const Button = tw.button`rounded border-0 bg-transparent cursor-pointer text-gray-500 hover:bg-gray-200/60 ml-auto px-[8px]`

export function SearchForm() {
  const [isFocus, setIsFocus] = useState(false)
  const [searchValue, setSearchValue] = useState('')

  function onFoucsHandler() {
    setIsFocus(true)
  }

  function onBlurHandler() {
    setIsFocus(false)
  }

  function onChangeHandler(e) {
    setSearchValue(e.target.value)
  }
  return (
    <form>
      <div
        css={[
          tw`bg-white/20 flex items-center rounded px-[10px] py-[4px] hover:bg-white/30 border border-white/30`,
          isFocus && tw`bg-white text-black hover:bg-white`,
        ]}
      >
        <Icon name={faSearch} size="sm" css={isFocus && tw`text-gray-500`} />
        <input
          type="text"
          css={tw`bg-transparent border-0 focus:outline-none placeholder:text-white block px-[6px] w-full h-[22px]`}
          placeholder="搜尋..."
          onFocus={onFoucsHandler}
          onBlur={onBlurHandler}
          onChange={onChangeHandler}
          value={searchValue}
        />
        {isFocus && (
          <Button>
            <Icon name={faTimes} size="sm" />
          </Button>
        )}
      </div>
      <section></section>
    </form>
  )
}
