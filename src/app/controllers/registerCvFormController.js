'use strict';
app.controller('registerCvFormController', ['$scope', '$routeParams', '$location', '$window', 'registrationService', 'ngAuthSettings',
    function ($scope, $routeParams, $location, $window, registrationService, ngAuthSettings) {

        $scope.selectedSchool = "";
        $scope.selectedDepartment = "";
        $scope.schools = [];
        $scope.departments = [];
        $scope.regId = $routeParams.regId;
        $scope.isCvUploaded = false;
        $scope.message = "";
        $scope.messageOk = "";
        $scope.userCvData = {
            objectId: $routeParams.regId,
            languageEnglish: 0,
            languageGerman: 0,
            languageFrench: 0
        };
        $scope.workOption = "";
        $scope.schoolOtherShow = false;
        $scope.deptOtherShow = false;
        $scope.loading = false;
        $scope.exhList = [];
        $scope.eventSettings = null;

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

        registrationService.getEventExhibitorsCVFromUserDyn($routeParams.regId).then(function (results) {
            $scope.exhList = results.data;
        }, function (error) {
            alert(error.data.message);
        });

        registrationService.getEventSettingsFromUser($routeParams.regId).then(function (results) {
            $scope.eventSettings = results.data;
            if ($scope.eventSettings.allowSendCV != true) {
                $location.path('/register-inform/' + $scope.regId);
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

        $scope.redirectToInform = function () {
	        var txt = 'Nie odnotowaliśmy przesłania formularza CV - czy na pewno chcesz przejść dalej?';
			if (!$scope.isCvUploaded && !confirm(txt)) {
				return;
			}
            $location.path('/register-inform/' + $scope.regId);
        };

        $scope.skipThisPage = function () {
            $location.path('/register-inform/' + $scope.regId);
        };

        $scope.redirectToUpload = function () {
	        var txt = 'Nie odnotowaliśmy przesłania formularza CV - czy na pewno chcesz przejść dalej?';
			if (!$scope.isCvUploaded && !confirm(txt)) {
				return;
			}
			$location.path('/register-cv-upload/' + $scope.regId);
        };

        $scope.uploadCvForm = function () {
            $scope.uploadCvFormNew(false);
        };

        $scope.uploadCvFormNew = function (goToUpload) {
            angular.forEach($scope.cvForm.$error.required, function (field) {
                field.$setDirty();
            });
			$scope.messageOk = "";
			$scope.message = "";
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

            registrationService.uploadCvForm($scope.regId, $scope.userCvData).then(function (response) {
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
                        // registrationService.uploadUserCVPicture($scope.regId, uploadData).then(function (results) {
                            // if (goToUpload == true) {
                                // $location.path('/register-cv-upload/' + $scope.regId);
                            // } else {
                                // $location.path('/register-inform/' + $scope.regId);
                            // }
                        // }, function (error) {
                            // $scope.message = error.data.message;
                            // $scope.loading = false;
                        // });
                    // }
                    // r.readAsArrayBuffer(file);
                // }
                // else {
                    //if (goToUpload == true) {
                    //    $location.path('/register-cv-upload/' + $scope.regId);
                    //} else {
                    //    $location.path('/register-inform/' + $scope.regId);
                    //}
					if (ngAuthSettings.lang == "pl") {
						$scope.messageOk = "Dziękujemy, zapisaliśmy Twoje CV";
					} else {
						$scope.messageOk = "Thank You, we've saved your CV";
					}
					$scope.isCvUploaded = true;
                    $scope.loading = false;
                // }
            },
             function (error) {
                 $scope.message = error.data.message;
                 $scope.loading = false;
                 return;
             });
        };
    }]);