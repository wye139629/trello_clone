import { css } from 'twin.macro'
import { faSpinner } from 'lib/fontawsome/icons'
import { Icon } from './'

const spinnerStyle = css`
  display: block;
  animation: spin 1s linear infinite;

  @keyframes spin {
    0% {
      transform: rotate(0deg);
    }
    100% {
      transform: rotate(360deg);
    }
  }
`

export function Spinner() {
  return <Icon name={faSpinner} css={spinnerStyle} />
}
