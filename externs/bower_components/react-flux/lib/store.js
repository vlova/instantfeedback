var Immutable = require('immutable');
var _merge = require('lodash-node/modern/objects/merge');
var _forEach = require('lodash-node/modern/collections/forEach');
var _isArray = require('lodash-node/modern/objects/isArray');

var Mixin = require('./mixin');

var CHANGE_EVENT = 'change';

var StoreActionHandler = require('./storeActionHandler');

/**
* Flux Store 
* @param {object} dispatcher
* @param {object} storeMixin
* @param {array} handlers
*/
var Store = function(dispatcher, storeMixin, handlers){
	this.state = Immutable.Map({
		_action_states: {}
	});
	this._events = {};//used by store event emitter 
	this._actionHandlers = {};
	this._constantHandlers = {};
	this._dispatcherIndexes = {};
	this._dispatcher = dispatcher;
	
	this._mixin(storeMixin);
	this._setInitialState();
	if( !!handlers ){
		this.setConstantHandlers(handlers);	
	}
	
	!!this.storeDidMount && this.storeDidMount();
}


Store.prototype =  {

	/**
	* @param {object} newState
	*/
	setState: function(newState){
		this.state = this.state.merge(newState);
		this.emit(CHANGE_EVENT);
	},

	/**
	* @param {string} constant
	* @param {object} newState
	*/
	setActionState: function(constant, newState){
		var actionStates = this.state.get('_action_states');
		actionStates[constant] = _merge(actionStates[constant] || {}, newState);
		this.setState({
			'_action_states': actionStates
		});
	},

	/**
	* @param {string} constant
	*/
	resetActionState: function(constant){
		if( typeof this._actionHandlers[constant] == 'undefined' ){
			throw new Error('Store.resetActionState constant handler for [' + constant + '] is not defined');
		}
		this.setActionState(
			constant,
			this._actionHandlers[constant].getInitialState()
		);
	},

	/**
	* @param {string} constant
	* @param {string} key
	*/
	getActionState: function(constant, key){
		if( typeof this._actionHandlers[constant] == 'undefined' ){
			throw new Error('Store.getActionState constant handler for [' + constant + '] is not defined');
		}
		var actionState = this.state.get('_action_states');
		if( typeof actionState[constant] == "undefined" ){
			return undefined;
		}
		if( typeof key == "undefined" ){
			return actionState[constant];
		}
		return actionState[constant][key];
	},

	/**
	* @param {string} propertyName
	* @return {mixed}
	*/
	get: function(propertyName){
		return this.state.get(propertyName);
	},

	/**
	* @param {object} newState
	*/
	replaceState: function(newState){
		this.state = Immutable.Map(newState)
	},
	
	/**
	* @return {object} Store's state
	*/
	toJS: function(){
		return this.state.toJS();
	},

	/**
	* @return {object} Store's state
	*/
	toObject: function(){
		return this.state.toObject();
	},

	/**
	* 
	*/
	toJSON: function(){
		return this.state.toJSON();
	},

	/**
	*
	*/
	isStore: function(){
		return true;
	},

	/**
	* @param {function} callback
	*/
	onChange: function(callback){
		this.on(CHANGE_EVENT, callback);
	},
		
	/**
	* @param {function} callback
	*/
	offChange: function(callback){
		this.off(CHANGE_EVENT, callback);
	},


	/**
	* set extra properties & methods for this Store
	* @param {object} storeMixin
	*/
	_mixin: function(storeMixin){
		_forEach(storeMixin, function(prop, propName){
			if( typeof prop != 'function' ){
				prop = prop.bind(this);
			} 
			this[propName] = prop;
		}.bind(this));
	},

	/**
	* @param {string} constant
	* @param {object} configs
	* @return {FluxStore} self
	*/
	addActionHandler: function(constant, configs){
		this._actionHandlers[constant] = new StoreActionHandler(this, constant, configs);
		return this;
	},

	/**
	* Set constant handlers for this Store
	* @param {array} handlers
	*/
	setConstantHandlers: function(handlers){
		if( !_isArray(handlers) ){
			throw new Error('Store.setConstantHandlers expects first parameter to be an array');
		}
		_forEach(handlers, function(options){
			var constant, handler, waitFor;
			
			constant = options[0];
			if( options.length == 2 ){
				waitFor = null;
				handler = options[1];
			}else{
				waitFor = options[1];
				handler = options[2];
			}

			var waitForIndexes = null;
			if( waitFor ){
				waitForIndexes = waitFor.map(function(store){
					return store.getHandlerIndex(constant);
				});
			}
			
			this._constantHandlers[constant] = handler.bind(this);
			var dispatcherIndex = this._dispatcher.register(constant, this._constantHandlers[constant], waitForIndexes);
			this._dispatcherIndexes[constant] = dispatcherIndex;
		}.bind(this));
	},
	
	/**
	* Get dispatcher idx of this constant callback for this store
	* @param {string} constant
	* @return {number} Index of constant callback
	*/
	getHandlerIndex: function(constant){
		if( typeof this._dispatcherIndexes[constant] == "undefined" ){
			throw new Error('Can not get store handler for constant: ' + constant);
		}
		return this._dispatcherIndexes[constant];
	},

	/**
	* Sets intial state of the Store
	*/
	_setInitialState: function(){
		!!this.getInitialState && this.setState( this.getInitialState() );
	},

	mixin: function(){
		return Mixin(this);
	},

	/**
	*
	* @param {String} evt
	* @param {Function} handler
	* @return  {Function} handler
	*/
	on: function(evt, handler){
		if( typeof this._events[evt] === 'undefined' ) {
			this._events[evt] = [];
		}
    this._events[evt].push(handler);
    return handler;
  },

  /**
	*
	* @param {String} evt
	* @param {Function} handler
	*/
  off: function(evt, handler){
    if( typeof this._events[evt] === 'undefined' ){
      return;
    }
    
    for(var i=0, len = this._events[evt].length; i < len; i++){
    	if( this._events[evt][i] == handler ){
    		this._events[evt].splice(i, 1);
    		break;
    	}
    }
  },

  /**
	*
	* @param {String} evt
	*/
  emit: function(evt){
    if( typeof this._events[evt] == 'undefined' ){
      return;
    }
    var args = Array.prototype.slice.call(arguments, 1);
    _forEach(this._events[evt], function(listner){
    	listner.apply(null, args)
    });
  },

};

module.exports = Store;
