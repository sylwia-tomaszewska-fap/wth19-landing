'use strict';
app.controller('registerInformController', ['$scope', '$routeParams', '$location', '$window', 'registrationService',
    function ($scope, $routeParams, $location, $window, registrationService) {

    $scope.regId = $routeParams.regId;
    $scope.message = "";
    $scope.registerUserData = {
        emails: "",
    };
    $scope.loading = false;

    var pattern = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
    if (pattern.test($scope.regId) != true) {
        alert('Błędny parametr formularza. Nastąpi przekierowanie na stronę główną');
        $window.location.href = '/index.html';
    }

    registrationService.getEventSettingsFromUser($routeParams.regId).then(function (results) {
        if (results.data.allowSendRecommendations != true) {
            //$location.path('/register-meet/' + $scope.regId);
            $location.path('/register-confirmation/' + $scope.regId);
        }
    }, function (error) {
        alert(error.data.message);
    });

    $scope.sendRecommendations = function () {
        $scope.loading = true;
		$scope.message = "";
        registrationService.sendRecommendations($scope.regId, $scope.registerUserData).then(function (results) {
            $scope.message = results.data.replace(/"/g, '').split('<br/>').join(' ');
            $scope.loading = false;
        }, function (error) {
            alert(error.data.message);
            $scope.loading = false;
        });
    };

    $scope.redirectToMeet = function () {
        //$location.path('/register-meet/' + $scope.regId);
        $location.path('/register-confirmation/' + $scope.regId);
    };
}]);