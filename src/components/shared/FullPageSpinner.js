import tw from 'twin.macro'
import { Spinner } from './'

export function FullPageSpinner() {
  return (
    <div css={tw`flex h-screen justify-center items-center text-[100px]`}>
      <Spinner />
    </div>
  )
}
