import './styles/global.scss'
import React from 'react'
import ReactDOM from 'react-dom'
import App from './App'
import { AppProvider } from 'context/AppProvider'

if (process.env.MOCK_API === 'enabled') {
  const { worker } = require('./mocks/browser')
  worker.start()
}

ReactDOM.render(
  <React.StrictMode>
    <AppProvider>
      <App />
    </AppProvider>
  </React.StrictMode>,
  document.getElementById('root')
)
