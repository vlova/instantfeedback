(function () {
  function bind(event, newListener, name) {
    name = name || newListener.toString().match(/function (.*)\(/)[1];

    if (typeof name === 'undefined') {
      throw "are you seriosly?" +
        "don't try to bind anonymous functions";
    }

    this._attachedListeners = this._attachedListeners || {};
    var oldListener = this._attachedListeners[name];
    this.removeEventListener(event, oldListener);
    this.addEventListener(event, newListener);
    this._attachedListeners[name] = newListener;
    return "ok";
  }

  Element.prototype.bind = bind;
})();
