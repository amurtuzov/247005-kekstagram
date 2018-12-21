'use strict';

(function () {
  var NEW_PHOTOS_QUANTITY = 10;
  var imgFilter = document.querySelector('.img-filters');
  var byPopuparButton = imgFilter.querySelector('#filter-popular');
  var byNewButton = imgFilter.querySelector('#filter-new');
  var byCommentsButton = imgFilter.querySelector('#filter-discussed');
  var filterButtons = [byPopuparButton, byNewButton, byCommentsButton];

  var doFilter = function (activeId, photos) {
    filterButtons.forEach(function (button) {
      if (button.id === activeId) {
        button.classList.add('img-filters__button--active');
      } else {
        button.classList.remove('img-filters__button--active');
      }
    });
    window.gallery.removePictures('.picture');
    window.gallery.renderPhotos(photos);
  };

  var filterByPopular = function () {
    doFilter(byPopuparButton.id, window.gallery.photos);
  };

  var filterByNew = function () {
    var copy = window.gallery.photos.slice(0);
    var newPhotos = window.utils.shuffle(copy).slice(0, NEW_PHOTOS_QUANTITY);
    doFilter(byNewButton.id, newPhotos);
  };

  var filterByComments = function () {
    var copy = window.gallery.photos.slice(0);
    var compareComments = function (a, b) {
      return b.comments.length - a.comments.length;
    };
    var sorted = copy.sort(compareComments);
    doFilter(byCommentsButton.id, sorted);
  };

  var filterInit = function () {
    byCommentsButton.addEventListener('click', window.utils.debounce(filterByComments));
    byNewButton.addEventListener('click', window.utils.debounce(filterByNew));
    byPopuparButton.addEventListener('click', window.utils.debounce(filterByPopular));
    imgFilter.classList.remove('img-filters--inactive');
  };

  filterInit();

})();
