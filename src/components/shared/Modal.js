import tw from 'twin.macro'
import '@reach/dialog/styles.css'

import { faTimes } from 'lib/fontawsome/icons'
import { Icon } from './'
import { Dialog as ReachDialog } from '@reach/dialog'
import { callAll } from 'lib/callAll'
import { useState, useContext, createContext, cloneElement } from 'react'
import PropTypes from 'prop-types'

const Dialog = tw(
  ReachDialog
)`relative rounded py-[10px] pr-[45px] pl-[12px] w-4/5 max-w-screen-md`

const ModalCtx = createContext()

function Modal(props) {
  const [isOpen, setIsOpen] = useState(false)
  return <ModalCtx.Provider value={[isOpen, setIsOpen]} {...props} />
}

function ModalDismissBtn({ children: child }) {
  const [, setIsOpen] = useContext(ModalCtx)
  return cloneElement(child, {
    onClick: callAll(() => setIsOpen(false), child.props.onClick),
  })
}

function ModalOpenBtn({ children: child }) {
  const [, setIsOpen] = useContext(ModalCtx)
  return cloneElement(child, {
    onClick: callAll(() => setIsOpen(true), child.props.onClick),
  })
}

function ModalContentsBase(props) {
  const [isOpen, setIsOpen] = useContext(ModalCtx)
  return (
    <Dialog isOpen={isOpen} onDismiss={() => setIsOpen(false)} {...props} />
  )
}

ModalContent.propTypes = {
  children: PropTypes.oneOfType([
    PropTypes.arrayOf(PropTypes.node),
    PropTypes.node,
  ]).isRequired,
}

function ModalContent({ children, ...props }) {
  return (
    <ModalContentsBase {...props}>
      <ModalDismissBtn>
        <button
          css={tw`absolute top-2 right-2 w-[25px] h-[25px] rounded-full text-gray-500 focus:outline-none hover:bg-gray-200`}
        >
          <Icon name={faTimes}></Icon>
        </button>
      </ModalDismissBtn>
      {children}
    </ModalContentsBase>
  )
}

function useModalState() {
  const context = useContext(ModalCtx)

  if (!context) throw new Error(`useModalState must used within Modal Context`)

  return context
}

export { Modal, ModalOpenBtn, ModalDismissBtn, ModalContent, useModalState }
