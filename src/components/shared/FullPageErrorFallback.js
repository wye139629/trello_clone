import tw from 'twin.macro'
import PropTypes from 'prop-types'

FullPageErrorFallback.propTypes = {
  resetErrorBoundary: PropTypes.func.isRequired,
}

export function FullPageErrorFallback({ resetErrorBoundary }) {
  return (
    <div
      role="alert"
      css={tw`flex justify-center items-center h-screen px-[20px]`}
    >
      <div>
        <p css={tw`text-4xl py-5`}>
          Uh oh... Sorry! There is a problem. Please, try refreshing the app or
          press the button below.
        </p>
        <button onClick={resetErrorBoundary} css={tw`border p-2 rounded-md`}>
          Try again!
        </button>
      </div>
    </div>
  )
}
