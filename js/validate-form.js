'use strict';

(function () {
  var INVALID_BORDER_STYLE = '1px solid red';
  var MAX_HASHTAGS = 5;
  var MAX_HASHTAG_LENGTH = 20;
  var MAX_COMMENT_LENGTH = 120;
  var uploadFileForm = document.querySelector('.img-upload__form');
  var hashtagInput = document.querySelector('.text__hashtags');
  var commentInput = document.querySelector('.text__description');
  var successTemplate = document.querySelector('#success')
    .content
    .querySelector('.success');
  var errorTemplate = document.querySelector('#error')
    .content
    .querySelector('.error');
  var successPopup = successTemplate.cloneNode(true);
  var successButton = successPopup.querySelector('.success__button');
  var errorPopup = errorTemplate.cloneNode(true);
  var errorButton = errorPopup.querySelector('.error__button');

  var hashtagsValidate = function () {
    hashtagInput.addEventListener('input', function (evt) {
      var target = evt.target;
      var checkSpace = target.value.match(/([a-z#]{1,}#)/ig);
      var hashtagsArray = target.value.toLowerCase().split(' ');
      if (hashtagsArray[0] === '') {
        hashtagsArray = [];
      }
      if (checkSpace !== null) {
        target.setCustomValidity('Между хэш-тегами должен быть пробел');
        target.style.border = INVALID_BORDER_STYLE;
      } else if (hashtagsArray.length > MAX_HASHTAGS) {
        target.setCustomValidity('Нельзя указать больше пяти хэш-тегов');
        target.style.border = INVALID_BORDER_STYLE;
      } else {
        target.setCustomValidity('');
        target.style = '';
      }
      hashtagsArray.forEach(function (item, index) {
        function isSame(hashtag) {
          return hashtag === item;
        }
        var spliced = target.value.toLowerCase().split(' ');
        spliced.splice(index, 1);
        if (item === '#') {
          target.setCustomValidity('Хэш-тег не может состоять только из одной решетки');
          target.style.border = INVALID_BORDER_STYLE;
        } else if (item.length > MAX_HASHTAG_LENGTH) {
          target.setCustomValidity('Максимально допустимая длинна хэш-тега 20 символов');
          target.style.border = INVALID_BORDER_STYLE;
        } else if (item.indexOf('#', 0) !== 0) {
          target.setCustomValidity('Хэш-тег должен начинаться с символа #');
          target.style.border = INVALID_BORDER_STYLE;
        } else if (spliced.some(isSame)) {
          target.setCustomValidity('Один и тот же хэш-тег не может быть использован повторно');
          target.style.border = INVALID_BORDER_STYLE;
        }
      });
    });
    hashtagInput.addEventListener('focus', function () {
      document.removeEventListener('keydown', window.setupForm.uploadFileFormEscPress);
    });
    hashtagInput.addEventListener('blur', function () {
      document.addEventListener('keydown', window.setupForm.uploadFileFormEscPress);
    });
  };
  var commentValidate = function () {
    commentInput.addEventListener('input', function (evt) {
      var target = evt.target;
      if (target.value.length > MAX_COMMENT_LENGTH) {
        target.setCustomValidity('Комментарий не может содержать более 120 символов');
        target.style.border = INVALID_BORDER_STYLE;
      } else {
        target.setCustomValidity('');
        target.style = '';
      }
    });
    commentInput.addEventListener('focus', function () {
      document.removeEventListener('keydown', window.setupForm.uploadFileFormEscPress);
    });
    commentInput.addEventListener('blur', function () {
      document.addEventListener('keydown', window.setupForm.uploadFileFormEscPress);
    });
  };

  var addPopups = function () {
    document.querySelector('main').appendChild(successPopup);
    successPopup.style.visibility = 'hidden';
    document.querySelector('main').appendChild(errorPopup);
    errorPopup.style.visibility = 'hidden';
  };

  var successHandler = function () {
    window.setupForm.uploadFileFormClose();
    successPopup.style.visibility = 'visible';
    successButton.addEventListener('click', function () {
      successPopup.style.visibility = 'hidden';
    });
    document.addEventListener('keydown', function (closeEvt) {
      if (closeEvt.keyCode === window.utils.ESC_CODE) {
        successPopup.style.visibility = 'hidden';
      }
    });
    document.addEventListener('click', function () {
      successPopup.style.visibility = 'hidden';
    });
  };
  var errorHandler = function () {
    window.setupForm.uploadFileFormClose();
    errorPopup.style.visibility = 'visible';
    errorButton.addEventListener('click', function () {
      errorPopup.style.visibility = 'hidden';
    });
    document.addEventListener('keydown', function (closeEvt) {
      if (closeEvt.keyCode === window.utils.ESC_CODE) {
        errorPopup.style.visibility = 'hidden';
      }
    });
    document.addEventListener('click', function () {
      errorPopup.style.visibility = 'hidden';
    });
  };
  uploadFileForm.addEventListener('submit', function (evt) {
    window.backend.upload(new FormData(uploadFileForm), successHandler, errorHandler);
    evt.preventDefault();
  });
  var initFormValidate = function () {
    hashtagsValidate();
    commentValidate();
    addPopups();
  };
  initFormValidate();
})();
