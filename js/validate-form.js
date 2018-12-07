'use strict';

(function () {
  var hashtagInput = document.querySelector('.text__hashtags');
  var commentInput = document.querySelector('.text__description');
  hashtagInput.addEventListener('input', function (evt) {
    var target = evt.target;
    var checkSpace = target.value.match(/([a-z#]{1,}#)/ig);
    var hashtagsArray = target.value.toLowerCase().split(' ');
    if (checkSpace !== null) {
      target.setCustomValidity('Между хэш-тегами должен быть пробел');
    } else if (hashtagsArray.length > 5) {
      target.setCustomValidity('Нельзя указать больше пяти хэш-тегов');
    } else {
      target.setCustomValidity('');
    }
    [].forEach.call(hashtagsArray, function (item, index) {
      function isSame(hashtag) {
        return hashtag === item;
      }
      var spliced = target.value.toLowerCase().split(' ');
      spliced.splice(index, 1);
      if (item === '#') {
        target.setCustomValidity('Хэш-тег не может состоять только из одной решетки');
      } else if (item.length > 20) {
        target.setCustomValidity('Максимально допустимая длинна хэш-тега 20 символов');
      } else if (item.indexOf('#', 0) !== 0) {
        target.setCustomValidity('Хэш-тег должен начинаться с символа #');
      } else if (spliced.some(isSame)) {
        target.setCustomValidity('Один и тот же хэш-тег не может быть использован повторно');
      }
    });
  });
  hashtagInput.addEventListener('focus', function () {
    document.removeEventListener('keydown', window.uploadFileFormEscPress);
  });
  hashtagInput.addEventListener('blur', function () {
    document.addEventListener('keydown', window.uploadFileFormEscPress);
  });
  commentInput.addEventListener('focus', function () {
    document.removeEventListener('keydown', window.uploadFileFormEscPress);
  });
  commentInput.addEventListener('blur', function () {
    document.addEventListener('keydown', window.uploadFileFormEscPress);
  });
})();
