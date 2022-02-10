import { QueryClient, QueryClientProvider } from 'react-query'
import { AuthProvider } from './authContext'
import PropTypes from 'prop-types'
import { BrowserRouter as Router } from 'react-router-dom'

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 10 * 60000,
      refetchOnWindowFocus: false,
    },
  },
})

AppProvider.propTypes = {
  children: PropTypes.oneOfType([
    PropTypes.arrayOf(PropTypes.node),
    PropTypes.node,
  ]).isRequired,
}

function AppProvider({ children }) {
  return (
    <QueryClientProvider client={queryClient}>
      <Router>
        <AuthProvider>{children}</AuthProvider>
      </Router>
    </QueryClientProvider>
  )
}

export { AppProvider }
