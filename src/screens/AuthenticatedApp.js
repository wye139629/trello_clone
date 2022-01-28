import { WorkSpaceScreen } from './WorkSpaceScreen'
import tw from 'twin.macro'

import KanbanScreen from './KanbanScreen'
import { Routes, Route } from 'react-router-dom'

export function AuthenticatedApp() {
  return (
    <div css={tw`h-screen`}>
      <Routes>
        <Route path="/" element={<WorkSpaceScreen />} />
        <Route path="/board/:boardId" element={<KanbanScreen />} />
      </Routes>
    </div>
  )
}
