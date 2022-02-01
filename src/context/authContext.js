import { useEffect, useCallback, useContext, createContext } from 'react'
import { client } from 'lib/api/client'
import { useAsync } from 'lib/hooks'
import { useQueryClient } from 'react-query'
import { useNavigate } from 'react-router-dom'
import { FullPageSpinner } from 'components/shared'

const AuthCtx = createContext()
AuthCtx.displayName = 'AuthContext'

function getUser() {
  return client('auth').then((res) => res.data)
}

const userPromise = getUser()

function AuthProvider(props) {
  const queryClient = useQueryClient()
  const navigateTo = useNavigate()
  const { isIdle, isLoading, isError, data, errors, run, setData } = useAsync()

  useEffect(() => {
    run(userPromise)
  }, [run])

  const login = useCallback(
    (form) =>
      client('users/sign_in', {
        data: {
          user: form,
        },
      }).then((res) => {
        setData(res.data)
      }),
    [setData]
  )
  const logout = useCallback(() => {
    client('users/sign_out', { method: 'DELETE' }).then(() => {
      queryClient.clear()
      setData(null)
      navigateTo('/')
    })
  }, [setData, queryClient, navigateTo])

  const register = useCallback(
    (form) =>
      client('users', {
        data: {
          user: form,
        },
      }).then((res) => setData(res.data)),
    [setData]
  )

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
