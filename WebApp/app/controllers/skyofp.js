'use strict';
app.controller('skyofpController', ['$scope', '$location', '$routeParams', '$rootScope', '$timeout', 'flightService', 'weatherService', 'aircraftService', 'authService', 'notificationService', '$route', '$window', '$http', function ($scope, $location, $routeParams, $rootScope, $timeout, flightService, weatherService, aircraftService, authService, notificationService, $route, $window, $http) {


    //$scope.mpln = [
    //    {
    //        WAP: 'OIKB',
    //        COR: 'N27° 13 06 ,  E056',
    //        FRE: '',
    //        VIA: 'ASMU1A',
    //        ALT: 'CLB',
    //        MEA: '0',
    //        GMR: '131',
    //        DIS: '0',
    //        TDS: '0',
    //        WID: '',
    //        TRK: '',
    //        TMP: '',
    //        TME: '00:00:00.0000000',
    //        TTM: '00:00:00.0000000',
    //        FRE: '-200',
    //        FUS: '200',
    //        TAS: '361',
    //        GSP: '0'
    //    },
    //];

    $scope._COR = function (r) {
        //if (r.FRE)
        //    return r.FRE;
        return r.COR;
    }

    $scope._Empty = function (d) {
        if (d == 0)
            return '';
        return d;
    }

    $scope._Time = function (d) {
        if (!d)
            return d;
        return d.substr(0,5);
    }

    //http://localhost:12271/api/ofp/sky/parse

    $http.get(  /*'http://localhost:12271/api/ofp/sky/parse'*/'https://localhost:7001/api/ofp/flight/510521').then(function (response) {
        console.log(response);
        console.log(response.data.Data.JPlan);
        console.log(JSON.parse(response.data.Data.JPlan));
        $scope.mpln = response.data.mplnpJson;
        $scope.apln1 = response.data.apln1Json;
        $scope.fuel =Enumerable.From( response.data.fuel).Where("['ZFW','TOW','LW'].indexOf($.prm)==-1").ToArray();
        console.log($scope.fuel);
    }, function (err, status) {

       
    });



}]);