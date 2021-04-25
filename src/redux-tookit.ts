import { configureStore, createSlice, PayloadAction, getDefaultMiddleware } from '@reduxjs/toolkit'
import logger from 'redux-logger';
import { v1 as uuid } from "uuid";

import { Todo } from './type';

const todosInitialState: Todo[] = [
  {
    id: uuid(),
    description: "Learn React",
    isComplete: true
  },
  {
    id: uuid(),
    description: "Learn Redux",
    isComplete: true
  },
  {
    id: uuid(),
    description: "Learn Redux-ToolKit",
    isComplete: false
  }
];

const todosSlice = createSlice({
  name: 'todos',
  initialState: todosInitialState,
  reducers: {
    create: {
      reducer: (state, { payload }: PayloadAction<{ id: string; description: string; isComplete: boolean }>) => {
        state.push(payload)
      },
      prepare: ({ description }: { description: string }) => ({
        payload: {
          id: uuid(),
          description,
          isComplete: false
        }
      })
    },
    edit: (state, { payload }: PayloadAction<{ id: string; description: string }>) => {
      const todoToEdit = state.find(todo => todo.id === payload.id)
      if (todoToEdit) {
        todoToEdit.description = payload.description
      }
    },
    toggle: (state, { payload }: PayloadAction<{ id: string; isComplete: boolean }>) => {
      const todoToEdit = state.find(todo => todo.id === payload.id)
      if (todoToEdit) {
        todoToEdit.isComplete = payload.isComplete
      }
    },
    remove: (state, { payload }: PayloadAction<{ id: string }>) => {
      const index = state.findIndex(todo => todo.id === payload.id)
      if (index !== -1) {
        state.splice(index, 1)
      }
    }
  }
})

const selectedTodoSlice = createSlice({
  name: 'selectedTodo',
  initialState: null as string | null,
  reducers: {
    select: (state, { payload }: PayloadAction<{ id: string }>) => payload.id
  }
})

const counterSlice = createSlice({
  name: 'counter',
  initialState: 0,
  reducers: {},
  extraReducers: {
    [todosSlice.actions.create.type]: state => state + 1,
    [todosSlice.actions.edit.type]: state => state + 1,
    [todosSlice.actions.toggle.type]: state => state + 1,
    [todosSlice.actions.remove.type]: state => state + 1,
  }
})

export const {
  create: createTodoActionCreator,
  edit: editTodoActionCreator,
  remove: deleteTodoActionCreator,
  toggle: toggleTodoActionCreator
} = todosSlice.actions

export const {
  select: selectTodoActionCreator
} = selectedTodoSlice.actions

const reducer = {
  todos: todosSlice.reducer,
  selectedTodo: selectedTodoSlice.reducer,
  counter: counterSlice.reducer
}

const middleware = [...getDefaultMiddleware(), logger]

export default configureStore({
  reducer,
  middleware
})