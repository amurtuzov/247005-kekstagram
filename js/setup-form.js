'use strict';

(function () {
  var uploadInput = document.querySelector('#upload-file');
  var uploadFileForm = document.querySelector('.img-upload__form');
  var uploadFileOverlay = document.querySelector('.img-upload__overlay');
  var effectsList = document.querySelectorAll('.effects__item');
  var uploadedImg = document.querySelector('.img-upload__preview img');
  var effectLine = document.querySelector('.effect-level__line');
  var effectPin = document.querySelector('.effect-level__pin');
  var effectLevelInput = document.querySelector('.effect-level__value');
  var effectLevelSlider = document.querySelector('.effect-level');
  var effectDepth = effectLine.querySelector('.effect-level__depth');

  var setFormToDefault = function () {
    uploadInput.value = '';
    uploadedImg.style = '';
    uploadedImg.classList = 'effects__preview--heat';
    effectPin.style.left = '100%';
    effectDepth.style.width = '100%';
    effectLevelInput.value = 100;
    uploadFileForm.querySelector('#effect-heat').checked = true;
    uploadFileForm.querySelector('.text__hashtags').value = '';
    uploadFileForm.querySelector('.text__description').value = '';
  };

  window.uploadFileFormEscPress = function (evt) {
    if (evt.keyCode === 27) {
      window.uploadFileFormClose();
    }
  };

  var uploadFileFormOpen = function () {
    uploadFileOverlay.classList.remove('hidden');
    uploadedImg.classList = 'effects__preview--heat';
    effectPin.style.left = '100%';
    effectDepth.style.width = '100%';
    effectLevelInput.value = 100;
    uploadFileOverlay.querySelector('.img-upload__cancel').addEventListener('click', window.uploadFileFormClose);
    document.addEventListener('keydown', window.uploadFileFormEscPress);
  };

  window.uploadFileFormClose = function () {
    uploadFileOverlay.classList.add('hidden');
    setFormToDefault();
    document.removeEventListener('keydown', window.uploadFileFormEscPress);
  };

  uploadInput.addEventListener('change', uploadFileFormOpen);
  [].forEach.call(effectsList, function (item) {
    item.addEventListener('click', function (evt) {
      evt.preventDefault();
      uploadedImg.classList = '';
      var input = item.querySelector('input');
      var effect = input.value;
      input.checked = true;
      uploadedImg.style = '';
      effectPin.style.left = '100%';
      effectDepth.style.width = '100%';
      effectLevelInput.value = 100;
      uploadedImg.classList.add('effects__preview--' + effect);
      if (effect === 'none') {
        effectLevelSlider.style.display = 'none';
      } else {
        effectLevelSlider.style.display = 'block';
      }
    });
  });

  var getEffectLevel = function (currentPos, maxPos) {
    return Math.round(currentPos * 100 / maxPos);
  };

  var setEffectLevel = function () {
    var effectLevel = getEffectLevel(effectPin.offsetLeft, effectLine.offsetWidth);
    effectLevelInput.value = effectLevel;
    if (uploadedImg.matches('.effects__preview--chrome')) {
      uploadedImg.style.filter = 'grayscale(' + 1 / 100 * effectLevel + ')';
    } else if (uploadedImg.matches('.effects__preview--sepia')) {
      uploadedImg.style.filter = 'sepia(' + 1 / 100 * effectLevel + ')';
    } else if (uploadedImg.matches('.effects__preview--marvin')) {
      uploadedImg.style.filter = 'invert(' + effectLevel + '%)';
    } else if (uploadedImg.matches('.effects__preview--phobos')) {
      uploadedImg.style.filter = 'blur(' + 3 / 100 * effectLevel + 'px)';
    } else if (uploadedImg.matches('.effects__preview--heat')) {
      uploadedImg.style.filter = 'brightness(' + 3 / 100 * effectLevel + ')';
    } else {
      uploadedImg.style.filter = '';
    }
  };

  var setImgEffect = function () {
    effectPin.addEventListener('mousedown', function (evt) {
      evt.preventDefault();

      var startCoords = {
        x: evt.clientX,
      };

      var onMouseMove = function (moveEvt) {
        moveEvt.preventDefault();
        var shift = {
          x: startCoords.x - moveEvt.clientX,
        };
        startCoords = {
          x: moveEvt.clientX,
        };
        effectPin.style.left = (effectPin.offsetLeft - shift.x) + 'px';
        effectDepth.style.width = effectPin.offsetLeft + 'px';
        if (effectPin.offsetLeft - shift.x < 0) {
          effectPin.style.left = 0 + 'px';
          document.removeEventListener('mousemove', onMouseMove);
        } else if (effectPin.offsetLeft > effectLine.offsetWidth) {
          effectPin.style.left = effectLine.offsetWidth + 'px';
          document.removeEventListener('mousemove', onMouseMove);
        }
        setEffectLevel();
      };

      var onMouseUp = function (upEvt) {
        upEvt.preventDefault();
        setEffectLevel();
        document.removeEventListener('mousemove', onMouseMove);
        document.removeEventListener('mouseup', onMouseUp);
      };

      document.addEventListener('mousemove', onMouseMove);
      document.addEventListener('mouseup', onMouseUp);
    });
  };
  setImgEffect();
})();
