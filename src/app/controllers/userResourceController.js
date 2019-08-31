'use strict';
app.controller('userResourceController', ['$scope', '$route', '$routeParams', '$location', '$window', 'registrationService', 'ngAuthSettings',
    function ($scope, $route, $routeParams, $location, $window, registrationService, ngAuthSettings) {

    $scope.eventCode = ngAuthSettings.eventCode;
    $scope.message = "";
    $scope.loading = false;

    registrationService.getUserResources($scope.eventCode).then(function (results) {
        $scope.prelekcje = results.data;
        transformLectures();
        $scope.message = 1;
    }, function (error) {
        $scope.message = error.data.errorMessage;
    });

    $scope.redirectToAccount = function () {
        $location.path('/user-account/');
    };

    var transformLectures = function () {

        $scope.prelekcjeDay1 = [];
        $scope.prelekcjeDay2 = [];
        var tmpdt = "";

        // rozbicie prelekcji z dnia 1 oraz 2

        for (var i = 0; i < $scope.prelekcje.length; i++) {
            tmpdt = $scope.prelekcje[i].calendarDay;
            if (tmpdt === "Dzień I - 26 maja 2017") {
                $scope.prelekcjeDay1.push($scope.prelekcje[i]);
            } 
        };

        // posortowanie prelekcji chronologicznie 

        $scope.prelekcjeDay1.sort(function (a, b) {
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

        // rozbicie prelekcji z dnia 1 wg. ścieżek (utworzenie obiektu $scope.Day1PrelekcjeByŚcieżka = { [ścieżka1, [prelekcje]], [ścieżka2, [prelekcje]], ... }  )

        $scope.prelekcjeDay1Final = [];

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
		var standIndex;

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

        for (var i = 0; i < $scope.prelekcjeDay1Final.length; i++) {
            if ($scope.prelekcjeDay1Final[i].categoryName.indexOf("Keynotes") == 0) {
                otwarcieIndex = i;
            }
        };
        //console.log(otwarcieIndex);
        $scope.prelekcjeDay1Final.move(otwarcieIndex, 0);

        for (var i = 0; i < $scope.prelekcjeDay1Final.length; i++) {
            if ($scope.prelekcjeDay1Final[i].categoryName.indexOf("Standy") == 0) {
                standIndex = i;
            }
        };
        //console.log(standIndex);
        $scope.prelekcjeDay1Final.move(standIndex, 0);

        // ***************************************************** KONIEC PRZESUWANIA ELEMENTÓW ***************************************

        // posortowanie prelekcji w ramach ścieżek chronologicznie

        for (var i = 0; i < $scope.prelekcjeDay1Final.length; i++) {
            $scope.prelekcjeDay1Final[i].prelekcjeSciezki.sort(function (a, b) {
                return new Date(a.startDate) - new Date(b.startDate);
            });
        }

        // dodanie atrybutów collapse do obsługi pływającego frontu

        var collapseNumber = 0;
        var DictCollapse = ["collapseZero", "collapseOne", "collapseTwo", "collapseThree", "collapseFour", "collapseFive", "collapseSix", "collapseSeven", "collapseEight", "collapseNine", "collapseTen", "collapseEleven", "collapseTwelve", "collapseThirteen"];

        for (var i = 0; i < $scope.prelekcjeDay1Final.length; i++) {
            $scope.prelekcjeDay1Final[i].CollapseNumber = DictCollapse[collapseNumber];
            collapseNumber++;
        }

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
    };
}]);