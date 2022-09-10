# concepts

- ```Actions``` describe unique events that are dispatched from components and services.
- ```State``` changes are handled by pure functions called ```reducers``` that take the current state and the latest action to compute a new state.
- ```Selectors``` are pure functions used to select, derive and compose pieces of state.
- State is accessed with the ```Store```, an observable of state and an observer of actions.


> NgRx Store is mainly for managing global state across an entire application. In cases where you need to manage temporary or local component state, consider using NgRx ComponentStore.

## NgRx Life Cycle
![NgRxLifeCycle](https://user-images.githubusercontent.com/89549639/189070993-2fbab974-150c-4674-936d-b3063305bafb.png)

> Note: All Actions that are dispatched within an application state are always first processed by the Reducers before being handled by the Effects of the application state.

## Actions

Actions are one of the main building blocks in NgRx. Actions express ***unique events*** that happen throughout your application. From user interaction with the page, external interaction through network requests, and direct interaction with device APIs, these and more events are described with actions.

**login-page.actions.ts**

``js
import { createAction, props } from '@ngrx/store';

export const login = createAction(
  '[Login Page] Login',
  props<{ username: string; password: string }>()
);
```
The createAction function returns a function, that when called returns an object in the shape of the Action interface. The props method is used to define any additional metadata needed for the handling of the action. Action creators provide a consistent, type-safe way to construct an action that is being dispatched.

To dispatch this action:

```js
onSubmit(username: string, password: string) {
  store.dispatch(login({ username: username, password: password }));
}
```

The login action creator receives an object of username and password and returns a plain JavaScript object with a type property of [Login Page] Login, with username and password as additional properties.

The returned action has very specific context about where the action came from and what event happened.

    The category of the action is captured within the square brackets [].
    The category is used to group actions for a particular area, whether it be a component page, backend API, or browser API.
    The Login text after the category is a description about what event occurred from this action. In this case, the user clicked a login button from the login page to attempt to authenticate with a username and password.

## Reducers

Reducers in NgRx are responsible for handling transitions from one state to the next state in your application. Reducer functions handle these transitions by determining which actions to handle based on the action's type.
<br>
Reducers are pure functions in that they produce the same output for a given input. They are without side effects and handle each state transition synchronously. Each reducer function takes the latest Action dispatched, the current state, and determines whether to return a newly modified state or the original state

### The reducer function

There are a few consistent parts of every piece of state managed by a reducer.

    An interface or type that defines the shape of the state.
    The arguments including the initial state or current state and the current action.
    The functions that handle state changes for their associated action(s).

**scoreboard-page.actions.ts**
```js
import { createAction, props } from '@ngrx/store';

export const homeScore = createAction('[Scoreboard Page] Home Score');
export const awayScore = createAction('[Scoreboard Page] Away Score');
export const resetScore = createAction('[Scoreboard Page] Score Reset');
export const setScores = createAction('[Scoreboard Page] Set Scores', props<{game: Game}>());
```

**scoreboard.reducer.ts**
```js
import { Action, createReducer, on } from '@ngrx/store';
import * as ScoreboardPageActions from '../actions/scoreboard-page.actions';

export interface State {
  home: number;
  away: number;
}

export const scoreboardReducer = createReducer(
  initialState,
  on(ScoreboardPageActions.homeScore, state => ({ ...state, home: state.home + 1 })),
  on(ScoreboardPageActions.awayScore, state => ({ ...state, away: state.away + 1 })),
  on(ScoreboardPageActions.resetScore, state => ({ home: 0, away: 0 })),
  on(ScoreboardPageActions.setScores, (state, { game }) => ({ home: game.home, away: game.away }))
);

In the example above, the reducer is handling 4 actions: [Scoreboard Page] Home Score, [Scoreboard Page] Away Score, [Scoreboard Page] Score Reset and [Scoreboard Page] Set Scores. Each action is strongly-typed. Each action handles the state transition immutably. This means that the state transitions are not modifying the original state, but are returning a new state object using the spread operator. The spread syntax copies the properties from the current state into the object, creating a new reference. This ensures that a new state is produced with each change, preserving the purity of the change. This also promotes referential integrity, guaranteeing that the old reference was discarded when a state change occurred.
```

The reducer function's responsibility is to handle the state transitions in an **immutable** way. Create a reducer function that handles the actions for managing the state of the scoreboard using the createReducer function.

***When an action is dispatched, all registered reducers receive the action. Whether they handle the action is determined by the on functions that associate one or more actions with a given state change.***

### Registering root state

The state of your application is defined as one large object. Registering reducer functions to manage parts of your state only defines keys with associated values in the object. To register the global Store within your application, use the StoreModule.forRoot() method with a map of key/value pairs that define your state. The StoreModule.forRoot() registers the global providers for your application, including the Store service you inject into your components and services to dispatch actions and select pieces of state.

```js
imports: [
    StoreModule.forRoot({ game: scoreboardReducer })
  ],
```

Registering states with ```StoreModule.forRoot()``` ensures that the states are defined upon application startup. In general, you register root states that always need to be available to all areas of your application immediately.



## Selectors
- Selectors are pure functions used for obtaining slices of store state. 
- @ngrx/store provides a few helper functions for optimizing this selection. 


When using the createSelector and createFeatureSelector functions @ngrx/store keeps track of the latest arguments in which your selector function was invoked. Because selectors are pure functions, the last result can be returned when the arguments match without reinvoking your selector function. This can provide performance benefits, particularly with selectors that perform expensive computation. This practice is known as memoization.


For example, imagine you have a selectedUser object in the state. You also have an allBooks array of book objects.

And you want to show all books for the current user.

You can use createSelector to achieve just that.

```js
import { createSelector } from '@ngrx/store';

export interface User {
  id: number;
  name: string;
}

export interface Book {
  id: number;
  userId: number;
  name: string;
}

export interface AppState {
  selectedUser: User;
  allBooks: Book[];
}

export const selectUser = (state: AppState) => state.selectedUser;
export const selectAllBooks = (state: AppState) => state.allBooks;

export const selectVisibleBooks = createSelector(
  selectUser,
  selectAllBooks,
  (selectedUser: User, allBooks: Book[]) => {
    if (selectedUser && allBooks) {
      return allBooks.filter((book: Book) => book.userId === selectedUser.id);
    } else {
      return allBooks;
    }
  }
);


### Using selectors with props
To select a piece of state based on data that isn't available in the store you can pass props to the selector function. These props gets passed through every selector and the projector function. To do so we must specify these props when we use the selector inside our component.

For example if we have a counter and we want to multiply its value, we can add the multiply factor as a prop:

```js
export const getCount = createSelector(
  getCounterValue,
  (counter, props) => counter * props.multiply
);
```

```js
ngOnInit() {
  this.counter = this.store.select(fromRoot.getCount, { multiply: 2 })
}
```
