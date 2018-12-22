'use strict';

(function () {
  var INVALID_BORDER_STYLE = '1px solid red';
  var MAX_HASHTAGS = 5;
  var MAX_HASHTAG_LENGTH = 20;
  var MAX_COMMENT_LENGTH = 140;
  var main = document.querySelector('main');
  var uploadFileForm = document.querySelector('.img-upload__form');
  var uploadFileOverlay = uploadFileForm.querySelector('.img-upload__overlay');
  var hashtagInput = uploadFileForm.querySelector('.text__hashtags');
  var commentInput = uploadFileForm.querySelector('.text__description');
  var successTemplate = document.querySelector('#success')
    .content
    .querySelector('.success');
  var errorTemplate = document.querySelector('#error')
    .content
    .querySelector('.error');

  var hashtagsValidate = function () {
    hashtagInput.addEventListener('input', function (evt) {
      var target = evt.target;
      var value = target.value.trim();
      var checkSpace = value.match(/([a-z#]{1,}#)/ig);
      var hashtagsArray = value.toLowerCase().split(' ');
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
        var spliced = value.toLowerCase().split(' ');
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
      document.removeEventListener('keydown', window.setupForm.uploadFileDialogEscPress);
    });
    hashtagInput.addEventListener('blur', function () {
      document.addEventListener('keydown', window.setupForm.uploadFileDialogEscPress);
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
      document.removeEventListener('keydown', window.setupForm.uploadFileDialogEscPress);
    });
    commentInput.addEventListener('blur', function () {
      document.addEventListener('keydown', window.setupForm.uploadFileDialogEscPress);
    });
  };


  var removePopup = function () {
    main.removeChild(main.children[main.children.length - 1]);
    document.removeEventListener('keydown', onKeydownClosePopup);
    document.removeEventListener('click', onClickClosePopup);
  };

  var onClickClosePopup = function () {
    removePopup();
  };
  var onKeydownClosePopup = function (closeEvt) {
    if (closeEvt.keyCode === window.utils.ESC_CODE) {
      removePopup();
    }
  };

  var successHandler = function () {
    var successPopup = successTemplate.cloneNode(true);
    var successButton = successPopup.querySelector('.success__button');
    main.appendChild(successPopup);
    window.setupForm.setToDefault();
    uploadFileOverlay.classList.add('hidden');
    successPopup.style.visibility = 'visible';
    successButton.addEventListener('click', function () {
      successPopup.style.visibility = 'hidden';
    });
    document.addEventListener('keydown', onKeydownClosePopup);
    document.addEventListener('click', onClickClosePopup);
  };
  var errorHandler = function () {
    var errorPopup = errorTemplate.cloneNode(true);
    var errorButton = errorPopup.querySelector('.error__button');
    main.appendChild(errorPopup);
    window.setupForm.setToDefault();
    uploadFileOverlay.classList.add('hidden');
    errorPopup.style.visibility = 'visible';
    errorButton.addEventListener('click', function () {
      errorPopup.style.visibility = 'hidden';
    });
    document.addEventListener('keydown', onKeydownClosePopup);
    document.addEventListener('click', onClickClosePopup);
  };

  uploadFileForm.addEventListener('submit', function (evt) {
    window.backend.upload(new FormData(uploadFileForm), successHandler, errorHandler);
    evt.preventDefault();
  });
  var initFormValidate = function () {
    hashtagsValidate();
    commentValidate();
  };
  initFormValidate();
})();
