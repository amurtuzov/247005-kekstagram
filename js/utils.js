'use strict';

(function () {
  window.utils = {
    ESC_CODE: 27,
    DEBOUNCE_INTERVAL: 500,
    debounce: function (callback) {
      var lastTimeout = null;

      return function () {
        var parameters = arguments;
        if (lastTimeout) {
          window.clearTimeout(lastTimeout);
        }
        lastTimeout = window.setTimeout(function () {
          callback.apply(null, parameters);
        }, window.utils.DEBOUNCE_INTERVAL);
      };
    },
    shuffle: function shuffle(array) {
      var copy = [];
      var n = array.length;
      var i;
      while (n) {
        i = Math.floor(Math.random() * n--);
        copy.push(array.splice(i, 1)[0]);
      }
      return copy;
    }
  };
})();
