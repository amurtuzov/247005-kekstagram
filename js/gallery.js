'use strict';

(function () {
  var picturesTemplate = document.querySelector('#picture')
    .content
    .querySelector('.picture');
  var photosFragment = document.createDocumentFragment();
  var picturesList = document.querySelector('.pictures');
  var commentsFragment = document.createDocumentFragment();
  window.photos = [];

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
  window.removePictures = function (className) {
    var elements = picturesList.querySelectorAll(className);
    elements.forEach(function (item) {
      item.remove();
    });
  };
  window.renderPhotos = function (data) {
    [].forEach.call(data, function (item) {
      photosFragment.appendChild(renderPhoto(item));
    });
    picturesList.appendChild(photosFragment);
  };

  var successHandler = function (data) {
    window.photos = data;
    window.renderPhotos(window.photos);
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

  var createComments = function (bigPicPhoto, lazyLoaded, comment) {
    bigPicPhoto.comments.forEach(function (item) {
      if (lazyLoaded.length !== 5) {
        lazyLoaded.push(item);
      }
    });
    lazyLoaded.forEach(function (item) {
      var commentElement = comment.cloneNode(true);
      commentElement.querySelector('.social__picture').src = item.avatar;
      commentElement.querySelector('.social__text').textContent = item.message;
      commentsFragment.appendChild(commentElement);
    });
    return commentsFragment;
  };
  var loadComments = function (comment, template) {
    var commentElement = template.cloneNode(true);
    commentElement.querySelector('.social__picture').src = comment.avatar;
    commentElement.querySelector('.social__text').textContent = comment.message;
    commentsFragment.appendChild(commentElement);
    return commentsFragment;
  };

  var renderBigPhoto = function (bigPicturePhoto) {
    var bigPicture = document.querySelector('.big-picture');
    bigPicture.classList.remove('hidden');
    var commentsCount = bigPicture.querySelector('.comments-count');
    var commentsLoader = document.querySelector('.comments-loader');
    commentsLoader.classList.remove('visually-hidden');

    var defaultCommentsNode = document.createTextNode('5 из ');
    commentsCount.parentNode.removeChild(commentsCount.previousSibling);
    commentsCount.parentNode.insertBefore(defaultCommentsNode, commentsCount);

    var commentsCounter = 5;
    var lazyLoadedComments = [];

    var commentsTemplate = bigPicture.querySelector('.social__comment');
    bigPicture.querySelector('.big-picture__img img').src = bigPicturePhoto.url;
    bigPicture.querySelector('.likes-count').textContent = bigPicturePhoto.likes;
    commentsCount.textContent = bigPicturePhoto.comments.length;

    if (bigPicturePhoto.comments.length < 5) {
      var fewCommentsNode = document.createTextNode(bigPicturePhoto.comments.length + ' из ');
      commentsCount.parentNode.removeChild(bigPicture.querySelector('.comments-count').previousSibling);
      commentsCount.parentNode.insertBefore(fewCommentsNode, bigPicture.querySelector('.comments-count'));
      commentsLoader.classList.add('visually-hidden');
    }

    bigPicture.querySelector('.social__comments').innerHTML = '';
    bigPicture.querySelector('.social__comments').appendChild(createComments(bigPicturePhoto, lazyLoadedComments, commentsTemplate));
    bigPicture.querySelector('.social__caption').textContent = bigPicturePhoto.description;

    commentsLoader.addEventListener('click', function () {
      commentsCounter = commentsCounter + 5;
      if (lazyLoadedComments.length < bigPicturePhoto.comments.length) {
        for (var i = 0; i < commentsCounter; i++) {
          if (bigPicturePhoto.comments[i] === undefined) {
            break;
          }
          if (lazyLoadedComments.indexOf(bigPicturePhoto.comments[i]) === -1) {
            lazyLoadedComments.push(bigPicturePhoto.comments[i]);
            bigPicture.querySelector('.social__comments').appendChild(loadComments(lazyLoadedComments[i], commentsTemplate));
          }
        }
        var dynamicCommentsNode = document.createTextNode(lazyLoadedComments.length + ' из ');
        commentsCount.parentNode.removeChild(bigPicture.querySelector('.comments-count').previousSibling);
        commentsCount.parentNode.insertBefore(dynamicCommentsNode, bigPicture.querySelector('.comments-count'));
        if (lazyLoadedComments.length === bigPicturePhoto.comments.length) {
          commentsLoader.classList.add('visually-hidden');
        }
      }
    });

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
})();
