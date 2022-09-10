import { createAction, props } from '@ngrx/store';
import { Todo } from '../../todo/todo.model';

// props same as payload
// [source] Event
export const addTodo = createAction(
  '[Todo Page] Add Todo',
  props<{ content: string }>()
);

export const removeTodo = createAction(
  '[Todo Page] Remove Todo',
  props<{ id: string }>()
);

// ------------------------------>

// responsible for triggering the loading process
export const loadTodos = createAction('[Todo Page] Load Todos');

// these two actions are going to triggered by the effect
export const loadTodosSuccess = createAction(
  '[Todo API] Todo Load Success',
  props<{ todos: Todo[] }>()
);

export const loadTodosFailure = createAction(
  '[Todo API] Todo Load Failure',
  props<{ error: string }>()
);
