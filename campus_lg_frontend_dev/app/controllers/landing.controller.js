LGApp.controller("LandingController", function ($scope, $rootScope, $cookies, $location, $timeout, $interval, apiService) {
        $timeout(function () {
            $rootScope.userAuthWithSessionId(function (userResponse) {

            })
        }, 10)
    }
);