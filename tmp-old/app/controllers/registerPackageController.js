'use strict';
app.controller('registerPackageController', ['$scope', '$route', '$routeParams', '$location', '$window', 'registrationService', 'authService', 'ngAuthSettings',
    function ($scope, $route, $routeParams, $location, $window, registrationService, authService, ngAuthSettings) {

        $scope.userChoice = {
            selected: '',
			couponCode: null,
        };
        $scope.agenda = {
            selected: [],
            packageCode: '',
            couponCode: null,
			selectedOptionalPkg: ''
        };
        $scope.message = '';
        $scope.loading = false;
        $scope.packages = {};
        $scope.packagesOrg = {};
        $scope.packagesOptional = {};
		$scope.packageNames = {};
		$scope.packageNamesOptional = {};

        registrationService.getEventSettings($routeParams.eventCode).then(function (results) {
            if (results.data.allowRegistration != true) {
                if (ngAuthSettings.lang == "pl") {
                    alert("Rejestracja na to wydarzenie jest zablokowana");
                    $window.location.href = results.data.eventUrl;
                } else {
                    alert("Registration is not available on that event");
                    $window.location.href = results.data.eventUrl + '/index_en.html';
                }
            }
            else if (results.data.isPackageRequired != true) {
                $location.path('/register-agenda/' + $routeParams.eventCode);
            }
        }, function (error) {
            alert(error.data.message);
        });

        $scope.getPackages = function () {
            registrationService.getUserPackages($routeParams.eventCode, $scope.agenda.couponCode).then(function (results) {
                for (var i = 0; i < results.data.length; i++) {
                    $scope.packages[results.data[i].code] = results.data[i].priceGrossPLN;
					$scope.packagesOrg[results.data[i].code] = (results.data[i].priceOrgGrossPLN != null ? results.data[i].priceOrgGrossPLN : results.data[i].priceGrossPLN);
					$scope.packageNames[results.data[i].code] = results.data[i].name;
                }
            }, function (error) {
                alert(error.data.message);
            });
        };

		$scope.getPackagesOptional = function () {
            registrationService.getUserPackagesOptional($routeParams.eventCode).then(function (results) {
                for (var i = 0; i < results.data.length; i++) {
                    $scope.packagesOptional[results.data[i].code] = results.data[i].priceGrossPLN;
					$scope.packageNamesOptional[results.data[i].code] = results.data[i].name;
                }
            }, function (error) {
                alert(error.data.message);
            });
        };
		
        $scope.getPackages();
		$scope.getPackagesOptional();

		$scope.getOrgPrice = function(price){
			return Math.round(price/1.23 * 100) / 100;
		};
		
		$scope.getTotal = function(){
			//var total = 0;
			//if ($scope.userChoice.selected != "") {
			//	total = $scope.packages[$scope.userChoice.selected];
			//}
			//for(var i = 0; i < $scope.agenda.selectedOptionalPkg.length; i++){
			//	total += $scope.packagesOptional[$scope.agenda.selectedOptionalPkg[i]];
			//}
			//return total;
			
			return Math.round($scope.getTotalGross()/1.23 * 100) / 100;
		};

		$scope.getTotalGross = function(){
			//return Math.round($scope.getTotal() * 123) / 100;
			
			var total = 0;
			if ($scope.userChoice.selected != "") {
				total = $scope.packages[$scope.userChoice.selected];
			}
			for(var i = 0; i < $scope.agenda.selectedOptionalPkg.length; i++){
				total += $scope.packagesOptional[$scope.agenda.selectedOptionalPkg[i]];
			}
			return total;
		};
		
		$scope.getDiscount = function(){
			return Math.round(($scope.packages[$scope.userChoice.selected] - $scope.packagesOrg[$scope.userChoice.selected]) * 100) / 100;
		};
		
        $scope.applyCoupon = function () {
            $scope.message = '';
            if ($scope.userChoice.couponCode == null || $scope.userChoice.couponCode == '') {
                if (ngAuthSettings.lang == "pl") {
                    $scope.message = "Nie podano kodu rabatowego";
                } else {
                    $scope.message = "Discount code has not been provided";
                }
                $scope.message_type = "error";
            } else {
                $scope.loading = true;
                registrationService.getIsCouponAvailable($routeParams.eventCode, $scope.userChoice.couponCode).then(function (results) {
                    if (results.data != true) {
                        if (ngAuthSettings.lang == "pl") {
                            $scope.message = "Przepraszamy, ale ten kod rabatowy nie jest poprawny";
                        } else {
                            $scope.message = "We are sorry, but provided discount code is not valid";
                        }
                        $scope.message_type = "error";
                    }
                    else {
                        if (ngAuthSettings.lang == "pl") {
                            $scope.message = "Kod rabatowy zaaplikowano";
                        } else {
                            $scope.message = "Discount code approved";
                        }
                        $scope.message_type = "success";
                        $scope.agenda.couponCode = $scope.userChoice.couponCode;
                        $scope.getPackages();
                    }
                    $scope.loading = false;
                }, function (error) {
                    $scope.message = error.data.message;
                });
            }
        };

        $scope.redirectToNextStep = function (chosenPackage) {
			if ($scope.agenda.couponCode != null && $scope.getDiscount() == 0) {
				var txt = 'Zastosowany kod rabatowy nie dotyczy wybranej pozycji. Przejście dalej spowoduje odpięcie kodu rabatowego. Czy kontynuować?';
				if (ngAuthSettings.lang != "pl") {
					txt = 'Provided discount code is not connected with chosen package. Going next cause detach of discount code. Do you want to continue?';
				}
				if (!confirm(txt)) {
					return;
				}
			}
            $scope.loading = true;
            registrationService.getIsPackageAvailable($routeParams.eventCode, chosenPackage).then(function (results) {
                if (results.data != true) {
                    $scope.loading = false;
                    if (ngAuthSettings.lang == "pl") {
                        alert("Przepraszamy, ale ten pakiet nie jest już dostępny");
                    } else {
                        alert("We are sorry, but chosen package is not available");
                    }
                    return;
                }
				$scope.agenda.packageCode = chosenPackage;
				registrationService.saveReservations($scope.agenda).then(function (results) {
					$scope.loading = false;
					$scope.reservationId = results.data;
	                registrationService.getPackageInfo($routeParams.eventCode, chosenPackage).then(function (results) {
						if (results.data.isOrgPackage || results.data.skipAgenda) {
							$location.path('/register-user-data/' + $routeParams.eventCode + '/' + $scope.reservationId.replace(/"/g, ''));
						} else {
							$location.path('/register-agenda/' + $routeParams.eventCode + '/' + $scope.reservationId.replace(/"/g, ''));
						}
					}, function (error) {
						alert(error.data.message);
					});
				}, function (error) {
					$scope.loading = false;
					alert(error.data.errorMessage);
				});
            }, function (error) {
                $scope.loading = false;
                alert(error.data.message);
            });
        };

        $scope.redirectToNextStepVIP = function () {
            $scope.redirectToNextStep($scope.userChoice.selected);
			var tt = document.getElementById('toggle2modal');
            tt.click();
        };
		
		$scope.redirectToBuyMore = function () {
            $location.path('/register-package-multi/' + $routeParams.eventCode);
        };
    }]);
