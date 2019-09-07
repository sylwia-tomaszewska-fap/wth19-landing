
var app = angular.module('RegistrationApp', ['ngRoute', 'LocalStorageModule', 'checklist-model', 'ngSanitize']);//, 'ui.bootstrap']);

app.config(function ($routeProvider) {

    var routeRedir = '';
    var langRedir = '/en';

    $routeProvider.when("/payment/:paymentCode", {
        controller: "paymentController",
        templateUrl: routeRedir + "/app/views" + langRedir + "/payment.html"
    });

    $routeProvider.when("/register", {
        controller: "registerController",
        templateUrl: routeRedir + "/app/views" + langRedir + "/register.html"
    });

    $routeProvider.when("/register/:eventCode", {
        controller: "registerController",
        templateUrl: routeRedir + "/app/views" + langRedir + "/register.html"
    });

    $routeProvider.when("/register-agenda/:eventCode", {
        controller: "registerAgendaController",
        templateUrl: routeRedir + "/app/views" + langRedir + "/register-agenda.html"
    });

    $routeProvider.when("/register-agenda/:eventCode/:selected", {
        controller: "registerAgendaController",
        templateUrl: routeRedir + "/app/views" + langRedir + "/register-agenda.html"
    });

    $routeProvider.when("/register-user-data/:eventCode", {
        controller: "registerUserDataController",
        templateUrl: routeRedir + "/app/views" + langRedir + "/register-user-data.html"
    });

    $routeProvider.when("/register-user-data/:eventCode/:selected", {
        controller: "registerUserDataController",
        templateUrl: routeRedir + "/app/views" + langRedir + "/register-user-data.html"
    });

    $routeProvider.when("/register-cv-main/:regId", {
        controller: "registerCvMainController",
        templateUrl: routeRedir + "/app/views" + langRedir + "/register-cv-main.html"
    });

    $routeProvider.when("/register-cv-upload/:regId", {
        controller: "registerCvUploadController",
        templateUrl: routeRedir + "/app/views" + langRedir + "/register-cv-upload.html"
    });

    $routeProvider.when("/register-cv-form/:regId", {
        controller: "registerCvFormController",
        templateUrl: routeRedir + "/app/views" + langRedir + "/register-cv-form.html"
    });

    $routeProvider.when("/register-inform/:regId", {
        controller: "registerInformController",
        templateUrl: routeRedir + "/app/views" + langRedir + "/register-inform.html"
    });

    $routeProvider.when("/register-meet/:regId", {
        controller: "registerMeetController",
        templateUrl: routeRedir + "/app/views" + langRedir + "/register-meet.html"
    });

    $routeProvider.when("/register-confirmation/:regId", {
        controller: "registerConfirmationController",
        templateUrl: routeRedir + "/app/views" + langRedir + "/register-confirmation.html"
    });

    $routeProvider.when("/register-activation/:regId", {
        controller: "registerActivationController",
        templateUrl: routeRedir + "/app/views" + langRedir + "/register-activation.html"
    });

    $routeProvider.when("/register-package/:eventCode", {
        controller: "registerPackageController",
        templateUrl: routeRedir + "/app/views" + langRedir + "/register-package.html"
    });

    $routeProvider.when("/register-package-multi/:eventCode", {
        controller: "registerPackageMultiController",
        templateUrl: routeRedir + "/app/views" + langRedir + "/register-package-multi.html"
    });

    $routeProvider.otherwise({ redirectTo: "/register" });
});

//var serviceBase = 'http://localhost:3682/';             // deweloperskie programisty
//var serviceBase = 'https://dev.brandsome.it/';          // deweloperskie zdalne
var serviceBase = 'https://brandsome.it/';              // produkcyjne !!!
app.constant('ngAuthSettings', {
    apiServiceBaseUri: serviceBase,
    clientId: 'DssApp',
    fbEventPage: 'https://www.facebook.com/dssconf',
    lang: 'en',
    testMode: false
});

app.config(function ($httpProvider) {
    $httpProvider.interceptors.push('authInterceptorService');
});

app.run(['authService', function (authService) {
    authService.fillAuthData();
}]);

