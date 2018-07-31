angular.module('LGApp')
    .factory('apiService',
        ['$http', '$rootScope', '$timeout',
            function ($http, $rootScope, $timeout) {
                var service = {};
                var baseUrl = 'http://clubelg.mblabs.com.br/api/';
                var header = {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json',
                    'token' : 'XXX'
                };

                service.getMenuCategories = function () {
                    var promise = $http({
                        url: baseUrl + 'MenuCategory/GetMenuTree',
                        method: 'GET',
                        headers: header
                    }).then(function (response) {
                        return response;
                    }).catch(function (e) {

                    });

                    return promise;
                };

                service.getFeaturedCategories = function (token) {
                    var promise = $http({
                        url: baseUrl + 'MenuCategory/FeaturedList',
                        method: 'GET',
                        headers: header
                    }).then(function (response) {
                        return response;
                    }).catch(function (e) {
                    });

                    return promise;
                };

                service.getSliders = function () {
                    var promise = $http({
                        url: baseUrl + 'Slider/Get',
                        method: 'GET',
                        headers: header
                    }).then(function (response) {
                        return response;
                    }).catch(function (e) {

                    });

                    return promise;
                };

                service.getProductsByCategory = function (categoryId) {
                    var promise = $http({
                        url: baseUrl + 'Product/List?menuCategoryId=' + categoryId,
                        method: 'GET',
                        headers: header
                    }).then(function (response) {
                        return response;
                    }).catch(function (e) {

                    });

                    return promise;
                };

                service.getFeaturedProducts = function (token) {
                    var promise = $http({
                        url: baseUrl + 'Product/FeaturedList',
                        method: 'GET',
                        headers: header
                    }).then(function (response) {
                        return response;
                    }).catch(function (e) {

                    });

                    return promise;
                };

                service.getProductById = function (productId, token) {
                    var promise = $http({
                        url: baseUrl + 'Product/Detail?productId=' + productId,
                        method: 'GET',
                        headers: header
                    }).then(function (response) {
                        return response;
                    }).catch(function (e) {
                    });

                    return promise;
                };

                service.getNextVideo = function (currentVideoId, token) {
                    var promise = $http({
                        url: baseUrl + 'Quiz/GetNextVideoByCurrentVideoId?videoId=' + currentVideoId,
                        method: 'GET',
                        headers: header
                    }).then(function (response) {
                        return response;
                    }).catch(function (e) {
                    });

                    return promise;
                };

                service.getQuestionsByVideoId = function (videoId, token) {
                    var promise = $http({
                        url: baseUrl + 'Quiz/GetByVideoId?videoId=' + videoId,
                        method: 'GET',
                        headers: header
                    }).then(function (response) {
                        console.log(response.data)
                        return response;
                    }).catch(function (e) {
                    });

                    return promise;
                };

                service.authenticate = function (sessionId) {
                    var promise = $http({
                        url: baseUrl + 'UserMobile/Authenticate?sessionId=' + sessionId,
                        method: 'GET',
                        headers: header
                    }).then(function (response) {
                        return response;
                    }).catch(function (e) {
                    });

                    return promise;
                };

                service.getTotalPrize = function (token) {
                    var promise = $http({
                        url: baseUrl + 'UserMobile/getTotalPrize',
                        method: 'GET',
                        headers: header
                    }).then(function (response) {
                        return response;
                    }).catch(function (e) {
                    });

                    return promise;
                };

                service.getCompletionPercentage = function (token) {
                    var promise = $http({
                        url: baseUrl + 'UserMobile/getCompletionPercentage',
                        method: 'GET',
                        headers: header
                    }).then(function (response) {
                        return response;
                    }).catch(function (e) {
                    });

                    return promise;
                };


                service.answerQuiz = function (answer, token) {
                    var promise = $http({
                        url: baseUrl + 'quiz/answer',
                        method: 'POST',
                        dataType: 'jsonp',
                        headers: header,
                        data: {
                            'AnswerId': answer
                        }
                    }).then(function (response) {
                        return response;
                    }).catch(function (e) {
                    });

                    return promise;
                };

                service.answerOpen = function (questionId, answer, token) {

                    var promise = $http({
                        url: baseUrl + 'quiz/openanswer',
                        method: 'POST',
                        dataType: 'jsonp',
                        headers: header,
                        data: {
                            "QuestionId": questionId,
                            "OpenAnswer": answer
                        }
                    }).then(function (response) {
                        return response;
                    }).catch(function (e) {
                    });

                    return promise;
                };

                service.quizRate = function (videoId, ratingValue, token) {
                    var promise = $http({
                        url: baseUrl + 'quizVideo/rating',
                        method: 'POST',
                        dataType: 'jsonp',
                        headers: header,
                        data: {
                            "VideoId": videoId,
                            "RatingValue ": ratingValue
                        }
                    }).then(function (response) {
                        return response;
                    }).catch(function (e) {
                        return e;
                    });

                    return promise;
                };

                service.markWVideoatched = function (videoId, token) {
                    var promise = $http({
                        url: baseUrl + 'quizVideo/watched',
                        method: 'POST',
                        dataType: 'jsonp',
                        headers: header,
                        data: {
                            "VideoId": videoId
                        }
                    }).then(function (response) {
                        return response;
                    }).catch(function (e) {
                        return e;
                    });

                    return promise;
                };

                return service;
            }
        ]);
