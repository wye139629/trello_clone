import { css } from 'twin.macro'
import kanbanBg from '/public/images/kanban-bg.jpg'

import Navbar from 'components/nav/Navbar'
import Kanban from 'components/kanban/Kanban'

const appStyle = css`
  height: 100vh;
  background-image: url(${kanbanBg});
  background-size: cover;
  background-repeat: no-repeat;
`

export function AuthenticatedApp() {
  return (
    <div css={appStyle}>
      <Navbar />
      <Kanban />
    </div>
  )
}
