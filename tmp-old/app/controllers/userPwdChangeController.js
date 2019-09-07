'use strict';
app.controller('userPwdChangeController', ['$scope', '$location', 'authService', 'ngAuthSettings', function ($scope, $location, authService, ngAuthSettings) {

    $scope.loginData = {
        eventCode: ngAuthSettings.eventCode,
        invitationCode: "",
        userName: "temp",
        email: "temp",
        password: "",
        confirmPassword: ""
    };

    $scope.loading = false;
    $scope.message = "";

    $scope.changePassword = function () {
        $scope.message = "";
        $scope.loading = true;
        authService.changePassword($scope.loginData).then(function (response) {
            $location.path('/user-account');
        },
         function (err) {
             if (err != null) {
                 $scope.message = err.data.message;
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

    $scope.redirectToAccount = function () {
        $location.path('/user-account');
    };
}]);
