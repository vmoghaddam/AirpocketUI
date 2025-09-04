'use strict';
app.factory('fbService', ['$http', '$q', 'ngAuthSettings', '$rootScope', function ($http, $q, ngAuthSettings, $rootScope) {
    var serviceFactory = {};

    var _getDRByFlight = function (flightId) {


        var deferred = $q.defer();
        $http.get(serviceBaseAPI + 'api/dr/flight/' + flightId  ).then(function (response) {
            deferred.resolve(response.data);
        }, function (err, status) {

            deferred.reject(Exceptions.getMessage(err));
        });

        return deferred.promise;
    };

    var _saveDR = function (entity) {
        var deferred = $q.defer();
        $http.post(serviceBaseAPI + 'api/dr/save', entity).then(function (response) {
            deferred.resolve(response.data);
        }, function (err, status) {

            deferred.reject(Exceptions.getMessage(err));
        });

        return deferred.promise;
    };




    serviceFactory.getDRByFlight = _getDRByFlight;
    serviceFactory.saveDR = _saveDR;

    return serviceFactory;

}]);
