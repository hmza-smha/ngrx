import { createSelector } from '@ngrx/store';
import { AppState } from '../app.state';
import { TodoState } from './todo.reducer';

// this sellector will return a STREAM of the current todos state (when ever it updated, will reflected here automatically)
// so your component will receive the changes immediatly, hence you need async pipe

// the app satete which contain all states in the application
// now from the app state select the state which you're interests in
export const selectTodos = (state: AppState) => state.todos;

// from the state you're interests in select the properity you want to be returned when calling this selector
export const selectAllTodos = createSelector(
  selectTodos,
  (state: TodoState) => state.todos
);
