angular.module('LGApp')
    .factory('apiService',
        ['$http', '$rootScope', '$timeout',
            function ($http, $rootScope, $timeout) {
                var service = {};
                var baseUrl = 1==1 ? 'http://campuslgadmdev.mblabs.com.br/api/' : 'http://localhost:13200/api/'; //ALTERAR AQUI
				
                var header = {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json',
                    'token' : ''
                };

                service.getMenuCategories = function (token) {
                    header.token = token;

                    var promise = $http({
                        url: baseUrl + 'MenuCategory/GetMenuTree',
                        method: 'GET',
                        headers: header
                    }).then(function (response) {
                        return response;
                    }).catch(function (e) {
                        return e;

                    });

                    return promise;
                };

                service.getFeaturedCategories = function (token) {
                    header.token = token;

                    var promise = $http({
                        url: baseUrl + 'MenuCategory/FeaturedList',
                        method: 'GET',
                        headers: header
                    }).then(function (response) {
                        return response;
                    }).catch(function (e) {
                        return e;
                    });

                    return promise;
                };

                service.getHomeSliders = function (token) {
                    header.token = token;

                    var promise = $http({
                        url: baseUrl + 'Slider/Get',
                        method: 'GET',
                        headers: header
                    }).then(function (response) {
                        return response;
                    }).catch(function (e) {
                        return e;
                    });

                    return promise;
                };

                service.getProductsByCategory = function (categoryId, token) {
                    header.token = token;

                    var promise = $http({
                        url: baseUrl + 'Product/List?menuCategoryId=' + categoryId,
                        method: 'GET',
                        headers: header
                    }).then(function (response) {
                        return response;
                    }).catch(function (e) {
                        return e;
                    });

                    return promise;
                };

                service.getFeaturedProducts = function (token) {
                    header.token = token;

                    var promise = $http({
                        url: baseUrl + 'Product/FeaturedList',
                        method: 'GET',
                        headers: header
                    }).then(function (response) {
                        return response;
                    }).catch(function (e) {
                        return e;
                    });

                    return promise;
                };

                service.getProductById = function (productId, token) {
                    header.token = token;

                    var promise = $http({
                        url: baseUrl + 'Product/Detail?productId=' + productId,
                        method: 'GET',
                        headers: header
                    }).then(function (response) {
                        return response;
                    }).catch(function (e) {
                        return e;
                    });

                    return promise;
                };

                service.getNextVideo = function (currentVideoId, token) {
                    header.token = token;

                    var promise = $http({
                        url: baseUrl + 'Quiz/GetNextVideoByCurrentVideoId?videoId=' + currentVideoId,
                        method: 'GET',
                        headers: header
                    }).then(function (response) {
                        return response;
                    }).catch(function (e) {
                        return e;
                    });

                    return promise;
                };

                service.getQuestionsByVideoId = function (videoId, token) {
                    header.token = token;

                    var promise = $http({
                        url: baseUrl + 'Quiz/GetByVideoId?videoId=' + videoId,
                        method: 'GET',
                        headers: header
                    }).then(function (response) {
                        return response;
                    }).catch(function (e) {
                        return e;
                    });

                    return promise;
                };

                service.authenticate = function (sessionId, token) {
                    header.token = token;

                    var promise = $http({
                        url: baseUrl + 'UserMobile/Authenticate?sessionId=' + sessionId,
                        method: 'GET',
                        headers: header
                    }).then(function (response) {
                        return response;
                    }).catch(function (e) {
                        return e;
                    });

                    return promise;
                };

                service.getTotalPrize = function (token) {
                    header.token = token;

                    var promise = $http({
                        url: baseUrl + 'UserMobile/getTotalPrize',
                        method: 'GET',
                        headers: header
                    }).then(function (response) {
                        return response;
                    }).catch(function (e) {
                        return e;
                    });

                    return promise;
                };

                service.getCompletionPercentage = function (token) {
                    header.token = token;

                    var promise = $http({
                        url: baseUrl + 'UserMobile/getCompletionPercentage',
                        method: 'GET',
                        headers: header
                    }).then(function (response) {
                        return response;
                    }).catch(function (e) {
                        return e;
                    });

                    return promise;
                };


                service.answerQuiz = function (answer, token) {
                    header.token = token;

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
                        return e;
                    });

                    return promise;
                };

                service.answerOpen = function (questionId, answer, token) {
                    header.token = token;

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
                        return e;
                    });

                    return promise;
                };

                service.quizRate = function (videoId, ratingValue, token) {
                    header.token = token;

                    var promise = $http({
                        url: baseUrl + 'quizVideo/rating',
                        method: 'POST',
                        dataType: 'jsonp',
                        headers: header,
                        data: {
                            "VideoId": videoId,
                            "RatingValue": ratingValue
                        }
                    }).then(function (response) {
                        return response;
                    }).catch(function (e) {
                        return e;
                    });

                    return promise;
                };

                service.markVideoWatched = function (videoId, token) {
                    header.token = token;

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
