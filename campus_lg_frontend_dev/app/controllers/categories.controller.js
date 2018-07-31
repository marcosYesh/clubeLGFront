LGApp.controller("CategoriesController", function ($scope, $rootScope, $cookies, $location, $timeout) {
        $timeout(function () {
            $rootScope.userAuthWithSessionId(function (userResponse) {})
        }, 10)
    }
);