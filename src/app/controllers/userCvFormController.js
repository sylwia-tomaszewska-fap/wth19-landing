'use strict';
app.controller('userCvFormController', ['$scope', '$location', 'registrationService', 'ngAuthSettings', function ($scope, $location, registrationService, ngAuthSettings) {

    $scope.eventCode = ngAuthSettings.eventCode;
    $scope.userSummary = {
    };
    $scope.selectedSchool = "";
    $scope.selectedDepartment = "";
    $scope.schools = [];
    $scope.departments = [];
    $scope.message = "";
    $scope.userCvData = {
        objectId: "",
        languageEnglish: 0,
        languageGerman: 0,
        languageFrench: 0,
    };
    $scope.workOption = "";
    $scope.schoolOtherShow = false;
    $scope.deptOtherShow = false;
    $scope.loading = false;
	$scope.exhList = [];
	$scope.eventSettings = null;


    registrationService.getEventSettings($scope.eventCode).then(function (results) {
        $scope.eventSettings = results.data;
        if ($scope.eventSettings.allowSendCV != true) {
            if (ngAuthSettings.lang == "pl") {
                alert('Wysyłanie i aktualizacja CV są obecnie zablokowane');
            } else {
                alert('CV sending and update are currently blocked');
            }
            //$location.path('/user-account');
        }
    }, function (error) {
        alert(error.data.message);
    });

	registrationService.getEventExhibitorsCVFromUserDynLogged().then(function (results) {
		$scope.exhList = results.data;
	}, function (error) {
		alert(error.data.message);
	});

    registrationService.getUserSummary().then(function (results) {
        $scope.userSummary = results.data;
        $scope.userCvData.objectId = $scope.userSummary.objectId;
    }, function (error) {
        alert(error.data.message);
    });

    registrationService.getSchools().then(function (results) {
        $scope.schools = results.data;
    }, function (error) {
        alert(error.data.message);
    });

    $scope.getDepartments = function (selectedSchool) {

        $scope.userCvData.schoolId = selectedSchool.objectId;
        $scope.schoolOtherShow = (selectedSchool.name == 'Inna');
        if ($scope.schoolOtherShow != true) {
            $scope.userCvData.otherSchool = null;
        }
        $scope.userCvData.departmentId = null;
        $scope.userCvData.otherDepartment = null;
        $scope.deptOtherShow = $scope.schoolOtherShow;

        registrationService.getDepartments(selectedSchool.objectId).then(function (results) {
            $scope.departments = results.data;
        }, function (error) {
            alert(error.data.message);
        });
    };

    $scope.changeDepartment = function (selectedDepartment) {
        $scope.userCvData.departmentId = selectedDepartment.objectId;
        $scope.deptOtherShow = (selectedDepartment.name == 'Inny');
    };

    registrationService.getCvForm().then(function (results) {
        if (results.data == 'null' || results.data == null) {
            return;
        };
        $scope.userCvData = results.data;
        if ($scope.userCvData.workCountry == true) {
            $scope.workOption = '0';
        } else if ($scope.userCvData.workDistrict == true) {
            $scope.workOption = '1';
        } else if ($scope.userCvData.workCity == true) {
            $scope.workOption = '2';
        }
        if ($scope.userCvData.educationLevel == '1' || $scope.userCvData.educationLevel == '2') {
            if ($scope.userCvData.schoolId != null) {
                if ($scope.userCvData.departmentId == null) {
                    $scope.deptOtherShow = true;
                };
                var arrayLength = $scope.schools.length;
                for (var i = 0; i < arrayLength; i++) {
                    if ($scope.schools[i].objectId == $scope.userCvData.schoolId) {
                        $scope.selectedSchool = $scope.schools[i];
                        break;
                    };
                }
                registrationService.getDepartments($scope.userCvData.schoolId).then(function (results) {
                    $scope.departments = results.data;
                    if ($scope.userCvData.departmentId != null) {
                        var arrayLength = $scope.departments.length;
                        for (var i = 0; i < arrayLength; i++) {
                            if ($scope.departments[i].objectId == $scope.userCvData.departmentId) {
                                $scope.selectedDepartment = $scope.departments[i];
                                break;
                            };
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
                    };
                }, function (error) {
                    alert(error.data.message);
                });
            } else {
                var arrayLength = $scope.schools.length;
                for (var i = 0; i < arrayLength; i++) {
                    if ($scope.schools[i].name == 'Inna') {
                        $scope.selectedSchool = $scope.schools[i];
                        break;
                    };
                }
            };
        };
    }, function (error) {
        alert(error.data.message);
    });

    $scope.redirectToAccount = function () {
        $location.path('/user-account');
    };

    $scope.uploadCvForm = function () {
        angular.forEach($scope.cvForm.$error.required, function (field) {
            field.$setDirty();
        });
        if (!$scope.cvForm.$valid) {
			if (ngAuthSettings.lang == "pl") {
				$scope.message = "Na formularzu występują błędy. Popraw i spróbuj ponownie";
			} else {
				$scope.message = "This form is not valid. Correct form and try again";
			}
            return;
        }
        // var docs = document.getElementById("userCVPicture").files;
        // if (docs.length > 0) {
            // var file = docs[0];
            // if (file.size > 1 * 1024 * 1024) {
                // if (ngAuthSettings.lang == "pl") {
                    // $scope.message = "Plik nie może być większy niż 1MB";
                // } else {
                    // $scope.message = "File size can not be greater than 1MB";
                // }
                // return;
            // };
        // }
        $scope.loading = true;

        if ($scope.userCvData.educationLevel == '0') {
            $scope.userCvData.schoolId = null;
            $scope.userCvData.otherSchool = null;
            $scope.userCvData.departmentId = null;
            $scope.userCvData.otherDepartment = null;
        }
        if ($scope.schoolOtherShow) {
            $scope.userCvData.schoolId = null;
        }
        if ($scope.deptOtherShow) {
            $scope.userCvData.departmentId = null;
        }
        if ($scope.workOption == '0') {
            $scope.userCvData.workCountry = true;
            $scope.userCvData.workCity = false;
            $scope.userCvData.workCityName = null;
            $scope.userCvData.workDistrict = false;
            $scope.userCvData.workDistrictName = null;
            $scope.userCvData.workAnywhere = false;
        }
        else if ($scope.workOption == '1') {
            $scope.userCvData.workCountry = false;
            $scope.userCvData.workCity = false;
            $scope.userCvData.workCityName = null;
            $scope.userCvData.workDistrict = true;
            $scope.userCvData.workAnywhere = false;
        }
        else if ($scope.workOption == '2') {
            $scope.userCvData.workCountry = false;
            $scope.userCvData.workCity = true;
            $scope.userCvData.workDistrict = false;
            $scope.userCvData.workDistrictName = null;
            $scope.userCvData.workAnywhere = false;
        }
		else if ($scope.workOption == '3') {
			$scope.userCvData.workCountry = false;
			$scope.userCvData.workCity = false;
			$scope.userCvData.workDistrict = false;
			$scope.userCvData.workDistrictName = null;
			$scope.userCvData.workAnywhere = true;
		}

        registrationService.uploadCvForm($scope.userCvData.objectId, $scope.userCvData).then(function (response) {
            // if (docs.length > 0) {
                // var r = new FileReader();
                // r.onloadend = function (e) {
                    // var arr = null;
                    // if (Array.from) {
                        // arr = Array.from(new Uint8Array(e.target.result));
                    // } else {
                        // arr = [];
                        // var tmp = new Uint8Array(e.target.result);
                        // var length = tmp.length;

                        // for (var i = 0; i < length; i++) {
                            // arr.push(tmp[i]);
                        // }
                    // }
                    // var uploadData = {
                        // Name: file.name,
                        // Bytes: arr
                    // }
                    // registrationService.uploadUserCVPicture($scope.userCvData.objectId, uploadData).then(function (results) {
                        // $location.path('/user-account');
                    // }, function (error) {
                        // $scope.message = error.data.message;
                        // $scope.loading = false;
                    // });
                // }
                // r.readAsArrayBuffer(file);
            // }
            // else {
                $location.path('/user-account');
            // }
            $scope.loading = false;
        },
         function (error) {
             $scope.message = error.data.message;
             $scope.loading = false;
             return;
         });
    };
}]);