import 'styles/components/shared/Switcher.scss'
import tw from 'twin.macro'

import {
  useState,
  useRef,
  useLayoutEffect,
  createContext,
  useContext,
  cloneElement,
  useImperativeHandle,
} from 'react'
import { callAll } from 'lib/utils/callAll'
import PropTypes from 'prop-types'

Switcher.propTypes = {
  children: PropTypes.arrayOf(PropTypes.element).isRequired,
}

const SwitcherCtx = createContext()

function Switcher({ children, ...props }) {
  const [isEdit, setIsEdit] = useState(false)
  const displayerRef = useRef()
  const editorRef = useRef()

  return (
    <SwitcherCtx.Provider
      value={{
        isEdit,
        setIsEdit,
        editorRef,
        displayerRef,
      }}
      {...props}
    >
      <div css={tw`relative`}>{children}</div>
    </SwitcherCtx.Provider>
  )
}

function Displayer({ children: child }) {
  const { setIsEdit, displayerRef } = useContext(SwitcherCtx)

  useImperativeHandle(child.ref, () => ({
    displayer: displayerRef.current,
  }))

  return cloneElement(child, {
    onClick: callAll(() => setIsEdit(true), child.props.onClick),
    ref: displayerRef,
  })
}

function Editor({ children: child }) {
  const { isEdit, setIsEdit, editorRef, displayerRef } = useContext(SwitcherCtx)

  useLayoutEffect(() => {
    editorRef.current.style.width = `${displayerRef.current.offsetWidth}px`
    editorRef.current.style.height = `${displayerRef.current.offsetHeight}px`
  })

  useLayoutEffect(() => {
    if (!isEdit) return
    editorRef.current.focus()
  }, [isEdit, editorRef])

  useImperativeHandle(child.ref, () => ({
    editor: editorRef.current,
  }))

  return cloneElement(child, {
    className: isEdit ? 'isEdit' : 'hidden',
    onBlur: callAll(() => setIsEdit(false), child.props.onBlur),
    onFocus: callAll((e) => e.target.select(), child.props.onFocus),
    onKeyDown: callAll((e) => {
      if (e.keyCode === 13) {
        return e.target.blur()
      }
    }, child.props.onKeyDown),
    ref: editorRef,
  })
}

export { Switcher, Displayer, Editor }
