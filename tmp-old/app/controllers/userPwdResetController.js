'use strict';
app.controller('userPwdResetController', ['$scope', '$location', '$timeout', 'authService', 'ngAuthSettings', function ($scope, $location, $timeout, authService, ngAuthSettings) {

    $scope.loginData = {
        eventCode: ngAuthSettings.eventCode,
        invitationCode: "",
        userName: "",
        email: "",
        password: "temp123456",
        confirmPassword: "temp123456"
    };
    $scope.loading = false;
    $scope.message = "";
    $scope.infoMessage = "";

	if (authService.authentication.isAuth == true) {
        $location.path('/user-account');
    }

    $scope.resetPassword = function () {
        $scope.message = "";
        $scope.infoMessage = "";
        $scope.loading = true;
        $scope.loginData.userName = $scope.loginData.eventCode + '$' + $scope.loginData.email;
        authService.resetPasswordInit($scope.loginData).then(function (response) {
            //$location.path('/login');
            if (ngAuthSettings.lang == "pl") {
                $scope.infoMessage = "E-mail z linkiem resetującym hasło został wysłany, zostaniesz przekierowany(a) na stronę logowania w ciągu 5 sekund.";
            } else {
                $scope.infoMessage = "Email with reset password link has been sent. You will be redirected to login page in 5 seconds.";
            }
            startTimer();
        },
         function (err) {
             $scope.message = err.data.message;
             $scope.loading = false;
         });
    };

    var startTimer = function () {
        var timer = $timeout(function () {
            $timeout.cancel(timer);
            $location.path('/login');
        }, 5000);
    }

    $scope.redirectToLogin = function () {
        $location.path('/login');
    };
}]);
