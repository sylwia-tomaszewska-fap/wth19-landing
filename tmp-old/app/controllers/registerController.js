'use strict';
app.controller('registerController', ['$scope', '$routeParams', '$location', '$window', 'registrationService', 'ngAuthSettings',
    function ($scope, $routeParams, $location, $window, registrationService, ngAuthSettings) {

    $scope.eventCode = $routeParams.eventCode;

    if ($scope.eventCode == "" || $scope.eventCode == null) {
        if (ngAuthSettings.lang == "pl") {
            alert('Błędny parametr formularza. Nastąpi przekierowanie na stronę główną');
            $window.location.href = '/index.html';
        } else {
            alert('Incorrect form parameter. You will be redirected to main page');
            $window.location.href = '/index_en.html';
        }
    }
    else {
        registrationService.getEventSettings($routeParams.eventCode).then(function (results) {
            if (results.data.allowRegistration != true) {
                if (ngAuthSettings.lang == "pl") {
                    alert("Rejestracja na to wydarzenie jest zablokowana");
                } else {
                    alert("Registration is not available on that event");
                }
                $window.location.href = results.data.eventUrl;
            }
            else {
                $location.path('/register-package/' + $scope.eventCode);
            }
        }, function (error) {
            if (error != null && error.data != null) {
                alert(error.data.message);
            } else {
                alert(error.message);
            }
            if (ngAuthSettings.lang == "pl") {
                $window.location.href = '/index.html';
            } else {
                $window.location.href = '/index_en.html';
            }
        });
    }
}]);