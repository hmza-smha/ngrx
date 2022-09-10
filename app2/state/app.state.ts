import { TodoState } from './todos/todo.reducer';

// the app satete which contain all states in the application
export interface AppState {
  todos: TodoState;
}
