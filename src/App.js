import { AuthenticatedApp } from './screens/AuthenticatedApp'

import { UnAuthenticatedApp } from './screens/UnAuthenticatedApp'
import { useAuth } from 'context/authContext'

function App() {
  const { user } = useAuth()
  return user ? <AuthenticatedApp /> : <UnAuthenticatedApp />
}

export default App
