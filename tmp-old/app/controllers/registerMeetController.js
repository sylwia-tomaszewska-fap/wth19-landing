'use strict';
app.controller('registerMeetController', ['$scope', '$routeParams', '$location', '$window', 'registrationService', 'ngAuthSettings', //'$modal',
    function ($scope, $routeParams, $location, $window, registrationService, ngAuthSettings) { //, $modal) {

        $scope.regId = $routeParams.regId;
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

        registrationService.getMeetingSlots($routeParams.regId, 'Asseco').then(function (results) {
            $scope.meetings1_1 = results.data.meetings.day1;
            $scope.meetings1_2 = results.data.meetings.day2;
        }, function (error) {
            alert(error.data.message);
        });

        registrationService.getMeetingSlots($routeParams.regId, 'Accenture').then(function (results) {
            $scope.meetings2_1 = results.data.meetings.day1;
            $scope.meetings2_2 = results.data.meetings.day2;
        }, function (error) {
            alert(error.data.message);
        });

        registrationService.getMeetingSlots($routeParams.regId, 'Pracuj').then(function (results) {
            $scope.meetings3_1 = results.data.meetings.day1;
            $scope.meetings3_2 = results.data.meetings.day2;
        }, function (error) {
            alert(error.data.message);
        });

        registrationService.getMeetingSlots($routeParams.regId, 'GoldmanSachs').then(function (results) {
            $scope.meetings4_1 = results.data.meetings.day1;
            $scope.meetings4_2 = results.data.meetings.day2;
        }, function (error) {
            alert(error.data.message);
        });

        var saveReservationMain = function (companyCode, selected1, selected2) {
            var uploadData = {
                selected: [],
                companyCode: companyCode
            };
            //if (selected1 == null && selected2 == null) {
                //var modalInstance = $modal.open({
                //    templateUrl: 'app/views/error-alert-template.html',
                //    controller: 'alertModalController',
                //    controllerAs: 'alert'
                //});
                //alert('Wybierz przynajmniej jedną godzinę spotkania');
                //return;
            //};
            $scope.loading = true;
            if (selected1 != null) {
                uploadData.selected.push(selected1.objectId);
            };
            if (selected2 != null) {
                uploadData.selected.push(selected2.objectId);
            };
            registrationService.uploadMeetings($routeParams.regId, uploadData).then(function (results) {
                //var modalInstance = $modal.open({
                //    templateUrl: 'app/views/success-alert-template.html',
                //    controller: 'alertModalController',
                //    controllerAs: 'alert'
                //});
                alert('Zapisano zgłoszenie');
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
            $location.path('/register-confirmation/' + $scope.regId);
        };
    }]);