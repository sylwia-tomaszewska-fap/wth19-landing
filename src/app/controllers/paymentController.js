'use strict';
app.controller('paymentController', ['$scope', '$routeParams', '$location', '$window', 'registrationService',
    function ($scope, $routeParams, $location, $window, registrationService) {

    $scope.paymentCode = $routeParams.paymentCode;
	$scope.paymentUrl = "";
    $scope.message = "";
    $scope.registerUserData = {
    };
    $scope.loading = true;

    registrationService.getUserPaymentInfo($scope.paymentCode).then(function (results) {
        $scope.registerUserData = results.data;
        $scope.paymentUrl = $scope.registerUserData.paymentUrl;
        $scope.loading = false;
    }, function (error) {
        $scope.message = error.data.message;
        $scope.loading = false;
    });
	
	$scope.goToPayment = function() {
		$window.location.href = $scope.paymentUrl;
	}
}]);