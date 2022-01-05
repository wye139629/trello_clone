import tw, { css } from 'twin.macro'

import { useDragLayer } from 'react-dnd'
import { TodoItem } from '../kanban/TodoItem'

function getItemStyles(initialOffset, currentOffset) {
  if (!initialOffset || !currentOffset) {
    return css`
      display: none;
    `
  }
  let { x, y } = currentOffset
  return css`
    transform: translate(${x}px, ${y}px) rotate(8deg);
  `
}

const CustomDragLayer = () => {
  const { itemType, isDragging, item, initialOffset, currentOffset } =
    useDragLayer((monitor) => ({
      item: monitor.getItem(),
      itemType: monitor.getItemType(),
      initialOffset: monitor.getInitialSourceClientOffset(),
      currentOffset: monitor.getSourceClientOffset(),
      isDragging: monitor.isDragging(),
    }))

  function renderItem() {
    switch (itemType) {
      case 'todo':
        return <TodoItem todo={item} taskDispatch={() => {}} />
      default:
        return null
    }
  }
  if (!isDragging) {
    return null
  }
  return (
    <div
      css={tw`fixed top-0 left-0 z-50 pointer-events-none w-[256px] rotate-12`}
    >
      <div css={getItemStyles(initialOffset, currentOffset)}>
        {renderItem()}
      </div>
    </div>
  )
}
export { CustomDragLayer }
