import { useSafeDispatch } from './useSafeDispatch'
import { useRef, useState, useCallback } from 'react'

const defaultState = {
  data: null,
  status: 'idle',
  errors: null,
}

export function useAsync(initialState = {}) {
  const initialStateRef = useRef({
    ...defaultState,
    ...initialState,
  })
  const [{ data, status, errors }, setState] = useState(initialStateRef.current)

  const safeDispatch = useSafeDispatch(setState)

  const setData = useCallback(
    (data) => {
      safeDispatch((prev) => ({
        ...prev,
        status: 'resolved',
        data,
      }))
    },
    [safeDispatch]
  )

  const setError = useCallback(
    (errors) => {
      safeDispatch((prev) => ({
        ...prev,
        status: 'rejected',
        errors,
      }))
    },
    [safeDispatch]
  )

  const reset = useCallback(() => {
    safeDispatch(initialStateRef.current)
  }, [safeDispatch])

  const run = useCallback(
    (promise) => {
      if (!promise || !promise.then) {
        throw new Error(
          `The argument passed to useAsync().run must be a promise. Maybe a function that's passed isn't returning anything?`
        )
      }

      safeDispatch((prev) => ({ ...prev, status: 'pending' }))
      return promise.then(
        (data) => {
          setData(data)
          return data
        },
        (error) => {
          const { data } = error.response
          setError(data)
          return Promise.reject(data)
        }
      )
    },
    [safeDispatch, setData, setError]
  )

  return {
    data,
    status,
    errors,
    setData,
    setError,
    reset,
    run,
    isIdle: status === 'idle',
    isLoading: status === 'pending',
    isSuccess: status === 'resolved',
    isError: status === 'rejected',
  }
}
