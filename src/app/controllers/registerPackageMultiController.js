'use strict';
app.controller('registerPackageMultiController', ['$scope', '$route', '$routeParams', '$location', '$window', 'registrationService', 'authService', 'ngAuthSettings',
    function ($scope, $route, $routeParams, $location, $window, registrationService, authService, ngAuthSettings) {

        $scope.userChoice = {
            selectedSTD: 0,
			//selectedSTDSTU: 0,
			selectedVIPBR: 0,
			selectedVIPSR: 0,
            selectedOPC1: 0,
			selectedOPC2: 0,
			selectedOPC3: 0,
			selectedOPC4: 0,
			selectedOPC5: 0,
			couponCode: null
        };
        $scope.agenda = {
            selected: [],
            packageCode: 'SET',
            couponCode: null,
			selectedOptionalPkg: [],
			selectedPkg: []
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

		$scope.stepUp = function(pkgCode){
			if (pkgCode == 'STD') {
				$scope.userChoice.selectedSTD = !$scope.isPositiveInteger($scope.userChoice.selectedSTD) ? 1 : $scope.userChoice.selectedSTD + 1;
			//} else if (pkgCode == 'STDSTU') {
			//	$scope.userChoice.selectedSTDSTU = !$scope.isPositiveInteger($scope.userChoice.selectedSTDSTU) ? 1 : $scope.userChoice.selectedSTDSTU + 1;
			} else if (pkgCode == 'VIP-BR') {
				$scope.userChoice.selectedVIPBR = !$scope.isPositiveInteger($scope.userChoice.selectedVIPBR) ? 1 : $scope.userChoice.selectedVIPBR + 1;
			} else if (pkgCode == 'VIP-SR') {
				$scope.userChoice.selectedVIPSR = !$scope.isPositiveInteger($scope.userChoice.selectedVIPSR) ? 1 : $scope.userChoice.selectedVIPSR + 1;
			} else if (pkgCode == 'OPC1') {
				$scope.userChoice.selectedOPC1 = !$scope.isPositiveInteger($scope.userChoice.selectedOPC1) ? 1 : $scope.userChoice.selectedOPC1 + 1;
			} else if (pkgCode == 'OPC2') {
				$scope.userChoice.selectedOPC2 = !$scope.isPositiveInteger($scope.userChoice.selectedOPC2) ? 1 : $scope.userChoice.selectedOPC2 + 1;
			} else if (pkgCode == 'OPC3') {
				$scope.userChoice.selectedOPC3 = !$scope.isPositiveInteger($scope.userChoice.selectedOPC3) ? 1 : $scope.userChoice.selectedOPC3 + 1;
			} else if (pkgCode == 'OPC4') {
				$scope.userChoice.selectedOPC4 = !$scope.isPositiveInteger($scope.userChoice.selectedOPC4) ? 1 : $scope.userChoice.selectedOPC4 + 1;
			} else if (pkgCode == 'OPC5') {
				$scope.userChoice.selectedOPC5 = !$scope.isPositiveInteger($scope.userChoice.selectedOPC5) ? 1 : $scope.userChoice.selectedOPC5 + 1;
			}
		};

		$scope.stepDown = function(pkgCode){
			if (pkgCode == 'STD') {
				$scope.userChoice.selectedSTD = !$scope.isPositiveInteger($scope.userChoice.selectedSTD) || $scope.userChoice.selectedSTD <= 0 ? 0 : $scope.userChoice.selectedSTD - 1;
			//} else if (pkgCode == 'STDSTU') {
			//	$scope.userChoice.selectedSTDSTU = !$scope.isPositiveInteger($scope.userChoice.selectedSTDSTU) || $scope.userChoice.selectedSTDSTU <= 0 ? 0 : $scope.userChoice.selectedSTDSTU - 1;
			} else if (pkgCode == 'VIP-BR') {
				$scope.userChoice.selectedVIPBR = !$scope.isPositiveInteger($scope.userChoice.selectedVIPBR) || $scope.userChoice.selectedVIPBR <= 0 ? 0 : $scope.userChoice.selectedVIPBR - 1;
			} else if (pkgCode == 'VIP-SR') {
				$scope.userChoice.selectedVIPSR = !$scope.isPositiveInteger($scope.userChoice.selectedVIPSR) || $scope.userChoice.selectedVIPSR <= 0 ? 0 : $scope.userChoice.selectedVIPSR - 1;
			} else if (pkgCode == 'OPC1') {
				$scope.userChoice.selectedOPC1 = !$scope.isPositiveInteger($scope.userChoice.selectedOPC1) || $scope.userChoice.selectedOPC1 <= 0 ? 0 : $scope.userChoice.selectedOPC1 - 1;
			} else if (pkgCode == 'OPC2') {
				$scope.userChoice.selectedOPC2 = !$scope.isPositiveInteger($scope.userChoice.selectedOPC2) || $scope.userChoice.selectedOPC2 <= 0 ? 0 : $scope.userChoice.selectedOPC2 - 1;
			} else if (pkgCode == 'OPC3') {
				$scope.userChoice.selectedOPC3 = !$scope.isPositiveInteger($scope.userChoice.selectedOPC3) || $scope.userChoice.selectedOPC3 <= 0 ? 0 : $scope.userChoice.selectedOPC3 - 1;
			} else if (pkgCode == 'OPC4') {
				$scope.userChoice.selectedOPC4 = !$scope.isPositiveInteger($scope.userChoice.selectedOPC4) || $scope.userChoice.selectedOPC4 <= 0 ? 0 : $scope.userChoice.selectedOPC4 - 1;
			} else if (pkgCode == 'OPC5') {
				$scope.userChoice.selectedOPC5 = !$scope.isPositiveInteger($scope.userChoice.selectedOPC5) || $scope.userChoice.selectedOPC5 <= 0 ? 0 : $scope.userChoice.selectedOPC5 - 1;
			}
		};
		
		$scope.getTotal = function(){
			//var total = 0;
			//total += $scope.packages['STD'] * $scope.userChoice.selectedSTD;
			//total += $scope.packages['STDSTU'] * $scope.userChoice.selectedSTDSTU;
			//total += $scope.packages['VIP-BR'] * $scope.userChoice.selectedVIPBR;
			//total += $scope.packages['VIP-SR'] * $scope.userChoice.selectedVIPSR;
			//total += $scope.packagesOptional['OPC1'] * $scope.userChoice.selectedOPC1;
			//total += $scope.packagesOptional['OPC2'] * $scope.userChoice.selectedOPC2;
			//total += $scope.packagesOptional['OPC3'] * $scope.userChoice.selectedOPC3;
			//total += $scope.packagesOptional['OPC4'] * $scope.userChoice.selectedOPC4;
			//total += $scope.packagesOptional['OPC5'] * $scope.userChoice.selectedOPC5;
			//return total;
			
			return Math.round($scope.getTotalGross()/1.23 * 100) / 100;
		};

		$scope.getTotalGross = function(){
			//return Math.round($scope.getTotal() * 123) / 100;
			
			var total = 0;
			total += $scope.packages['STD'] * $scope.userChoice.selectedSTD;
			//total += $scope.packages['STDSTU'] * $scope.userChoice.selectedSTDSTU;
			total += $scope.packages['VIP-BR'] * $scope.userChoice.selectedVIPBR;
			total += $scope.packages['VIP-SR'] * $scope.userChoice.selectedVIPSR;
			total += $scope.packagesOptional['OPC1'] * $scope.userChoice.selectedOPC1;
			total += $scope.packagesOptional['OPC2'] * $scope.userChoice.selectedOPC2;
			total += $scope.packagesOptional['OPC3'] * $scope.userChoice.selectedOPC3;
			total += $scope.packagesOptional['OPC4'] * $scope.userChoice.selectedOPC4;
			total += $scope.packagesOptional['OPC5'] * $scope.userChoice.selectedOPC5;
			return total;
		};
		
		$scope.getDiscount = function(){
			var total = 0;
			total += Math.round(($scope.packages['STD'] - $scope.packagesOrg['STD']) * 100 * $scope.userChoice.selectedSTD) / 100;
			//total += Math.round(($scope.packages['STDSTU'] - $scope.packagesOrg['STDSTU']) * 100 * $scope.userChoice.selectedSTDSTU) / 100;
			total += Math.round(($scope.packages['VIP-BR'] - $scope.packagesOrg['VIP-BR']) * 100 * $scope.userChoice.selectedVIPBR) / 100;
			total += Math.round(($scope.packages['VIP-SR'] - $scope.packagesOrg['VIP-SR']) * 100 * $scope.userChoice.selectedVIPSR) / 100;
			return total;
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

		$scope.isPositiveInteger = function(n) {
			return n >>> 0 === parseFloat(n);
		}

        $scope.redirectToNextStepVIP = function () {
			if (!$scope.isPositiveInteger($scope.userChoice.selectedSTD) 
				//|| !$scope.isPositiveInteger($scope.userChoice.selectedSTDSTU)
				|| !$scope.isPositiveInteger($scope.userChoice.selectedVIPBR)
				|| !$scope.isPositiveInteger($scope.userChoice.selectedVIPSR)
				|| !$scope.isPositiveInteger($scope.userChoice.selectedOPC1)
				|| !$scope.isPositiveInteger($scope.userChoice.selectedOPC2)
				|| !$scope.isPositiveInteger($scope.userChoice.selectedOPC3)
				|| !$scope.isPositiveInteger($scope.userChoice.selectedOPC4)
				|| !$scope.isPositiveInteger($scope.userChoice.selectedOPC5)) {
					alert("Nie wszystkie pola zawierają właściwe liczby.");
					return;
				}
			if ($scope.userChoice.selectedSTD == 0
				//&& $scope.userChoice.selectedSTDSTU == 0
				&& $scope.userChoice.selectedVIPBR == 0
				&& $scope.userChoice.selectedVIPSR == 0) {
					alert("Nie wybrano żadnego pakietu.");
					return;
				}
				
            $scope.loading = true;
			$scope.agenda.selectedPkg = [];
			$scope.agenda.selectedPkg.push('STD:'+$scope.userChoice.selectedSTD);
			//$scope.agenda.selectedPkg.push('STDSTU:'+$scope.userChoice.selectedSTDSTU);
			$scope.agenda.selectedPkg.push('VIP-BR:'+$scope.userChoice.selectedVIPBR);
			$scope.agenda.selectedPkg.push('VIP-SR:'+$scope.userChoice.selectedVIPSR);
			
			$scope.agenda.selectedOptionalPkg = [];
			$scope.agenda.selectedOptionalPkg.push('OPC1:'+$scope.userChoice.selectedOPC1);
			$scope.agenda.selectedOptionalPkg.push('OPC2:'+$scope.userChoice.selectedOPC2);
			$scope.agenda.selectedOptionalPkg.push('OPC3:'+$scope.userChoice.selectedOPC3);
			$scope.agenda.selectedOptionalPkg.push('OPC4:'+$scope.userChoice.selectedOPC4);
			$scope.agenda.selectedOptionalPkg.push('OPC5:'+$scope.userChoice.selectedOPC5);
			
			registrationService.saveReservations($scope.agenda).then(function (results) {
				$scope.loading = false;
				$scope.reservationId = results.data;
				$location.path('/register-user-data/' + $routeParams.eventCode + '/' + $scope.reservationId.replace(/"/g, ''));
            }, function (error) {
                $scope.loading = false;
                alert(error.data.message);
            });
        };
    }]);
