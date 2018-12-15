'use strict';

(function () {
  window.ESC_CODE = 27;
  window.DEBOUNCE_INTERVAL = 500; // ms
  window.debounce = function (callback) {
    var lastTimeout = null;

    return function () {
      var parameters = arguments;
      if (lastTimeout) {
        window.clearTimeout(lastTimeout);
      }
      lastTimeout = window.setTimeout(function () {
        callback.apply(null, parameters);
      }, window.DEBOUNCE_INTERVAL);
    };
  };
  window.shuffle = function shuffle(array) {
    var copy = [];
    var n = array.length;
    var i;
    while (n) {
      i = Math.floor(Math.random() * n--);
      copy.push(array.splice(i, 1)[0]);
    }
    return copy;
  };
  window.blobToBase64 = function (blob, callback) {
    var reader = new FileReader();
    reader.onload = function () {
      var dataUrl = reader.result;
      var base64 = dataUrl.split(',')[1];
      callback(base64);
    };
    reader.readAsDataURL(blob);
  };
  window.getRandomNumber = function (min, max) {
    return Math.round(Math.random() * (max - min) + min);
  };
})();
