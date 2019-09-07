'use strict';
app.controller('userPwdReset2Controller', ['$scope', '$location', '$routeParams', 'authService', 'ngAuthSettings', function ($scope, $location, $routeParams, authService, ngAuthSettings) {

    $scope.loginData = {
        eventCode: ngAuthSettings.eventCode,
        invitationCode: $routeParams.token,
        userName: "temp",
        email: "",
        password: "",
        confirmPassword: ""
    };
    $scope.loading = false;
    $scope.message = "";

    $scope.resetPassword = function () {
        $scope.message = "";
        $scope.loading = true;
        authService.resetPassword($scope.loginData).then(function (response) {
            $location.path('/login');
        },
        function (response) {
            var errors = [];
            for (var key in response.data.modelState) {
                for (var i = 0; i < response.data.modelState[key].length; i++) {
                    errors.push(response.data.modelState[key][i]);
                }
            }
            if (ngAuthSettings.lang == "pl") {
                $scope.message = "Błąd w resecie hasła. Szczegóły: " + errors.join(' ');
            } else {
                $scope.message = "There was an error during password reset. Details: " + errors.join(' ');
            }
            $scope.loading = false;
        });
    };

    $scope.redirectToLogin = function () {
        $location.path('/login');
    };
}]);
