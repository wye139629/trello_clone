import tw from 'twin.macro'

import { useState, useEffect } from 'react'
import PropTypes from 'prop-types'

const messageTypes = {
  success: tw`text-green-500`,
  error: tw`text-red-500`,
}

Message.propTypes = {
  message: PropTypes.string.isRequired,
  type: PropTypes.string.isRequired,
}

function Message({ message, type }) {
  const [showMsg, setShowMsg] = useState(true)

  useEffect(() => {
    const id = setTimeout(() => {
      setShowMsg((prev) => !prev)
    }, 3000)
    return () => {
      clearTimeout(id)
    }
  }, [])

  return showMsg ? <div css={messageTypes[type]}>{message}</div> : null
}

export { Message }
