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
      const { todo } = action.payload
      const todoId = todo.id
      return {
        ...prevState,
        todos: {
          ...prevState.todos,
          [todoId]: {
            ...prevState.todos[todoId],
            ...todo,
          },
        },
      }
    }
    case 'REMOVE_TODO': {
      const { todoId, listId } = action.payload
      const nextList = { ...prevState.lists[listId] }
      const nextTodos = { ...prevState.todos }
      const todoIdx = nextList.todoIds.indexOf(todoId)
      nextList.todoIds.splice(todoIdx, 1)
      delete nextTodos[todoId]

      return {
        ...prevState,
        lists: {
          ...prevState.lists,
          [listId]: nextList,
        },
        todos: {
          ...nextTodos,
        },
      }
    }
    case 'DRAG_LIST': {
      return
    }
    case 'DRAG_TODO_TO_SAME_LIST': {
      const { dragTodo, hoverTodo } = action.payload
      const targetListId = hoverTodo.status
      const prevTargetList = prevState.lists[targetListId]
      const nextTodoIds = [...prevTargetList.todoIds]
      const dragIdx = nextTodoIds.indexOf(dragTodo.id)
      const targetIdx = nextTodoIds.indexOf(hoverTodo.id)
      nextTodoIds.splice(dragIdx, 1)
      nextTodoIds.splice(targetIdx, 0, dragTodo.id)

      return {
        ...prevState,
        lists: {
          ...prevState.lists,
          [targetListId]: {
            ...prevTargetList,
            todoIds: nextTodoIds,
          },
        },
      }
    }
    case 'DRAG_TODO_TO_OTHER_LIST': {
      const { dragTodo, hoverTodo } = action.payload
      const targetListId = hoverTodo.status
      const originListId = dragTodo.status
      const dragIdx = prevState.lists[originListId].todoIds.indexOf(dragTodo.id)
      const targetIdx = prevState.lists[targetListId].todoIds.indexOf(
        hoverTodo.id
      )
      const nextOriginList = { ...prevState.lists[originListId] }
      const nextTargetList = { ...prevState.lists[targetListId] }

      nextOriginList.todoIds.splice(dragIdx, 1)
      nextTargetList.todoIds.splice(targetIdx, 0, dragTodo.id)

      return {
        ...prevState,
        lists: {
          ...prevState.lists,
          [originListId]: nextOriginList,
          [targetListId]: nextTargetList,
        },
        todos: {
          ...prevState.todos,
          [dragTodo.id]: {
            ...prevState.todos[dragTodo.id],
            status: hoverTodo.status,
          },
        },
      }
    }
    case 'DROP_TODO_TO_EMPETY': {
      const dragTodo = action.payload.todo
      const originListId = dragTodo.status
      const targetListId = action.payload.targetListId
      const dragIdx = prevState.lists[originListId].todoIds.indexOf(dragTodo.id)
      const nextOriginList = { ...prevState.lists[originListId] }
      nextOriginList.todoIds.splice(dragIdx, 1)

      return {
        ...prevState,
        lists: {
          ...prevState.lists,
          [originListId]: nextOriginList,
          [targetListId]: {
            ...prevState.lists[targetListId],
            todoIds: [dragTodo.id],
          },
        },
        todos: {
          ...prevState.todos,
          [dragTodo.id]: {
            ...prevState.todos[dragTodo.id],
            status: targetListId,
          },
        },
      }
    }
    case 'TOGGLE_TODO_DRAGGING': {
      const { todoId, isDragging } = action.payload
      const nextTodo = { ...prevState.todos[todoId], isDragging }

      return {
        ...prevState,
        todos: {
          ...prevState.todos,
          [todoId]: nextTodo,
        },
      }
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
      status: 'list-1',
      description: '',
      isDragging: false,
    },
    'todo-2': {
      id: 'todo-2',
      title: '串 api',
      status: 'list-1',
      description: '',
      isDragging: false,
    },
    'todo-3': {
      id: 'todo-3',
      title: 'kanban 切版',
      status: 'list-2',
      description: '',
      isDragging: false,
    },
    'todo-4': {
      id: 'todo-4',
      title: 'todo 拖拉',
      status: 'list-1',
      description: '',
      isDragging: false,
    },
    'todo-5': {
      id: 'todo-5',
      title: 'list 拖拉',
      status: 'list-3',
      description: '',
      isDragging: false,
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
