'use strict';
(function () {

  var UPLOAD_URL = 'https://js.dump.academy/kekstagram';
  var LOAD_URL = 'https://js.dump.academy/kekstagram/data';
  var TIMEOUT = 10000;
  var HTTP_STAUS_OK = 200;
  var XHR_RESPONSE_TYPE = 'json';

  var request = function (method, url, data, onSuccess, onError) {
    var xhr = new XMLHttpRequest();
    xhr.responseType = XHR_RESPONSE_TYPE;

    xhr.addEventListener('load', function () {
      if (xhr.status === HTTP_STAUS_OK) {
        onSuccess(xhr.response);
      } else {
        onError('Статус ответа: ' + xhr.status + ' ' + xhr.statusText);
      }
    });

    xhr.addEventListener('error', function () {
      onError('Произошла ошибка соединения');
    });

    xhr.addEventListener('timeout', function () {
      onError('Запрос не успел выполниться за ' + xhr.timeout + 'мс');
    });

    xhr.timeout = TIMEOUT;

    xhr.open(method, url);
    xhr.send(data);

  };


  window.upload = function (data, onSuccess, onError) {
    request('POST', UPLOAD_URL, data, onSuccess, onError);
  };

  window.load = function (onSuccess, onError) {
    request('GET', LOAD_URL, null, onSuccess, onError);
  };
})();
