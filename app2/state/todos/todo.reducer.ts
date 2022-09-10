import { createReducer, on } from '@ngrx/store';
import {
  addTodo,
  removeTodo,
  loadTodos,
  loadTodosSuccess,
  loadTodosFailure,
} from './todo.actions';
import { Todo } from '../../todo/todo.model';

// state is just an object with some props
export interface TodoState {
  todos: Todo[];
  error: string;
  status: 'pending' | 'loading' | 'error' | 'success';
}

// the state before any action has been dispatched
export const initialState: TodoState = {
  todos: [],
  error: null,
  status: 'pending',
};

export const todoReducer = createReducer(
  
  // Supply the initial state
  initialState,


  // Whenever the addTodo dispatched:
  // it will take the 'current state' which is the initialState at first time
  // and it will take the 'content' which is the payload which you are going to send when trigger this action
  on(addTodo, (state, { content }) => ({
    ...state, // spread the state,, (take the current state, but overrite this ->)
    todos: [...state.todos, { id: Date.now().toString(), content: content }],
  })),

  // Remove the todo from the todos array
  on(removeTodo, (state, { id }) => ({
    ...state,
    todos: state.todos.filter((todo) => todo.id !== id),
  })),


  // ------------------------------>


  // Trigger loading the todos
  on(loadTodos, (state) => ({ ...state, status: 'loading' })),


  // Handle successfully loaded todos
  on(loadTodosSuccess, (state, { todos }) => ({
    ...state,
    todos: todos,
    error: null,
    status: 'success',
  })),


  // Handle todos load failure
  on(loadTodosFailure, (state, { error }) => ({
    ...state,
    error: error,
    status: 'error',
  }))

);
