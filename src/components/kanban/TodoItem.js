import tw from 'twin.macro'

import PropTypes from 'prop-types'

TodoItem.propTypes = {
  todo: PropTypes.object.isRequired,
}

export function TodoItem({ todo }) {
  const { title } = todo

  return (
    <div
      css={tw`px-[8px] py-[6px] text-sm cursor-pointer rounded shadow-md overflow-hidden break-words bg-white hover:bg-white/50`}
    >
      {title}
    </div>
  )
}
