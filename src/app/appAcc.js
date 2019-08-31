
var app = angular.module('WdiApp', ['ngRoute', 'LocalStorageModule', 'checklist-model', 'ngSanitize']);//, 'ui.bootstrap']);

app.config(function ($routeProvider) {

    var routeRedir = '';

    $routeProvider.when("/login", {
        controller: "userLoginController",
        templateUrl: routeRedir + "/app/views/user-login.html"
    });

    $routeProvider.when("/user-account", {
        controller: "userAccountController",
        templateUrl: routeRedir + "/app/views/user-account.html"
    });

    $routeProvider.when("/user-lecture", {
        controller: "userLectureController",
        templateUrl: routeRedir + "/app/views/user-lecture.html"
    });

    $routeProvider.when("/user-resource", {
        controller: "userResourceController",
        templateUrl: routeRedir + "/app/views/user-resource.html"
    });

    $routeProvider.when("/user-data", {
        controller: "userDataController",
        templateUrl: routeRedir + "/app/views/user-data.html"
    });

    $routeProvider.when("/user-cv-form", {
        controller: "userCvFormController",
        templateUrl: routeRedir + "/app/views/user-cv-form.html"
    });

    $routeProvider.when("/user-meet", {
        controller: "userMeetController",
        templateUrl: routeRedir + "/app/views/user-meet.html"
    });

    $routeProvider.when("/user-pwd-change", {
        controller: "userPwdChangeController",
        templateUrl: routeRedir + "/app/views/user-pwd-change.html"
    });

    $routeProvider.when("/user-pwd-reset2/:token", {
        controller: "userPwdReset2Controller",
        templateUrl: routeRedir + "/app/views/user-pwd-reset2.html"
    });

    $routeProvider.when("/user-pwd-reset", {
        controller: "userPwdResetController",
        templateUrl: routeRedir + "/app/views/user-pwd-reset.html"
    });

    $routeProvider.when("/user-package", {
        controller: "userPackageController",
        templateUrl: routeRedir + "/app/views/user-package.html"
    });

    $routeProvider.otherwise({ redirectTo: "/login" });
});

//var serviceBase = 'http://localhost:3682/';             // deweloperskie programisty
//var serviceBase = 'https://webapi.cloud.wat.edu.pl/';   // deweloperskie lokalne
//var serviceBase = 'https://dev.brandsome.it/';          // deweloperskie zdalne
var serviceBase = 'https://brandsome.it/';              // produkcyjne !!!
app.constant('ngAuthSettings', {
    apiServiceBaseUri: serviceBase,
    clientId: 'WthApp',
    eventCode: 'WTH18',
    lang: 'pl'
});

app.config(function ($httpProvider) {
    $httpProvider.interceptors.push('authInterceptorService');
});

app.run(['authService', function (authService) {
    authService.fillAuthData();
}]);

