var app = angular.module('mpApp', ['ngSanitize']);

//var serviceBase = 'http://localhost:3682/';             // deweloperskie programisty
//var serviceBase = 'https://dev.brandsome.it/';          // deweloperskie zdalne
var serviceBase = 'https://brandsome.it/'; // produkcyjne !!!

app.constant('ngAuthSettings', {
    apiServiceBaseUri: serviceBase,
    clientId: 'DssApp',
    eventCode: 'DSS19',
    lang: 'en'
});
