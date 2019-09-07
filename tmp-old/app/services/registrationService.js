'use strict';
app.factory('registrationService', ['$http', '$routeParams', 'ngAuthSettings', function ($http, $routeParams, ngAuthSettings) {

    var serviceBase = ngAuthSettings.apiServiceBaseUri;
    var lang = ngAuthSettings.lang;
    var registrationServiceFactory = {};

	// Event independent ====================================
    var _getSchools = function () {
        return $http.get(serviceBase + 'api/school').then(function (results) {
            return results;
        });
    };

    var _getDepartments = function (schoolId) {
        return $http.get(serviceBase + 'api/school/' + schoolId + '/departments').then(function (results) {
            return results;
        });
    };

	// Event based (not req auth) ====================================
    var _getEventSettings = function (eventCode) {
        return $http.get(serviceBase + 'api/event/' + eventCode + '/settings').then(function (results) {
            return results;
        });
    };

    var _checkEmail = function (eventCode, email) {
        return $http.get(serviceBase + 'api/event/' + eventCode + '/checkEmail?email=' + email).then(function (results) {
            return results;
        });
    };

	var _getLectueTags = function (eventCode) {
        return $http.get(serviceBase + 'api/event/' + eventCode + '/lectures/tags').then(function (results) {
            return results;
        });
    };

    var _getLectures = function (eventCode) {
        return $http.get(serviceBase + 'api/event/' + eventCode + '/lectures').then(function (results) {
            return results;
        });
    };

    var _getLecturesTreeWithFilter = function (eventCode, inEnglish, tags, couponCode) {
        if (inEnglish == "null")
            inEnglish = "";
        var apiPath = serviceBase + 'api/event/' + eventCode + '/lectures/tree?inEnglish=' + inEnglish + '&tags=' + tags;
        if (couponCode != null && couponCode != 'undefined')
            apiPath = apiPath + '&couponCode=' + couponCode;
        return $http.get(apiPath).then(function (results) {
            return results;
        });
    };
	
    var _getLecturesTree = function (eventCode, couponCode) {
        var apiPath = serviceBase + 'api/event/' + eventCode + '/lectures/tree';
        if (couponCode != null && couponCode != 'undefined')
            apiPath = apiPath + '?couponCode=' + couponCode;
        return $http.get(apiPath).then(function (results) {
            return results;
        });
    };

    var _getPartners = function (eventCode) {
        return $http.get(serviceBase + 'api/event/' + eventCode + '/partners').then(function (results) {
            return results;
        });
    };

    var _getEventCategories = function (eventCode) {
        return $http.get(serviceBase + 'api/event/' + eventCode + '/categories').then(function (results) {
            return results;
        });
    };

    var _getPackages = function (eventCode) {
        return $http.get(serviceBase + 'api/event/' + eventCode + '/eventPackages').then(function (results) {
            return results;
        });
    };

	// remove
    var _getIsVipCategoryRequired = function (eventCode, packageCode) {
        return $http.get(serviceBase + 'api/event/' + eventCode + '/packages/' + packageCode + '/isVipCategoryRequired').then(function (results) {
            return results;
        });
    };

	// remove
    var _getIsPackageHasVipPlaces = function (eventCode, packageCode) {
        return $http.get(serviceBase + 'api/event/' + eventCode + '/packages/' + packageCode + '/isPackageHasVipPlaces').then(function (results) {
            return results;
        });
    };

    var _getIsPackageAvailable = function (eventCode, packageCode) {
        return $http.get(serviceBase + 'api/event/' + eventCode + '/packages/' + packageCode + '/isPackageAvailable').then(function (results) {
            return results;
        });
    };

    var _getPackageInfo = function (eventCode, packageCode) {
        return $http.get(serviceBase + 'api/event/' + eventCode + '/packages/' + packageCode).then(function (results) {
            return results;
        });
    };

    var _getUserPackages = function (eventCode, couponCode) {
        var urlEP = serviceBase + 'api/event/' + eventCode + '/userPackages';
        if (couponCode != null)
            urlEP = urlEP + '/' + couponCode;
        return $http.get(urlEP).then(function (results) {
            return results;
        });
    };

	var _getUserPackagesOptional = function (eventCode) {
        var urlEP = serviceBase + 'api/event/' + eventCode + '/packagesOptional/user';
        return $http.get(urlEP).then(function (results) {
            return results;
        });
    };

    var _getIsCouponAvailable = function (eventCode, couponCode) {
        return $http.get(serviceBase + 'api/event/' + eventCode + '/coupons/' + couponCode + '/checkLimit').then(function (results) {
            return results;
        });
    };
	
	// User based (not req auth) ====================================
	// -- Account
    var _activateAccount = function (token) {
        return $http.post(serviceBase + 'api/account/confirmEmail?id=' + token + '&lang=' + lang).then(function (results) {
            return results;
        });
    };

	// -- CV agreement (file + form)
    var _getEventExhibitorsCVFromUser = function (id) {
        return $http.get(serviceBase + 'api/user/' + id + '/exhibitors/agreement').then(function (results) {
            return results;
        });
    };

    var _getEventExhibitorsCVFromUserDyn = function (id) {
        return $http.get(serviceBase + 'api/user/' + id + '/exhibitors/definition/agreement').then(function (results) {
            return results;
        });
    };

	// -- CV file
    var _uploadUserCV = function (id, uploadData) {
        return $http.post(serviceBase + 'api/user/' + id + '/userCV/file', uploadData).then(function (results) {
            return results;
        });
    };

    var _uploadCvInfo = function (id, uploadData) {
        return $http.post(serviceBase + 'api/user/' + id + '/userCV/file/info', uploadData).then(function (results) {
            return results;
        });
    };

	// -- CV form
    var _uploadCvForm = function (id, uploadData) {
        return $http.post(serviceBase + 'api/user/' + id + '/userCv/form', uploadData).then(function (results) {
            return results;
        });
    };

    var _uploadUserCVPicture = function (id, uploadData) {
        return $http.post(serviceBase + 'api/user/' + id + '/userCv/form/picture', uploadData).then(function (results) {
            return results;
        });
    };

	// -- agenda
	var _getReservations = function (id) {
        return $http.get(serviceBase + 'api/user/saveReservations/' + id).then(function (results) {
            return results;
        });
    };

    var _saveReservations = function (uploadData) {
        return $http.post(serviceBase + 'api/user/saveReservations', uploadData).then(function (results) {
            return results;
        });
    };

	// -- meetings
    var _getMeetingSlots = function (id, companyCode) {
        return $http.get(serviceBase + 'api/user/' + id + '/meetingSlots/' + companyCode).then(function (results) {
            return results;
        });
    };

    var _uploadMeetings = function (id, uploadData) {
        return $http.post(serviceBase + 'api/user/' + id + '/meetingSlots', uploadData).then(function (results) {
            return results;
        });
    };
	
	// -- regiatration info
    var _sendRecommendations = function (id, data) {
        return $http.post(serviceBase + 'api/user/' + id + '/recommendation', data).then(function (results) {
            return results;
        });
    };

	// -- User info
    var _getUserConfInfo = function (id) {
        return $http.get(serviceBase + 'api/user/' + id + '/confInfo').then(function (results) {
            return results;
        });
    };

    var _getUserPaymentInfo = function (id) {
        return $http.get(serviceBase + 'api/user/payment/' + id).then(function (results) {
            return results;
        });
    };

    var _getEventSettingsFromUser = function (id) {
        return $http.get(serviceBase + 'api/user/' + id + '/eventSettings').then(function (results) {
            return results;
        });
    };

    var _sendInvitation = function (id) {
        return $http.post(serviceBase + 'api/user/' + id + '/sendInvitation').then(function (results) {
            return results;
        });
    };

    var _getUserPackageInfo = function (eventCode, selectedId) {
        return $http.get(serviceBase + 'api/event/' + eventCode + '/userPackageInfo/' + selectedId).then(function (results) {
            return results;
        });
    };

    var _getInvoiceUrl = function (invoiceId) {
        //return $http.get(serviceBase + 'api/user/' + userId + '/invoice');.then(function (results) {
        //    return results;
        //});
        return serviceBase + 'api/user/invoice/' + invoiceId;
    };

    var _getInvitationUrl = function (userId) {
        return serviceBase + 'api/user/' + userId + '/invitation';
    };

    var _getPaymentUrl = function (token) {
        return $http.get(serviceBase + 'api/user/getPaymentUrl/' + token).then(function (results) {
            return results;
        });
    };

    var _getPaymentUrlConf = function (userId) {
        return $http.get(serviceBase + 'api/user/getPaymentUrlConf/' + userId).then(function (results) {
            return results;
        });
    };

    var _getCalendarUrl = function (userId) {
        return serviceBase + 'api/user/' + userId + '/calendar';
    };

	// Event based (req auth)
    var _getUserResources = function (eventCode) {
        return $http.get(serviceBase + 'api/event/' + eventCode + '/userResources').then(function (results) {
            return results;
        });
    };

    var _getUserLectures = function (eventCode) {
        return $http.get(serviceBase + 'api/event/' + eventCode + '/userLectures').then(function (results) {
            return results;
        });
    };

    var _getUserLecturesTree = function (eventCode) {
        return $http.get(serviceBase + 'api/event/' + eventCode + '/userLecturesTree').then(function (results) {
            return results;
        });
    };

    var _getUserLecturesTreeWithFilter = function (eventCode, inEnglish, tags) {
        if (inEnglish == "null")
            inEnglish = "";
        return $http.get(serviceBase + 'api/event/' + eventCode + '/userLecturesTree?inEnglish=' + inEnglish + '&tags=' + tags).then(function (results) {
            return results;
        });
    };

	// User based (req auth)
    var _getUserData = function () {
        return $http.get(serviceBase + 'api/user/userData').then(function (results) {
            return results;
        });
    };

    var _updateUserData = function (uploadData) {
        return $http.post(serviceBase + 'api/user/userData', uploadData).then(function (results) {
            return results;
        });
    };

    var _changeUserEmail = function (uploadData) {
        return $http.post(serviceBase + 'api/user/changeEmail', uploadData).then(function (results) {
            return results;
        });
    };

    var _saveReservation = function (id, choice) {
        return $http.post(serviceBase + 'api/user/lecture/' + id + '/' + choice).then(function (results) {
            return results;
        });
    };

    var _getUserSummary = function () {
        return $http.get(serviceBase + 'api/user/summary').then(function (results) {
            return results;
        });
    };

    var _getCvForm = function () {
        return $http.get(serviceBase + 'api/user/userCvForm').then(function (results) {
            return results;
        });
    };

    var _convertToVIP = function (uploadData) {
        return $http.post(serviceBase + 'api/user/convertToVIP', uploadData).then(function (results) {
            return results;
        });
    };

    var _getUserInvoices = function () {
        return $http.get(serviceBase + 'api/user/invoices').then(function (results) {
            return results;
        });
    };

	var _getUserPackagesOptionalChoosed = function () {
        return $http.get(serviceBase + 'api/user/packagesOptional').then(function (results) {
            return results;
        });
    };
	
	var _removeUserCVFile  = function (id) {
        return $http.post(serviceBase + 'api/user/' + id + '/userCV/delete').then(function (results) {
            return results;
        });
    };

    var _removeAccount = function () {
        return $http.post(serviceBase + 'api/user/removeAccount').then(function (results) {
            return results;
        });
    };

    var _saveUserReservations = function (uploadData) {
        return $http.post(serviceBase + 'api/user/saveUserReservations', uploadData).then(function (results) {
            return results;
        });
    };
	
    var _getEventExhibitorsCVFromUserDynLogged = function () {
        return $http.get(serviceBase + 'api/user/exhibitors/definition/agreement').then(function (results) {
            return results;
        });
    };

    var _getEventExhibitorsCVFromUserLogged = function () {
        return $http.get(serviceBase + 'api/user/exhibitors/agreement').then(function (results) {
            return results;
        });
    };
	
	// ==============================
    registrationServiceFactory.getSchools = _getSchools;
    registrationServiceFactory.getDepartments = _getDepartments;
    registrationServiceFactory.checkEmail = _checkEmail;
    registrationServiceFactory.uploadUserCV = _uploadUserCV;
    registrationServiceFactory.sendRecommendations = _sendRecommendations;
    registrationServiceFactory.getUserConfInfo = _getUserConfInfo;
    registrationServiceFactory.uploadCvForm = _uploadCvForm;
    registrationServiceFactory.uploadUserCVPicture = _uploadUserCVPicture;
    registrationServiceFactory.activateAccount = _activateAccount;
    registrationServiceFactory.getEventSettings = _getEventSettings;
    registrationServiceFactory.getEventSettingsFromUser = _getEventSettingsFromUser;
    registrationServiceFactory.getLectures = _getLectures;
    registrationServiceFactory.getLecturesTree = _getLecturesTree;
    registrationServiceFactory.saveReservations = _saveReservations;
    registrationServiceFactory.getUserSummary = _getUserSummary;
    registrationServiceFactory.getCvForm = _getCvForm;
    registrationServiceFactory.getMeetingSlots = _getMeetingSlots;
    registrationServiceFactory.uploadMeetings = _uploadMeetings;
    registrationServiceFactory.sendInvitation = _sendInvitation;
    registrationServiceFactory.uploadCvInfo = _uploadCvInfo;
    registrationServiceFactory.getUserData = _getUserData;
    registrationServiceFactory.updateUserData = _updateUserData;
    registrationServiceFactory.getUserLectures = _getUserLectures;
    registrationServiceFactory.getUserLecturesTree = _getUserLecturesTree;
    registrationServiceFactory.getUserResources = _getUserResources;
    registrationServiceFactory.saveReservation = _saveReservation;
    registrationServiceFactory.getPartners = _getPartners;
    registrationServiceFactory.getPackages = _getPackages;
    registrationServiceFactory.getLectueTags = _getLectueTags;
    registrationServiceFactory.getLecturesTreeWithFilter = _getLecturesTreeWithFilter;
    registrationServiceFactory.getUserLecturesTreeWithFilter = _getUserLecturesTreeWithFilter;
    registrationServiceFactory.getEventCategories = _getEventCategories;
    registrationServiceFactory.getIsVipCategoryRequired = _getIsVipCategoryRequired;
    registrationServiceFactory.convertToVIP = _convertToVIP;
    registrationServiceFactory.getIsPackageAvailable = _getIsPackageAvailable;
    registrationServiceFactory.getIsCouponAvailable = _getIsCouponAvailable;
    registrationServiceFactory.getInvoiceUrl = _getInvoiceUrl;
    registrationServiceFactory.getInvitationUrl = _getInvitationUrl;
    registrationServiceFactory.removeAccount = _removeAccount;
    registrationServiceFactory.saveUserReservations = _saveUserReservations;
    registrationServiceFactory.getPackageInfo = _getPackageInfo;
    registrationServiceFactory.getPaymentUrl = _getPaymentUrl;
    registrationServiceFactory.getPaymentUrlConf = _getPaymentUrlConf;
    registrationServiceFactory.getUserPackages = _getUserPackages;
	registrationServiceFactory.getUserPackagesOptional = _getUserPackagesOptional;
    registrationServiceFactory.getIsPackageHasVipPlaces = _getIsPackageHasVipPlaces;
    registrationServiceFactory.getEventExhibitorsCVFromUser = _getEventExhibitorsCVFromUser;
    registrationServiceFactory.getEventExhibitorsCVFromUserLogged = _getEventExhibitorsCVFromUserLogged;
    registrationServiceFactory.getEventExhibitorsCVFromUserDyn = _getEventExhibitorsCVFromUserDyn;
    registrationServiceFactory.getEventExhibitorsCVFromUserDynLogged = _getEventExhibitorsCVFromUserDynLogged;
    registrationServiceFactory.getCalendarUrl = _getCalendarUrl;
    registrationServiceFactory.getUserInvoices = _getUserInvoices;
	registrationServiceFactory.getReservations = _getReservations;
	registrationServiceFactory.getUserPackagesOptionalChoosed = _getUserPackagesOptionalChoosed;
	registrationServiceFactory.getUserPackageInfo = _getUserPackageInfo;
    registrationServiceFactory.removeUserCVFile = _removeUserCVFile;
    registrationServiceFactory.getUserPaymentInfo = _getUserPaymentInfo;
    registrationServiceFactory.changeUserEmail = _changeUserEmail;

    return registrationServiceFactory;
}]);