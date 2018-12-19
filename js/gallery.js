'use strict';

(function () {
  var DEFAULT_COMMENTS_AMOUNT = 5;
  var picturesTemplate = document.querySelector('#picture')
    .content
    .querySelector('.picture');
  var photosFragment = document.createDocumentFragment();
  var picturesList = document.querySelector('.pictures');
  var bigPicture = document.querySelector('.big-picture');
  var bigPictureImg = bigPicture.querySelector('.big-picture__img img');
  var bigPictureLikes = bigPicture.querySelector('.likes-count');
  var bigPictureComments = bigPicture.querySelector('.social__comments');
  var bigPictureDescription = bigPicture.querySelector('.social__caption');
  var bigPictureCloser = bigPicture.querySelector('.big-picture__cancel');
  var commentsCount = bigPicture.querySelector('.comments-count');
  var commentsLoader = document.querySelector('.comments-loader');
  var commentsTemplate = bigPicture.querySelector('.social__comment');
  var commentsFragment = document.createDocumentFragment();
  var photos = [];
  window.gallery = {};

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
  var removePictures = function (className) {
    var elements = picturesList.querySelectorAll(className);
    elements.forEach(function (item) {
      item.remove();
    });
  };
  var renderPhotos = function (data) {
    data.forEach(function (item) {
      photosFragment.appendChild(renderPhoto(item));
    });
    picturesList.appendChild(photosFragment);
  };

  var successHandler = function (data) {
    photos = data;
    window.gallery.photos = photos;
    renderPhotos(photos);
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

  var createComment = function (template, data) {
    var commentElement = template.cloneNode(true);
    commentElement.querySelector('.social__picture').src = data.avatar;
    commentElement.querySelector('.social__text').textContent = data.message;
    return commentElement;
  };

  var createComments = function (bigPicPhoto, lazyLoaded, comment) {
    bigPicPhoto.comments.forEach(function (item) {
      if (lazyLoaded.length !== DEFAULT_COMMENTS_AMOUNT) {
        lazyLoaded.push(item);
      }
    });
    lazyLoaded.forEach(function (item) {
      commentsFragment.appendChild(createComment(comment, item));
    });
    return commentsFragment;
  };
  var loadComments = function (comment, template) {
    var commentElement = createComment(template, comment);
    commentsFragment.appendChild(commentElement);
    return commentsFragment;
  };

  var bigPictureCloseHandler = function (evt) {
    evt.preventDefault();
    bigPicture.classList.add('hidden');
    document.removeEventListener('keydown', bigPictureEscPressCloseHandler);
    bigPictureCloser.removeEventListener('click', bigPictureCloseHandler);
  };
  var bigPictureEscPressCloseHandler = function (evt) {
    if (evt.keyCode === window.utils.ESC_CODE) {
      bigPicture.classList.add('hidden');
    }
    document.removeEventListener('keydown', bigPictureEscPressCloseHandler);
    bigPictureCloser.removeEventListener('click', bigPictureCloseHandler);
  };

  var renderBigPhoto = function (bigPicturePhoto) {

    bigPicture.classList.remove('hidden');
    commentsLoader.classList.remove('visually-hidden');

    var defaultCommentsNode = document.createTextNode('5 из ');
    commentsCount.parentNode.removeChild(commentsCount.previousSibling);
    commentsCount.parentNode.insertBefore(defaultCommentsNode, commentsCount);

    var commentsCounter = DEFAULT_COMMENTS_AMOUNT;
    var lazyLoadedComments = [];

    bigPictureImg.src = bigPicturePhoto.url;
    bigPictureLikes.textContent = bigPicturePhoto.likes;
    commentsCount.textContent = bigPicturePhoto.comments.length;

    if (bigPicturePhoto.comments.length < DEFAULT_COMMENTS_AMOUNT) {
      var fewCommentsNode = document.createTextNode(bigPicturePhoto.comments.length + ' из ');
      commentsCount.parentNode.removeChild(commentsCount.previousSibling);
      commentsCount.parentNode.insertBefore(fewCommentsNode, commentsCount);
      commentsLoader.classList.add('visually-hidden');
    }

    bigPictureComments.innerHTML = '';
    bigPictureComments.appendChild(createComments(bigPicturePhoto, lazyLoadedComments, commentsTemplate));
    bigPictureDescription.textContent = bigPicturePhoto.description;

    commentsLoader.addEventListener('click', function () {
      var commentsLeft = bigPicturePhoto.comments.length - commentsCounter;
      var increment = commentsLeft >= DEFAULT_COMMENTS_AMOUNT ? DEFAULT_COMMENTS_AMOUNT : commentsLeft;
      commentsCounter = commentsCounter + increment;

      if (lazyLoadedComments.length < bigPicturePhoto.comments.length) {
        for (var i = (commentsCounter - increment); i < commentsCounter; i++) {
          lazyLoadedComments.push(bigPicturePhoto.comments[i]);
          bigPictureComments.appendChild(loadComments(lazyLoadedComments[i], commentsTemplate));
        }

        var dynamicCommentsNode = document.createTextNode(lazyLoadedComments.length + ' из ');
        commentsCount.parentNode.removeChild(commentsCount.previousSibling);
        commentsCount.parentNode.insertBefore(dynamicCommentsNode, commentsCount);
        if (lazyLoadedComments.length === bigPicturePhoto.comments.length) {
          commentsLoader.classList.add('visually-hidden');
        }
      }
    });

    bigPictureCloser.addEventListener('click', bigPictureCloseHandler);
    document.addEventListener('keydown', bigPictureEscPressCloseHandler);
  };
  var initGallery = function () {
    window.backend.load(successHandler, errorHandler);
    window.gallery.renderPhotos = renderPhotos;
    window.gallery.removePictures = removePictures;
  };
  initGallery();
})();
