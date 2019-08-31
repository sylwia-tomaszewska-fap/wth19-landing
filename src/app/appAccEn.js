
var app = angular.module('WdiApp', ['ngRoute', 'LocalStorageModule', 'checklist-model', 'ngSanitize']);//, 'ui.bootstrap']);

app.config(function ($routeProvider) {

    var routeRedir = '';
    var langRedir = '/en';

    $routeProvider.when("/login", {
        controller: "userLoginController",
        templateUrl: routeRedir + "/app/views" + langRedir + "/user-login.html"
    });

    $routeProvider.when("/user-account", {
        controller: "userAccountController",
        templateUrl: routeRedir + "/app/views" + langRedir + "/user-account.html"
    });

    $routeProvider.when("/user-lecture", {
        controller: "userLectureController",
        templateUrl: routeRedir + "/app/views" + langRedir + "/user-lecture.html"
    });

    $routeProvider.when("/user-resource", {
        controller: "userResourceController",
        templateUrl: routeRedir + "/app/views" + langRedir + "/user-resource.html"
    });

    $routeProvider.when("/user-data", {
        controller: "userDataController",
        templateUrl: routeRedir + "/app/views" + langRedir + "/user-data.html"
    });

    $routeProvider.when("/user-cv-form", {
        controller: "userCvFormController",
        templateUrl: routeRedir + "/app/views" + langRedir + "/user-cv-form.html"
    });

    $routeProvider.when("/user-meet", {
        controller: "userMeetController",
        templateUrl: routeRedir + "/app/views" + langRedir + "/user-meet.html"
    });

    $routeProvider.when("/user-pwd-change", {
        controller: "userPwdChangeController",
        templateUrl: routeRedir + "/app/views" + langRedir + "/user-pwd-change.html"
    });

    $routeProvider.when("/user-pwd-reset2/:token", {
        controller: "userPwdReset2Controller",
        templateUrl: routeRedir + "/app/views" + langRedir + "/user-pwd-reset2.html"
    });

    $routeProvider.when("/user-pwd-reset", {
        controller: "userPwdResetController",
        templateUrl: routeRedir + "/app/views" + langRedir + "/user-pwd-reset.html"
    });

    $routeProvider.when("/user-package", {
        controller: "userPackageController",
        templateUrl: routeRedir + "/app/views" + langRedir + "/user-package.html"
    });

    $routeProvider.otherwise({ redirectTo: "/login" });
});

//var serviceBase = 'http://localhost:3682/';             // deweloperskie programisty
//var serviceBase = 'https://dev.brandsome.it/';          // deweloperskie zdalne
var serviceBase = 'https://brandsome.it/';              // produkcyjne !!!
app.constant('ngAuthSettings', {
    apiServiceBaseUri: serviceBase,
    clientId: 'DssApp',
    eventCode: 'DSS19',
    lang: 'en'
});

app.config(function ($httpProvider) {
    $httpProvider.interceptors.push('authInterceptorService');
});

app.run(['authService', function (authService) {
    authService.fillAuthData();
}]);

