'use strict';

(function () {
  window.getRandomNumber = function (min, max) {
    return Math.round(Math.random() * (max - min) + min);
  };
})();
