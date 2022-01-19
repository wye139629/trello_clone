import { useRef, useLayoutEffect, useCallback } from 'react'

export function useSafeDispatch(setState) {
  const mountedRef = useRef(false)
  useLayoutEffect(() => {
    mountedRef.current = true
    return () => {
      mountedRef.current = false
    }
  })
  return useCallback(
    (...args) => {
      mountedRef.current ? setState(...args) : void 0
    },
    [setState]
  )
}
