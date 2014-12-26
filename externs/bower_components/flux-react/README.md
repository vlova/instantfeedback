flux-react
==========

A React JS flux expansion based on experiences building [www.jsfridge.com](http://www.jsfridge.com) and [www.jflux.io](http://www.jflux.io). Read more about FLUX over at [Facebook Flux](http://facebook.github.io/flux/). I wrote an article about it here: [My experiences building a FLUX application](http://christianalfoni.github.io/javascript/2014/10/27/my-experiences-building-a-flux-application.html) and the background for version 2.6.0 and up is here: [An alternative render strategy with FLUX and React JS](http://christianalfoni.github.io/javascript/2014/12/04/flux-and-eventemitter2.html)

- [What is it all about?](#whatisitallabout)
- [How to install](#howtoinstall)
- [API](#api)
	- [flux.debug()](#debug)
	- [flux.createActions()](#actions)
	- [flux.createStore()](#store)
		- [state](#getinitialstate)
		- [actions](#storeactions)
		- [handlers](#handlers)
		- [events](#events)
		- [exports](#exports)
		- [mixins](#mixins)
		- [listener](#listener)
	- [flux.RenderMixin](#rendermixin)
- [Changes](#changes)

## <a name="whatisitallabout">What is it all about?</a>
It can be difficult to get going with React JS and FLUX as there is no complete framework with all the tools you need. This project will help you get going with the FLUX parts and it has a boilerplate with a browserify workflow, [flux-react-boilerplate](https://github.com/christianalfoni/flux-react-boilerplate).

## <a name="howtoinstall">How to install</a>
Download from **releases/** folder of the repo, use `npm install flux-react` or `bower install flux-react`, but I recommend using the boilerplate located here: [flux-react-boilerplate](https://github.com/christianalfoni/flux-react-boilerplate). It has everything set up for you.

## <a name="api">API</a>

### <a name="debug">flux.debug</a>
```javascript
var flux = require('flux-react');
flux.debug();
```
Puts React on the global scope, which triggers the React dev tools in Chrome

### <a name="actions">flux.createActions()</a>
```javascript
var flux = require('flux-react');
var actions = flux.createActions([
	'addTodo',
	'removeTodo'
]);
actions.addTodo(); // Trigger action
actions.removeTodo(0); // Pass any number of arguments
```
Use them inside components or other parts of your architecture. The only way to reach a store is through an action.

### <a name="store">flux.createStore()</a>
```javascript
var flux = require('flux-react');
var MyStore = flux.createStore({});
```
Creates a store.

#### <a name="getinitialstate">state</a>
```javascript
var flux = require('flux-react');
var MyStore = flux.createStore({
	todos: []
});
```
Add state properties directly to your store.

#### <a name="storeactions">actions</a>
```javascript
var flux = require('flux-react');
var actions = require('./actions.js');
var MyStore = flux.createStore({
	todos: []
	actions: [
		actions.addTodo
	]
});
```
List what actions the store should handle. They will map to handler with the same name.

#### <a name="handlers">handler</a>
```javascript
var flux = require('flux-react');
var actions = require('./actions.js');
var MyStore = flux.createStore({
	todos: []
	actions: [
		actions.addTodo
	],
	addTodo: function (title) {
		this.todos.push({title: title, completed: false});
	}
});
```
Based on the name of the action, add a handler that will run when the action is triggered. Any arguments passed to the action will be available in the handler.

#### <a name="events">events</a>
```javascript
var flux = require('flux-react');
var actions = require('./actions.js');
var MyStore = flux.createStore({
	todos: []
	actions: [
		actions.addTodo
	],
	addTodo: function (title) {
		this.todos.push({title: title, completed: false});
		this.emit('todos.add');
	}
});
```
flux-react uses EventEmitter2 which allows for more granular control of events. Instead of always triggering a change event or/and trigger a specific event you will now always trigger a specifically named event. It is recommended to namespace your events related to the state you are changing. In the current example "todos" is the state name and "add" is what we did to that state. That becomes "todos.add". Look at component to see how you can use this to optimize your rendering.

#### <a name="exports">exports</a>
```javascript
var flux = require('flux-react');
var actions = require('./actions.js');
var MyStore = flux.createStore({
	todos: [],
	actions: [
		actions.addTodo
	],
	addTodo: function (title) {
		this.todos.push({title: title, completed: false});
		this.emit('todos.add');
	},
	exports: {
		getTodos: function () {
			return this.todos
		}
	}
});
```
Methods defined in exports will be returned by **createStore**. Components or other parts of the architecture can use it to get state from the store. The methods are bound to the store, meaning "this.todos" points to the state "todos". 

**Note!** Values returned by an export method will be deep cloned. Meaning that the state of a store is immutable. You can not do changes to a returned value and expect that to be valid inside your store also. You have to trigger an action to change the state of a store.

#### <a name="mixins">mixins</a>
```javascript
var flux = require('flux-react');
var actions = require('./actions.js');

var MyMixin = {
	actions: [
		actions.removeTodo
	],
	removeTodo: function (index) {
		this.state.todos.splice(index, 1);
		this.emit('todos.remove');
	}
};

var MyStore = flux.createStore({
	todos: [],
	mixins: [MyMixin],
	actions: [
		actions.addTodo
	],
	addTodo: function (title) {
		this.todos.push({title: title, completed: false});
		this.emit('todos.add');
	},
	exports: {
		getTodos: function () {
			return this.todos
		}
	}
});
```
Mixins helps you handle big stores. You do not want to divide your stores within one section of your application as they very quickly become dependant on each other. That can result in circular dependency problems. Use mixins instead and create big stores. **state**, **actions**, **handlers** and **exports** will be merged with the main store as expected.

**ProTip!** In big stores it is a good idea to create a StatesMixin that holds all possible state properties in your store. That makes it very easy to look up what states are available to you.

```javascript
var flux = require('flux-react');

var StateMixin = {
	someState: true,
	stateA: 'foo',
	stateB: 'bar',
	stateC: []
};

var MyStore = flux.createStore({
	mixins: [StateMixin, OtherMixin, MoreMixin],
	exports: {
		getSomeState: function () {
			return this.someState;
		}
	}
});
```
#### <a name="listener">listener</a>
```javascript
var React = require('react');
var MyStore = require('./MyStore.js');
var MyComponent = React.createClass({
	componentWillMount: function () {
		MyStore.onAny(this.update); // On any events triggered from the store
		MyStore.on('todos.add', this.update); // When specific event is triggered from the store
		MyStore.on('todos.*', this.update); // When events related to todos are triggered from the store
		MyStore.once('todos.add', this.update); // Trigger only once
		MyStore.many('todos.remove', 5, this.update); // Trigger only 5 times
	},
	componentWillUnmount: function () {
		MyStore.offAny(this.update); // Remove all events listener
		MyStore.off('todos.add', this.update); // Remove any other type of listener
	},
	update: function () {
		this.setState({});
	},
	render: function () {
		return (
			<div>Number of todos: {MyStore.getTodos().length}</div>
		);
	}
});
```
Add and remove listeners to handle updates from the store

#### <a name="rendermixin">RenderMixin</a>
If you want to know more about this feature, read the following article: [An alternative render strategy with FLUX and React JS](http://christianalfoni.github.io/javascript/2014/12/04/flux-and-eventemitter2.html). The main point is that React JS will most likely rerender your whole application on every change event in your stores. You can control this behavior by adding the RenderMixin to your components. Instead of a component automatically rerenders all child components it will only do that if props has been passed to the child and the props actually has changed. The mixin also adds an "update" method to your component which can be called to just update the component without passing any new state. It does not do a **forceUpdate**, but it does a **setState** passing an empty object. This gives a clean API for working with state from stores, as you can see below.

```javascript
var React = require('react');
var flux = require('flux-react');
var MyStore = require('./MyStore.js');
var MyComponent = React.createClass({
	mixins: [flux.RenderMixin],
	componentWillMount: function () {
		MyStore.on('todos.*', this.update);
	},
	componentWillUnmount: function () {
		MyStore.off('todos.*', this.update);
	},
	render: function () {
		return (
			<div>Number of todos: {MyStore.getTodos().length}</div>
		);
	}
});
```
Add and remove listeners to handle updates from the store

## <a name="changes">Changes</a>

**2.6.1**
- Added feature detection on ArrayBuffer, Blob and File. Thanks to @rdjpalmer

**2.6.0**
- Added RenderMixin to give you an alternative optimized render strategy

**2.5.1**
- Added eventemitter2 to package.json

**2.5.0**
- Changed to EventEmitter2 to allow more granular control of changes in store
- Updated documentation with examples
- Old API still works

**2.4.2**
- Store events are now emitted async. This is needed due to the async nature of component rendering

**2.4.1**
- Added ArrayBuffer, Blob and File as "non-clonable" objects

**2.4.0**
- actions now deep clones arguments also, to avoid calling actions with complex objects that are later changed
- Smaller file size. Removed Buffer cloning and browserify paths

**2.3.0**
- Removed special state handling alltogether. Put state directly on the store. This keeps consistency when working with state from handlers and exports. 

**2.2.0**
- Removed **getInitialState()** from store and just use **state**. There is not reason to calculate state with a function as there are no props, or anything else, passed to the store on instanciation


License
-------

flux-react is licensed under the [MIT license](LICENSE).

> The MIT License (MIT)
>
> Copyright (c) 2014 Brandon Tilley
>
> Permission is hereby granted, free of charge, to any person obtaining a copy
> of this software and associated documentation files (the "Software"), to deal
> in the Software without restriction, including without limitation the rights
> to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
> copies of the Software, and to permit persons to whom the Software is
> furnished to do so, subject to the following conditions:
>
> The above copyright notice and this permission notice shall be included in
> all copies or substantial portions of the Software.
>
> THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
> IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
> FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
> AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
> LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
> OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
> THE SOFTWARE.
