LGApp.config(['$routeProvider', '$locationProvider',
    function ($routeProvider, $locationProvider) {

        $locationProvider.html5Mode(true);

        $routeProvider.when('/', {
            templateUrl: 'app/views/landing/landing.view.html',
            controller: 'LandingController',
            title: 'LG Campus - Bem vindo!',
        });

        $routeProvider.when('/categoria/:categoryId', {
            templateUrl: 'app/views/landing/category-single.view.html',
            controller: 'CategoriesController',
            title: 'LG Campus - Produtos por categoria',
        });

        $routeProvider.when('/produto/:productId', {
            templateUrl: 'app/views/landing/product-single.view.html',
            controller: 'ProductsController',
            title: 'LG Campus - Módulos do produto',
        });

        $routeProvider.when('/certificado/', {
            templateUrl: 'app/views/landing/certificado.view.html',
            controller: 'CertificadoController',
            title: 'LG Campus - Certificado',
        });

        $routeProvider.when('/autenticacao-requerida/', {
            templateUrl: 'app/views/generic/user.not.logged.generic.view.html',
            controller: 'MainController',
            title: 'LG Campus - Autenticação Requerida',
        }).otherwise({ redirectTo: '/' });


    }
]);

LGApp.run(['$rootScope', '$route', '$location', function ($rootScope, $route, $location, $scope) {
    $rootScope.$on('$routeChangeSuccess', function () {
        document.title = $route.current.title;
        window.scrollTo(0, 0);
    });
}]);
