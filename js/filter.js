'use strict';

(function () {
  var imgFilter = document.querySelector('.img-filters');
  var byPopuparButton = imgFilter.querySelector('#filter-popular');
  var byNewButton = imgFilter.querySelector('#filter-new');
  var byCommentsButton = imgFilter.querySelector('#filter-discussed');

  imgFilter.classList.remove('img-filters--inactive');
  var filterByPopular = function () {
    window.removePictures('.picture');
    byPopuparButton.classList.add('img-filters__button--active');
    byNewButton.classList.remove('img-filters__button--active');
    byCommentsButton.classList.remove('img-filters__button--active');
    updatePhotos(window.photos);
  };
  byPopuparButton.addEventListener('click', window.debounce(filterByPopular));

  var filterByNew = function () {
    window.removePictures('.picture');
    var copy = window.photos.slice(0);
    byNewButton.classList.add('img-filters__button--active');
    byPopuparButton.classList.remove('img-filters__button--active');
    byCommentsButton.classList.remove('img-filters__button--active');
    var newPhotos = window.shuffle(copy).slice(0, 10);
    updatePhotos(newPhotos);
  };
  byNewButton.addEventListener('click', window.debounce(filterByNew));

  var filterByComments = function () {
    window.removePictures('.picture');
    var copy = window.photos.slice(0);
    byCommentsButton.classList.add('img-filters__button--active');
    byNewButton.classList.remove('img-filters__button--active');
    byPopuparButton.classList.remove('img-filters__button--active');
    var compareComments = function (a, b) {
      if (a.comments.length < b.comments.length) {
        return 1;
      } else if (a.comments.length > b.comments.length) {
        return -1;
      } else {
        return 0;
      }
    };
    var sorted = copy.sort(compareComments);
    updatePhotos(sorted);
  };
  byCommentsButton.addEventListener('click', window.debounce(filterByComments));
  var updatePhotos = function (photos) {
    window.renderPhotos(photos);
  };
})();
