import { createContext, useContext, useReducer } from 'react'

const TaskCtx = createContext()

function taskReducer(prevState, action) {
  switch (action.type) {
    case 'ADD_LIST': {
      const listId = action.payload.id

      return {
        ...prevState,
        lists: { ...prevState.lists, [listId]: action.payload },
        listOrder: [...prevState.listOrder, listId],
      }
    }
    case 'EDIT_LIST_TITLE': {
      const { id: listId, title: nextTitle } = action.payload

      return {
        ...prevState,
        lists: {
          ...prevState.lists,
          [listId]: { ...prevState.lists[listId], title: nextTitle },
        },
      }
    }
    case 'REMOVE_LIST': {
      return
    }
    case 'ADD_TODO': {
      const { listId, todo: nextTodo } = action.payload
      const todoId = nextTodo.id

      return {
        ...prevState,
        lists: {
          ...prevState.lists,
          [listId]: {
            ...prevState.lists[listId],
            todoIds: [...prevState.lists[listId].todoIds, todoId],
          },
        },
        todos: { ...prevState.todos, [todoId]: nextTodo },
      }
    }
    case 'EDIT_TODO': {
      return
    }
    case 'REMOVE_TODO': {
      return
    }
    case 'DRAG_LIST': {
      return
    }
    case 'DRAG_TODO': {
      return
    }
    default:
      throw new Error(`Sorry, there is no ${action.type} type in taskReducer`)
  }
}

const initialState = {
  lists: {
    'list-1': {
      id: 'list-1',
      title: '待辦事項',
      todoIds: ['todo-1', 'todo-2', 'todo-4'],
    },
    'list-2': {
      id: 'list-2',
      title: '進行中',
      todoIds: ['todo-3'],
    },
    'list-3': {
      id: 'list-3',
      title: '已完成',
      todoIds: ['todo-5'],
    },
  },
  listOrder: ['list-1', 'list-2', 'list-3'],
  todos: {
    'todo-1': {
      id: 'todo-1',
      title: 'nav切版',
    },
    'todo-2': {
      id: 'todo-2',
      title: '串 api',
    },
    'todo-3': {
      id: 'todo-3',
      title: 'kanban 切版',
    },
    'todo-4': {
      id: 'todo-4',
      title: 'todo 拖拉',
    },
    'todo-5': {
      id: 'todo-5',
      title: 'list 拖拉',
    },
  },
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
