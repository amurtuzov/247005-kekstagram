'use strict';

(function () {
  var FILE_TYPES_REGEXP = /^(?:image\/bmp|image\/cis\-cod|image\/gif|image\/ief|image\/jpeg|image\/jpeg|image\/jpeg|image\/pipeg|image\/png|image\/svg\+xml|image\/tiff|image\/x\-cmu\-raster|image\/x\-cmx|image\/x\-icon|image\/x\-portable\-anymap|image\/x\-portable\-bitmap|image\/x\-portable\-graymap|image\/x\-portable\-pixmap|image\/x\-rgb|image\/x\-xbitmap|image\/x\-xpixmap|image\/x\-xwindowdump)$/i;
  var SCALE_STEP = 25;
  var SCALE_MAX = 100;
  var uploadInput = document.querySelector('#upload-file');
  var uploadFileForm = document.querySelector('.img-upload__form');
  var uploadFileOverlay = document.querySelector('.img-upload__overlay');
  var uploadFileFormCloser = uploadFileOverlay.querySelector('.img-upload__cancel');
  var effectsList = document.querySelectorAll('.effects__item');
  var uploadedImg = document.querySelector('.img-upload__preview img');
  var effectLine = document.querySelector('.effect-level__line');
  var effectPin = document.querySelector('.effect-level__pin');
  var effectLevelInput = document.querySelector('.effect-level__value');
  var effectLevelSlider = document.querySelector('.effect-level');
  var effectDepth = effectLine.querySelector('.effect-level__depth');
  var scaleLevelInput = uploadFileForm.querySelector('.scale__control--value');
  window.setupForm = {};

  var setFormToDefault = function () {
    uploadInput.value = '';
    uploadedImg.style = '';
    uploadedImg.classList = 'effects__preview--none';
    scaleLevelInput.value = '100%';
    effectLevelInput.value = 0;
    effectLevelSlider.style.display = 'none';
    uploadFileForm.querySelector('#effect-none').checked = true;
    uploadFileForm.querySelector('.text__hashtags').value = '';
    uploadFileForm.querySelector('.text__description').value = '';
  };

  var uploadFileFormEscPress = function (evt) {
    evt.preventDefault();
    if (evt.keyCode === window.utils.ESC_CODE) {
      uploadFileOverlay.classList.add('hidden');
      setFormToDefault();
      uploadFileFormCloser.removeEventListener('click', uploadFileFormClose);
      document.removeEventListener('keydown', uploadFileFormEscPress);
    }
  };

  var checkLoadedFile = function (files) {
    if (files.length === 0) {
      return false;
    }
    if (!FILE_TYPES_REGEXP.test(files[0].type)) {
      return false;
    }
    return true;
  };

  var uploadFileFormOpen = function (evt) {
    var target = evt.target;
    var reader = new FileReader();
    reader.onloadend = function () {
      uploadedImg.src = reader.result;
    };
    if (checkLoadedFile(target.files)) {
      reader.readAsDataURL(target.files[0]);
    }
    uploadFileOverlay.classList.remove('hidden');
    uploadFileFormCloser.addEventListener('click', uploadFileFormClose);
    document.addEventListener('keydown', uploadFileFormEscPress);
  };

  var uploadFileFormClose = function (evt) {
    evt.preventDefault();
    uploadFileOverlay.classList.add('hidden');
    setFormToDefault();
    uploadFileFormCloser.removeEventListener('click', uploadFileFormClose);
    document.removeEventListener('keydown', uploadFileFormEscPress);
  };

  var setupEffectsList = function () {
    [].forEach.call(effectsList, function (item) {
      item.addEventListener('click', function (evt) {
        evt.preventDefault();
        uploadedImg.classList = '';
        var input = item.children[0];
        var effect = input.value;
        input.checked = true;
        uploadedImg.style.filter = '';
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
  };

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
  var initSetupForm = function () {
    window.setupForm.uploadFileFormEscPress = uploadFileFormEscPress;
    window.setupForm.uploadFileFormClose = uploadFileFormClose;
    window.setupForm.setFormToDefault = setFormToDefault;
    uploadInput.addEventListener('change', uploadFileFormOpen);
    setFormToDefault();
    scaleImg();
    setImgEffect();
    setupEffectsList();
  };
  initSetupForm();
})();
