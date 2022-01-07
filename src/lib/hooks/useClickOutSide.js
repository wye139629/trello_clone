import { useEffect } from 'react'

export function useClickOutSide(elRef, callback) {
  useEffect(() => {
    if (!elRef.current) return

    function clickOutSide(e) {
      if (!elRef?.current?.contains(e.target) && callback) {
        callback(e)
      }
    }

    document.addEventListener('click', clickOutSide)
    return () => {
      document.removeEventListener('click', clickOutSide)
    }
  }, [elRef, callback])
}
