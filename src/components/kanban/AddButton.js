import tw from 'twin.macro'
import { Icon } from 'components/shared'
import { faPlus } from 'lib/fontawsome/icons'
import PropTypes from 'prop-types'

AddButton.propTypes = {
  text: PropTypes.string.isRequired,
}

export function AddButton({ text, ...props }) {
  return (
    <button
      css={[
        tw`w-full text-sm text-left px-[10px] py-[6px] text-gray-500 space-x-[10px] rounded-sm hover:bg-gray-500/20 hover:text-gray-700`,
      ]}
      {...props}
    >
      <Icon name={faPlus} />
      <span>{text}</span>
    </button>
  )
}
