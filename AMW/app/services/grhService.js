'use strict';
app.factory('grhService', ['$http', '$q', 'ngAuthSettings', '$rootScope', function ($http, $q, ngAuthSettings, $rootScope) {
    var serviceFactory = {};

    var _get_turnaround_flights = function (station_id, dfrom, dto) {

        var deferred = $q.defer();
        $http.get('http://localhost:9063/api/grh/turnaround/get/flights/' + station_id + '/' + dfrom + '/' + dto).then(function (response) {
            deferred.resolve(response.data);
        }, function (err, status) {
            deferred.reject(Exceptions.getMessage(err));
        })

        return deferred.promise;
    }



    var _save_check_list = function (entity) {
        var deferred = $q.defer();
        $http.post('http://localhost:9063/api/grh/turnaround/item/value/update', entity).then(function (response) {
            deferred.resolve(response.data);
        }, function (err, status) {

            deferred.reject(Exceptions.getMessage(err));
        });

        return deferred.promise;
    };

    var _get_turnaround_station = function (entity) {
        var deferred = $q.defer();
        $http.post('http://localhost:9063/api/grh/turnaround/get/flights', entity).then(function (response) {
            deferred.resolve(response.data);
        }, function (err, status) {

            deferred.reject(Exceptions.getMessage(err));
        });

        return deferred.promise;
    };

    var _get_cehck_list = function (flightid) {
        var deferred = $q.defer();
        $http.get('http://localhost:9063/api/grh/turnaround/get/' + flightid).then(function (response) {
            deferred.resolve(response.data);
        }, function (err, status) {

            deferred.reject(Exceptions.getMessage(err));
        });

        return deferred.promise;
    };




    serviceFactory.get_turnaround_flights = _get_turnaround_flights;
    serviceFactory.save_check_list = _save_check_list;
    serviceFactory.get_cehck_list = _get_cehck_list;
    serviceFactory.get_turnaround_station = _get_turnaround_station;

    return serviceFactory;

}]);