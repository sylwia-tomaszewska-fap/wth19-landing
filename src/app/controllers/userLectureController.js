'use strict';
app.controller('userLectureController', ['$scope', '$route', '$routeParams', '$location', '$window', 'registrationService', 'ngAuthSettings',
    function ($scope, $route, $routeParams, $location, $window, registrationService, ngAuthSettings) {

    $scope.eventCode = ngAuthSettings.eventCode;
    $scope.message = "";
    $scope.loading = true;
    $scope.inEnglish = "null";
    $scope.lectureTags = [];
    $scope.isPackageHasVipPlaces = false;
    $scope.tags = {
        selected: []
    };
    $scope.userSummary = {
    };
    // new
    $scope.agenda = {
        selected: [],
    };
	$scope.lectures = {};

    registrationService.getUserSummary().then(function (results) {
        $scope.userSummary = results.data;
        registrationService.getIsPackageHasVipPlaces($scope.eventCode, $scope.userSummary.packageCode).then(function (results) {
            $scope.isPackageHasVipPlaces = results.data;
        }, function (error) {
            alert(error.data.message);
        });
        registrationService.getUserLecturesTree($scope.eventCode).then(function (results) {
            $scope.setAgenda(results.data, true);
            $scope.message = "";
            $scope.loading = false;
        }, function (error) {
            $scope.message = error.data.errorMessage;
            $scope.loading = false;
        });
    }, function (error) {
        alert(error.data.message);
        $scope.loading = false;
        return;
    });

    registrationService.getLectueTags($scope.eventCode).then(function (results) {
        $scope.lectureTags = results.data;
    }, function (error) {
        alert(error.data.message);
    });

    $scope.setAgenda = function (resData, isInit) {
        $scope.prelekcje = resData;

        var isFirst = $scope.agenda.selected.length == 0; // new
        for (var d = 0; d < $scope.prelekcje.length; d++) {
            for (var i = 0; i < $scope.prelekcje[d].categories.length; i++) {
                for (var j = 0; j < $scope.prelekcje[d].categories[i].lectures.length; j++) {
                    $scope.prelekcje[d].categories[i].lectures[j].startDate = $scope.prelekcje[d].categories[i].lectures[j].startDate.substring(11, 16);
                    $scope.prelekcje[d].categories[i].lectures[j].endDate = $scope.prelekcje[d].categories[i].lectures[j].endDate.substring(11, 16);
					$scope.lectures[$scope.prelekcje[d].categories[i].lectures[j].objectId] = $scope.prelekcje[d].categories[i].lectures[j];

                    // new
                    if (isInit == true && isFirst == true && $scope.prelekcje[d].categories[i].lectures[j].isRegistered == true)
                        $scope.agenda.selected.push($scope.prelekcje[d].categories[i].lectures[j].objectId);
                }
            }
        }
    };

    $scope.filterAgenda = function () {
        $scope.loading = true;
        registrationService.getUserLecturesTreeWithFilter($scope.eventCode, $scope.inEnglish, $scope.tags.selected).then(function (results) {
            $scope.setAgenda(results.data, false);
            $scope.message = "";
            $scope.loading = false;
        }, function (error) {
            $scope.message = error.data.errorMessage;
            $scope.loading = false;
        });
    };

	$scope.sortFnc = function (objectId) {
        return $scope.lectures[objectId].startDate;
    };
	
    //$scope.saveReservation = function (ps) {
    //    $scope.loading = true;
    //    registrationService.saveReservation(ps.objectId, !ps.isRegistered).then(function (results) {
    //        ps.isRegistered = !ps.isRegistered;
    //        alert('Zapisano zmianę');
    //        $scope.loading = false;
    //    }, function (error) {
    //        $scope.message = error.data.errorMessage;
    //        $scope.loading = false;
    //    });
    //};

    $scope.saveReservations = function () {
        $scope.loading = true;
        registrationService.saveUserReservations($scope.agenda).then(function (results) {
            $location.path('/user-account');
        }, function (error) {
            $scope.message = error.data.message;
            $scope.loading = false;
        });
    };

    $scope.redirectToAccount = function () {
        $location.path('/user-account/');
    };
}]);