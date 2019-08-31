'use strict';
app.controller('userPackageController', ['$scope', '$location', 'registrationService', 'ngAuthSettings', 
	function ($scope, $location, registrationService, ngAuthSettings) {

	   $scope.eventCode = ngAuthSettings.eventCode;
	   $scope.userSummary = {
	   };
	   $scope.userChoice = {
			packageCode: '',
			payerName: null,
			payerStreet: null,
			payerPostCode: null,
			payerCity: null,
			payerNip: null,
			wantInvoice: null,
			vipCategoryId: null,
			couponCode: null
		};
		$scope.categories = [];
		$scope.selectedCategory = null;
        $scope.couponCode = null;
		$scope.message = '';
		$scope.loading = false;
		$scope.messageCpn = '';
        $scope.packages = {};
        $scope.packagesOrg = {};
		$scope.packageNames = {};

		registrationService.getUserSummary().then(function (results) {
			$scope.userSummary = results.data;
			registrationService.getEventSettings($scope.userSummary.eventCode).then(function (results) {
				$scope.eventSettings = results.data;
			}, function (error) {
				alert(error.data.message);
			});
		}, function (error) {
			alert(error.data.message);
			return;
		});

		registrationService.getEventCategories($scope.eventCode).then(function (results) {
			$scope.categories = results.data;
		}, function (error) {
			alert(error.data.message);
		});

		$scope.getPackages = function () {
			registrationService.getUserPackages($scope.eventCode, $scope.couponCode).then(function (results) {
				for (var i = 0; i < results.data.length; i++) {
					$scope.packages[results.data[i].code] = results.data[i].priceGrossPLN;
					$scope.packagesOrg[results.data[i].code] = (results.data[i].priceOrgGrossPLN != null ? results.data[i].priceOrgGrossPLN : results.data[i].priceGrossPLN);
					$scope.packageNames[results.data[i].code] = results.data[i].name;
				}
			}, function (error) {
				alert(error.data.message);
			});
		};

        $scope.getPackages();

		$scope.getTotal = function(){
			//var total = 0;
			//if ($scope.userChoice.packageCode != "") {
			//	total = $scope.packages[$scope.userChoice.packageCode];
			//}
			//return total;
			
			return Math.round($scope.getTotalGross()/1.23 * 100) / 100;
		};

		$scope.getTotalGross = function(){
			//return Math.round($scope.getTotal() * 123) / 100;
			
			var total = 0;
			if ($scope.userChoice.packageCode != "") {
				total = $scope.packages[$scope.userChoice.packageCode];
			}
			return total;
		};
		
		$scope.getDiscount = function(){
			return Math.round(($scope.packages[$scope.userChoice.packageCode] - $scope.packagesOrg[$scope.userChoice.packageCode]) * 100) / 100;
		};

		$scope.applyCoupon = function () {
			$scope.messageCpn = '';
            if ($scope.couponCode == null || $scope.couponCode == '') {
                if (ngAuthSettings.lang == "pl") {
                    $scope.messageCpn = "Nie podano kodu rabatowego";
                } else {
                    $scope.messageCpn = "Discount code has not been provided";
                }
                $scope.message_type = "error";
            } else {
				$scope.loading = true;

				registrationService.getIsCouponAvailable($scope.eventCode, $scope.couponCode).then(function (results) {
					if (results.data != true) {
						if (ngAuthSettings.lang == "pl") {
							$scope.messageCpn = "Przepraszamy, ale ten kod rabatowy nie jest poprawny";
						} else {
							$scope.messageCpn = "We are sorry, but provided discount code is not valid";
						}
					}
					else {
						if (ngAuthSettings.lang == "pl") {
							$scope.messageCpn = "Kod rabatowy zaaplikowano";
						} else {
							$scope.messageCpn = "Discount code approved";
						}
						$scope.userChoice.couponCode = $scope.couponCode;
						$scope.getPackages();
					}
					$scope.loading = false;
				}, function (error) {
					$scope.messageCpn = error.data.message;
				});
			}
		};

		$scope.convertToVIP = function () {
			$scope.message = '';
			$scope.loading = true;

			registrationService.getIsPackageAvailable($scope.eventCode, $scope.userChoice.packageCode).then(function (results) {
				if (results.data != true) {
					if (ngAuthSettings.lang == "pl") {
						$scope.message = "Przepraszamy, ale ten pakiet nie jest już dostępny";
					} else {
						$scope.message = "We are sorry, but chosen package is not available";
					}
					$scope.loading = false;
					return;
				}
				registrationService.convertToVIP($scope.userChoice).then(function (response) {
					$location.path('/user-account');
				},
				function (response) {
					var errors = [];
					for (var key in response.data.modelState) {
						for (var i = 0; i < response.data.modelState[key].length; i++) {
							errors.push(response.data.modelState[key][i]);
						}
					}
					if (ngAuthSettings.lang == "pl") {
						$scope.message = "Błąd aktualizacji danych użytkownika. Szczegóły:" + errors.join(' ') + ' ' + response.data.message;
					} else {
						$scope.message = "There was an error during user data update. Details:" + errors.join(' ') + ' ' + response.data.message;
					}
					$scope.loading = false;
				});
			}, function (error) {
				$scope.message = error.data.message;
			});
		};

    $scope.changeCategory = function (selectedCategory) {
        $scope.userChoice.vipCategoryId = selectedCategory.objectId;
    };

    $scope.redirectToAccount = function () {
        $location.path('/user-account');
    };
}]);
