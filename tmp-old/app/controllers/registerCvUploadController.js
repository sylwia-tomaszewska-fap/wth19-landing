'use strict';
app.controller('registerCvUploadController', ['$scope', '$routeParams', '$location', '$window', 'registrationService', 'ngAuthSettings',
    function ($scope, $routeParams, $location, $window, registrationService, ngAuthSettings) {

        $scope.regId = $routeParams.regId;
        $scope.isCvUploaded = false;
        $scope.message = "";
        $scope.messageOk = "";
        $scope.uploadData = {
            interestedIn: null
        };
        $scope.loading = false;
        $scope.eventSettings = null;
        $scope.exhList = [];
	
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

        registrationService.getEventSettingsFromUser($routeParams.regId).then(function (results) {
            $scope.eventSettings = results.data;
            if ($scope.eventSettings.allowSendCV != true) {
                $location.path('/register-inform/' + $scope.regId);
            }
        }, function (error) {
            alert(error.data.message);
        });

        registrationService.getEventExhibitorsCVFromUserDyn($routeParams.regId).then(function (results) {
            $scope.exhList = results.data;
        }, function (error) {
            alert(error.data.message);
        });

        var saveCvInfo = function (pathToRedir) {
            if ($scope.isCvUploaded == false) {
                if (ngAuthSettings.lang == "pl") {
                    $scope.message = 'Najpierw wgraj plik CV';
                } else {
                    $scope.message = 'You need to upload CV file first';
                }
                return;
            };
            if ($scope.uploadData.interestedIn == null) {
                if (ngAuthSettings.lang == "pl") {
                    $scope.message = 'Wpisz dodatkowe informacje';
                } else {
                    $scope.message = 'Provide additional information';
                }
                return;
            };
            $scope.loading = true;
        };

        $scope.redirectToInform = function () {
	        var txt = 'Nie odnotowaliśmy przesłania CV w postaci pliku - czy na pewno chcesz przejść dalej?';
			if (!$scope.isCvUploaded && !confirm(txt)) {
				return;
			}
            $location.path('/register-inform/' + $scope.regId);
        };

        $scope.skipThisPage = function () {
            $location.path('/register-inform/' + $scope.regId);
        };

        $scope.saveAndRedirectToForm = function () {
            //$scope.uploadUserCV(true);
	        var txt = 'Nie odnotowaliśmy przesłania CV w postaci pliku - czy na pewno chcesz przejść dalej?';
			if (!$scope.isCvUploaded && !confirm(txt)) {
				return;
			}
			$location.path('/register-cv-form/' + $scope.regId);
        };

        $scope.saveAndMoveNext = function () {
            $scope.uploadUserCV(false);
        };

        $scope.uploadUserCV = function (goToForm) {
            if ($scope.uploadData.interestedIn == null) {
                if (ngAuthSettings.lang == "pl") {
                    $scope.message = 'Wpisz dodatkowe informacje';
                } else {
                    $scope.message = 'Provide additional information';
                }
                return;
            };
            if (document.getElementById("userCV").files.length == 0) {
                if (ngAuthSettings.lang == "pl") {
                    $scope.message = 'Wybierz plik CV do wgrania';
                } else {
                    $scope.message = 'Choose CV file to upload';
                }
                return;
            };
            var file = document.getElementById("userCV").files[0];
            if (file.size > 5 * 1024 * 1024) {
                if (ngAuthSettings.lang == "pl") {
                    $scope.message = "Plik nie może być większy niż 5MB";
                } else {
                    $scope.message = "File size can not be greater than 5MB";
                }
                return;
            };
            $scope.loading = true;
            var r = new FileReader();
            r.onloadend = function (e) {
                var arr = null;
                if (Array.from) {
                    arr = Array.from(new Uint8Array(e.target.result));
                } else {
                    arr = [];
                    var tmp = new Uint8Array(e.target.result);
                    var length = tmp.length;

                    for (var i = 0; i < length; i++) {
                        arr.push(tmp[i]);
                    }
                }
                var uploadData = {
                    Name: file.name,
                    Bytes: arr
                }
                $scope.messageOk = "";
                $scope.message = "";
                registrationService.uploadUserCV($scope.regId, uploadData).then(function (results) {
                    registrationService.uploadCvInfo($routeParams.regId, $scope.uploadData).then(function (results) {
                        //if (goToForm) {
                            //$location.path('/register-cv-form/' + $scope.regId);
                        //} else {
                            //$location.path('/register-inform/' + $scope.regId);
                        //}
                        if (ngAuthSettings.lang == "pl") {
                            $scope.messageOk = "Dziękujemy, zapisaliśmy Twoje CV";
                        } else {
                            $scope.messageOk = "Thank You, we've saved your CV";
                        }
                        $scope.isCvUploaded = true;
                        $scope.loading = false;
                    }, function (error) {
                        $scope.message = error.data.message;
                        $scope.loading = false;
                    });
                }, function (error) {
                    $scope.message = error.data.message;
                    $scope.loading = false;
                });
            }
            r.readAsArrayBuffer(file);
        };
    }]);