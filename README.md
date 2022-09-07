# NgRx

[resource](https://blog.logrocket.com/angular-state-management-made-simple-with-ngrx/)

When working on an Angular application, there is no out-of-the-box, quick solution for data persistence. As a result, the experience of developing a very large application that requires a lot of data communication between components can be very stressful.

> it is complex *(based on functional programming)*.
> Working with large-scale applications requires good architecture and organized structure. State management tools such as NgRx can help you maintain a readable codebase as your app scales.

## Managing state in frontend applications

- Unlike backend applications, which use databases for state management, frontend applications need some sort of mechanism for handling data.
- We can consider this frontend database as a large JS object that holds all the data in the program

## What is state?
- State is nothing but the 'current state' of the program.
- the date which is manipulated & refelected by running the program,
  - Fetching data from the database
  - loading 'using loader, spinner'


## Redux pattern & NgRx

NgRx uses the Redux pattern, which is comprised of three main concepts:

    Store, a central store that holds all of the application state
    Action, which describes all the changes in the state of the application
    Reducers, which tie the store and actions together by using the defined action to carry out a state transition, depending on the action


## Scenario
Let’s say, for instance, we have a button in a particular component that, when clicked, changes the value of the page header. We’ll use NgRx to handle that.

First, the component dispatches an action. The action then goes to the reducer. The reducer is a simple method that takes the current state and the action as a parameter and then returns a new state. When the reducer returns the new state, the component then subscribes to a selector to get the new value.

The state is never changed directly. Instead, the reducer always creates a new state. This is known as immutability.

## Building a simple Angular app using NgRx Store


Create a ```store``` directory inside your ```src/app``` directory. This is where all the NgRx features will be added.

Inside the store directory, create a models directory and, inside it, a courseItem.model.ts file. We’ll define our interface for our course list in this file:

```js
export interface CourseItem {
  id: string;
  department: string;
  name: string;
}
```

Next, create an Actions directory inside the store directory. This is where all the NgRx actions will be defined.

Create a course.action.ts file inside the actions directory and add the following:

```js
import { Action } from '@ngrx/store';
import { CourseItem } from '../models/courseItem.model';
export enum CourseActionType {
  ADD_ITEM = '[COURSE] Add Course',
}
export class AddItemAction implements Action {
  readonly type = CourseActionType.ADD_ITEM;
  //add an optional payload
  constructor(public payload: CourseItem) {}
}
export type CourseAction = AddItemAction;
```

We start by importing the NgRx Action from the store and then also import the coureitem interface that we defined. This has a lot of use cases; here, we’ll use it as a simple validation for our actions.

We’ll use the TypeScript enum to define an action that allows us to declare a set of named constants, such as a collection of related numeric or string values.

After doing this, we create an AddItemAction, which implements the NgRx Action. Every NgRx Action has two main properties: a type and an optional payload. The type is usually a read-only string that represents the type of action we’ll be dispatching into the store. Since this is a class, we can accept an optional payload using the class constructor.

Next, we’ll export a CourseAction type, the value of which will be the AddItemAction action.
With this defined, we need to create our reducer to help in transitioning from stateX to stateY.

Let’s create a reducers directory inside the store directory. Inside the reducers directory, create a course.reducer.ts file and add the following:

```js
// import the interface
import { CourseItem } from '../models/courseItem.model';
import { CourseAction, CourseActionType } from '../actions/course.action';
//create a dummy initial state
const initialState: Array<CourseItem> = [
  {
    id: '1',
    department: 'Computer Engineering',
    name: 'C++ Programming',
  },
];
export function courseReducer(
  state: Array<CourseItem> = initialState,
  action: CourseAction
) {
  switch (action.type) {
    case CourseActionType.ADD_ITEM:
      return [...state, action.payload];
    default:
      return state;
  }
}
```

The first thing to do is import the courseItem model, CourseAction action, and CourseActionType action. For now, we’ll create an initial state that will use the CourseItem interface for validation.

We create a reducer function that takes a state and an action as a parameter. The state parameter will be a type of array, the value of which will be the defined initial state we just created. We use the JavaScript statement to check if the action type is defined in our actions file. If it does exist, it returns the state and the action payload. If not, it just returns the state.

Recall that the objective of NgRx or any state management system is to keep all application state in a single store so that it can be assessable from any part of the application. Let’s create a state.model.ts file inside the models directory.

Add the following to the file you just created:

```
import { CourseItem } from './courseItem.model';

export interface State {
  readonly courses: Array<CourseItem>;
}
```

Now we have to register NgRx in our root app.modules.ts file. Import CourseReducer and then register it in the imports array. We’ll also import the Angular FormsModule, which we’ll be using shortly:

import { CourseReducer } from './store/reducers/course.reducer';
import { FormsModule } from '@angular/forms';

After importing the module, register it in the imports array:

```js
imports: [
    FormsModule,
    StoreModule.forRoot({
      course: CourseReducer,
    }),
  ],
```

We can now use NgRx in our components. Let’s start by modifying our root app.component.ts file to the following:

```js
import { Component, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { CourseItem } from './store/models/courseItem.model';
import { AppState } from './store/models/app-state.model';
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent implements OnInit {
  courseItems$: Observable<Array<CourseItem>>;
  constructor(private store: Store<AppState>) {}
  ngOnInit(): void {
    this.courseItems$ = this.store.select((store) => store.course);
  }
}
```

We bring in RxJS Observables, our defined courseItem interface, and our app state. We set courseItems$ to a type of observable, which will be a type of array. We then set the value of courseItems$ to the returned store.

We can now use this in our template. We’ll delete all of our template HTML in app.component.html and convert it to the following:

```html
<h4>Testing NgRx</h4>
<ul>
  <li *ngFor="let course of courseItems$ | async">
    {{course.department}}
  </li>
</ul>
```

We can use async to automatically subscribe to an observable and run our application using the ng serve command. Running the application on the browser will display this:

**Testing NgRx
- Computer Engineering

This is returned because we haven’t called any reducer, so it just returns the state.

### Adding a course
```js
//create the method for adding a new course and then reset the form

 addCourse(form: NgForm) {
    this.store.dispatch(new AddItemAction(form.value));
    form.reset();
}
```
