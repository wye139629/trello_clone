import tw from 'twin.macro'

import { WorkSpaceScreen, KanbanScreen } from './'
import { Routes, Route } from 'react-router-dom'
import { ErrorBoundary } from 'react-error-boundary'
import { FullPageErrorFallback } from 'components/shared'
import { useNavigate } from 'react-router-dom'

export function AuthenticatedApp() {
  const navigateTo = useNavigate()

  return (
    <ErrorBoundary
      FallbackComponent={FullPageErrorFallback}
      onReset={() => {
        navigateTo('/')
      }}
    >
      <div css={tw`h-screen`}>
        <Routes>
          <Route path="/" element={<WorkSpaceScreen />} />
          <Route path="/board/:boardId" element={<KanbanScreen />} />
        </Routes>
      </div>
    </ErrorBoundary>
  )
}
