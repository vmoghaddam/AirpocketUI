'use strict';
app.factory('aircraftService', ['$http', '$q', 'ngAuthSettings', '$rootScope', function ($http, $q, ngAuthSettings, $rootScope) {



    var serviceFactory = {};
    var _getMSNs = function (cid) {



        var deferred = $q.defer();
        $http.get(serviceBase + 'odata/aircrafts/customer/' + cid).then(function (response) {
            deferred.resolve(response.data);
        }, function (err, status) {

            deferred.reject(Exceptions.getMessage(err));
        });

        return deferred.promise;
    };
    var _getMSNsByType = function (cid,tid) {



        var deferred = $q.defer();
        $http.get(serviceBase + 'odata/aircrafts/customer/type/' + cid+'/'+tid).then(function (response) {
            deferred.resolve(response.data);
        }, function (err, status) {

            deferred.reject(Exceptions.getMessage(err));
        });

        return deferred.promise;
    };
    var _getVirtualMSNsByType = function (cid, tid) {



        var deferred = $q.defer();
        $http.get(serviceBase + 'odata/aircrafts/customer/virtual/type/' + cid + '/' + tid).then(function (response) {
            deferred.resolve(response.data);
        }, function (err, status) {

            deferred.reject(Exceptions.getMessage(err));
        });

        return deferred.promise;
    };
    var _getAvailableMSNsByType = function (cid, tid) {



        var deferred = $q.defer();
        $http.get(serviceBase + 'odata/aircrafts/available/customer/type/' + cid + '/' + tid).then(function (response) {
            deferred.resolve(response.data);
        }, function (err, status) {

            deferred.reject(Exceptions.getMessage(err));
        });

        return deferred.promise;
    };
    var _getAircraftTypes = function (cid) {



        var deferred = $q.defer();
        $http.get(serviceBase + 'odata/aircrafttypes/all/' ).then(function (response) {
            deferred.resolve(response.data);
        }, function (err, status) {

            deferred.reject(Exceptions.getMessage(err));
        });

        return deferred.promise;
    };
    

    var _save = function (entity) {
        var deferred = $q.defer();
        $http.post($rootScope.serviceUrl + 'odata/airports/save', entity).then(function (response) {
            deferred.resolve(response.data);
        }, function (err, status) {

            deferred.reject(Exceptions.getMessage(err));
        });

        return deferred.promise;
    };
    var _delete = function (entity) {
        var deferred = $q.defer();
        $http.post($rootScope.serviceUrl + 'odata/airports/delete', entity).then(function (response) {
            deferred.resolve(response.data);
        }, function (err, status) {

            deferred.reject(Exceptions.getMessage(err));
        });

        return deferred.promise;
    };
    serviceFactory.getAircraftTypes = _getAircraftTypes;
    serviceFactory.getMSNs = _getMSNs;
    serviceFactory.getVirtualMSNsByType = _getVirtualMSNsByType;
    serviceFactory.getMSNsByType = _getMSNsByType;
    serviceFactory.getAvailableMSNsByType = _getAvailableMSNsByType;
    serviceFactory.save = _save;
    serviceFactory.delete = _delete;
    return serviceFactory;

}]);