'use strict';

(function () {
  var picturesTemplate = document.querySelector('#picture')
    .content
    .querySelector('.picture');
  var photosFragment = document.createDocumentFragment();
  var picturesList = document.querySelector('.pictures');
  var commentsFragment = document.createDocumentFragment();

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

  var successHandler = function (data) {
    [].forEach.call(data, function (item) {
      photosFragment.appendChild(renderPhoto(item));
    });
    picturesList.appendChild(photosFragment);
  };
  var errorHandler = function (error) {
    var node = document.createElement('div');
    node.style = 'z-index: 100; margin: 0 auto; text-align: center; background-color: red;';
    node.style.position = 'absolute';
    node.style.left = 0;
    node.style.right = 0;
    node.style.fontSize = '30px';

    node.textContent = error;
    document.body.insertAdjacentElement('afterbegin', node);
  };
  window.load(successHandler, errorHandler);

  var createComments = function (bigPicPhoto, comment) {
    bigPicPhoto.comments.forEach(function (item) {
      var commentElement = comment.cloneNode(true);
      commentElement.querySelector('.social__picture').src = item.avatar;
      commentElement.querySelector('.social__text').textContent = item.message;
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
      if (evt.keyCode === window.ESC_CODE) {
        bigPicture.classList.add('hidden');
      }
    });
  };

  document.querySelector('.social__comment-count').classList.add('visually-hidden');
  document.querySelector('.comments-loader').classList.add('visually-hidden');
})();
