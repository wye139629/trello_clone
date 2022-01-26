import {
  useState,
  useEffect,
  useCallback,
  useContext,
  createContext,
} from 'react'
import { client } from 'lib/api/client'
import { FullPageSpinner } from 'components/shared'

const AuthCtx = createContext()
AuthCtx.displayName = 'AuthContext'

function AuthProvider(props) {
  const [userData, setUserData] = useState({
    data: null,
    status: 'idle',
    errors: null,
  })

  useEffect(() => {
    setUserData((prev) => ({ ...prev, status: 'pending' }))
    client('auth')
      .then((res) => {
        const { user, boards } = res.data
        setUserData((prev) => ({
          ...prev,
          data: { ...user, boards },
          status: 'resolved',
        }))
      })
      .catch((err) => {
        const { data } = err.response
        setUserData((prev) => ({
          ...prev,
          errors: {
            message: data.error,
          },
          status: 'rejected',
        }))
      })
  }, [])

  const login = useCallback(
    (form) =>
      client('users/sign_in', {
        data: {
          user: form,
        },
      }).then((res) => {
        const { user, boards } = res.data
        setUserData((prev) => ({
          ...prev,
          data: {
            ...user,
            boards,
          },
        }))
      }),
    []
  )

  const logout = useCallback(() => {
    client('users/sign_out', { method: 'DELETE' }).then(() =>
      setUserData((prev) => ({
        ...prev,
        data: null,
      }))
    )
  }, [])

  const register = useCallback(
    (form) =>
      client('users', {
        data: {
          user: form,
        },
      }).then((res) =>
        setUserData((prev) => ({
          ...prev,
          data: res.data.user,
        }))
      ),
    []
  )

  const { data, status, errors } = userData
  const isIdle = status === 'idle'
  const isLoading = status === 'pending'
  const isError = status === 'rejected'
  // const isSuccess = status === 'resolved'

  const value = {
    user: data,
    login,
    logout,
    register,
    errors,
    isError,
  }

  if (isIdle || isLoading) {
    return <FullPageSpinner />
  }

  return <AuthCtx.Provider value={value} {...props} />
}

function useAuth() {
  const context = useContext(AuthCtx)

  if (!context) {
    throw new Error(`useAuth must be used within a AuthProvider`)
  }

  return context
}

export { AuthProvider, useAuth }
