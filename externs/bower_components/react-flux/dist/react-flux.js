!function(t,n){"object"==typeof exports&&"object"==typeof module?module.exports=n(require("promise"),require("immutable")):"function"==typeof define&&define.amd?define(["promise","immutable"],n):"object"==typeof exports?exports.ReactFlux=n(require("promise"),require("immutable")):t.ReactFlux=n(t.promise,t.Immutable)}(this,function(t,n){return function(t){function n(r){if(e[r])return e[r].exports;var i=e[r]={exports:{},id:r,loaded:!1};return t[r].call(i.exports,i,i.exports,n),i.loaded=!0,i.exports}var e={};return n.m=t,n.c=e,n.p="",n(0)}([function(t,n,e){var r=e(1),i=e(2),o=e(3),s=e(4),a=e(5),f=e(6),c=new a;t.exports={configs:f,createActions:function(t){return new i(c,t)},createStore:function(t,n){return new o(c,t,n)},createConstants:function(t,n){return new r(t,n)},dispatch:function(t,n){c.dispatch(t,n)},mixin:s}},function(t,n,e){var r=e(10),i=e(11),o=e(12),s=e(6).constants.get();t.exports=function(t,n){if(!i(t))throw new Error("Constants expects first parameter to be an array of strings");if(n=n||"",!o(n))throw new Error("Constants expects second parameter string");n.length>0&&(n+=s.separator);var e={};return r(t,function(t){if(!o(t))throw new Error("Constants expects first parameter to be an array of strings");e[t]=n+t,e[t+"_"+s.successSuffix]=n+t+s.separator+s.successSuffix,e[t+"_"+s.failSuffix]=n+t+s.separator+s.failSuffix,e[t+"_"+s.afterSuffix]=n+t+s.separator+s.afterSuffix}),e}},function(t,n,e){var r=e(13),i=e(10),o=e(11),s=e(7),a=e(6).constants.get(),f=function(t,n){this._dispatcher=t,this._registerActions(n)};f.prototype=r(f.prototype,{_registerActions:function(t){i(t,function(t,n){if(!o(t))throw new Error("ReactFlux.Actions: Action must be an array {login: [CONSTANT, callback]}");var e=t[0],r=t[1];if("undefined"==typeof r)r=function(){};else if("function"!=typeof r)throw new Error("ReactFlux.Actions: you did not provide a valid callback for action: "+n);this[n]=this._createAction(n,e,r)}.bind(this))},_createAction:function(t,n,e){return function(){this._dispatch(n,null,arguments);try{var t=e.apply(this,arguments);if(t&&"object"==typeof t&&"[object Error]"==Object.prototype.toString.call(t))throw t}catch(r){t=new s(function(t,n){n(r)})}s.resolve(t).then(function(t){this._dispatch(n,"successSuffix",t),this._dispatch(n,"afterSuffix",t)}.bind(this),function(t){this._dispatch(n,"failSuffix",t),this._dispatch(n,"afterSuffix",t)}.bind(this))}.bind(this)},_dispatch:function(t,n,e){n&&(t+=a.separator+a[n]),this._dispatcher.dispatch(t,e)}}),t.exports=f},function(t,n,e){var r=e(8),i=e(13),o=e(10),s=e(11),a=e(4),f="change",c=e(9),u=function(t,n,e){this.state=r.Map({_action_states:{}}),this._events={},this._actionHandlers={},this._constantHandlers={},this._dispatcherIndexes={},this._dispatcher=t,this._mixin(n),this._setInitialState(),e&&this.setConstantHandlers(e),!!this.storeDidMount&&this.storeDidMount()};u.prototype={setState:function(t){this.state=this.state.merge(t),this.emit(f)},setActionState:function(t,n){var e=this.state.get("_action_states");e[t]=i(e[t]||{},n),this.setState({_action_states:e})},resetActionState:function(t){if("undefined"==typeof this._actionHandlers[t])throw new Error("Store.resetActionState constant handler for ["+t+"] is not defined");this.setActionState(t,this._actionHandlers[t].getInitialState())},getActionState:function(t,n){if("undefined"==typeof this._actionHandlers[t])throw new Error("Store.getActionState constant handler for ["+t+"] is not defined");var e=this.state.get("_action_states");return"undefined"==typeof e[t]?void 0:"undefined"==typeof n?e[t]:e[t][n]},get:function(t){return this.state.get(t)},replaceState:function(t){this.state=r.Map(t)},toJS:function(){return this.state.toJS()},toObject:function(){return this.state.toObject()},toJSON:function(){return this.state.toJSON()},isStore:function(){return!0},onChange:function(t){this.on(f,t)},offChange:function(t){this.off(f,t)},_mixin:function(t){o(t,function(t,n){"function"!=typeof t&&(t=t.bind(this)),this[n]=t}.bind(this))},addActionHandler:function(t,n){return this._actionHandlers[t]=new c(this,t,n),this},setConstantHandlers:function(t){if(!s(t))throw new Error("Store.setConstantHandlers expects first parameter to be an array");o(t,function(t){var n,e,r;n=t[0],2==t.length?(r=null,e=t[1]):(r=t[1],e=t[2]);var i=null;r&&(i=r.map(function(t){return t.getHandlerIndex(n)})),this._constantHandlers[n]=e.bind(this);var o=this._dispatcher.register(n,this._constantHandlers[n],i);this._dispatcherIndexes[n]=o}.bind(this))},getHandlerIndex:function(t){if("undefined"==typeof this._dispatcherIndexes[t])throw new Error("Can not get store handler for constant: "+t);return this._dispatcherIndexes[t]},_setInitialState:function(){!!this.getInitialState&&this.setState(this.getInitialState())},mixin:function(){return a(this)},on:function(t,n){return"undefined"==typeof this._events[t]&&(this._events[t]=[]),this._events[t].push(n),n},off:function(t,n){if("undefined"!=typeof this._events[t])for(var e=0,r=this._events[t].length;r>e;e++)if(this._events[t][e]==n){this._events[t].splice(e,1);break}},emit:function(t){if("undefined"!=typeof this._events[t]){var n=Array.prototype.slice.call(arguments,1);o(this._events[t],function(t){t.apply(null,n)})}}},t.exports=u},function(t,n,e){var r=e(10);t.exports=function(){var t=Array.prototype.slice.call(arguments);if(!t.length)throw new Error("Flux.mixin expects a store or a list of stores");return r(t,function(t){var n="undefined"==typeof t||"function"!=typeof t.onChange||"function"!=typeof t.offChange;if(n)throw new Error("Flux.mixin expects a store or an array of stores")}),{componentWillMount:function(){"undefined"==typeof this._react_flux_onChange&&(this._react_flux_onChange=function(){this.isMounted()&&this.setState(this.getStateFromStores())}.bind(this)),this.setState(this.getStateFromStores())},componentDidMount:function(){for(var n=0;n<t.length;n++){if("function"!=typeof t[n].onChange)throw new Error("Mixin expects stores");t[n].onChange(this._react_flux_onChange)}},componentWillUnmount:function(){for(var n=0;n<t.length;n++)t[n].offChange(this._react_flux_onChange)}}}},function(t,n,e){function r(){this._registry={}}var i=e(7),o=e(13),s=e(11),a=e(12),f=e(10);r.prototype=o(r.prototype,{register:function(t,n,e){if(!a(t)||0==t.length)throw new Error("Dispatcher.register: constant must be a string");if(e=e||null,"function"!=typeof n)throw new Error("Dispatcher.register expects second parameter to be a callback");if(null!==e&&!s(e))throw new Error("Dispatcher.register expects third parameter to be null or an array");var r=this._getRegistry(t);return r.callbacks.push(n),r.waitFor.push(e),r.callbacks.length-1},dispatch:function(t,n){var e=this._getRegistry(t);e.dispatchQueue.push({constant:t,payload:n}),this._dispatch(e)},_dispatch:function(t){if(!t.isDispatching&&0!=t.dispatchQueue.length){t.isDispatching=!0;var n=t.dispatchQueue.shift();this._createDispatchPromises(t),f(t.callbacks,function(e,r){var o=function(t,n,e){return function(){i.resolve(t.callbacks[n](e)).then(function(){t.resolves[n](e)},function(){t.rejects[n](new Error("Dispatch callback error"))})}}(t,r,n.payload),s=t.waitFor[r];if(s){var a=this._getPromisesByIndexes(t,s);i.all(a).then(o,o)}else o()}.bind(this)),i.all(t.promises).then(function(){this._onDispatchEnd(t)}.bind(this),function(){this._onDispatchEnd(t)})}},_getRegistry:function(t){return"undefined"==typeof this._registry[t]&&(this._registry[t]={callbacks:[],waitFor:[],promises:[],resolves:[],rejects:[],dispatchQueue:[],isDispatching:!1}),this._registry[t]},_getPromisesByIndexes:function(t,n){return n.map(function(n){return t.promises[n]})},_createDispatchPromises:function(t){t.promises=[],t.resolves=[],t.rejects=[],f(t.callbacks,function(n,e){t.promises[e]=new i(function(n,r){t.resolves[e]=n,t.rejects[e]=r})})},_onDispatchEnd:function(t){t.promises=[],t.resolves=[],t.rejects=[],t.isDispatching=!1,this._dispatch(t)}}),t.exports=r},function(t,n,e){var r=e(12),i="_",o="SUCCESS",s="FAIL",a="AFTER",f={constants:{separator:i,successSuffix:o,failSuffix:s,afterSuffix:a}};t.exports={constants:{setSeparator:function(t){if(!r(t)||!t.length)throw new Error("Constants.separator must be a non empty string");f.constants.separator=t},setSuccessSuffix:function(t){if(!r(t)||!t.length)throw new Error("Constants.successSuffix must be a non empty string");f.constants.successSuffix=t},setFailSuffix:function(t){if(!r(t)||!t.length)throw new Error("Constants.failSuffix must be a non empty string");f.constants.failSuffix=t},setAfterSuffix:function(t){if(!r(t)||!t.length)throw new Error("Constants.afterSuffix must be a non empty string");f.constants.afterSuffix=t},resetToDefaults:function(){f.constants.separator=i,f.constants.successSuffix=o,f.constants.failSuffix=s,f.constants.afterSuffix=a},get:function(){return f.constants}}}},function(n){n.exports=t},function(t){t.exports=n},function(t,n,e){function r(t,n,e){if(!t.isStore())throw new Error("StoreActionHandler expects first parameter to be a store");if(!i(n))throw new Error("StoreActionHandler expects second parameter to be a constant(string)");if("undefined"==typeof e.getInitialState&&(e.getInitialState=function(){return{}}),"function"!=typeof e.getInitialState)throw new Error("StoreActionHandler expects getInitialState to be a function");e=e||{},this.parent=t,this.constant=n,this.getInitialState=e.getInitialState,this.before=e.before||null,this.after=e.after||null,this.success=e.success||null,this.fail=e.fail||null,this.parent.setActionState(this.constant,this.getInitialState());for(var r=[],a=s.length,f=0;a>f;f++){var c=s[f];if(null!=this[c]){if("function"!=typeof this[c])throw new Error('StoreActionHandler expects "'+c+'" to be a function');var n=this.constant;"before"!=c&&(n+=o.separator+o[c+"Suffix"]),r.push([n,this[c].bind(this)])}}t.setConstantHandlers(r)}var i=e(12),o=e(6).constants.get(),s=["before","after","success","fail"];r.prototype={setState:function(t){this.parent.setActionState(this.constant,t)},getState:function(){return this.parent.getActionState(this.constant)}},t.exports=r},function(t,n,e){function r(t,n,e){var r=-1,s=t?t.length:0;if(n=n&&"undefined"==typeof e?n:i(n,e,3),"number"==typeof s)for(;++r<s&&n(t[r],r,t)!==!1;);else o(t,n);return t}var i=e(16),o=e(14);t.exports=r},function(t,n,e){var r=e(17),i="[object Array]",o=Object.prototype,s=o.toString,a=r(a=Array.isArray)&&a,f=a||function(t){return t&&"object"==typeof t&&"number"==typeof t.length&&s.call(t)==i||!1};t.exports=f},function(t){function n(t){return"string"==typeof t||t&&"object"==typeof t&&i.call(t)==e||!1}var e="[object String]",r=Object.prototype,i=r.toString;t.exports=n},function(t,n,e){function r(t){var n=arguments,e=2;if(!a(t))return t;if("number"!=typeof n[2]&&(e=n.length),e>3&&"function"==typeof n[e-2])var r=i(n[--e-1],n[e--],2);else e>2&&"function"==typeof n[e-1]&&(r=n[--e]);for(var u=c(arguments,1,e),p=-1,h=s(),l=s();++p<e;)o(t,u[p],r,h,l);return f(h),f(l),t}var i=e(16),o=e(18),s=e(19),a=e(15),f=e(20),c=e(21);t.exports=r},function(t,n,e){var r=e(16),i=e(22),o=e(23),s=function(t,n,e){var s,a=t,f=a;if(!a)return f;if(!o[typeof a])return f;n=n&&"undefined"==typeof e?n:r(n,e,3);for(var c=-1,u=o[typeof a]&&i(a),p=u?u.length:0;++c<p;)if(s=u[c],n(a[s],s,t)===!1)return f;return f};t.exports=s},function(t,n,e){function r(t){return!(!t||!i[typeof t])}var i=e(23);t.exports=r},function(t,n,e){function r(t,n,e){if("function"!=typeof t)return o;if("undefined"==typeof n||!("prototype"in t))return t;var r=t.__bindData__;if("undefined"==typeof r&&(a.funcNames&&(r=!t.name),r=r||!a.funcDecomp,!r)){var p=u.call(t);a.funcNames||(r=!f.test(p)),r||(r=c.test(p),s(t,r))}if(r===!1||r!==!0&&1&r[1])return t;switch(e){case 1:return function(e){return t.call(n,e)};case 2:return function(e,r){return t.call(n,e,r)};case 3:return function(e,r,i){return t.call(n,e,r,i)};case 4:return function(e,r,i,o){return t.call(n,e,r,i,o)}}return i(t,n)}var i=e(29),o=e(30),s=e(24),a=e(25),f=/^\s*function[ \n\r\t]+\w/,c=/\bthis\b/,u=Function.prototype.toString;t.exports=r},function(t){function n(t){return"function"==typeof t&&i.test(t)}var e=Object.prototype,r=e.toString,i=RegExp("^"+String(r).replace(/[.*+?^${}()|[\]\\]/g,"\\$&").replace(/toString| for [^\]]+/g,".*?")+"$");t.exports=n},function(t,n,e){function r(t,n,e,f,c){(s(n)?i:o)(n,function(n,i){var o,u,p=n,h=t[i];if(n&&((u=s(n))||a(n))){for(var l=f.length;l--;)if(o=f[l]==n){h=c[l];break}if(!o){var d;e&&(p=e(h,n),(d="undefined"!=typeof p)&&(h=p)),d||(h=u?s(h)?h:[]:a(h)?h:{}),f.push(n),c.push(h),d||r(h,n,e,f,c)}}else e&&(p=e(h,n),"undefined"==typeof p&&(p=n)),"undefined"!=typeof p&&(h=p);t[i]=h})}var i=e(10),o=e(14),s=e(11),a=e(28);t.exports=r},function(t,n,e){function r(){return i.pop()||[]}var i=e(26);t.exports=r},function(t,n,e){function r(t){t.length=0,i.length<o&&i.push(t)}var i=e(26),o=e(27);t.exports=r},function(t){function n(t,n,e){n||(n=0),"undefined"==typeof e&&(e=t?t.length:0);for(var r=-1,i=e-n||0,o=Array(0>i?0:i);++r<i;)o[r]=t[n+r];return o}t.exports=n},function(t,n,e){var r=e(17),i=e(15),o=e(31),s=r(s=Object.keys)&&s,a=s?function(t){return i(t)?s(t):[]}:o;t.exports=a},function(t){var n={"boolean":!1,"function":!0,object:!0,number:!1,string:!1,undefined:!1};t.exports=n},function(t,n,e){var r=e(17),i=e(32),o={configurable:!1,enumerable:!1,value:null,writable:!1},s=function(){try{var t={},n=r(n=Object.defineProperty)&&n,e=n(t,t,t)&&n}catch(i){}return e}(),a=s?function(t,n){o.value=n,s(t,"__bindData__",o)}:i;t.exports=a},function(t,n,e){(function(n){var r=e(17),i=/\bthis\b/,o={};o.funcDecomp=!r(n.WinRTError)&&i.test(function(){return this}),o.funcNames="string"==typeof Function.name,t.exports=o}).call(n,function(){return this}())},function(t){var n=[];t.exports=n},function(t){var n=40;t.exports=n},function(t,n,e){var r=e(17),i=e(33),o="[object Object]",s=Object.prototype,a=s.toString,f=r(f=Object.getPrototypeOf)&&f,c=f?function(t){if(!t||a.call(t)!=o)return!1;var n=t.valueOf,e=r(n)&&(e=f(n))&&f(e);return e?t==e||f(t)==e:i(t)}:i;t.exports=c},function(t,n,e){function r(t,n){return arguments.length>2?i(t,17,o(arguments,2),null,n):i(t,1,null,null,n)}var i=e(34),o=e(21);t.exports=r},function(t){function n(t){return t}t.exports=n},function(t,n,e){var r=e(23),i=Object.prototype,o=i.hasOwnProperty,s=function(t){var n,e=t,i=[];if(!e)return i;if(!r[typeof t])return i;for(n in e)o.call(e,n)&&i.push(n);return i};t.exports=s},function(t){function n(){}t.exports=n},function(t,n,e){function r(t){var n,e;return t&&f.call(t)==s&&(n=t.constructor,!o(n)||n instanceof n)?(i(t,function(t,n){e=n}),"undefined"==typeof e||c.call(t,e)):!1}var i=e(35),o=e(36),s="[object Object]",a=Object.prototype,f=a.toString,c=a.hasOwnProperty;t.exports=r},function(t,n,e){function r(t,n,e,f,p,h){var l=1&n,d=2&n,g=4&n,y=16&n,x=32&n;if(!d&&!s(t))throw new TypeError;y&&!e.length&&(n&=-17,y=e=!1),x&&!f.length&&(n&=-33,x=f=!1);var v=t&&t.__bindData__;if(v&&v!==!0)return v=a(v),v[2]&&(v[2]=a(v[2])),v[3]&&(v[3]=a(v[3])),!l||1&v[1]||(v[4]=p),!l&&1&v[1]&&(n|=8),!g||4&v[1]||(v[5]=h),y&&c.apply(v[2]||(v[2]=[]),e),x&&u.apply(v[3]||(v[3]=[]),f),v[1]|=n,r.apply(null,v);var _=1==n||17===n?i:o;return _([t,n,e,f,p,h])}var i=e(37),o=e(38),s=e(36),a=e(21),f=[],c=f.push,u=f.unshift;t.exports=r},function(t,n,e){var r=e(16),i=e(23),o=function(t,n,e){var o,s=t,a=s;if(!s)return a;if(!i[typeof s])return a;n=n&&"undefined"==typeof e?n:r(n,e,3);for(o in s)if(n(s[o],o,t)===!1)return a;return a};t.exports=o},function(t){function n(t){return"function"==typeof t}t.exports=n},function(t,n,e){function r(t){function n(){if(r){var t=a(r);c.apply(t,arguments)}if(this instanceof n){var s=i(e.prototype),u=e.apply(s,t||arguments);return o(u)?u:s}return e.apply(f,t||arguments)}var e=t[0],r=t[2],f=t[4];return s(n,t),n}var i=e(39),o=e(15),s=e(24),a=e(21),f=[],c=f.push;t.exports=r},function(t,n,e){function r(t){function n(){var t=d?h:this;if(u){var s=a(u);c.apply(s,arguments)}if((p||y)&&(s||(s=a(arguments)),p&&c.apply(s,p),y&&s.length<l))return f|=16,r([e,x?f:-4&f,s,null,h,l]);if(s||(s=arguments),g&&(e=t[v]),this instanceof n){t=i(e.prototype);var _=e.apply(t,s);return o(_)?_:t}return e.apply(t,s)}var e=t[0],f=t[1],u=t[2],p=t[3],h=t[4],l=t[5],d=1&f,g=2&f,y=4&f,x=8&f,v=e;return s(n,t),n}var i=e(39),o=e(15),s=e(24),a=e(21),f=[],c=f.push;t.exports=r},function(t,n,e){(function(n){function r(t){return o(t)?s(t):{}}var i=e(17),o=e(15),s=(e(32),i(s=Object.create)&&s);s||(r=function(){function t(){}return function(e){if(o(e)){t.prototype=e;var r=new t;t.prototype=null}return r||n.Object()}}()),t.exports=r}).call(n,function(){return this}())}])});