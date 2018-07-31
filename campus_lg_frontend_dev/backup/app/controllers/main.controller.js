var LGApp = angular.module("LGApp", ['ngRoute', 'ngCookies', 'ngSanitize', 'ngVideo', 'youtube-embed']);

LGApp.controller("MainController", function ($scope, $rootScope, $cookies, $location, $timeout, video, apiService, $sce, $http, $interval) {

        $scope.sectionLoading = true;
        $scope.videoFinished = false;
        $scope.showGoToNextBtn = false;
        $scope.showOpenTextGoToNextBtn = false;
        $scope.asnswered = false;
        $scope.blockAnswerClick = false;
        $rootScope.userLogged = false;
        $scope.quizNumber = 1;
        $scope.answeredType = 0;
        $scope.answerAmount = 0;
        $scope.currentSiteUrl = $location.protocol() + '://' + $location.host() + '' + ($location.port() > 0 ? ':' + $location.port() : '');
        $scope.currentVideoId = $location.search().video != undefined ? $location.search().video : null;
        $scope.multipleAnsweredQuestions = [];
        $rootScope.userProfile = {};
        $rootScope.userIsLogged = false;
        $scope.showFinishMultipleBtn = false;
        $scope.isFullDescriptionVisible = false;
        $scope.isVideoAlreadyRated = false;

        $scope.selectedRatingStars = [
            {
                id: 1,
                class: 'fa-star-o'
            }, {
                id: 2,
                class: 'fa-star-o'
            }, {
                id: 3,
                class: 'fa-star-o'
            }, {
                id: 4,
                class: 'fa-star-o'
            }, {
                id: 5,
                class: 'fa-star-o'
            },
        ];

        $scope.setRatingStar = function (event, star) {
            angular.forEach($scope.selectedRatingStars, function (starE, index) {
                if (starE.id <= star.id) {
                    $scope.selectedRatingStars[index].class = 'fa-star';
                } else {
                    $scope.selectedRatingStars[index].class = 'fa-star-o';
                }
            });
        }

        $scope.rateQuizExperience = function () {
            var ratingAmount = $scope.selectedRatingStars.filter(function (stars) {
                return stars.class == 'fa-star';
            }).length;

            apiService.quizRate($scope.currentWatchingVideo.Id, ratingAmount, $cookies.getObject('userData') != undefined ? $cookies.getObject('userData').Token : 'XXX').then(function (response) {
                console.log($scope.currentWatchingVideo.Id)
                console.log(ratingAmount)
                //TODO: consertar o combination not found
                $scope.isVideoAlreadyRated = true;

                if (response.data != undefined && response.data.ResultStatus != "ERROR") {
                    $scope.isVideoAlreadyRated = true;
                }
            })
        }

        resetProductInfo();
        sessionVerify();
        windowVerify();

        $scope.youtubePlayerOptions = {
            controls: 0,
            autoplay: 0,
            rel: 0,
            showinfo: 0
        };

        function loadStuff(loggedUser) {

            $rootScope.userIsLogged = loggedUser;
            var userToken = loggedUser && $cookies.getObject('userData') != undefined ? $cookies.getObject('userData').Token : 'XXX';

            if (loggedUser) {
                getUserProfile($cookies.get('sessionId'));
                //e1a79ad3-3017-4dc0-8f3c-2d7338e602ee
            }

            loadSliders();

            $rootScope.$watch('youtubePlayer', function () {
                if ($rootScope.youtubePlayer != undefined) {
                    $scope.youtubePlayer = $rootScope.youtubePlayer;
                }
            });

            $rootScope.$watch('playing', function () {
                if ($rootScope.playing) {
                    $scope.currentWatchingVideo.FirstlyPlayed = true;
                }
            });

            $rootScope.windowRefresh = function (goToLink) {
                $timeout(function () {
                    window.location.replace(goToLink);
                }, 0)
            }

            $scope.onReadySwiper = function (swiper) {
                swiper.initObservers();
            };

            apiService.getMenuCategories().then(function (response) {
                if (response != undefined) {
                    $rootScope.menuItems = response.data.ReturnData;
                }
            });

            apiService.getFeaturedCategories().then(function (response) {
                if (response != undefined) {
                    $rootScope.featuredCategories = response.data.ReturnData;
                }
            });

            apiService.getSliders().then(function (response) {
                showLoading();
                if (response != undefined) {
                    $rootScope.sliderItems = response.data.ReturnData;
                }
                hideLoading();
            });

            if ($location.path().indexOf('categoria') > -1) {
                getCategoryStuff($location.path().split('/')[2]);
            }

            function getUserProfile(sessionId) {

                apiService.authenticate(sessionId).then(function (response) {
                    if (response != undefined) {
                        response.data.ReturnData.TotalPrize = parseInt(response.data.ReturnData.TotalPrize);
                        $rootScope.userProfile = response.data.ReturnData;

                        if (response.data.ReturnData != null) {
                            apiService.getCompletionPercentage(response.data.ReturnData.Token).then(function (response) {
                                $rootScope.userProfile.completionPercentage = response.data.ReturnData;
                                $timeout(function () {
                                    var $mainProgressLoader2 = $("#mainProgressLoader").percentageLoader({
                                        width: 256,
                                        height: 256,
                                        controllable: false,
                                        progress: 1,
                                        maximumProgress: response.data.ReturnData,
                                        bottomText: 'dos módulos.'
                                    });
                                    var mainProgressLoaderRunning2 = false;
                                    $mainProgressLoader2.percentageLoader({
                                        onready: function () {
                                            if (mainProgressLoaderRunning2) {
                                                return;
                                            }
                                            mainProgressLoaderRunning2 = true;
                                            var kb2 = 0;
                                            var totalKb2 = 350;
                                            var animateFunc2 = function () {
                                                kb2 += 5;
                                                $mainProgressLoader2.percentageLoader({progress: kb2 / totalKb2});
                                                if (kb2 < totalKb2) {
                                                    setTimeout(animateFunc2, 25);
                                                } else {
                                                    mainProgressLoaderRunning2 = false;
                                                }
                                            };
                                            setTimeout(animateFunc2, 25);
                                        }
                                    });

                                }, 100)
                            });
                            $cookies.putObject('userData', response.data.ReturnData);
                        }
                    }
                });
            }

            function getTotalPrize() {
                apiService.getTotalPrize(userToken).then(function (response) {
                    if (response != undefined) {
                        $rootScope.userTotalPrize = parseInt(response.data.ReturnData);
                    }
                });
            }

            $rootScope.$watch('openAnswer', function () {
                if ($rootScope.openAnswer != undefined) {
                    if ($rootScope.openAnswer.length >= 10) {
                        $scope.answeredType = 1;
                        $scope.showOpenTextGoToNextBtn = true;
                    } else {
                        $scope.showOpenTextGoToNextBtn = false;
                    }
                }
            });

            $scope.goToNextVideo = function (currentVideoId) {
                apiService.getNextVideo(currentVideoId, userToken).then(function (response) {
                    setCurrentWatchingVideo(response.data.ReturnData.Id, false);
                });
            }

            if ($location.path().indexOf('produto') > -1) {
                loadCurrentProduct($location.path().split('/')[2]);
            }

            function setCurrentProduct(product) {
                $scope.currentProduct = product;

                console.log(product)
                if (product.ProductVideoList && product.ProductVideoList.length > 0) {
                    $scope.currentProduct.ProductHasVideos = true;

                    if ($scope.currentVideoId == null) {
                        $scope.currentVideoId = $scope.currentProduct.ProductVideoList[0].Id;
                    }

                } else {
                    $scope.currentProduct.ProductHasVideos = false;
                }
            }

            function setCurrentWatchingVideo(videoId, isYoutube) {
                angular.forEach($scope.currentProduct.ProductVideoList, function (productVideo) {
                    if (productVideo.Id == videoId) {

                        productVideo.isYoutubeVideo = productVideo.VideoSourceType == 2 ? true : false;

                        if (productVideo.isYoutubeVideo) {
                            $scope.isYoutubeVideo = true;
                            $scope.currentWatchingVideo = productVideo;
                            //$scope.currentWatchingVideo.YoutubeVideoId = 'ObzSNZR9FZ4';
                            $scope.currentWatchingVideo.YoutubeVideoId = productVideo.VideoPath.split('?v=')[1];
                        } else {
                            $scope.isYoutubeVideo = false;
                            $scope.currentWatchingVideo = productVideo;
                            video.addSource('mp4', productVideo.VideoPath);
                        }

                        $scope.currentWatchingVideo.ShowVideoMask = false;
                        $scope.currentWatchingVideo.FirstlyPlayed = false;
                    }
                });
            }

            function setCurrentWatchingVideoQuestions(video) {

                $scope.currentWatchingVideoQuestions = video.ProductVideoQuestionList;
                $scope.currentWatchingVideoQuestions.QuestionsCount = video.ProductVideoQuestionList.length;

                if (video.ProductVideoQuestionList && video.ProductVideoQuestionList.length > 0) {
                    $scope.currentWatchingVideoQuestions.VideoHasQuestions = true;
                } else {
                    $scope.currentWatchingVideoQuestions.VideoHasQuestions = false;
                }
            }

            function setCurrentWatchingVideoAnswers(questions) {
                if (questions && questions.length > 0) {
                    angular.forEach(questions, function (questionItem, questionItemIndex) {
                        questions[questionItemIndex].QuestionItemList = randomizeAnswers(questionItem.QuestionItemList);
                    });
                    $scope.currentWatchingVideoAnswers = questions;
                    $scope.currentWatchingVideoAnswers.QuestionHasAnswers = true;
                } else {
                    $scope.currentWatchingVideoAnswers.QuestionHasAnswers = false;
                }
            }

            function randomizeAnswers(randomizeArray) {
                var m = randomizeArray.length, t, i;
                while (m) {
                    i = Math.floor(Math.random() * m--);
                    t = randomizeArray[m];
                    randomizeArray[m] = randomizeArray[i];
                    randomizeArray[i] = t;
                }

                return randomizeArray;
            }

            $scope.pauseTheVideo = function () {
                $rootScope.player.pause();
            }

            $scope.playTheVideo = function () {
                $rootScope.player.play();
            }

            $scope.removeTheVideo = function () {
                video.resetSource();
            }

            $scope.changecurrentWatchingVideo = function (newVideo) {
                console.log(newVideo)
                $scope.removeTheVideo();
                resetProductInfo();
                $scope.currentVideoId = newVideo.Id;
                loadCurrentProduct($location.path().split('/')[2]);
                goToCoordinate('.product-video-section', 500);
            }

            function loadCurrentProduct(productId) {

                showLoading();

                loadingEvents('start', 0);

                apiService.getProductById(productId, userToken).then(function (response) {
                    if (response != undefined) {
                        setCurrentProduct(response.data.ReturnData.Product);
                        setCurrentWatchingVideo($scope.currentVideoId, false);
                        setCurrentWatchingVideoQuestions($scope.currentWatchingVideo);
                        setCurrentWatchingVideoAnswers($scope.currentWatchingVideoQuestions);
                        $rootScope.currentTime = 0;

                        $rootScope.$watch('currentTime', function () {

                            if ($scope.currentWatchingVideo.isYoutubeVideo) {
                                $rootScope.playing = $scope.youtubePlayer.getPlayerState() == 1 ? true : false;
                            }

                            if ($scope.currentWatchingVideoQuestions.VideoHasQuestions) {
                                if ($rootScope.currentTime != undefined) {
                                    angular.forEach($scope.currentWatchingVideoQuestions, function (videoQuestion, videoQuestionIndex) {
                                        if (videoQuestion.Showtime != "REMOVED" && $rootScope.currentTime > 0) {

                                            var showTime = (parseInt(videoQuestion.Showtime.split(':')[0] * 60) + parseInt(videoQuestion.Showtime.split(':')[1])).toFixed(6);

                                            if ($rootScope.currentTime >= showTime) {
                                                if ($scope.currentWatchingVideo.isYoutubeVideo) {
                                                    $scope.youtubePlayer.pauseVideo();
                                                } else {
                                                    $scope.pauseTheVideo();
                                                }

                                                $scope.currentWatchingVideo.ProductVideoQuestionList[videoQuestionIndex].Showtime = "REMOVED";
                                                $scope.currentWatchingVideo.ShowVideoMask = true;
                                            }
                                        }
                                    });
                                }
                            }

                            if ($rootScope.currentTime != undefined && $rootScope.duration != undefined && $rootScope.duration > 0) {
                                if ($rootScope.currentTime >= $rootScope.duration) {
                                    $scope.currentWatchingVideo.videoFinished = true;
                                    apiService.markWVideoatched($scope.currentWatchingVideo.Id, $cookies.getObject('userData') != undefined ? $cookies.getObject('userData').Token : 'XXX').then(function (response) {
                                        //TODO: consertar o combination not found
                                    });
                                }
                            }
                        });

                        loadCurrentProductPercentageCounter(response.data.ReturnData.LoggedUserCompletionPercentage);
                    }

                    loadingEvents('finish', 1000);
                    hideLoading();
                });
            }


            $scope.replayTheVideo = function (video) {
                if ($scope.currentWatchingVideo.isYoutubeVideo) {
                    $scope.youtubePlayer.playVideo();
                } else {
                    $scope.playTheVideo();
                }

                $scope.currentWatchingVideo.FirstlyPlayed = true;
                $scope.currentWatchingVideo.videoFinished = false;
            }

            function loadingEvents(action, delay) {
                $timeout(function () {
                    if (action == 'start') {
                        $('.event-loader').fadeIn();
                    } else if (action == 'finish') {
                        $('.event-loader').fadeOut();
                    }
                }, delay)
            }

            $scope.formatTimeToMinSec = function (time) {
                var minutes = Math.floor(time / 60);
                var seconds = time - minutes * 60;

                return ("00" + parseInt(minutes)).slice(-2) + ':' + ("00" + parseInt(seconds)).slice(-2);
            }

            apiService.getFeaturedProducts(userToken).then(function (response) {
                showLoading();
                if (response != undefined) {
                    $scope.featuredProductsList = response.data.ReturnData;
                }
                hideLoading();
            });

            $scope.answerQuiz = function (answer, event, answerType) {

                if (!$scope.blockAnswerClick) {

                    if (answerType != 3) {
                        $("[data-correct]").each(function () {
                            if ($(this).data('correct')) {
                                $(this).addClass('correct-answer');
                            } else {
                                $(this).addClass('wrong-answer');
                            }
                        });

                        $scope.showFinishMultipleBtn = false;
                        $scope.showGoToNextBtn = true;
                    } else {
                        $scope.showFinishMultipleBtn = true;
                        $scope.showGoToNextBtn = false;
                    }

                    $(event.currentTarget).addClass('selected-answer');
                    $scope.currentAnsweredQuestion = answer.Id;
                    $scope.currentAnsweringQuestion.questionAnswered = true;


                    $scope.answeredType = answerType;

                    if (answerType == 2) {
                        $scope.blockAnswerClick = true;
                    } else if (answerType == 3) {
                        $scope.multipleAnsweredQuestions.push(answer.Id);
                        $scope.answerAmount = $scope.answerAmount + 1;

                        if ($scope.answerAmount == 2) {
                            $scope.blockAnswerClick = true;
                        }
                    } else if (answerType == 4) {
                        $scope.informativeQuestion = answer.Id;
                    }
                }
            }

            $scope.finishMultipleQuestionAnswer = function () {
                $scope.showFinishMultipleBtn = false;
                $scope.showGoToNextBtn = true;

                $("[data-correct]").each(function () {
                    if ($(this).data('correct')) {
                        $(this).addClass('correct-answer');
                    } else {
                        $(this).addClass('wrong-answer');
                    }
                });
            }

            $scope.continueVideo = function (answeredQuestionId, openAnswer, isInformativeAnswer) {
                $scope.showGoToNextBtn = false;
                $scope.showFinishMultipleBtn = false;

                $scope.showOpenTextGoToNextBtn = false;
                $rootScope.openAnswer = "";
                $scope.currentWatchingVideo.ShowVideoMask = false;

                if ($scope.currentWatchingVideo.isYoutubeVideo) {
                    $scope.youtubePlayer.playVideo();
                } else {
                    $scope.playTheVideo();
                }

                $scope.quizNumber = $scope.quizNumber + 1;
                $scope.currentAnsweringQuestion.questionAnswered = false;
                $scope.blockAnswerClick = false;
                $scope.answerAmount = 0;

                if ($scope.answeredType == 1) {
                    apiService.answerOpen(answeredQuestionId, openAnswer, userToken).then(function (response) {
                    });
                } else if ($scope.answeredType == 2 || $scope.answeredType == 3) {
                    if ($scope.answeredType == 3) {
                        angular.forEach($scope.multipleAnsweredQuestions, function (question) {
                            apiService.answerQuiz(question, userToken).then(function (response) {
                            });
                        })
                    } else {
                        apiService.answerQuiz($scope.currentAnsweredQuestion, userToken).then(function (response) {
                        });
                    }
                } else if (isInformativeAnswer) {
                    apiService.answerOpen(answeredQuestionId, openAnswer, userToken).then(function (response) {
                    });
                }
            }

            $scope.replayVideo = function () {

                if ($scope.currentWatchingVideo.isYoutubeVideo) {
                    $scope.youtubePlayer.playVideo();
                } else {
                    $scope.playTheVideo();
                }

                $scope.currentWatchingVideo.videoFinished = false;
                $scope.currentAnsweringQuestion.questionAnswered = false;
                $scope.currentWatchingVideo.FirstlyPlayed = true;
                $rootScope.currentTime = 0;
                $scope.quizNumber = 1;
            }

            $scope.toTrustedHTML = function (html) {
                return $sce.trustAsHtml(html);
            }

            $scope.playlistOpen = false;

            $scope.playVideo = function (sourceUrl) {
                video.addSource('mp4', sourceUrl, true);
            };

            $timeout(function () {
                $(function () {
                    $('.navbar-nav a').on('click', function (e) {
                        e.preventDefault();
                    });
                });

            }, 0);

            if ($location.path().indexOf('produto') > -1) {
                angular.forEach($scope.products, function (product, index) {
                    if ($location.path().split('/')[2] == product.id) {
                        $scope.productSingle = product;
                    }
                });
            }
        }

        $scope.showProductFullDescription = function () {
            $('#productInfo').collapse('toggle');

            if ($scope.isFullDescriptionVisible) {
                $scope.isFullDescriptionVisible = false;
            } else {
                $scope.isFullDescriptionVisible = true;
            }
        }

        $rootScope.userLogout = function () {
            removeCookies();
            location.reload();
        }


        function goToCoordinate(element, duration) {
            $('html, body').animate({
                scrollTop: $(element).offset().top
            }, duration);
        }

        function resetProductInfo() {

            $rootScope.currentTime = 0;

            $scope.currentProduct = {
                ProductHasVideos: true
            };

            $scope.currentWatchingVideo = {
                ProductVideoQuestionList: [],
                ShowVideoMask: false,
                videoFinished: false,
                FirstlyPlayed: false
            };

            $scope.currentWatchingVideoQuestions = {
                VideoHasQuestions: false,
                QuestionsCount: 0
            };

            $scope.currentWatchingVideoAnswers = [{
                QuestionHasAnswers: false
            }];

            $scope.currentAnsweringQuestion = {
                questionAnswered: false
            };
        }

        function sessionVerify() {
            //todo: remover http://campuslg.com.br?sessao=e1a79ad3-3017-4dc0-8f3c-2d7338e602ee
            if ($location.search().sessao != undefined) {
                removeCookies();
                $cookies.put('sessionId', $location.search().sessao);
                $cookies.put('logged', true);
                $location.search('sessao', null);
                location.reload();
            }

            if ($cookies.get('logged')) {
                loadStuff($cookies.get('logged') != undefined ? true : false);
            }
        }

        function showLoading() {
            $scope.sectionLoading = true;
        }

        function hideLoading() {
            $timeout(function () {
                $scope.sectionLoading = false;
            }, 1000)
        }

        function getCategoryStuff(categoryId) {
            showLoading();
            apiService.getProductsByCategory(categoryId).then(function (response) {
                if (response != undefined) {
                    $rootScope.categoryInfo = response.data.ReturnData.MenuCategory;
                    $rootScope.categoryProducts = response.data.ReturnData.ProductList;

                }

                hideLoading();
            });
        }

        function removeCookies() {
            var cookies = $cookies.getAll();
            angular.forEach(cookies, function (v, k) {
                $cookies.remove(k);
            });
        }

        function windowVerify() {
            $('.user-not-logged').css('height', ($(window).height() - 30) + 'px');
            $(window).on('resize', function () {
                $('.user-not-logged').css('height', ($(window).height() - 30) + 'px');
                if ((window.fullScreen) || (window.innerWidth == screen.width && window.innerHeight == screen.height)) {
                    $('.video').addClass('video-fs');
                } else {
                    $('.video').removeClass('video-fs');
                }
            });

            if ((window.fullScreen) || (window.innerWidth == screen.width && window.innerHeight == screen.height)) {
                $('.video').addClass('video-fs');
            } else {
                $('.video').removeClass('video-fs');
            }
        }

        $scope.toggleFullscreenVideo = function () {
            var elem = document.getElementById('youtubevideoitem');
            if (!document.fullscreenElement && !document.mozFullScreenElement &&
                !document.webkitFullscreenElement && !document.msFullscreenElement) {
                $(elem).addClass('isFullScreenVideo');
                if (elem.requestFullscreen) {
                    elem.requestFullscreen();
                } else if (elem.msRequestFullscreen) {
                    elem.msRequestFullscreen();
                } else if (elem.mozRequestFullScreen) {
                    elem.mozRequestFullScreen();
                } else if (elem.webkitRequestFullscreen) {
                    elem.webkitRequestFullscreen(Element.ALLOW_KEYBOARD_INPUT);
                }
            } else {
                $(elem).removeClass('isFullScreenVideo');
                if (document.exitFullscreen) {
                    document.exitFullscreen();
                } else if (document.msExitFullscreen) {
                    document.msExitFullscreen();
                } else if (document.mozCancelFullScreen) {
                    document.mozCancelFullScreen();
                } else if (document.webkitExitFullscreen) {
                    document.webkitExitFullscreen();
                }
            }
        }

        $timeout(function () {
            document.onkeydown = function (evt) {
                evt = evt || window.event;
                if (evt.keyCode == 27) {
                    $('#youtubevideoitem').removeClass('isFullScreenVideo');
                }
            };
        }, 10);
        function loadCurrentProductPercentageCounter(LoggedUserCompletionPercentage) {
            $timeout(function () {
                var $mainProgressLoader = $("#mainProgressLoaderInner").percentageLoader({
                    width: 256,
                    height: 256,
                    controllable: false,
                    progress: 1,
                    maximumProgress: LoggedUserCompletionPercentage,
                    bottomText: 'desse módulo.'
                });

                var mainProgressLoaderRunning = false;
                $mainProgressLoader.percentageLoader({
                    onready: function () {

                        if (mainProgressLoaderRunning) {
                            return;
                        }
                        mainProgressLoaderRunning = true;

                        var kb = 0;
                        var totalKb = 350;

                        var animateFunc = function () {
                            kb += 5;
                            $mainProgressLoader.percentageLoader({progress: kb / totalKb});

                            if (kb < totalKb) {
                                setTimeout(animateFunc, 25);
                            } else {
                                mainProgressLoaderRunning = false;
                            }
                        };
                        setTimeout(animateFunc, 25);
                    }
                });
            }, 100);
        }

        function loadSliders() {
            $timeout(function () {

                new Swiper('.home-slider', {
                    observer: true,
                    pagination: '.swiper-pagination',
                    slidesPerView: 1,
                    paginationClickable: true,
                    spaceBetween: 30,
                    centeredSlides: true,
                    initialSlide: 0,
                    lazyLoading: true,
                    onInit: function (swiper) {
                        setTimeout(function () {
                            swiper.slideTo(0, 0, true)
                        }, 1000);
                    }
                });

                new Swiper('.featured-products-slider', {
                    observer: true,
                    pagination: '.swiper-pagination',
                    slidesPerView: 4,
                    paginationClickable: true,
                    spaceBetween: 15,
                    initialSlide: 0,
                    lazyLoading: true,
                    onLazyImageLoad: true,
                    loop: false,
                    breakpoints: {
                        1024: {
                            slidesPerView: 1,
                            spaceBetween: 0
                        }
                    },
                    onInit: function (swiper) {
                        setTimeout(function () {
                            swiper.slideTo(0, 0, true)
                        }, 1000);
                    }
                });

                var categoriesSlider = new Swiper('.categories-products-slider', {
                    observer: true,
                    pagination: '.swiper-pagination',
                    slidesPerView: 4,
                    paginationClickable: true,
                    spaceBetween: 15,
                    initialSlide: 0,
                    lazyLoading: true,
                    onLazyImageLoad: true,
                    breakpoints: {
                        1024: {
                            slidesPerView: 1,
                            spaceBetween: 0
                        }
                    },
                    onInit: function (swiper) {
                        setTimeout(function () {
                            swiper.slideTo(0, 0, true)
                        }, 1000);
                    }
                });

                new Swiper('.product-modules-slider', {
                    observer: true,
                    pagination: '.swiper-pagination',
                    slidesPerView: 5,
                    paginationClickable: true,
                    spaceBetween: 15,
                    initialSlide: 0,
                    lazyLoading: true,
                    onLazyImageLoad: true,
                    breakpoints: {
                        1024: {
                            slidesPerView: 1,
                            spaceBetween: 0
                        }
                    },
                    onInit: function (swiper) {
                        setTimeout(function () {
                            swiper.slideTo(0, 0, true)
                        }, 1000);
                    }
                });

                $rootScope.goToSlideCategories = function (action) {
                    if (action == 'next') {
                        categoriesSlider.slideNext();
                    } else if ('prev') {
                        categoriesSlider.slidePrev();
                    }
                }
            }, 100)
        }
    }
).filter('character', function () {
    return function (input) {
        return String.fromCharCode(64 + parseInt(input, 10));
    };
})