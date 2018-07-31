LGApp.config(['$routeProvider', '$locationProvider',
    function ($routeProvider, $locationProvider) {

        $locationProvider.html5Mode(true);

        $routeProvider.when('/', {
            templateUrl: 'app/views/landing/landing.view.html',
            controller: 'MainController',
            title: 'LG Campus - Bem vindo!',
        })


        $routeProvider.when('/categoria/:categoryId', {
            templateUrl: 'app/views/landing/category-single.view.html',
            controller: 'MainController',
            title: 'LG Campus - Produtos por categoria',
        })

        $routeProvider.when('/produto/:productId', {
            templateUrl: 'app/views/landing/product-single.view.html',
            controller: 'MainController',
            title: 'LG Campus - Módulos do produto',
        })

            .otherwise({redirectTo: '/'});
    }
]);

LGApp.run(['$rootScope', '$route', '$location', function ($rootScope, $route, $location, $scope) {
    $rootScope.$on('$routeChangeSuccess', function () {
        document.title = $route.current.title;
        window.scrollTo(0, 0);
    });
}]);
