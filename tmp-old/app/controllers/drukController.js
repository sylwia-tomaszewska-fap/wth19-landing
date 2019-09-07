var mpApp = angular.module('mpApp', ['ngSanitize']);

mpApp.service('apiSwitch', function () {

    var tst = 'https://dev.brandsome.it/api/';
    var prd = 'https://brandsome.it/api/';
    var wat = 'https://webapi.cloud.wat.edu.pl/api/';

    this.apiPath = function () {
        return prd; // <<<---------- TUTAJ ZMIENIĆ NA PRD PRZY WCHODZENIU NA PRODUKCJĘ
    };

    this.eventCode = function () {
        return 'DSS17';
    };
});

mpApp.controller('drukController', ['$scope', '$http', '$window', 'apiSwitch', function ($scope, $http, $window, apiSwitch) {

    $scope.activeExhibitor = {};
    $scope.recruitmentOfferInternship = '';
    $scope.recruitmentOfferNonFTE = '';
    $scope.recruitmentOfferFTE = '';
    $scope.recruitmentOfferRemote = '';
    $scope.changeActiveExhibitor = changeActiveExhibitor;
	$scope.activePrelegent = {};
	$scope.changePrelegent = changePrelegent;

    $scope.redirectToHome = function () {
        $window.location.href = '/user.html';
    };

    $scope.redirectToRemindMeLater = function () {
        $window.location.href = '/user.html';
    };

    $scope.redirectToRecommend = function () {
        $window.location.href = '/user.html';
    };

	function changePrelegent(index) {
		$scope.activePrelegent = index;
	}

    function changeActiveExhibitor(wystawca) {
        var exhId = wystawca.objectId;
        $scope.loadExhibitorDetails(exhId);
    }

    var loadPartners = function () {
        $http({
            method: 'GET', url: apiSwitch.apiPath() + 'event/' + apiSwitch.eventCode() + '/Partners',
            responseType: 'json', headers: {
                'Content-type': 'application/json'
            }
        })
		.success(function (data, status, headers, config) {
		    $scope.partnerzy = data;
		    $scope.message = 1;
		})
		.error(function (data, status, headers, config) {
		    $scope.message = status;
		});
    };

    var loadExhibitors = function () {
        $http({
            method: 'GET', url: apiSwitch.apiPath() + 'event/' + apiSwitch.eventCode() + '/Exhibitors/-1',
            responseType: 'json', headers: {
                'Content-type': 'application/json'
            }
        })
		.success(function (data, status, headers, config) {
		    $scope.wystawcy = data;
		    //$scope.wystawcyPremium = [];
		    //for(var i=0; i < 4; i++){
		    //	$scope.wystawcyPremium.push($scope.wystawcy.shift());
		    //}			
		    $scope.message = 1;
		    //console.log($scope.wystawcyPremium);
		})
		.error(function (data, status, headers, config) {
		    $scope.message = status;
		});
    };

    var loadLectures = function () {
        $http({
            method: 'GET', url: apiSwitch.apiPath() + 'event/' + apiSwitch.eventCode() + '/Lectures',
            responseType: 'json', headers: {
                'Content-type': 'application/json'
            }
        })
		.success(function (data, status, headers, config) {
		    $scope.prelekcje = data;
		    transformLectures();
		    $scope.message = 1;
		})
		.error(function (data, status, headers, config) {
		    $scope.message = status;
		});
    };

    var loadLecturers = function () {

        $scope.prelegenci = [];

        $http({
            method: 'GET', url: apiSwitch.apiPath() + 'event/' + apiSwitch.eventCode() + '/LecturersN?count=-1',
            responseType: 'json', headers: {
                'Content-type': 'application/json'
            }
        })
		.success(function (data, status, headers, config) {
		    $scope.prelegencitmp = data;
		    for (var i = 0; i < $scope.prelegencitmp.length; i++) {
		        if ($scope.prelegencitmp[i].LastName !== "Wkrótce") {
		            $scope.prelegenci.push($scope.prelegencitmp[i]);
		        }
		    }
		    $scope.prelegenci = $scope.prelegenci.slice(0, 20);
		    $scope.message = 1;
		    //console.log($scope.prelegenci);
		})
		.error(function (data, status, headers, config) {
		    $scope.message = status;
		});
    };

    $scope.loadExhibitorDetails = function (exhId) {

        $http({
            method: 'GET', url: apiSwitch.apiPath() + 'exhibitor/' + exhId, // <--- do zmiany 
            responseType: 'json', headers: {
                'Content-type': 'application/json'
            }
        })
  		.success(function (data, status, headers, config) {
  		    $scope.szczegolyWystawcy = data;
            $scope.activeExhibitor = $scope.szczegolyWystawcy;

            //checkbox
            if ($scope.activeExhibitor.recruitmentOfferInternship) {
                $scope.recruitmentOfferInternship = 'checked';
            }

            if ($scope.activeExhibitor.recruitmentOfferNonFTE) {
                $scope.recruitmentOfferNonFTE = 'checked';
            }

            if ($scope.activeExhibitor.recruitmentOfferFTE) {
                $scope.recruitmentOfferFTE = 'checked';
            }

            if($scope.activeExhibitor.recruitmentOfferRemote) {
                $scope.recruitmentOfferRemote = 'checked';
            }
            
  		    console.log($scope.szczegolyWystawcy);
  		    $scope.ExhibitorObject = {
  		        name: $scope.szczegolyWystawcy.fullName,
  		        website: $scope.szczegolyWystawcy.webSite,
  		        address: $scope.szczegolyWystawcy.address,
  		        workingCities: $scope.szczegolyWystawcy.workingCities,
  		        noOfEmployeesPL: $scope.szczegolyWystawcy.noOfEmployeesPL,
  		        noOfEmployeesWorld: $scope.szczegolyWystawcy.noOfEmployeesWorld,
  		        recruitmentWebSite: $scope.szczegolyWystawcy.recruitmentWebSite,
  		        mainAreas: $scope.szczegolyWystawcy.mainAreas,
  		        shortDescription: $scope.szczegolyWystawcy.shortDescription,
  		        recruitmentWhyUs: $scope.szczegolyWystawcy.recruitmentWhyUs,
  		        recruitmentOfferInternship: $scope.szczegolyWystawcy.recruitmentOfferInternship,
  		        recruitmentOfferNonFTE: $scope.szczegolyWystawcy.recruitmentOfferNonFTE,
  		        recruitmentOfferFTE: $scope.szczegolyWystawcy.recruitmentOfferFTE,
  		        recruitmentOfferRemote: $scope.szczegolyWystawcy.recruitmentOfferRemote,
  		        recruitmentSpecialty: $scope.szczegolyWystawcy.recruitmentSpecialty,
  		        comments: $scope.szczegolyWystawcy.comments,
  		        logoUrl: $scope.szczegolyWystawcy.logoUrl,
  		    };
  		    $scope.message = 1;
  		})
  		.error(function (data, status, headers, config) {
  		    $scope.message = status;
  		});

    };

    $scope.loadSpeakerDetails = function (speaker) {

        /*$http({method: 'GET', url: apiSwitch.apiPath()+'Lecturer/'+speakerId, // <--- do zmiany 
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

    var initData = function () {
        loadLectures();
        loadLecturers();
        loadExhibitors();
        loadPartners();
    };

    var transformLectures = function () {

        $scope.prelekcjeDay1 = [];
        $scope.prelekcjeDay2 = [];
        var tmpdt = "";

        // rozbicie prelekcji z dnia 1 oraz 2

        for (var i = 0; i < $scope.prelekcje.length; i++) {
            tmpdt = $scope.prelekcje[i].calendarDay;
			if ($scope.prelekcje[i].categoryName.indexOf("Standy") == 0) {
				continue;
			}
            if (tmpdt === "Dzień I - 26 maja 2017") {
                $scope.prelekcjeDay1.push($scope.prelekcje[i]);
            } //else if (tmpdt === "Dzień II - 29 marca 2017") {
                // $scope.prelekcjeDay2.push($scope.prelekcje[i]);
            // }
        };

        // posortowanie prelekcji chronologicznie 

        $scope.prelekcjeDay1.sort(function (a, b) {
            return new Date(a.startDate) - new Date(b.startDate);
        });

        $scope.prelekcjeDay2.sort(function (a, b) {
            return new Date(a.startDate) - new Date(b.startDate);
        });

        //console.log($scope.prelekcjeDay1);

        // wyłuskanie ścieżek

        var flags1 = [];
        var sciezkiD1 = [];

        for (var i = 0; i < $scope.prelekcjeDay1.length; i++) {
            if (flags1[$scope.prelekcjeDay1[i].categoryName]) continue;
            flags1[$scope.prelekcjeDay1[i].categoryName] = true;
            sciezkiD1.push($scope.prelekcjeDay1[i].categoryName);

        };

        var flags2 = [];
        var sciezkiD2 = [];

        for (var i = 0; i < $scope.prelekcjeDay2.length; i++) {
            if (flags2[$scope.prelekcjeDay2[i].categoryName]) continue;
            flags2[$scope.prelekcjeDay2[i].categoryName] = true;
            sciezkiD2.push($scope.prelekcjeDay2[i].categoryName);
        };

        // rozbicie prelekcji z dnia 1 wg. ścieżek (utworzenie obiektu $scope.Day1PrelekcjeByŚcieżka = { [ścieżka1, [prelekcje]], [ścieżka2, [prelekcje]], ... }  )

        $scope.prelekcjeDay1Final = [];
        $scope.prelekcjeDay2Final = [];
        var tmpPrelekcjaObj = { sciezka: "", prelekcjeSciezki: [] };
        var tmpPrelekcje = [];
        var sc = "";

        function transformArr(orig) {
            var newArr = [],
        	types = {},
        	newItem, i, j, cur;
            for (i = 0, j = orig.length; i < j; i++) {
                cur = orig[i];
                if (!(cur.categoryName in types)) {
                    types[cur.categoryName] = { categoryName: cur.categoryName, prelekcjeSciezki: [] };
                    newArr.push(types[cur.categoryName]);
                }
                types[cur.categoryName].prelekcjeSciezki.push(cur);
            }
            return newArr;
        };

        $scope.prelekcjeDay1Final = transformArr($scope.prelekcjeDay1);
        $scope.prelekcjeDay2Final = transformArr($scope.prelekcjeDay2);

        // **************************************************** DODANIE WARSZTATÓW I ZAMKNIĘCIA NA KONIEC ***************************

        Array.prototype.move = function (old_index, new_index) {
            if (new_index >= this.length) {
                var k = new_index - this.length;
                while ((k--) + 1) {
                    this.push(undefined);
                }
            }
            this.splice(new_index, 0, this.splice(old_index, 1)[0]);
            return this; // for testing purposes
        };

        var warsztatyIndex;
		var afterIndex;
        var otwarcieIndex;

        for (var i = 0; i < $scope.prelekcjeDay1Final.length; i++) {
            if ($scope.prelekcjeDay1Final[i].categoryName === "Warsztaty") {
                warsztatyIndex = i;
            }
        };
        //console.log(warsztatyIndex);
        $scope.prelekcjeDay1Final.move(warsztatyIndex, $scope.prelekcjeDay1Final.length - 1);

        for (var i = 0; i < $scope.prelekcjeDay1Final.length; i++) {
            if ($scope.prelekcjeDay1Final[i].categoryName === "Afterparty") {
                afterIndex = i;
            }
        };
        //console.log(afterIndex);
        $scope.prelekcjeDay1Final.move(afterIndex, $scope.prelekcjeDay1Final.length - 1);

        // for (var i = 0; i < $scope.prelekcjeDay2Final.length; i++) {
            // if ($scope.prelekcjeDay2Final[i].categoryName === "Warsztaty") {
                // warsztatyIndex = i;
            // }
        // };
        //console.log(warsztatyIndex);
        //$scope.prelekcjeDay2Final.move(warsztatyIndex, $scope.prelekcjeDay2Final.length - 1);

        for (var i = 0; i < $scope.prelekcjeDay1Final.length; i++) {
            if ($scope.prelekcjeDay1Final[i].categoryName.indexOf("Keynotes") == 0) {
                otwarcieIndex = i;
            }
        };
        //console.log(otwarcieIndex);
        $scope.prelekcjeDay1Final.move(otwarcieIndex, 0);

        // ***************************************************** KONIEC PRZESUWANIA ELEMENTÓW ***************************************

        // posortowanie prelekcji w ramach ścieżek chronologicznie

        for (var i = 0; i < $scope.prelekcjeDay1Final.length; i++) {
            $scope.prelekcjeDay1Final[i].prelekcjeSciezki.sort(function (a, b) {
                return new Date(a.startDate) - new Date(b.startDate);
            });
        }

        // for (var i = 0; i < $scope.prelekcjeDay2Final.length; i++) {
            // $scope.prelekcjeDay2Final[i].prelekcjeSciezki.sort(function (a, b) {
                // return new Date(a.startDate) - new Date(b.startDate);
            // });
        // }

        // dodanie atrybutów collapse do obsługi pływającego frontu

        var collapseNumber = 0;
        var DictCollapse = ["collapseZero", "collapseOne", "collapseTwo", "collapseThree", "collapseFour", "collapseFive", "collapseSix", "collapseSeven", "collapseEight", "collapseNine", "collapseTen", "collapseEleven", "collapseTwelve", "collapseThirteen"];

        for (var i = 0; i < $scope.prelekcjeDay1Final.length; i++) {
            $scope.prelekcjeDay1Final[i].CollapseNumber = DictCollapse[collapseNumber];
            collapseNumber++;
        }

        // for (var i = 0; i < $scope.prelekcjeDay2Final.length; i++) {
            // $scope.prelekcjeDay2Final[i].CollapseNumber = DictCollapse[collapseNumber];
            // collapseNumber++;
        // }

        var collapseNo = 0;

        for (var i = 0; i < $scope.prelekcjeDay1Final.length; i++) {
            if ($scope.prelekcjeDay1Final[i].categoryName.indexOf("Big Data") == 0) { 
                $scope.prelekcjeDay1Final[i].CategoryIcon = "images/agenda/icon5.svg";
            } else if ($scope.prelekcjeDay1Final[i].categoryName.indexOf("Standy") == 0) {
                $scope.prelekcjeDay1Final[i].CategoryIcon = "images/logo-dss.png";
            } else if ($scope.prelekcjeDay1Final[i].categoryName.indexOf("Business") == 0) {
                $scope.prelekcjeDay1Final[i].CategoryIcon = "images/agenda/icon2.svg";
            } else if ($scope.prelekcjeDay1Final[i].categoryName.indexOf("Data Administration") == 0) {
                $scope.prelekcjeDay1Final[i].CategoryIcon = "images/icons/icon-hardware.svg";
            } else if ($scope.prelekcjeDay1Final[i].categoryName.indexOf("Data Science") == 0) {
                $scope.prelekcjeDay1Final[i].CategoryIcon = "images/icons/icon-data-science.svg";
            } else if ($scope.prelekcjeDay1Final[i].categoryName.indexOf("Machine") == 0) {
                $scope.prelekcjeDay1Final[i].CategoryIcon = "images/agenda/icon4.svg";
            } else if ($scope.prelekcjeDay1Final[i].categoryName.indexOf("Programming") == 0) {
                $scope.prelekcjeDay1Final[i].CategoryIcon = "images/agenda/icon3.svg";
            } else if ($scope.prelekcjeDay1Final[i].categoryName === "Afterparty") {
                $scope.prelekcjeDay1Final[i].CategoryIcon = "images/agenda/icon7.svg";
            } else if ($scope.prelekcjeDay1Final[i].categoryName === "Keynotes") {
                $scope.prelekcjeDay1Final[i].CategoryIcon = "images/icons/icon-hot.svg";
            } else if ($scope.prelekcjeDay1Final[i].categoryName === "Warsztaty") {
                $scope.prelekcjeDay1Final[i].CategoryIcon = "images/icons/icon-workshop-event.svg";
            };
            for (var j = 0; j < $scope.prelekcjeDay1Final[i].prelekcjeSciezki.length; j++) {
                $scope.prelekcjeDay1Final[i].prelekcjeSciezki[j].CollapseNo = "collapse" + collapseNo;
                $scope.prelekcjeDay1Final[i].prelekcjeSciezki[j].startDate = $scope.prelekcjeDay1Final[i].prelekcjeSciezki[j].startDate.substring(11, 16);
                $scope.prelekcjeDay1Final[i].prelekcjeSciezki[j].endDate = $scope.prelekcjeDay1Final[i].prelekcjeSciezki[j].endDate.substring(11, 16);
                collapseNo++;
            }
        }

        // for (var i = 0; i < $scope.prelekcjeDay2Final.length; i++) {
            // if ($scope.prelekcjeDay2Final[i].categoryName === "Coding and stuff") {
                // $scope.prelekcjeDay2Final[i].CategoryIcon = "images/icons/icon-coding.svg";
            // } else if ($scope.prelekcjeDay2Final[i].categoryName === "Data science") {
                // $scope.prelekcjeDay2Final[i].CategoryIcon = "images/icons/icon-data-science.svg";
            // } else if ($scope.prelekcjeDay2Final[i].categoryName === "Deep dive by DevTalk.pl") {
                // $scope.prelekcjeDay2Final[i].CategoryIcon = "images/icons/icon-devtalk.svg";
            // } else if ($scope.prelekcjeDay2Final[i].categoryName === "Mobile Dev") {
                // $scope.prelekcjeDay2Final[i].CategoryIcon = "images/icons/icon-mobile.svg";
            // } else if ($scope.prelekcjeDay2Final[i].categoryName === "Security by Zaufana Trzecia Strona") {
                // $scope.prelekcjeDay2Final[i].CategoryIcon = "images/icons/icon-security-event.svg";
            // } else if ($scope.prelekcjeDay2Final[i].categoryName === "Software delivery") {
                // $scope.prelekcjeDay2Final[i].CategoryIcon = "images/icons/icon-delivery.svg";
            // } else if ($scope.prelekcjeDay2Final[i].categoryName === "Warsztaty") {
                // $scope.prelekcjeDay2Final[i].CategoryIcon = "images/icons/icon-workshop-event.svg";
            // };
            // for (var j = 0; j < $scope.prelekcjeDay2Final[i].prelekcjeSciezki.length; j++) {
                // $scope.prelekcjeDay2Final[i].prelekcjeSciezki[j].CollapseNo = "collapse" + collapseNo;
                // $scope.prelekcjeDay2Final[i].prelekcjeSciezki[j].startDate = $scope.prelekcjeDay2Final[i].prelekcjeSciezki[j].startDate.substring(11, 16);
                // $scope.prelekcjeDay2Final[i].prelekcjeSciezki[j].endDate = $scope.prelekcjeDay2Final[i].prelekcjeSciezki[j].endDate.substring(11, 16);
                // collapseNo++;
            // }
        // }

        //console.log($scope.prelekcjeDay2Final);

    };

    initData();

}]);

// dodane do obsługi dynamicznych href'ów generowanych przez Angulara

mpApp.config([
	'$compileProvider',
	function ($compileProvider) {
	    $compileProvider.aHrefSanitizationWhitelist(/^\s*(https?|ftp|mailto|chrome-extension):/);
	    // Angular before v1.2 uses $compileProvider.urlSanitizationWhitelist(...)
	}
]);
