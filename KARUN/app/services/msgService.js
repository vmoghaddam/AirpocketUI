'use strict';
app.factory('msgService', ['$http', '$q', 'ngAuthSettings', '$rootScope', function ($http, $q, ngAuthSettings, $rootScope) {

    var serviceFactory = {};

    var _getNiraConflicts = function (df, dt) {


        var deferred = $q.defer();
        $http.get(apimsg + 'api/nira/conflicts/' + df + '/' + dt).then(function (response) {
            deferred.resolve(response.data);
        }, function (err, status) {

            deferred.reject(Exceptions.getMessage(err));
        });

        return deferred.promise;
    };

    serviceFactory.getNiraConflicts = _getNiraConflicts;


    var _syncNira = function (entity) {
        var deferred = $q.defer();
        $http.post(apimsg + 'api/nira/sync/', entity).then(function (response) {
            deferred.resolve(response.data);
        }, function (err, status) {

            deferred.reject(Exceptions.getMessage(err));
        });

        return deferred.promise;
    };
    serviceFactory.syncNira = _syncNira;


    return serviceFactory;

}]);
