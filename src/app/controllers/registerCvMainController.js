'use strict';
app.controller('registerCvMainController', ['$scope', '$routeParams', '$location', '$window', 'registrationService', 'ngAuthSettings',
    function ($scope, $routeParams, $location, $window, registrationService, ngAuthSettings) {

    $scope.regId = $routeParams.regId;

    var pattern = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
    if (pattern.test($scope.regId) != true) {
        if (ngAuthSettings.lang == "pl") {
            alert('Błędny parametr formularza. Nastąpi przekierowanie na stronę główną');
            $window.location.href = '/index.html';
        } else {
            alert('Incorrect form parameter. You will be redirected to main page');
            $window.location.href = '/index_en.html';
        }
    }

    registrationService.getEventSettingsFromUser($routeParams.regId).then(function (results) {
        if (results.data.allowSendCV != true) {
            $location.path('/register-inform/' + $scope.regId);
        }
    }, function (error) {
        alert(error.data.message);
    });

    $scope.redirectToCvUpload = function () {
        $location.path('/register-cv-upload/' + $scope.regId);
    };

    $scope.redirectToCvForm = function () {
        $location.path('/register-cv-form/' + $scope.regId);
    };

    $scope.redirectToInform = function () {
        $location.path('/register-inform/' + $scope.regId);
    };
}]);