'use strict';
app.controller('userDataController', ['$scope', '$location', 'registrationService', 'authService', 'ngAuthSettings',
    function ($scope, $location, registrationService, authService, ngAuthSettings) {

    $scope.schools = [];
    $scope.departments = [];
    $scope.registerUserData = {
        eventCode: null,
        email: null,
        password: "TemporaryP@$$w0rd",
        firstName: null,
        lastName: null,
        phoneNo: null,
        isGraduate: 'false',
        schoolId: null,
        otherSchool: null,
        departmentId: null,
        otherDepartment: null,
        companyName: null,
        companyPosition: null,
        marketingAgreement: true,
        savedReservations: null
    };
    $scope.isGraduate = 'false';
    $scope.wantedInvoice = false;
    $scope.wantInvoice = 'false';
    $scope.selectedSchool = null;
    $scope.selectedDepartment = null;
    $scope.message = "";
    $scope.deptOtherShow = false;
    $scope.loading = false;
    $scope.oldEmail = "";

    registrationService.getUserData().then(function (results) {
        $scope.registerUserData = results.data;
        $scope.isGraduate = $scope.registerUserData.isGraduate ? 'true' : 'false';
        $scope.wantedInvoice = $scope.registerUserData.wantInvoice;
        $scope.oldEmail = $scope.registerUserData.email;
        if ($scope.registerUserData.wantInvoice)
            $scope.wantInvoice = 'true';
        if ($scope.registerUserData.isGraduate == false) {
            if ($scope.registerUserData.schoolId != null) {
                if ($scope.registerUserData.departmentId == null) {
                    $scope.deptOtherShow = true;
                };
                var arrayLength = $scope.schools.length;
                for (var i = 0; i < arrayLength; i++) {
                    if ($scope.schools[i].objectId == $scope.registerUserData.schoolId) {
                        $scope.selectedSchool = $scope.schools[i];
                        break;
                    }
                }
                registrationService.getDepartments($scope.registerUserData.schoolId).then(function (results) {
                    $scope.departments = results.data;
                    if ($scope.registerUserData.departmentId != null) {
                        var arrayLength = $scope.departments.length;
                        for (var i = 0; i < arrayLength; i++) {
                            if ($scope.departments[i].objectId == $scope.registerUserData.departmentId) {
                                $scope.selectedDepartment = $scope.departments[i];
                                break;
                            }
                        }
                    } else {
                        var arrayLength = $scope.departments.length;
                        for (var i = 0; i < arrayLength; i++) {
                            if ($scope.departments[i].name == 'Inny') {
                                $scope.selectedDepartment = $scope.departments[i];
                                break;
                            };
                            $scope.deptOtherShow = true;
                        }
                    }
                }, function (error) {
                    alert(error.data.message);
                });
            } else {
                var arrayLength = $scope.schools.length;
                for (var i = 0; i < arrayLength; i++) {
                    if ($scope.schools[i].name == 'Inna') {
                        $scope.selectedSchool = $scope.schools[i];
                        break;
                    }
                }
            }
        }
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

    $scope.changeInvoiceCheck = function (wantInv) {
        $scope.registerUserData.wantInvoice = wantInv;
        $scope.wantInvoice = wantInv;
    };

    $scope.registerUser = function () {
        angular.forEach($scope.registerForm.$error.required, function (field) {
            field.$setDirty();
        });
        if (!$scope.registerForm.$valid) {
            return;
        }
        $scope.loading = true;

        $scope.registerUserData.isGraduate = $scope.isGraduate == 'true' ? true : false;
        if ($scope.registerUserData.isGraduate == true) {
            $scope.registerUserData.schoolId = null;
            $scope.registerUserData.otherSchool = null;
            $scope.registerUserData.departmentId = null;
            $scope.registerUserData.otherDepartment = null;
        } else {
            $scope.registerUserData.companyName = null;
            $scope.registerUserData.companyPosition = null;
        };

        registrationService.updateUserData($scope.registerUserData).then(function (response) {
            if (!$scope.registerUserData.packageIsFree && $scope.registerUserData.email != $scope.oldEmail) {
                var chngEmailData = {
                    objectId: $scope.registerUserData.objectId,
                    email: $scope.oldEmail,
                    newEmail: $scope.registerUserData.email
                };
                registrationService.changeUserEmail(chngEmailData).then(function (response) {
                    if (ngAuthSettings.lang == "pl") {
                        alert('Dane zmieniono poprawnie. Ze względu na zmianę adresu email wymagane jest ponowne logowanie');
                    } else {
                        alert('Data changes successfuly. Because of the email change re-login is requited');
                    }
                    authService.logOut();
                    $location.path('/login');
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
            } else {
                $location.path('/user-account');
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
                 $scope.message = "Błąd aktualizacji danych użytkownika. Szczegóły:" + errors.join(' ') + ' ' + response.data.message;
             } else {
                 $scope.message = "There was an error during user data update. Details:" + errors.join(' ') + ' ' + response.data.message;
             }
             $scope.loading = false;
         });
    };

    $scope.redirectToAccount = function () {
        $location.path('/user-account');
    };
}]);
