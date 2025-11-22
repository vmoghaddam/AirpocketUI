'use strict';
app.factory('logService', ['$http', '$q', 'ngAuthSettings', '$rootScope', function ($http, $q, ngAuthSettings, $rootScope) {

    var serviceFactory = {};

    var _getFlightsGanttUTC = function (cid, from, to, tzoffset, airport, filter) {
        var url = apiLog + 'api/flights/gantt/utc/customer/' + cid + '/' + from + '/' + to + '/' + tzoffset;
        if (airport)
            url += '/' + airport;



        var deferred = $q.defer();
        $http.post(url,
            filter
        ).then(function (response) {
            deferred.resolve(response.data);
        }, function (err, status) {

            deferred.reject(Exceptions.getMessage(err));
        });

        return deferred.promise;
    };

    var _saveFlightLog = function (entity) {
        var deferred = $q.defer();
        $http.post(apiLog + 'api/flight/log/save', entity).then(function (response) {
            deferred.resolve(response.data);
        }, function (err, status) {

            deferred.reject(Exceptions.getMessage(err));
        });

        return deferred.promise;
    };


    var _getPlanFlights = function ( from, to ) {
        var url = apiLog + 'api/plan/flights?dfrom=' + from +'&dto='+to;
       

        var deferred = $q.defer();
        $http.get(url).then(function (response) {
            deferred.resolve(response.data);
        }, function (err, status) {

            deferred.reject(Exceptions.getMessage(err));
        });

        return deferred.promise;
    };

    var _saveFlightPlan = function (entity) {
        var deferred = $q.defer();
        $http.post(apiLog + 'api/plan/flights/save', entity).then(function (response) {
            deferred.resolve(response.data);
        }, function (err, status) {

            deferred.reject(Exceptions.getMessage(err));
        });

        return deferred.promise;
    };
    serviceFactory.saveFlightPlan = _saveFlightPlan;
    serviceFactory.getPlanFlights = _getPlanFlights;
    serviceFactory.saveFlightLog = _saveFlightLog;
    serviceFactory.getFlightsGanttUTC = _getFlightsGanttUTC;


    return serviceFactory;

}]);