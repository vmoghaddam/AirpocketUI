'use strict';
app.factory('flightService', ['$http', '$q', 'ngAuthSettings', '$rootScope', function ($http, $q, ngAuthSettings, $rootScope) {
    var serviceFactory = {};
    var _getCrewFlights = function (id, df, dt) {
        var _df = moment(df).format('YYYY-MM-DDTHH:mm:ss');
        var _dt = moment(dt).format('YYYY-MM-DDTHH:mm:ss');
        var deferred = $q.defer();
        $http.get(serviceBase + 'odata/crew/flights/app/' + id + '?from=' + _df + '&to=' + _dt).then(function (response) {
            deferred.resolve(response.data);
        }, function (err, status) {

            deferred.reject(Exceptions.getMessage(err));
        });

        return deferred.promise;
    };
    var _getCrewFlightsGrouped = function (id ) {
       
        var deferred = $q.defer();
        $http.get( serviceBase2  + 'odata/crew/report/flights/app/grouped/' + id ).then(function (response) {
            deferred.resolve(response.data);
        }, function (err, status) {

            deferred.reject(/*Exceptions.getMessage(err)*/ JSON.stringify(err));
        });

        return deferred.promise;
    };
    var _getFlightCrews = function (id) {

        var deferred = $q.defer();
        $http.get(serviceBase + 'odata/flight/crews/new/' + id).then(function (response) {
            deferred.resolve(response.data);
        }, function (err, status) {

            deferred.reject(Exceptions.getMessage(err));
        });

        return deferred.promise;
    };
	
	
	 var _getFlightsByDate = function (df) {

        var deferred = $q.defer();
        $http.get(zscheduling + 'api/sch/flts/date?df=' + df).then(function (response) {
            deferred.resolve(response.data);
        }, function (err, status) {

            deferred.reject(Exceptions.getMessage(err));
        });

        return deferred.promise;
    };
	
	
	
	var _getFlightCrewsNew = function (id) {

        var deferred = $q.defer();
        $http.get(zscheduling + 'api/sch/flight/crews/' + id).then(function (response) {
            deferred.resolve(response.data);
        }, function (err, status) {

            deferred.reject(Exceptions.getMessage(err));
        });

        return deferred.promise;
    };
	
	
    serviceFactory.getCrewFlights = _getCrewFlights;
    serviceFactory.getCrewFlightsGrouped = _getCrewFlightsGrouped;
    serviceFactory.getFlightCrews = _getFlightCrews;
	
	
	 serviceFactory.getFlightsByDate  = _getFlightsByDate;
	 serviceFactory.getFlightCrewsNew = _getFlightCrewsNew;
    
    return serviceFactory;

}]);