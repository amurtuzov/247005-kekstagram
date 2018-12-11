'use strict';

(function () {
  window.ESC_CODE = 27;
  window.getRandomNumber = function (min, max) {
    return Math.round(Math.random() * (max - min) + min);
  };
})();
