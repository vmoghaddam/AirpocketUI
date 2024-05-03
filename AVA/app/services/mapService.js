'use strict';
app.factory('mapService', ['$http', '$q', 'ngAuthSettings', '$rootScope', function ($http, $q, ngAuthSettings, $rootScope) {

    var serviceFactory = {};
	
	var apiMap='https://main.apimap.airpocket.app/api/';

    var _getLiveFlights = function (df, dt) {


        var deferred = $q.defer();
        $http.get(apiMap + 'fr/live/flights/icao?icao='+'AXV'+'&no=-1').then(function (response) {
            deferred.resolve(response.data);
        }, function (err, status) {

            deferred.reject(Exceptions.getMessage(err));
        });

        return deferred.promise;
    };

    
    serviceFactory.getLiveFlights = _getLiveFlights;
	
	
	
	var _getFlight = function (id) {


        var deferred = $q.defer();
        $http.get(apiapsb + 'api/flight/'+id).then(function (response) {
            deferred.resolve(response.data);
        }, function (err, status) {

            deferred.reject(Exceptions.getMessage(err));
        });

        return deferred.promise;
    };

    
    serviceFactory.getFlight = _getFlight;


    return serviceFactory;

}]);
