'use strict';

(function () {
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

  var getComments = function (allComents) {
    var comments = [];
    for (var i = 0; i < window.getRandomNumber(1, 2); i++) {
      comments.push(allComents[window.getRandomNumber(null, 5)]);
    }
    return comments;
  };
  var CreatePhoto = function (index, likes, comments, description) {
    this.url = 'photos/' + index + '.jpg';
    this.likes = likes;
    this.comments = comments;
    this.description = description[window.getRandomNumber(null, 5)];
  };
  window.getPhotos = function () {
    var photos = [];
    for (var i = 1; i < 26; i++) {
      photos.push(new CreatePhoto(i, window.getRandomNumber(15, 200), getComments(commentsList), descriptionsList));
    }
    return photos;
  };
})();
