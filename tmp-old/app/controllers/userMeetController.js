'use strict';
app.controller('userMeetController', ['$scope', '$routeParams', '$location', '$window', 'registrationService', 'ngAuthSettings', //'$modal',
    function ($scope, $routeParams, $location, $window, registrationService, ngAuthSettings) { //, $modal) {

        $scope.eventCode = ngAuthSettings.eventCode;
        $scope.userId = null;
        $scope.userSummary = {
        };

        $scope.meetings1_1 = [];
        $scope.meetings1_2 = [];
        $scope.meetings2_1 = [];
        $scope.meetings2_2 = [];
        $scope.meetings3_1 = [];
        $scope.meetings3_2 = [];
        $scope.meetings4_1 = [];
        $scope.meetings4_2 = [];
        $scope.selected1_1 = null;
        $scope.selected1_2 = null;
        $scope.selected2_1 = null;
        $scope.selected2_2 = null;
        $scope.selected3_1 = null;
        $scope.selected3_2 = null;
        $scope.selected4_1 = null;
        $scope.selected4_2 = null;

        registrationService.getUserSummary().then(function (results) {
            $scope.userSummary = results.data;
            $scope.userId = $scope.userSummary.objectId;

            registrationService.getMeetingSlots($scope.userId, 'Asseco').then(function (results) {
                $scope.meetings1_1 = results.data.meetings.day1;
                $scope.meetings1_2 = results.data.meetings.day2;
                if (results.data.chosen != null) {
                    if (results.data.chosen.day1 != null) {
                        var arrayLength = $scope.meetings1_1.length;
                        for (var i = 0; i < arrayLength; i++) {
                            if ($scope.meetings1_1[i].objectId == results.data.chosen.day1.objectId) {
                                $scope.selected1_1 = $scope.meetings1_1[i];
                                break;
                            };
                        }
                    };
                    if (results.data.chosen.day2 != null) {
                        var arrayLength = $scope.meetings1_2.length;
                        for (var i = 0; i < arrayLength; i++) {
                            if ($scope.meetings1_2[i].objectId == results.data.chosen.day2.objectId) {
                                $scope.selected1_2 = $scope.meetings1_2[i];
                                break;
                            };
                        }
                    };
                };
            }, function (error) {
                alert(error.data.message);
            });

            registrationService.getMeetingSlots($scope.userId, 'Accenture').then(function (results) {
                $scope.meetings2_1 = results.data.meetings.day1;
                $scope.meetings2_2 = results.data.meetings.day2;
                if (results.data.chosen != null) {
                    if (results.data.chosen.day1 != null) {
                        var arrayLength = $scope.meetings2_1.length;
                        for (var i = 0; i < arrayLength; i++) {
                            if ($scope.meetings2_1[i].objectId == results.data.chosen.day1.objectId) {
                                $scope.selected2_1 = $scope.meetings2_1[i];
                                break;
                            };
                        }
                    };
                    if (results.data.chosen.day2 != null) {
                        var arrayLength = $scope.meetings2_2.length;
                        for (var i = 0; i < arrayLength; i++) {
                            if ($scope.meetings2_2[i].objectId == results.data.chosen.day2.objectId) {
                                $scope.selected2_2 = $scope.meetings2_2[i];
                                break;
                            };
                        }
                    };
                };
            }, function (error) {
                alert(error.data.message);
            });

            registrationService.getMeetingSlots($scope.userId, 'Pracuj').then(function (results) {
                $scope.meetings3_1 = results.data.meetings.day1;
                $scope.meetings3_2 = results.data.meetings.day2;
                if (results.data.chosen != null) {
                    if (results.data.chosen.day1 != null) {
                        var arrayLength = $scope.meetings3_1.length;
                        for (var i = 0; i < arrayLength; i++) {
                            if ($scope.meetings3_1[i].objectId == results.data.chosen.day1.objectId) {
                                $scope.selected3_1 = $scope.meetings3_1[i];
                                break;
                            };
                        }
                    };
                    if (results.data.chosen.day2 != null) {
                        var arrayLength = $scope.meetings3_2.length;
                        for (var i = 0; i < arrayLength; i++) {
                            if ($scope.meetings3_2[i].objectId == results.data.chosen.day2.objectId) {
                                $scope.selected3_2 = $scope.meetings3_2[i];
                                break;
                            };
                        }
                    };
                };
            }, function (error) {
                alert(error.data.message);
            });

            registrationService.getMeetingSlots($scope.userId, 'GoldmanSachs').then(function (results) {
                $scope.meetings4_1 = results.data.meetings.day1;
                $scope.meetings4_2 = results.data.meetings.day2;
                if (results.data.chosen != null) {
                    if (results.data.chosen.day1 != null) {
                        var arrayLength = $scope.meetings4_1.length;
                        for (var i = 0; i < arrayLength; i++) {
                            if ($scope.meetings4_1[i].objectId == results.data.chosen.day1.objectId) {
                                $scope.selected4_1 = $scope.meetings4_1[i];
                                break;
                            };
                        }
                    };
                    if (results.data.chosen.day2 != null) {
                        var arrayLength = $scope.meetings4_2.length;
                        for (var i = 0; i < arrayLength; i++) {
                            if ($scope.meetings4_2[i].objectId == results.data.chosen.day2.objectId) {
                                $scope.selected4_2 = $scope.meetings4_2[i];
                                break;
                            };
                        }
                    };
                };
            }, function (error) {
                alert(error.data.message);
            });
        }, function (error) {
            alert(error.data.message);
        });

        var saveReservationMain = function (companyCode, selected1, selected2) {
            var uploadData = {
                selected: [],
                companyCode: companyCode
            };
            $scope.loading = true;
            if (selected1 != null) {
                uploadData.selected.push(selected1.objectId);
            };
            if (selected2 != null) {
                uploadData.selected.push(selected2.objectId);
            };
            registrationService.uploadMeetings($scope.userId, uploadData).then(function (results) {
                //var modalInstance = $modal.open({
                //    templateUrl: 'app/views/success-alert-template.html',
                //    controller: 'alertModalController',
                //    controllerAs: 'alert'
                //});
                if (ngAuthSettings.lang == "pl") {
                    alert('Zapisano zgłoszenie');
                } else {
                    alert('Meeting has been saved');
                }
                $scope.loading = false;
            }, function (error) {
                alert(error.data.message);
                $scope.loading = false;
            });
        };

        $scope.saveReservation1 = function () {
            saveReservationMain('Asseco', $scope.selected1_1, $scope.selected1_2);
        };

        $scope.saveReservation2 = function () {
            saveReservationMain('Accenture', $scope.selected2_1, $scope.selected2_2);
        };

        $scope.saveReservation3 = function () {
            saveReservationMain('Pracuj', $scope.selected3_1, $scope.selected3_2);
        };

        $scope.saveReservation4 = function () {
            saveReservationMain('GoldmanSachs', $scope.selected4_1, $scope.selected4_2);
        };

        $scope.redirectToConfirm = function () {
            $location.path('/user-account/');
        };
    }]);