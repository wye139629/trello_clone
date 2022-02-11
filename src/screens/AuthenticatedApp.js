import tw from 'twin.macro'

import { lazy, Suspense } from 'react'
import { Routes, Route } from 'react-router-dom'
import { ErrorBoundary } from 'react-error-boundary'
import { FullPageErrorFallback, FullPageSpinner } from 'components/shared'
import { useNavigate } from 'react-router-dom'

const WorkSpaceScreen = lazy(() => import('./WorkSpaceScreen'))
const KanbanScreen = lazy(() => import('./KanbanScreen'))

export default function AuthenticatedApp() {
  const navigateTo = useNavigate()

  return (
    <ErrorBoundary
      FallbackComponent={FullPageErrorFallback}
      onReset={() => {
        navigateTo('/')
      }}
    >
      <div css={tw`h-screen`}>
        <Suspense fallback={<FullPageSpinner />}>
          <Routes>
            <Route path="/" element={<WorkSpaceScreen />} />
            <Route path="/board/:boardId" element={<KanbanScreen />} />
          </Routes>
        </Suspense>
      </div>
    </ErrorBoundary>
  )
}
