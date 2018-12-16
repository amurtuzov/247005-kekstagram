'use strict';

(function () {
  var uploadInput = document.querySelector('#upload-file');
  var loadMessageTemplate = document.querySelector('#messages')
    .content
    .querySelector('.img-upload__message');
  var uploadFileForm = document.querySelector('.img-upload__form');
  var uploadFileOverlay = document.querySelector('.img-upload__overlay');
  var effectsList = document.querySelectorAll('.effects__item');
  var imgWrapper = document.querySelector('.img-upload__preview');
  var uploadedImg = document.querySelector('.img-upload__preview img');
  var effectLine = document.querySelector('.effect-level__line');
  var effectPin = document.querySelector('.effect-level__pin');
  var effectLevelInput = document.querySelector('.effect-level__value');
  var effectLevelSlider = document.querySelector('.effect-level');
  var effectDepth = effectLine.querySelector('.effect-level__depth');
  var scaleLevelInput = uploadFileForm.querySelector('.scale__control--value');
  var effectPreviews = uploadFileForm.querySelectorAll('.effects__preview');
  var SCALE_STEP = 25;
  var SCALE_MAX = 100;
  window.setupForm = {};

  var setFormToDefault = function () {
    uploadInput.value = '';
    uploadedImg.style = '';
    uploadedImg.classList = 'effects__preview--none';
    scaleLevelInput.value = '100%';
    effectLevelInput.value = 0;
    uploadFileForm.querySelector('#effect-none').checked = true;
    uploadFileForm.querySelector('.text__hashtags').value = '';
    uploadFileForm.querySelector('.text__description').value = '';
  };

  var uploadFileFormEscPress = function (evt) {
    if (evt.keyCode === window.utils.ESC_CODE) {
      uploadFileFormClose();
    }
  };
  window.setupForm.uploadFileFormEscPress = uploadFileFormEscPress;

  var uploadFileFormOpen = function (evt) {
    uploadedImg.style.visibility = 'hidden';
    var loadingMessage = loadMessageTemplate.cloneNode(true);
    imgWrapper.appendChild(loadingMessage);
    var target = evt.target;
    var blob = target.files[0];
    if (blob.type === 'image/jpeg' || blob.type === 'image/png') {
      window.utils.blobToBase64(blob, function (base64) {
        uploadedImg.src = 'data:image/png;base64,' + base64;
        imgWrapper.removeChild(loadingMessage);
        uploadedImg.style.visibility = 'visible';
        [].forEach.call(effectPreviews, function (item) {
          item.style.backgroundImage = 'url(data:image/png;base64,' + base64 + ')';
        });
      });
    } else {
      imgWrapper.removeChild(loadingMessage);
      uploadedImg.style.visibility = 'visible';
    }
    uploadFileOverlay.classList.remove('hidden');
    uploadedImg.classList = 'effects__preview--none';
    effectLevelSlider.style.display = 'none';
    uploadFileForm.querySelector('#effect-none').checked = true;
    scaleLevelInput.value = '100%';
    effectLevelInput.value = 0;
    uploadFileOverlay.querySelector('.img-upload__cancel').addEventListener('click', uploadFileFormClose);
    document.addEventListener('keydown', uploadFileFormEscPress);
  };

  var uploadFileFormClose = function () {
    uploadFileOverlay.classList.add('hidden');
    setFormToDefault();
    document.removeEventListener('keydown', uploadFileFormEscPress);
  };
  window.setupForm.uploadFileFormClose = uploadFileFormClose;

  uploadInput.addEventListener('change', uploadFileFormOpen);
  [].forEach.call(effectsList, function (item) {
    item.addEventListener('click', function (evt) {
      evt.preventDefault();
      uploadedImg.classList = '';
      scaleLevelInput.value = '100%';
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
        effectLevelInput.value = 0;
      } else {
        effectLevelSlider.style.display = 'block';
      }
    });
  });

  var scaleImg = function () {
    var scaleSmaller = uploadFileForm.querySelector('.scale__control--smaller');
    var scaleBigger = uploadFileForm.querySelector('.scale__control--bigger');
    scaleSmaller.addEventListener('click', function () {
      var scaleLevel = parseInt(scaleLevelInput.value.replace('%', ''), 10);
      scaleLevel = scaleLevel - SCALE_STEP;
      if (scaleLevel < SCALE_STEP) {
        scaleLevel = SCALE_STEP;
      }
      uploadedImg.style.transform = 'scale(' + scaleLevel / 100 + ')';
      scaleLevelInput.value = scaleLevel + '%';
    });
    scaleBigger.addEventListener('click', function () {
      var scaleLevel = parseInt(scaleLevelInput.value.replace('%', ''), 10);
      scaleLevel = scaleLevel + SCALE_STEP;
      if (scaleLevel > SCALE_MAX) {
        scaleLevel = SCALE_MAX;
      }
      uploadedImg.style.transform = 'scale(' + scaleLevel / 100 + ')';
      scaleLevelInput.value = scaleLevel + '%';
    });
  };
  scaleImg();

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
