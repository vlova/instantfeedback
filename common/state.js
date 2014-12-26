define(function() {
  function get(key, value) {
    var item = localStorage.getItem(key);
    if (!item) {
      set(key, value);
      return value;
    } else {
      return JSON.parse(item);
    }
  }

  function set(key, value) {
    localStorage.setItem(key, JSON.stringify(value));
  }

  function subset(prefix) {
    return {
      get: function (key, value) {
        return get(prefix + key, value);
      },
      set: function (key, value) {
        set(prefix + key, value);
      }
    };
  }

  return {
    get: get,
    set: set
  };
});
