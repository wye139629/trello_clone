import tw from 'twin.macro'

import { faUser } from 'lib/fontawsome/icons'
import { Icon } from './'

export function UserIcon() {
  return (
    <div
      css={tw`bg-cyan-500 rounded-full border-0 cursor-pointer w-[32px] h-[32px] flex justify-center items-center`}
    >
      <Icon name={faUser} css={tw`text-lg text-sky-900`} />
    </div>
  )
}
