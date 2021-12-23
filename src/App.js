import kanbanBg from '/public/images/kanban-bg.jpg'
import Navbar from 'components/nav/Navbar'
import Kanban from './components/kanban/Kanban'
import { css } from 'twin.macro'

const appStyle = css`
  height: 100vh;
  background-image: url(${kanbanBg});
  background-size: cover;
  background-repeat: no-repeat;
`

function App() {
  return (
    <div css={appStyle}>
      <Navbar />
      <Kanban />
    </div>
  )
}

export default App
