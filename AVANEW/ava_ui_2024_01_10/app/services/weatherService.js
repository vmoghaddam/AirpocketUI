'use strict';
app.factory('weatherService', ['$http', '$q', 'ngAuthSettings', '$rootScope', function ($http, $q, ngAuthSettings, $rootScope) {



    var serviceFactory = {};
    
    var _getCurrent = function (lt,lg) {



        var deferred = $q.defer();
        $http.get($rootScope.serviceUrl +'odata/weather/current/' + lt+'/'+lg+'/' ).then(function (response) {
            deferred.resolve(response.data);
        }, function (err, status) {

            deferred.reject(Exceptions.getMessage(err));
        });

        return deferred.promise;
    };
    var _getTime = function (lt, lg,time) {



        var deferred = $q.defer();
        $http.get($rootScope.serviceUrl + 'odata/weather/' + lt + '/' + lg + '/'+time+'/').then(function (response) {
            deferred.resolve(response.data);
        }, function (err, status) {

            deferred.reject(Exceptions.getMessage(err));
        });

        return deferred.promise;
    };

    //odata/weather/flight/{id}/{status}
    var _getFlight = function (id,status) {



        var deferred = $q.defer();
        $http.get($rootScope.serviceUrl + 'odata/weather/flight/' + id + '/' + status + '/' ).then(function (response) {
            deferred.resolve(response.data);
        }, function (err, status) {

            deferred.reject(Exceptions.getMessage(err));
        });

        return deferred.promise;
    };
     
    var _getFlightAll = function (id ) {



        var deferred = $q.defer();
        $http.get($rootScope.serviceUrl + 'odata/weather/flight/all/' + id  ).then(function (response) {
            deferred.resolve(response.data);
        }, function (err, status) {

            deferred.reject(Exceptions.getMessage(err));
        });

        return deferred.promise;
    };
    var _getCurrentHourly = function (lt, lg) {



        var deferred = $q.defer();
        $http.get($rootScope.serviceUrl + 'odata/weather/current/hourly/' + lt + '/' + lg + '/').then(function (response) {
            deferred.resolve(response.data);
        }, function (err, status) {

            deferred.reject(Exceptions.getMessage(err));
        });

        return deferred.promise;
    };
    
    serviceFactory.getCurrent = _getCurrent;
    serviceFactory.getTime = _getTime;
    serviceFactory.getFlight = _getFlight;
    serviceFactory.getCurrentHourly = _getCurrentHourly;
    serviceFactory.getFlightAll = _getFlightAll;
     
    return serviceFactory;

}]);