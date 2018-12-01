'use strict';

var commentsList = [
  'Всё отлично!',
  'В целом всё неплохо. Но не всё.',
  'Когда вы делаете фотографию, хорошо бы убирать палец из кадра. В конце концов это просто непрофессионально.',
  'Моя бабушка случайно чихнула с фотоаппаратом в руках и у неё получилась фотография лучше.',
  'Я поскользнулся на банановой кожуре и уронил фотоаппарат на кота и у меня получилась фотография лучше.',
  'Лица у людей на фотке перекошены, как будто их избивают. Как можно было поймать такой неудачный момент?!'
];
var descriptionsList = [
  'Тестим новую камеру!',
  'Затусили с друзьями на море',
  'Как же круто тут кормят',
  'Отдыхаем...',
  'Цените каждое мгновенье. Цените тех, кто рядом с вами и отгоняйте все сомненья. Не обижайте всех словами......',
  'Вот это тачка!'
];

var picturesTemplate = document.querySelector('#picture')
  .content
  .querySelector('.picture');
var photosFragment = document.createDocumentFragment();
var picturesList = document.querySelector('.pictures');
var commentsFragment = document.createDocumentFragment();
var uploadInput = document.querySelector('#upload-file');
var uploadFileForm = document.querySelector('.img-upload__overlay');
var effectsList = document.querySelectorAll('.effects__item');
var uploadedImg = document.querySelector('.img-upload__preview img');
var effectLine = document.querySelector('.effect-level__line');
var effectPin = document.querySelector('.effect-level__pin');
var effectLevelInput = document.querySelector('.effect-level__value');

var getRandomNumber = function (min, max) {
  return Math.round(Math.random() * (max - min) + min);
};
var getComments = function (allComents) {
  var comments = [];
  for (var i = 0; i < getRandomNumber(1, 2); i++) {
    comments.push(allComents[getRandomNumber(null, 5)]);
  }
  return comments;
};
var CreatePhoto = function (index, likes, comments, description) {
  this.url = 'photos/' + index + '.jpg';
  this.likes = likes;
  this.comments = comments;
  this.description = description[getRandomNumber(null, 5)];
};
var getPhotos = function () {
  var photos = [];
  for (var i = 1; i < 26; i++) {
    photos.push(new CreatePhoto(i, getRandomNumber(15, 200), getComments(commentsList), descriptionsList));
  }
  return photos;
};

var renderPhoto = function (photo) {
  var photoElement = picturesTemplate.cloneNode(true);
  photoElement.querySelector('.picture__img').src = photo.url;
  photoElement.querySelector('.picture__likes').textContent = photo.likes;
  photoElement.querySelector('.picture__comments').textContent = photo.comments.length;
  photoElement.addEventListener('click', function (evt) {
    evt.preventDefault();
    renderBigPhoto(photo);
  });
  return photoElement;
};
[].forEach.call(getPhotos(), function (item) {
  photosFragment.appendChild(renderPhoto(item));
});
picturesList.appendChild(photosFragment);

var createComments = function (bigPicPhoto, comment) {
  bigPicPhoto.comments.forEach(function (item) {
    var commentElement = comment.cloneNode(true);
    commentElement.querySelector('.social__picture').src = 'img/avatar-' + getRandomNumber(1, 6) + '.svg';
    commentElement.querySelector('.social__text').textContent = item;
    commentsFragment.appendChild(commentElement);
  });
  return commentsFragment;
};
var renderBigPhoto = function (bigPicturePhoto) {
  var bigPicture = document.querySelector('.big-picture');
  bigPicture.classList.remove('hidden');
  var commentsTemplate = bigPicture.querySelector('.social__comment');
  bigPicture.querySelector('.big-picture__img img').src = bigPicturePhoto.url;
  bigPicture.querySelector('.likes-count').textContent = bigPicturePhoto.likes;
  bigPicture.querySelector('.comments-count').textContent = bigPicturePhoto.comments.length;
  bigPicture.querySelector('.social__comments').innerHTML = '';
  bigPicture.querySelector('.social__comments').appendChild(createComments(bigPicturePhoto, commentsTemplate));
  bigPicture.querySelector('.social__caption').textContent = bigPicturePhoto.description;
  bigPicture.querySelector('.big-picture__cancel').addEventListener('click', function (evt) {
    evt.preventDefault();
    bigPicture.classList.add('hidden');
  });
  document.addEventListener('keydown', function (evt) {
    if (evt.keyCode === 27) {
      bigPicture.classList.add('hidden');
    }
  });
};

document.querySelector('.social__comment-count').classList.add('visually-hidden');
document.querySelector('.comments-loader').classList.add('visually-hidden');

var uploadFileFormEscPress = function (evt) {
  if (evt.keyCode === 27) {
    uploadInput.value = '';
    uploadFileFormClose();
  }
};

var uploadFileFormOpen = function () {
  uploadFileForm.classList.remove('hidden');
  uploadFileForm.querySelector('.img-upload__cancel').addEventListener('click', uploadFileFormClose);
  document.addEventListener('keydown', uploadFileFormEscPress);
};

var uploadFileFormClose = function () {
  uploadFileForm.classList.add('hidden');
  uploadInput.value = '';
  document.removeEventListener('keydown', uploadFileFormEscPress);
};

uploadInput.addEventListener('change', uploadFileFormOpen);

[].forEach.call(effectsList, function (item) {
  item.addEventListener('click', function (evt) {
    evt.preventDefault();
    uploadedImg.classList = '';
    var effect = item.querySelector('input').value;
    uploadedImg.style = '';
    uploadedImg.classList.add('effects__preview--' + effect);
  });
});

var getEffectLevel = function (currentPos, maxPos) {
  return Math.round(currentPos * 100 / maxPos);
};
var setImgEffect = function () {
  effectLine.querySelector('.effect-level__pin').addEventListener('mouseup', function (evt) {
    evt.preventDefault();
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
  });
};
setImgEffect();

var uploadFileFormValidate = function () {
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
    document.removeEventListener('keydown', uploadFileFormEscPress);
  });
  hashtagInput.addEventListener('blur', function () {
    document.addEventListener('keydown', uploadFileFormEscPress);
  });
  commentInput.addEventListener('focus', function () {
    document.removeEventListener('keydown', uploadFileFormEscPress);
  });
  commentInput.addEventListener('blur', function () {
    document.addEventListener('keydown', uploadFileFormEscPress);
  });
};
uploadFileFormValidate();
