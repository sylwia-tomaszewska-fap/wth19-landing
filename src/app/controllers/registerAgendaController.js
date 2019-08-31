'use strict';
app.controller('registerAgendaController', ['$scope', '$route', '$routeParams', '$location', '$window', 'registrationService', 'ngAuthSettings', 
    function ($scope, $route, $routeParams, $location, $window, registrationService, ngAuthSettings) {

	$scope.message = "";
	$scope.lectureTags = [];
	$scope.categories = [];
	$scope.selectedCategory = null;
	$scope.isPackageHasVipPlaces = false;
	$scope.isVipCategoryRequired = false;
	$scope.inEnglish = "null";
	$scope.tags = {
       selected: []
	};
	$scope.agenda = {
       selected: [],
       packageCode: null,
       couponCode: null,
       vipCategoryId: null
	};
	$scope.lectures = {};
	$scope.loading = true;

	if ($routeParams.selected != undefined) {
		registrationService.getReservations($routeParams.selected).then(function (results) {
			$scope.agenda = results.data;
			$scope.getEventSettings();
		}, function (error) {
			$scope.loading = false;
			alert(error.data.message);
		});
	} else {
		$scope.getEventSettings();
	}
	
	$scope.getEventSettings = function() {
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
			else if (results.data.isPackageRequired == true && $scope.agenda.packageCode == null) {
				$location.path('/register-package/' + $routeParams.eventCode);
			}
			else if (results.data.hasAgenda == false) {
				$location.path('/register-user-data/' + $routeParams.eventCode);
			}
			else if (results.data.showAgenda == false) {
				if (ngAuthSettings.lang == "pl") {
					$scope.message = "Agenda czasowo ukryta, zapraszamy niebawem.";
				} else {
					$scope.message = "Agenda is temporary unavailable, welcome soon.";
				}
            } else {
                registrationService.getPackageInfo($routeParams.eventCode, $scope.agenda.packageCode).then(function (results) {
                    $scope.isPackageHasVipPlaces = results.data.hasVipPlaces;
                    $scope.isVipCategoryRequired = results.data.isVipCategoryRequired;
                    if ($scope.isVipCategoryRequired) {
                        registrationService.getEventCategories($routeParams.eventCode).then(function (results) {
                            $scope.categories = results.data;
                        }, function (error) {
                            alert(error.data.message);
                        });
                    }
                }, function (error) {
                    alert(error.data.message);
                });
				$scope.noFilterAgenda();
			}
		}, function (error) {
			$scope.loading = false;
			alert(error.data.message);
		});
	};

    registrationService.getLectueTags($routeParams.eventCode).then(function (results) {
        $scope.lectureTags = results.data;
    }, function (error) {
        alert(error.data.message);
    });

    $scope.noFilterAgenda = function () {
        $scope.loading = true;
        registrationService.getLecturesTree($routeParams.eventCode, $scope.agenda.couponCode).then(function (results) {
            $scope.prelekcje = results.data;

            for (var d = 0; d < $scope.prelekcje.length; d++) {
                for (var i = 0; i < $scope.prelekcje[d].categories.length; i++) {
                    for (var j = 0; j < $scope.prelekcje[d].categories[i].lectures.length; j++) {
                        $scope.prelekcje[d].categories[i].lectures[j].startDate = $scope.prelekcje[d].categories[i].lectures[j].startDate.substring(11, 16);
                        $scope.prelekcje[d].categories[i].lectures[j].endDate = $scope.prelekcje[d].categories[i].lectures[j].endDate.substring(11, 16);
						$scope.lectures[$scope.prelekcje[d].categories[i].lectures[j].objectId] = $scope.prelekcje[d].categories[i].lectures[j];
                    }
                }
            }

            $scope.message = "";
            $scope.loading = false;
        }, function (error) {
            $scope.loading = false;
            $scope.message = error.data.errorMessage;
        });
    };

    $scope.filterAgenda = function () {
        $scope.loading = true;
        registrationService.getLecturesTreeWithFilter($routeParams.eventCode, $scope.inEnglish, $scope.tags.selected, $scope.agenda.couponCode).then(function (results) {
            $scope.prelekcje = results.data;

            for (var d = 0; d < $scope.prelekcje.length; d++) {
                for (var i = 0; i < $scope.prelekcje[d].categories.length; i++) {
                    for (var j = 0; j < $scope.prelekcje[d].categories[i].lectures.length; j++) {
                        $scope.prelekcje[d].categories[i].lectures[j].startDate = $scope.prelekcje[d].categories[i].lectures[j].startDate.substring(11, 16);
                        $scope.prelekcje[d].categories[i].lectures[j].endDate = $scope.prelekcje[d].categories[i].lectures[j].endDate.substring(11, 16);
                    }
                }
            }

            $scope.loading = false;
            $scope.message = "";
        }, function (error) {
            $scope.loading = false;
            $scope.message = error.data.errorMessage;
        });
    };

	$scope.sortFnc = function (objectId) {
        return $scope.lectures[objectId].startDate;
    };
	
    $scope.changeCategory = function (selectedCategory) {
        $scope.agenda.vipCategoryId = selectedCategory.objectId;
    };

    $scope.saveReservations = function () {
        angular.forEach($scope.agendaForm.$error.required, function (field) {
            field.$setDirty();
        });
        if (!$scope.agendaForm.$valid) {
            return;
        }
        if ($scope.agenda.selected.length == 0) {
            if (ngAuthSettings.lang == "pl") {
                $scope.message = "Wybierz co najmniej jedną prelekcję";
            } else {
                $scope.message = "Choose at least one speach";
            }
            return;
        }
        $scope.loading = true;
        registrationService.saveReservations($scope.agenda).then(function (results) {
            $location.path('/register-user-data/' + $routeParams.eventCode + '/' + results.data.replace(/"/g, ''));
        }, function (error) {
            $scope.message = error.data.message;
            $scope.loading = false;
        });
    };
}]);