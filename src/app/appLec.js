
var app = angular.module('RegistrationApp', ['ngRoute', 'LocalStorageModule', 'checklist-model', 'ngSanitize']);//, 'ui.bootstrap']);

app.config(function ($routeProvider) {

    var routeRedir = '';

    $routeProvider.when("/user-lecture", {
        controller: "userLectureController",
        templateUrl: routeRedir + "/app/views/user-lecture.html"
    });

    $routeProvider.otherwise({ redirectTo: "/user-lecture" });
});

//var serviceBase = 'http://localhost:3682/';             // deweloperskie programisty
//var serviceBase = 'https://dev.brandsome.it/';          // deweloperskie zdalne
var serviceBase = 'https://brandsome.it/';              // produkcyjne !!!
app.constant('ngAuthSettings', {
    apiServiceBaseUri: serviceBase,
    clientId: 'DssApp',
    eventCode: 'DSS19',
    fbEventPage: 'https://www.facebook.com/dssconf',
    lang: 'pl',
    testMode: false
});

app.config(function ($httpProvider) {
    $httpProvider.interceptors.push('authInterceptorService');
});

app.run(['authService', function (authService) {
    authService.fillAuthData();
}]);

