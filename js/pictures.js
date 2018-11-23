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
var bigPicturePhoto;

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
  bigPicturePhoto = photos[0];
  return photos;
};

var renderPhoto = function (photo) {
  var photoElement = picturesTemplate.cloneNode(true);
  photoElement.querySelector('.picture__img').src = photo.url;
  photoElement.querySelector('.picture__likes').textContent = photo.likes;
  photoElement.querySelector('.picture__comments').textContent = photo.comments.length;
  return photoElement;
};
getPhotos().forEach(function (item) {
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
var renderBigPhoto = function () {
  var bigPicture = document.querySelector('.big-picture');
  bigPicture.classList.remove('hidden');
  var commentsTemplate = bigPicture.querySelector('.social__comment');
  bigPicture.querySelector('.big-picture__img img').src = bigPicturePhoto.url;
  bigPicture.querySelector('.likes-count').textContent = bigPicturePhoto.likes;
  bigPicture.querySelector('.comments-count').textContent = bigPicturePhoto.comments.length;
  bigPicture.querySelector('.social__comments').innerHTML = '';
  bigPicture.querySelector('.social__comments').appendChild(createComments(bigPicturePhoto, commentsTemplate));
  bigPicture.querySelector('.social__caption').textContent = bigPicturePhoto.description;
};
renderBigPhoto();

document.querySelector('.social__comment-count').classList.add('visually-hidden');
document.querySelector('.comments-loader').classList.add('visually-hidden');
