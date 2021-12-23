import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { Switcher, Displayer, Editor } from 'components/shared'

const originalOffsetHeight = Object.getOwnPropertyDescriptor(
  HTMLElement.prototype,
  'offsetHeight'
)
const originalOffsetWidth = Object.getOwnPropertyDescriptor(
  HTMLElement.prototype,
  'offsetWidth'
)

afterAll(() => {
  Object.defineProperty(
    HTMLElement.prototype,
    'offsetHeight',
    originalOffsetHeight
  )
  Object.defineProperty(
    HTMLElement.prototype,
    'offsetWidth',
    originalOffsetWidth
  )
})

test('can be switch between displayer and editor', () => {
  Object.defineProperty(HTMLElement.prototype, 'offsetWidth', {
    configurable: true,
    value: 187,
  })

  Object.defineProperty(HTMLElement.prototype, 'offsetHeight', {
    configurable: true,
    value: 28,
  })
  const value = 'Trello-clone'

  render(
    <Switcher>
      <Displayer>
        <h4>{value}</h4>
      </Displayer>
      <Editor>
        <input type="text" value={value} onChange={() => {}} />
      </Editor>
    </Switcher>
  )

  const displayer = screen.getByRole('heading', { name: /Trello-clone/i })

  userEvent.click(displayer)
  const editor = screen.getByRole('textbox')

  expect(editor).toHaveClass('isEdit')
  expect(editor.style.width).toBe('187px')
  expect(editor.style.height).toBe('28px')

  userEvent.click(document.body)
  expect(editor).toHaveClass('hidden')
})
