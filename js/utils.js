'use strict';

(function () {
  window.ESC_CODE = 27;
  window.blobToBase64 = function (blob, callback) {
    var reader = new FileReader();
    reader.onload = function() {
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
