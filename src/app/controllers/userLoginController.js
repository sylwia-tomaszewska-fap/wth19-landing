'use strict';
app.controller('userLoginController', ['$scope', '$location', 'authService', 'ngAuthSettings',
    function ($scope, $location, authService, ngAuthSettings) {

    $scope.loginData = {
        eventCode: ngAuthSettings.eventCode,
        userName: "",
        email: "",
        password: "",
        useRefreshTokens: false
    };
    $scope.loading = false;
    $scope.message = "";

    if (authService.authentication.isAuth == true) {
        $location.path('/user-account');
    }
	
    $scope.login = function () {
        $scope.message = "";
        $scope.loading = true;
        $scope.loginData.userName = $scope.loginData.eventCode + '$' + $scope.loginData.email;
        authService.login($scope.loginData).then(function (response) {
            $location.path('/user-account');
        },
        function (err) {
             if (err != null) {
                 $scope.message = err.error_description;
             } else {
                 if (ngAuthSettings.lang == "pl") {
                     $scope.message = "Wystąpił błąd wewnętrzny. Skontaktuj się z organizatorami.";
                 } else {
                     $scope.message = "An internal error has occured. Contact the organizers.";
                 }
             };
             $scope.loading = false;
         });
    };

    $scope.redirectToResetPwd = function () {
        $location.path('/user-pwd-reset');
    };
}]);
