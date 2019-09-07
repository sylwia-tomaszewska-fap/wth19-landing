'use strict';
app.controller('registerActivationController', ['$scope', '$routeParams', '$location', '$window', '$timeout', 'registrationService', 'ngAuthSettings',
    function ($scope, $routeParams, $location, $window, $timeout, registrationService, ngAuthSettings) {

    $scope.regId = $routeParams.regId;
    $scope.userInfo = {
		firstName: "{ Imię }",
		hasPayment: null,
		isOrgPackage: false,
		eventUrl: null,
	};
    $scope.paymentUrl = null;
    $scope.loading = true;

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

    registrationService.activateAccount($scope.regId).then(function (results) {
		$scope.userInfo = results.data;
		$scope.paymentUrl = results.data.paymentUrl;
        if ($scope.userInfo.hasPayment == false || $scope.userInfo.isWaitingForCouponApproval == false || $scope.paymentUrl != null) {
            startTimer();
            $scope.loading = false;
        } else {
            //startTimerCheck();
            $scope.ActivateCheck();
        }
    }, function (error) {
        alert(error.data.message);
    });

    $scope.ActivateCheck = function () {
        $scope.loading = true;
        registrationService.getPaymentUrl($scope.regId).then(function (results) {
            $scope.paymentUrl = results.data;
            if ($scope.paymentUrl == null) {
                startTimerCheck();
            } else {
				$scope.userInfo.isWaitingForCouponApproval = false;
                $scope.loading = false;
            }
        }, function (error) {
            alert(error.data.message);
        });
    };

    var startTimerCheck = function () {
        var timer = $timeout(function () {
            $timeout.cancel(timer);
            $scope.ActivateCheck();
        }, 5000);
    };

    var startTimer = function () {
        var timer = $timeout(function () {
            $timeout.cancel(timer);
            $window.location.href = $scope.userInfo.eventUrl;
        }, 10000);
    };

    $scope.redirectToFB = function () {
        $window.location.href = ngAuthSettings.fbEventPage;
    };

	$scope.redirectToMeetup = function () {
        $window.location.href = ngAuthSettings.fbEventPage;
    };
	
    $scope.redirectToPayment = function () {
        $window.location.href = $scope.paymentUrl;
    };
}]);