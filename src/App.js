import { lazy, Suspense } from 'react'
import { useAuth } from 'context/authContext'
import { FullPageSpinner } from 'components/shared'

const AuthenticatedApp = lazy(() =>
  import(/* webpackPrefetch: true */ './screens/AuthenticatedApp')
)
const UnAuthenticatedApp = lazy(() => import('./screens/UnAuthenticatedApp'))

function App() {
  const { user } = useAuth()
  return (
    <Suspense fallback={<FullPageSpinner />}>
      {user ? <AuthenticatedApp /> : <UnAuthenticatedApp />}
    </Suspense>
  )
}

export default App
