'use strict';
app.controller('userAccountController', ['$scope', '$window', '$route', '$location', 'registrationService', 'authService', 'ngAuthSettings',
    function ($scope, $window, $route, $location, registrationService, authService, ngAuthSettings) {

    $scope.userSummary = {
        };
    $scope.eventSettings = {
    };
    $scope.uploadMessage = "";
    $scope.informMessage = "";
    $scope.registerUserData = {
        emails: "",
    };
    $scope.invoices = [];
	$scope.packagesOpt = [];
    $scope.loading = false;
    $scope.exhList = [];

    var initData = function () {
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
        registrationService.getUserInvoices().then(function (results) {
            $scope.invoices = results.data;
        }, function (error) {
            alert(error.data.message);
            return;
        });
		registrationService.getEventExhibitorsCVFromUserDynLogged().then(function (results) {
			$scope.exhList = results.data;
		}, function (error) {
			alert(error.data.message);
		});
		registrationService.getUserPackagesOptionalChoosed().then(function (results) {
            $scope.packagesOpt = results.data;
        }, function (error) {
            alert(error.data.message);
            return;
        });
	}

    initData();

    $scope.uploadUserCV = function () {
        var file = document.getElementById("userCV").files[0];
        if (file.size > 10 * 1024 * 1024) {
            if (ngAuthSettings.lang == "pl") {
                $scope.uploadMessage = "Plik nie może być większy niż 10MB";
            } else {
                $scope.uploadMessage = "File size can not be greater than 10MB";
            }
            return;
        };
        $scope.uploadMessage = '';
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
                name: file.name,
                bytes: arr
            }

            registrationService.uploadUserCV($scope.userSummary.objectId, uploadData).then(function (results) {
                $route.reload();
                $scope.loading = false;
            }, function (error) {
                $scope.loading = false;
                $scope.uploadMessage = error.data.message;
            });
        }
        r.onerror = function (error) {
            $scope.uploadMessage = error;
        };
        r.readAsArrayBuffer(file);
    };

    $scope.sendRecommendations = function () {
        registrationService.sendRecommendations($scope.userSummary.objectId, $scope.registerUserData).then(function (results) {
            $scope.informMessage = results.data.replace(/"/g, '');//.split('<br/>').join(' ');
            initData();
        }, function (error) {
            alert(error.data.message);
        });
    };

    $scope.redirectToLectures = function () {
        $location.path('/user-lecture');
    };

    $scope.redirectToResources = function () {
        $location.path('/user-resource');
    };

    $scope.redirectToUserEdit = function () {
        $location.path('/user-data');
    };

    $scope.redirectToMeet = function () {
        $location.path('/user-meet');
    };

    $scope.redirectToConvertToVIP = function () {
        $location.path('/user-package');
    };

    $scope.sendInvitation = function () {
        registrationService.sendInvitation($scope.userSummary.objectId).then(function (results) {
            if (ngAuthSettings.lang == "pl") {
                alert('Zaproszenie zostało wysłane. Sprawdź swoją skrzynkę pocztową. Gdyby wiadomość przez długi czas nie przychodziła, upewnij się czy nie wpadła do "wiadomości-śmieci"');
            } else {
                alert("Invitation has been sent. Check Your mailbox. If message hasn't been received for a long time, make sure it is not in Junk Email folder");
            }
        }, function (error) {
            alert(error.data.message);
        });
    };

    $scope.getInvoice = function (invoiceId) {
        $window.location.href = registrationService.getInvoiceUrl(invoiceId);
    };

    $scope.getInvitation = function () {
        $window.location.href = registrationService.getInvitationUrl($scope.userSummary.objectId);
    };

    $scope.getCalendar = function () {
        $window.location.href = registrationService.getCalendarUrl($scope.userSummary.objectId);
    };

    $scope.removeAccount = function () {
        var txt = 'Czy jesteś pewien/pewna, że chcesz usunąć konto? Operacja jest nieodwracalna';
        if (ngAuthSettings.lang != "pl") {
            txt = 'Are You sure You want to remove Your account? The operation is irreversible';
        }
        if (confirm(txt)) {
            registrationService.removeAccount().then(function (results) {
                authService.logOut();
                if (ngAuthSettings.lang == "pl") {
                    alert('Konto zostało usunięte. Nastąpi wylogowanie.');
                } else {
                    alert('Account has been removed. You will be logged out.');
                }
                $location.path('/login');
            }, function (error) {
                alert(error.data.message);
            });
        }
    };
	
    $scope.removeUserCVFile = function () {
        var txt = 'Czy jesteś pewien/pewna, że chcesz usunąć plik CV?';
        if (ngAuthSettings.lang != "pl") {
            txt = 'Are You sure You want to remove Your CV file?';
        }
        if (confirm(txt)) {
            registrationService.removeUserCVFile($scope.userSummary.objectId).then(function (results) {
                initData();
            }, function (error) {
                alert(error.data.message);
            });
        }
    };
	
    $scope.redirectToCvFormEdit = function () {
        $location.path('/user-cv-form');
    };
    
}]);