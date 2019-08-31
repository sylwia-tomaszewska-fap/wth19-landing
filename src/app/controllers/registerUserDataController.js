'use strict';
app.controller('registerUserDataController', ['$scope', '$route', '$routeParams', '$location', '$window', 'registrationService', 'authService', 'ngAuthSettings',
    function ($scope, $route, $routeParams, $location, $window, registrationService, authService, ngAuthSettings) {

        $scope.schools = [];
        $scope.departments = [];
        $scope.registerUserData = {
            eventCode: $routeParams.eventCode,
            email: null,
            password: "",
            firstName: null,
            lastName: null,
            phoneNo: null,
            isGraduate: null,
            schoolId: null,
            otherSchool: null,
            departmentId: null,
            otherDepartment: null,
            companyName: null,
            companyPosition: null,
            savedReservations: $routeParams.selected,
            payerName: null,
            payerStreet: null,
            payerPostCode: null,
            payerCity: null,
            payerNip: null,
            packageIsFree: null,
            wantInvoice: null,
			tShirtChoice: null,
        };
		$scope.userPackageInfo = null;
        $scope.isPackageFree = true;
        $scope.isOrgPackage = false;
		$scope.isInvoiceAllowed = false;
        $scope.selectedSchool = null;
        $scope.selectedDepartment = null;
        $scope.message = "";
        $scope.deptOtherShow = false;
        $scope.loading = false;

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
        }, function (error) {
            alert(error.data.message);
        });

        registrationService.getUserPackageInfo($routeParams.eventCode, $routeParams.selected).then(function (results) {
            $scope.userPackageInfo = results.data;
			$scope.isPackageFree = $scope.userPackageInfo.isFree;
            $scope.registerUserData.packageIsFree = $scope.userPackageInfo.isFree;
			$scope.isOrgPackage = $scope.userPackageInfo.isOrgPackage;
			$scope.isInvoiceAllowed = $scope.userPackageInfo.isInvoiceAllowed;
        }, function (error) {
            alert(error.data.message);
        });

        registrationService.getSchools().then(function (results) {
            $scope.schools = results.data;
        }, function (error) {
            alert(error.data.message);
        });

        $scope.getDepartments = function (selectedSchool) {
            if (selectedSchool.name != 'Inna') {
                $scope.registerUserData.schoolId = selectedSchool.objectId;
                $scope.registerUserData.otherSchool = null;
            } else {
                $scope.registerUserData.schoolId = null;
            }
            $scope.registerUserData.departmentId = null;
            $scope.registerUserData.otherDepartment = null;
            $scope.deptOtherShow = false;

            registrationService.getDepartments(selectedSchool.objectId).then(function (results) {
                $scope.departments = results.data;
            }, function (error) {
                alert(error.data.message);
            });
        };

        $scope.changeDepartment = function (selectedDepartment) {
            $scope.deptOtherShow = (selectedDepartment.name == 'Inny');
            if (selectedDepartment.name != 'Inny') {
                $scope.registerUserData.departmentId = selectedDepartment.objectId;
                $scope.registerUserData.otherDepartment = null;
            } else {
                $scope.registerUserData.departmentId = null;
            }
        };

        $scope.checkEmail = function () {
            registrationService.checkEmail($routeParams.eventCode, $scope.registerUserData.email).then(function (results) {
                if (results.data.isValid == false) {
                    alert(results.data.errorMessage);
                }
            }, function (error) {
                alert(error.data.message);
            });
        };

        $scope.registerUser = function () {
            $scope.registerUserCond(true);
        };

        $scope.registerUserCond = function (requireAgreement) {
            angular.forEach($scope.registerForm.$error.required, function (field) {
                field.$setDirty();
            });
            if (!$scope.registerForm.$valid) {
                return;
            }

            if ($scope.registerUserData.password != $scope.registerUserData.confirmPassword) {
                if (ngAuthSettings.lang == "pl") {
                    $scope.message = "Pole hasło i powtórz hasło się różnią";
                } else {
                    $scope.message = "Fields password and confirm password have different values";
                }
                return;
            }

            if ($scope.registerUserData.password.length < 8) {
                if (ngAuthSettings.lang == "pl") {
                    $scope.message = "Hasło musi mieć co najmniej 8 znaków";
                } else {
                    $scope.message = "Password has to be at least 8 chars length";
                }
                return;
            }

            if (requireAgreement && ($scope.registerUserData.marketingAgreement == false
                || $scope.registerUserData.marketingAgreement == null)) {
                $scope.showModal();
                return;
            }
            $scope.loading = true;

            if ($scope.registerUserData.isGraduate == 'true') {
                $scope.registerUserData.schoolId = null;
                $scope.registerUserData.otherSchool = null;
                $scope.registerUserData.departmentId = null;
                $scope.registerUserData.otherDepartment = null;
            } else {
                $scope.registerUserData.companyName = null;
                $scope.registerUserData.companyPosition = null;
            }

            if ($scope.registerUserData.wantInvoice == null) {
                $scope.registerUserData.wantInvoice = false;
            }
			
            registrationService.checkEmail($routeParams.eventCode, $scope.registerUserData.email).then(function (results) {
                if (results.data.isValid == true) {
                    authService.saveRegistrationUser($scope.registerUserData).then(function (response) {
                        if ($scope.isOrgPackage) {
                            $location.path('/register-confirmation/' + response.data.replace(/"/g, ''));
                        } else {
                            $location.path('/register-cv-main/' + response.data.replace(/"/g, ''));
                        }
                    },
                     function (response) {
                         var errors = [];
                         for (var key in response.data.modelState) {
                             for (var i = 0; i < response.data.modelState[key].length; i++) {
                                 errors.push(response.data.modelState[key][i]);
                             }
                         }
                         if (ngAuthSettings.lang == "pl") {
                             $scope.message = "Błąd w rejestracji użytkownika. Szczegóły:" + errors.join(' ') + ' ' + response.data.message;
                         } else {
                             $scope.message = "There was error during user registration. Details:" + errors.join(' ') + ' ' + response.data.message;
                         }
                         $scope.loading = false;
                         $scope.closeModal();
                     });
                }
                else {
                    $scope.message = results.data.errorMessage;
                    $scope.loading = false;
					$scope.closeModal();
                }
            }, function (error) {
                $scope.loading = false;
                $scope.message = results.data.errorMessage;
				$scope.closeModal();
            });
        };
		
		$scope.showModal = function() {
			//$('#modal_brak_zgod').modal('show');
			document.getElementById('modal-maybe').classList.add('is-open');
			document.body.classList.add('menuActive');
		};
		
		$scope.closeModal = function() {
			document.getElementById('modal-maybe').classList.remove('is-open');
			document.body.classList.remove('menuActive');
		};
    }]);
