import { createContext, useContext, useReducer } from 'react'
import { taskReducer } from '../reducers/taskReducer'

const TaskCtx = createContext()

// const initialState = {
//   lists: {
//     'list-1': {
//       id: 'list-1',
//       title: '待辦事項',
//       todoIds: ['todo-1', 'todo-2', 'todo-4'],
//     },
//   },
//   listOrder: ['list-1'],
//   todos: {
//     'todo-1': {
//       id: 'todo-1',
//       title: 'list 拖拉',
//       status: 'list-1',
//       description: '',
//       isDragging: false,
//     },
//   },
// }
const initialState = {
  lists: {},
  listOrder: [],
  todos: {},
}

export function TaskCtxProvider(props) {
  const [state, dispath] = useReducer(taskReducer, initialState)

  return <TaskCtx.Provider value={[state, dispath]} {...props} />
}

export function useTaskReducer() {
  const context = useContext(TaskCtx)
  if (!context) {
    throw new Error('useTaskReducer must used within TaskCtxProvider')
  }
  return context
}
