import { AuthenticatedApp, UnAuthenticatedApp } from './screens'
import { useAuth } from 'context/authContext'

function App() {
  const { user } = useAuth()
  return user ? <AuthenticatedApp /> : <UnAuthenticatedApp />
}

export default App
