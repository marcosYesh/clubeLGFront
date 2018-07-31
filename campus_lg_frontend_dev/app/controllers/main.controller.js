LGApp.controller("MainController", function ($scope, $rootScope, $cookies, $location, $timeout, video, apiService, $sce, $http, $interval, $routeParams) {

        $rootScope.sectionLoading = true;
        $rootScope.userProfile = {};
        $rootScope.userIsLogged = false;
        $rootScope.userToken = "";

		$scope.xxx = function(a) {
			console.log(a);
		};
		
        $rootScope.userAuthWithSessionId = function (callback) {
            var sessionId = $location.search().sessao != undefined ? $location.search().sessao : $cookies.getObject('userData') != undefined ? $cookies.getObject('userData').SessionId : null;

            apiService.authenticate(sessionId).then(function (response) {
                if (response.data.ResultStatus == "SUCCESS") {
                    response.data.ReturnData.SessionId = sessionId;
                    $cookies.putObject('userData', response.data.ReturnData);
                    $rootScope.userIsLogged = true;
                    $rootScope.userProfile = response.data.ReturnData;
                    $cookies.getObject('userData').Token = response.data.ReturnData.Token;

                    $timeout(function () {
                        $rootScope.loadStuff(response.data.ReturnData.Token, [
                            'menuCategories',
                            'featuredCategories',
                            'featuredProducts',
                            'homeSliders',
                            'totalPrize',
                            'totalCompletionPercentage',
                            'productsByCategory'
                        ], $routeParams.categoryId);
                    }, 200);

                    if ($location.search().sessao != undefined) {
                        $location.search('sessao',null);
                    }
                    if (callback != undefined) {
                        callback(response.data.ReturnData);
                    }
                } else {
                    $location.path('autenticacao-requerida');
                }

                return true;

            });


        }

        $rootScope.loadStuff = function (userToken, loadItems, categoryId) {
            var loaded = [];
            $rootScope.sectionLoading = true;
            angular.forEach(loadItems, function (loadItem) {
                if (loadItem == 'menuCategories') {
                    apiService.getMenuCategories(userToken).then(function (response) {
                        if (response.data.ResultStatus != 'ERROR') {
                            $rootScope.menuItems = response.data.ReturnData;
                            loaded.push('menuCategories');
                        }
                    });
                }
                if (loadItem == 'featuredCategories') {
                    apiService.getFeaturedCategories(userToken).then(function (response) {
                        if (response.data.ResultStatus != 'ERROR') {
                            $rootScope.featuredCategories = response.data.ReturnData;
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
                            $rootScope.goToSlideCategories = function (action) {
                                if (action == 'next') {
                                    categoriesSlider.slideNext();
                                } else if ('prev') {
                                    categoriesSlider.slidePrev();
                                }
                            }
                            loaded.push('featuredCategories');
                        }
                    });
                }
                if (loadItem == 'featuredProducts') {
                    apiService.getFeaturedProducts(userToken).then(function (response) {
                        if (response.data.ResultStatus != 'ERROR') {
                            $rootScope.featuredProductsList = response.data.ReturnData;
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
                                }, onInit: function (swiper) {
                                    setTimeout(function () {
                                        swiper.slideTo(0, 0, true)
                                    }, 1000);
                                }
                            });
                            loaded.push('featuredProducts');
                        }
                    });
                }
                if (loadItem == 'homeSliders') {
                    apiService.getHomeSliders(userToken).then(function (response) {
                        if (response.data.ResultStatus != 'ERROR') {
                            $rootScope.sliderItems = response.data.ReturnData;
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
                            loaded.push('homeSliders');
                        }
                    });
                }

                if (loadItem == 'totalPrize') {
                    apiService.getTotalPrize(userToken).then(function (response) {
                        if (response.data.ResultStatus != 'ERROR') {
                            $rootScope.userTotalPrize = parseInt(response.data.ReturnData);
                            loaded.push('totalPrize');
                        }
                    });
                }


                if ($routeParams.categoryId != undefined) {
                    if (loadItem == 'productsByCategory') {
                        apiService.getProductsByCategory(categoryId, userToken).then(function (response) {
                            if (response != undefined) {
                                $rootScope.categoryInfo = response.data.ReturnData.MenuCategory;
                                $rootScope.categoryProducts = response.data.ReturnData.ProductList;
                            }

                            loaded.push('productsByCategory');
                        });
                    }
                } else {
                    loaded.push('productsByCategory');
                }

                if (loadItem == 'totalCompletionPercentage') {
                    apiService.getCompletionPercentage(userToken).then(function (response) {
                        if (response.data.ResultStatus != 'ERROR') {
                            $rootScope.userProfile.completionPercentage = response.data.ReturnData;

                            $timeout(function () {
                                var progressLoader = $("#mainProgressLoader").percentageLoader({
                                    width: 256,
                                    height: 256,
                                    controllable: false,
                                    progress: 1,
                                    maximumProgress: response.data.ReturnData,
                                    bottomText: 'dos módulos.'
                                });

                                var progressLoaderRunning = false;

                                progressLoader.percentageLoader({
                                    onready: function () {
                                        if (progressLoaderRunning) {
                                            return;
                                        }
                                        progressLoaderRunning = true;
                                        var kb2 = 0;
                                        var totalKb2 = 350;
                                        var animateFunc2 = function () {
                                            kb2 += 5;
                                            progressLoader.percentageLoader({progress: kb2 / totalKb2});
                                            if (kb2 < totalKb2) {
                                                setTimeout(animateFunc2, 25);
                                            } else {
                                                progressLoaderRunning = false;
                                            }
                                        };
                                        setTimeout(animateFunc2, 25);
                                    }
                                });

                                loaded.push('totalCompletionPercentage');
                            }, 100);
                        }
                    });
                }
            });


            $interval(function () {
                if (loaded.length >= loadItems.length) {
                    $rootScope.sectionLoading = false;
                }
            }, 1000);
        }

        $rootScope.userLogout = function () {
            angular.forEach($cookies.getAll(), function (v, k) {
                $cookies.remove(k);
            });
            location.reload();
        }
    }
).filter('character', function () {
    return function (input) {
        return String.fromCharCode(64 + parseInt(input, 10));
    };
})