;(function (root, factory) {
  if (typeof define === 'function' && define.amd) {
    define(['react'], factory);
  } else {
    root.ReactAsync = factory(root.React);
  }
})(this, function(React) {

  var __ReactShim = window.__ReactShim = window.__ReactShim || {};

  __ReactShim.React = React;

  __ReactShim.cloneWithProps = React.addons.cloneWithProps;

  __ReactShim.invariant = function(check, msg) {
    if (!check) {
      throw new Error(msg);
    }
  }

  var
require=(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);throw new Error("Cannot find module '"+o+"'")}var f=n[o]={exports:{}};t[o][0].call(f.exports,function(e){var n=t[o][1][e];return s(n?n:e)},f,f.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({"Focm2+":[function(__browserify__,module,exports){
"use strict";

var BaseMixin               = __browserify__('./lib/BaseMixin');
var Preloaded               = __browserify__('./lib/Preloaded');
var getComponentFingerprint = __browserify__('./lib/getComponentFingerprint');

var Mixin = {
  mixins: [BaseMixin],

  getDefaultProps: function() {
    if (window.__reactAsyncStatePacket === undefined) {
      return {};
    }

    var fingerprint = getComponentFingerprint(this);

    if (window.__reactAsyncStatePacket[fingerprint] === undefined) {
      return {};
    }

    var state = window.__reactAsyncStatePacket[fingerprint];
    delete window.__reactAsyncStatePacket[fingerprint];

    if (typeof this.stateFromJSON === 'function') {
      state = this.stateFromJSON(state);
    }

    return {asyncState: state};
  }
};

module.exports = {
  prefetchAsyncState: __browserify__('./lib/prefetchAsyncState'),
  isAsyncComponent: __browserify__('./lib/isAsyncComponent'),
  Mixin: Mixin,
  Preloaded: Preloaded
};

},{"./lib/BaseMixin":3,"./lib/Preloaded":4,"./lib/getComponentFingerprint":5,"./lib/isAsyncComponent":6,"./lib/prefetchAsyncState":7}],"__main__":[function(__browserify__,module,exports){
module.exports=__browserify__('Focm2+');
},{}],3:[function(__browserify__,module,exports){
(function (global){
"use strict";

var invariant         = (typeof window !== "undefined" ? window.__ReactShim.invariant : typeof global !== "undefined" ? global.__ReactShim.invariant : null);
var isAsyncComponent  = __browserify__('./isAsyncComponent');

/**
 * Mixin for asynchronous components.
 *
 * Asynchronous state is fetched via `getInitialStateAsync(cb)` method but also
 * can be injected via `asyncState` prop.
 *
 * In the latter case `getInitialStateAsync` won't be called at all.
 */
var BaseMixin = {

  getInitialState: function() {
    return this.props.asyncState || {};
  },

  componentDidMount: function() {

    invariant(
      isAsyncComponent(this),
      "%s uses ReactAsync.Mixin and should provide getInitialStateAsync(cb) method",
      this.displayName
    );

    if (!this.props.asyncState) {
      this.getInitialStateAsync(this._onStateReady);
    }
  },

  _onStateReady: function(err, state) {
    if (err) {
      throw err;
    }

    if (this.isMounted()) {
      this.setState(state);
    }
  }
};

module.exports = BaseMixin;

}).call(this,typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})
},{"./isAsyncComponent":6}],4:[function(__browserify__,module,exports){
(function (global){
"use strict";

var React               = (typeof window !== "undefined" ? window.__ReactShim.React : typeof global !== "undefined" ? global.__ReactShim.React : null);
var cloneWithProps      = (typeof window !== "undefined" ? window.__ReactShim.cloneWithProps : typeof global !== "undefined" ? global.__ReactShim.cloneWithProps : null);
var ReactUpdates        = __browserify__('react/lib/ReactUpdates');
var emptyFunction       = __browserify__('react/lib/emptyFunction');
var prefetchAsyncState  = __browserify__('./prefetchAsyncState');
var isAsyncComponent    = __browserify__('./isAsyncComponent');

var PreloaderMixin = {

  propTypes: {
    children: React.PropTypes.component.isRequired,
    onAsyncStateFetched: React.PropTypes.func,
    onBeforeUpdate: React.PropTypes.func,
    preloader: React.PropTypes.component,
    alwayUsePreloader: React.PropTypes.bool
  },

  getDefaultProps: function() {
    return {
      onAsyncStateFetched: emptyFunction,
      onBeforeUpdate: emptyFunction,
      onUpdate: emptyFunction
    };
  },

  getInitialState: function() {
    var children = React.Children.only(this.props.children);
    if (this.props.preloader) {
      return {
        rendered: this.props.preloader,
        pending: children
      };
    } else {
      return {
        rendered: children,
        pending: null
      };
    }
  },

  componentWillReceiveProps: function(nextProps) {
    var children = React.Children.only(nextProps.children);
    if (isAsyncComponent(children) &&
        children.type !== this.state.rendered.type) {

      var nextState = {pending: children};

      if (nextProps.preloader && nextProps.alwayUsePreloader) {
        nextState.rendered = nextProps.preloader;
      }

      this.setState(nextState, this.prefetchAsyncState.bind(null, children));

    } else {

      this.setState({
        rendered: children,
        pending: null
      }, this.props.onUpdate);

    }
  },

  componentDidMount: function() {
    if (this.state.pending) {
      this.prefetchAsyncState(this.state.pending);
    }
  },

  /**
   * Get the currently rendered component instance.
   *
   * Do not use it in a real code, this is provided only for testing purposes.
   *
   * @returns {ReactComponent}
   */
  getRendered: function() {
    return this.refs.rendered;
  },

  /**
   * Check if there's update pending.
   *
   * @returns {boolean}
   */
  hasPendingUpdate: function() {
    return this.state.pending !== null;
  },

  /**
   * Prefetch async state for a component and update state.
   *
   * @param {ReactComponent} component
   */
  prefetchAsyncState: function(component) {
    prefetchAsyncState(component, function(err, nextRendered) {
      ReactUpdates.batchedUpdates(function() {
        this.props.onAsyncStateFetched();
        if (this.state.pending === component && this.isMounted()) {
          this.props.onBeforeUpdate();
          this.setState({
            rendered: nextRendered,
            pending: null
          }, this.props.onUpdate);
        }
      }.bind(this));
    }.bind(this));
  }
};

/**
 * Component which wraps another component and prefetches its async state before
 * rendering it.
 */
var Preloaded = React.createClass({

  mixins: [PreloaderMixin],

  render: function() {
    return cloneWithProps(this.state.rendered, {ref: 'rendered'});
  },
});

module.exports = Preloaded;


}).call(this,typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})
},{"./isAsyncComponent":6,"./prefetchAsyncState":7,"react/lib/ReactUpdates":9,"react/lib/emptyFunction":11}],5:[function(__browserify__,module,exports){
"use strict";

/**
 * Get a fingerprint of the component.
 *
 * @param {Object} component
 * @return {String}
 */
function getComponentFingerprint(component) {
  return component._rootNodeID + '__' + component._mountDepth;
}

module.exports = getComponentFingerprint;

},{}],6:[function(__browserify__,module,exports){
"use strict";

/**
 * Check if a component is an async component.
 *
 * @param {ReactComponent} component
 */
function isAsyncComponent(component) {
  return typeof Object.getPrototypeOf(component).getInitialStateAsync === 'function';
}

module.exports = isAsyncComponent;

},{}],7:[function(__browserify__,module,exports){
(function (global){
"use strict";

var invariant         = (typeof window !== "undefined" ? window.__ReactShim.invariant : typeof global !== "undefined" ? global.__ReactShim.invariant : null);
var cloneWithProps    = (typeof window !== "undefined" ? window.__ReactShim.cloneWithProps : typeof global !== "undefined" ? global.__ReactShim.cloneWithProps : null);
var isAsyncComponent  = __browserify__('./isAsyncComponent');

/**
 * Prefetch an async state for an unmounted async component instance.
 *
 * @param {ReactComponent} component
 * @param {Callback} cb
 */
function prefetchAsyncState(component, cb) {

  invariant(
    isAsyncComponent(component),
    "%s should be an async component to be able to prefetch async state, " +
    "but getInitialStateAsync(cb) method is missing or is not a function",
    component.displayName
  );

  var getInitialStateAsync = Object.getPrototypeOf(component).getInitialStateAsync;

  getInitialStateAsync.call(component, function(err, asyncState) {
    if (err) {
      return cb(err);
    }

    cb(null, cloneWithProps(component, {asyncState: asyncState}));
  });
}

module.exports = prefetchAsyncState;

}).call(this,typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})
},{"./isAsyncComponent":6}],8:[function(__browserify__,module,exports){
/**
 * Copyright 2013-2014 Facebook, Inc.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 *
 * @providesModule ReactPerf
 * @typechecks static-only
 */

"use strict";

/**
 * ReactPerf is a general AOP system designed to measure performance. This
 * module only has the hooks: see ReactDefaultPerf for the analysis tool.
 */
var ReactPerf = {
  /**
   * Boolean to enable/disable measurement. Set to false by default to prevent
   * accidental logging and perf loss.
   */
  enableMeasure: false,

  /**
   * Holds onto the measure function in use. By default, don't measure
   * anything, but we'll override this if we inject a measure function.
   */
  storedMeasure: _noMeasure,

  /**
   * Use this to wrap methods you want to measure. Zero overhead in production.
   *
   * @param {string} objName
   * @param {string} fnName
   * @param {function} func
   * @return {function}
   */
  measure: function(objName, fnName, func) {
    if ("production" !== "development") {
      var measuredFunc = null;
      return function() {
        if (ReactPerf.enableMeasure) {
          if (!measuredFunc) {
            measuredFunc = ReactPerf.storedMeasure(objName, fnName, func);
          }
          return measuredFunc.apply(this, arguments);
        }
        return func.apply(this, arguments);
      };
    }
    return func;
  },

  injection: {
    /**
     * @param {function} measure
     */
    injectMeasure: function(measure) {
      ReactPerf.storedMeasure = measure;
    }
  }
};

/**
 * Simply passes through the measured function, without measuring it.
 *
 * @param {string} objName
 * @param {string} fnName
 * @param {function} func
 * @return {function}
 */
function _noMeasure(objName, fnName, func) {
  return func;
}

module.exports = ReactPerf;

},{}],9:[function(__browserify__,module,exports){
/**
 * Copyright 2013-2014 Facebook, Inc.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 *
 * @providesModule ReactUpdates
 */

"use strict";

var ReactPerf = __browserify__("./ReactPerf");

var invariant = __browserify__("./invariant");

var dirtyComponents = [];

var batchingStrategy = null;

function ensureBatchingStrategy() {
  ("production" !== "development" ? invariant(batchingStrategy, 'ReactUpdates: must inject a batching strategy') : invariant(batchingStrategy));
}

function batchedUpdates(callback, param) {
  ensureBatchingStrategy();
  batchingStrategy.batchedUpdates(callback, param);
}

/**
 * Array comparator for ReactComponents by owner depth
 *
 * @param {ReactComponent} c1 first component you're comparing
 * @param {ReactComponent} c2 second component you're comparing
 * @return {number} Return value usable by Array.prototype.sort().
 */
function mountDepthComparator(c1, c2) {
  return c1._mountDepth - c2._mountDepth;
}

function runBatchedUpdates() {
  // Since reconciling a component higher in the owner hierarchy usually (not
  // always -- see shouldComponentUpdate()) will reconcile children, reconcile
  // them before their children by sorting the array.

  dirtyComponents.sort(mountDepthComparator);

  for (var i = 0; i < dirtyComponents.length; i++) {
    // If a component is unmounted before pending changes apply, ignore them
    // TODO: Queue unmounts in the same list to avoid this happening at all
    var component = dirtyComponents[i];
    if (component.isMounted()) {
      // If performUpdateIfNecessary happens to enqueue any new updates, we
      // shouldn't execute the callbacks until the next render happens, so
      // stash the callbacks first
      var callbacks = component._pendingCallbacks;
      component._pendingCallbacks = null;
      component.performUpdateIfNecessary();
      if (callbacks) {
        for (var j = 0; j < callbacks.length; j++) {
          callbacks[j].call(component);
        }
      }
    }
  }
}

function clearDirtyComponents() {
  dirtyComponents.length = 0;
}

var flushBatchedUpdates = ReactPerf.measure(
  'ReactUpdates',
  'flushBatchedUpdates',
  function() {
    // Run these in separate functions so the JIT can optimize
    try {
      runBatchedUpdates();
    } finally {
      clearDirtyComponents();
    }
  }
);

/**
 * Mark a component as needing a rerender, adding an optional callback to a
 * list of functions which will be executed once the rerender occurs.
 */
function enqueueUpdate(component, callback) {
  ("production" !== "development" ? invariant(
    !callback || typeof callback === "function",
    'enqueueUpdate(...): You called `setProps`, `replaceProps`, ' +
    '`setState`, `replaceState`, or `forceUpdate` with a callback that ' +
    'isn\'t callable.'
  ) : invariant(!callback || typeof callback === "function"));
  ensureBatchingStrategy();

  if (!batchingStrategy.isBatchingUpdates) {
    component.performUpdateIfNecessary();
    callback && callback.call(component);
    return;
  }

  dirtyComponents.push(component);

  if (callback) {
    if (component._pendingCallbacks) {
      component._pendingCallbacks.push(callback);
    } else {
      component._pendingCallbacks = [callback];
    }
  }
}

var ReactUpdatesInjection = {
  injectBatchingStrategy: function(_batchingStrategy) {
    ("production" !== "development" ? invariant(
      _batchingStrategy,
      'ReactUpdates: must provide a batching strategy'
    ) : invariant(_batchingStrategy));
    ("production" !== "development" ? invariant(
      typeof _batchingStrategy.batchedUpdates === 'function',
      'ReactUpdates: must provide a batchedUpdates() function'
    ) : invariant(typeof _batchingStrategy.batchedUpdates === 'function'));
    ("production" !== "development" ? invariant(
      typeof _batchingStrategy.isBatchingUpdates === 'boolean',
      'ReactUpdates: must provide an isBatchingUpdates boolean attribute'
    ) : invariant(typeof _batchingStrategy.isBatchingUpdates === 'boolean'));
    batchingStrategy = _batchingStrategy;
  }
};

var ReactUpdates = {
  batchedUpdates: batchedUpdates,
  enqueueUpdate: enqueueUpdate,
  flushBatchedUpdates: flushBatchedUpdates,
  injection: ReactUpdatesInjection
};

module.exports = ReactUpdates;

},{"./ReactPerf":8,"./invariant":12}],10:[function(__browserify__,module,exports){
/**
 * Copyright 2013-2014 Facebook, Inc.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 *
 * @providesModule copyProperties
 */

/**
 * Copy properties from one or more objects (up to 5) into the first object.
 * This is a shallow copy. It mutates the first object and also returns it.
 *
 * NOTE: `arguments` has a very significant performance penalty, which is why
 * we don't support unlimited arguments.
 */
function copyProperties(obj, a, b, c, d, e, f) {
  obj = obj || {};

  if ("production" !== "development") {
    if (f) {
      throw new Error('Too many arguments passed to copyProperties');
    }
  }

  var args = [a, b, c, d, e];
  var ii = 0, v;
  while (args[ii]) {
    v = args[ii++];
    for (var k in v) {
      obj[k] = v[k];
    }

    // IE ignores toString in object iteration.. See:
    // webreflection.blogspot.com/2007/07/quick-fix-internet-explorer-and.html
    if (v.hasOwnProperty && v.hasOwnProperty('toString') &&
        (typeof v.toString != 'undefined') && (obj.toString !== v.toString)) {
      obj.toString = v.toString;
    }
  }

  return obj;
}

module.exports = copyProperties;

},{}],11:[function(__browserify__,module,exports){
/**
 * Copyright 2013-2014 Facebook, Inc.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 *
 * @providesModule emptyFunction
 */

var copyProperties = __browserify__("./copyProperties");

function makeEmptyFunction(arg) {
  return function() {
    return arg;
  };
}

/**
 * This function accepts and discards inputs; it has no side effects. This is
 * primarily useful idiomatically for overridable function endpoints which
 * always need to be callable, since JS lacks a null-call idiom ala Cocoa.
 */
function emptyFunction() {}

copyProperties(emptyFunction, {
  thatReturns: makeEmptyFunction,
  thatReturnsFalse: makeEmptyFunction(false),
  thatReturnsTrue: makeEmptyFunction(true),
  thatReturnsNull: makeEmptyFunction(null),
  thatReturnsThis: function() { return this; },
  thatReturnsArgument: function(arg) { return arg; }
});

module.exports = emptyFunction;

},{"./copyProperties":10}],12:[function(__browserify__,module,exports){
/**
 * Copyright 2013-2014 Facebook, Inc.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 *
 * @providesModule invariant
 */

"use strict";

/**
 * Use invariant() to assert state which your program assumes to be true.
 *
 * Provide sprintf-style format (only %s is supported) and arguments
 * to provide information about what broke and what you were
 * expecting.
 *
 * The invariant message will be stripped in production, but the invariant
 * will remain to ensure logic does not differ in production.
 */

var invariant = function(condition) {
  if (!condition) {
    var error = new Error(
      'Minified exception occured; use the non-minified dev environment for ' +
      'the full error message and additional helpful warnings.'
    );
    error.framesToPop = 1;
    throw error;
  }
};

if ("production" !== "development") {
  invariant = function(condition, format, a, b, c, d, e, f) {
    if (format === undefined) {
      throw new Error('invariant requires an error message argument');
    }

    if (!condition) {
      var args = [a, b, c, d, e, f];
      var argIndex = 0;
      var error = new Error(
        'Invariant Violation: ' +
        format.replace(/%s/g, function() { return args[argIndex++]; })
      );
      error.framesToPop = 1; // we don't care about invariant's own frame
      throw error;
    }
  };
}

module.exports = invariant;

},{}]},{},[])

  return require('__main__');
});
