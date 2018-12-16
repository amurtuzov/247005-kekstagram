'use strict';

(function () {
  window.utils = {
    ESC_CODE: 27,
    DEBOUNCE_INTERVAL: 500, // ms
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
    },
    blobToBase64: function (blob, callback) {
      var reader = new FileReader();
      reader.onload = function () {
        var dataUrl = reader.result;
        var base64 = dataUrl.split(',')[1];
        callback(base64);
      };
      reader.readAsDataURL(blob);
    },
    getRandomNumber: function (min, max) {
      return Math.round(Math.random() * (max - min) + min);
    }
  };
})();
