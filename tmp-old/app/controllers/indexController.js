var app = angular.module('mpApp', ['ngSanitize']);

//var serviceBase = 'http://localhost:3682/';             // deweloperskie programisty
// var serviceBase = 'https://dev.brandsome.it/';          // deweloperskie zdalne
var serviceBase = 'https://brandsome.it/'; // produkcyjne !!!

app.constant('ngAuthSettings', {
    apiServiceBaseUri: serviceBase,
    clientId: 'WthApp',
    eventCode: 'WTH18',
    lang: 'pl'
});

app.controller('indexController', ['$scope', '$http', '$window', 'ngAuthSettings', function($scope, $http, $window, ngAuthSettings) {

    $scope.exhibitors_full = [];
    $scope.exhibitors_basic = [];
    $scope.activeExhibitor = {};
    $scope.changeActiveExhibitor = changeActiveExhibitor;
    $scope.activePrelegent = {};
    $scope.changePrelegent = changePrelegent;
    $scope.partners = [];
    $scope.recData = {
        name: null,
        emails: null,
        phoneNumbers: null
    };
    $scope.recMessage = "";
    $scope.reminderData = {
        email: null,
        date: null,
        time: null
    };
    $scope.prelegenci = [];
    $scope.prelegenciAll = [];
	$scope.modalData = {
        name: null,
        companyName: null,
        email: null,
		phoneNo: null
    };
	$scope.modalMessage = '';

    $scope.redirectToRegistration = function() {
        if (ngAuthSettings.lang == 'pl') {
            $window.location.href = 'registration.html#/register/' + ngAuthSettings.eventCode;
        } else {
            $window.location.href = 'registration-en.html#/register/' + ngAuthSettings.eventCode;
        }
    };

    $scope.redirectToLogin = function() {
        if (ngAuthSettings.lang == 'pl') {
            $window.location.href = 'user.html#/login';
        } else {
            $window.location.href = 'user-en.html#/login';
        }
    };

    function changePrelegent(index) {
        $scope.activePrelegent = index;
    }

    function changeActiveExhibitor(exhibitor) {
        var exhId = exhibitor.objectId;
        $scope.loadExhibitorDetails(exhId);
    }

    var loadPartners = function() {
        $http({
                method: 'GET',
                url: ngAuthSettings.apiServiceBaseUri + 'api/event/' + ngAuthSettings.eventCode + '/Partners',
                responseType: 'json',
                headers: {
                    'Content-type': 'application/json'
                }
            })
            .success(function(data, status, headers, config) {
                $scope.partners = data;
                $scope.message = 1;
            })
            .error(function(data, status, headers, config) {
                $scope.message = status;
            });
    };

    var loadExhibitors = function() {
        $http({
                method: 'GET',
                url: ngAuthSettings.apiServiceBaseUri + 'api/event/' + ngAuthSettings.eventCode + '/Exhibitors/Definition/FULL',
                responseType: 'json',
                headers: {
                    'Content-type': 'application/json'
                }
            })
            .success(function(data, status, headers, config) {
                $scope.exhibitors_full = data;
                $scope.message = '';
            })
            .error(function(data, status, headers, config) {
                $scope.message = status;
            });
        $http({
                method: 'GET',
                url: ngAuthSettings.apiServiceBaseUri + 'api/event/' + ngAuthSettings.eventCode + '/Exhibitors/Definition/BASIC',
                responseType: 'json',
                headers: {
                    'Content-type': 'application/json'
                }
            })
            .success(function(data, status, headers, config) {
                $scope.exhibitors_basic = data;
                $scope.message = '';
            })
            .error(function(data, status, headers, config) {
                $scope.message = status;
            });

        //Piotr Janas:start
        $http({
                method: 'GET',
                url: ngAuthSettings.apiServiceBaseUri + 'api/event/' + ngAuthSettings.eventCode + '/Exhibitors/Definition/MARK',
                responseType: 'json',
                headers: {
                    'Content-type': 'application/json'
                }
            })
            .success(function(data, status, headers, config) {
                $scope.exhibitors_mark = data;
                $scope.message = '';
                exhibitors_mark = data;               
            })
            .error(function(data, status, headers, config) {
                $scope.message = status;
            });
        
        //Piotr Janas:end
    };

    $scope.loadExhibitorDetails = function(exhId) {

        $http({
                method: 'GET',
                url: ngAuthSettings.apiServiceBaseUri + 'api/event/' + ngAuthSettings.eventCode + '/Exhibitors/List/' + exhId,
                responseType: 'json',
                headers: {
                    'Content-type': 'application/json'
                }
            })
            .success(function(data, status, headers, config) {
                $scope.activeExhibitor = data;
                console.log($scope.activeExhibitor);
                $scope.message = '';
            })
            .error(function(data, status, headers, config) {
                $scope.message = status;
            });

    };

    $scope.loadLectures = function() {
        //var inEnglishFlt = $scope.inEnglish;
        //if (inEnglishFlt == "null")
        //    inEnglishFlt = "";
        //var filter = '?inEnglish=' + inEnglishFlt + '&tags=' + $scope.tags.selected;

        $http({
                method: 'GET',
                url: ngAuthSettings.apiServiceBaseUri + 'api/event/' + ngAuthSettings.eventCode + '/Lectures/Tree', // + filter,
                responseType: 'json',
                headers: {
                    'Content-type': 'application/json'
                }
            })
            .success(function(data, status, headers, config) {
                $scope.prelekcje = data;

                for (var d = 0; d < $scope.prelekcje.length; d++) {
                    for (var i = 0; i < $scope.prelekcje[d].categories.length; i++) {
                        for (var j = 0; j < $scope.prelekcje[d].categories[i].lectures.length; j++) {
                            $scope.prelekcje[d].categories[i].lectures[j].startDate = $scope.prelekcje[d].categories[i].lectures[j].startDate.substring(11, 16);
                            $scope.prelekcje[d].categories[i].lectures[j].endDate = $scope.prelekcje[d].categories[i].lectures[j].endDate.substring(11, 16);
                        }
                    }
                }

                $scope.prelekcjeByTimeSlot = makePrelekcjeByTimeSlot($scope.prelekcje);

                $scope.message = 1;
            })
            .error(function(data, status, headers, config) {
                $scope.message = status;
            });
    };

    var loadLecturers = function() {
        $http({
                method: 'GET',
                url: ngAuthSettings.apiServiceBaseUri + 'api/event/' + ngAuthSettings.eventCode + '/LecturersN?count=11',
                responseType: 'json',
                headers: {
                    'Content-type': 'application/json'
                }
            })
            .success(function(data, status, headers, config) {
                $scope.prelegencitmp = data;
                for (var i = 0; i < $scope.prelegencitmp.length; i++) {
                    if ($scope.prelegencitmp[i].LastName !== "Wkrótce") {
                        $scope.prelegenci.push($scope.prelegencitmp[i]);
                    }
                    if ($scope.prelegencitmp[i].imageUrl == null) {
                        $scope.prelegencitmp[i].imageUrl = "https://brandsome.it/content/img/brak_zdjecia.png";
                    }
                }
                //$scope.prelegenci = $scope.prelegenci.slice(0, 20);
                $scope.message = 1;
                //console.log($scope.prelegenci);
            })
            .error(function(data, status, headers, config) {
                $scope.message = status;
            });
    };

    $scope.loadAllLecturers = function() {
        if ($scope.prelegenciAll.length == 0) {
            $http({
                    method: 'GET',
                    url: ngAuthSettings.apiServiceBaseUri + 'api/event/' + ngAuthSettings.eventCode + '/Lecturers',
                    responseType: 'json',
                    headers: {
                        'Content-type': 'application/json'
                    }
                })
                .success(function(data, status, headers, config) {
                    $scope.prelegenciAll = data;
                    for (var i = 0; i < $scope.prelegenciAll.length; i++) {
                        if ($scope.prelegenciAll[i].imageUrl == null) {
                            $scope.prelegenciAll[i].imageUrl = "https://brandsome.it/content/img/brak_zdjecia.png";
                        }
                    }
                    //$scope.prelegenciAll = $scope.prelegenciAll.slice(0, 20);
                    $scope.message = 1;
                    //console.log($scope.prelegenciAll);
                })
                .error(function(data, status, headers, config) {
                    $scope.message = status;
                });
        }
    };

    $scope.loadSpeakerDetails = function(speaker) {
        /*$http({method: 'GET', url: ngAuthSettings.apiServiceBaseUri + 'api/Lecturer/' + speakerId, // <--- do zmiany 
	      responseType:'json', headers: {
	            'Content-type': 'application/json'
	        }})
	      .success(function(data, status, headers, config){
	        $scope.SpeakerObject = data;
	        console.log($scope.SpeakerObject);
	        $scope.message = 1;
	      })
	      .error(function(data, status, headers, config){
	        $scope.message = status;
	    });*/

        if (!speaker.Biography) {
            speaker.Biography = "Opis zostanie dodany wkrótce";
        }

        /*	    if(!ps.Description){
                    ps.Description = "Opis zostanie dodany wkrótce";
                }*/

        $scope.SpeakerObject = {
            FirstName: speaker.FirstName,
            LastName: speaker.LastName,
            JobPosition: speaker.JobPosition,
            Organization: speaker.Organization,
            Biography: speaker.Biography,
            ImageUrl: speaker.ImageUrl
        };
        console.log($scope.SpeakerObject);

    };

    var _recommendEvent = function(data) {
        return $http.post(ngAuthSettings.apiServiceBaseUri + 'api/event/' + ngAuthSettings.eventCode + '/recommend', data).then(function(results) {
            return results;
        });
    };

    var _remaindMeLater = function(data) {
        return $http.post(ngAuthSettings.apiServiceBaseUri + 'api/event/' + ngAuthSettings.eventCode + '/reminder', data).then(function(results) {
            return results;
        });
    };

    $scope.recommendEvent = function() {
        $scope.recMessage = null;
        _recommendEvent($scope.recData).then(function(results) {
            $scope.recMessage = results.data;
            $scope.recData.emails = null;
            $scope.recData.phoneNumbers = null;
        }, function(error) {
            alert(error.data.message);
        });
    };

    $scope.remaindMeLater = function() {
        _remaindMeLater($scope.reminderData).then(function(results) {
            alert("Wysłano pomyślnie");
        }, function(error) {
            alert(error.data.message);
        });
    };

	var _sendModalEventData = function(data, typeId) {
        $scope.sendData = {
            eventCode: ngAuthSettings.eventCode,
            modalType: typeId,
            name: data.fullname,
            email: data.email,
            phoneNo: data.phoneNo,
            companyName: data.companyName
        };
        return $http.post(ngAuthSettings.apiServiceBaseUri + 'api/event/' + ngAuthSettings.eventCode + '/modal', $scope.sendData).then(function(results) {
            return results;
        });
    };

	// 0 - exh, 1 - vol, 2 - lect
    $scope.sendModalData = function(typeId) {
		$scope.modalMessage = '';
        _sendModalEventData($scope.modalData, typeId).then(function(results) {
            $scope.modalMessage = results.data;
            $scope.modalData = {};
        }, function(error) {
            alert(error.data.message);
        });
    };
	
	$scope.sendBecomeLecturer = function() {
		$scope.sendModalData(2);
	}

	$scope.sendBecomeVolounteer = function() {
		$scope.sendModalData(1);
	}

	$scope.sendBecomeExhibitor = function() {
		$scope.sendModalData(0);
	}

    var initData = function() {
        $scope.loadLectures();
        loadLecturers();
        loadExhibitors();
        loadPartners();
    };

    initData();

}]);

// dodane do obsługi dynamicznych href'ów generowanych przez Angulara

app.config([
    '$compileProvider',
    function($compileProvider) {
        $compileProvider.aHrefSanitizationWhitelist(/^\s*(https?|ftp|mailto|chrome-extension):/);
        // Angular before v1.2 uses $compileProvider.urlSanitizationWhitelist(...)
    }
]);