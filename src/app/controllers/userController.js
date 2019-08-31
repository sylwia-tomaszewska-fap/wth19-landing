'use strict';
app.controller('userController', ['$scope', '$location', '$window', 'authService', 'ngAuthSettings',
    function ($scope, $location, $window, authService, ngAuthSettings) {

    $scope.logOut = function () {
        authService.logOut();
        //$location.path('/login');
        if (ngAuthSettings.lang == "pl") {
            $window.location.href = '/index.html';
        } else {
            $window.location.href = '/index_en.html';
        }
    }

    $scope.authentication = authService.authentication;

    $scope.redirectToChangePassword = function () {
        $location.path('/user-pwd-change');
    };

}]);